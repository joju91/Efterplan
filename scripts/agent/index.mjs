#!/usr/bin/env node
/**
 * Groq-driven agent — en-skotts JSON-strategi (inget tool use).
 * Samlar kontext programmatiskt → ett AI-anrop → kör action-plan.
 *
 * Läge: 'roadmap' (implementera ticket) | 'autofix' (fixa deploy-fel)
 */

import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { globSync } from 'glob';

const MODE = process.argv[2];
const MAX_CONTEXT_CHARS = 3_000;

// Provmodeller i prioritetsordning
const MODELS = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'openai/gpt-oss-120b'
];

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Kontext-insamling (programmatisk, ingen AI) ────────────────────────────

function grepSample(pattern, glob, maxChars = 1500) {
  const r = spawnSync('grep', ['-rn', '--include=' + glob, '-m', '3', pattern, '.'], { encoding: 'utf8' });
  return r.stdout.replace(/^\.\//gm, '').trim().slice(0, maxChars);
}

function listProjectFiles() {
  const htmlFiles = globSync('*.html', { ignore: ['.git/**'] }).slice(0, 20).join(' ');
  const apiFiles = globSync('api/*.js', { ignore: ['.git/**'] }).join(' ');
  return `HTML: ${htmlFiles}\nAPI: ${apiFiles}`;
}

// ── Ticket-parsning ────────────────────────────────────────────────────────

function findBestTicket() {
  if (!fs.existsSync('claude/open')) return null;
  const files = fs.readdirSync('claude/open').filter(f => f.endsWith('.md'));
  if (files.length === 0) return null;

  const tickets = files.map(f => {
    const content = fs.readFileSync(`claude/open/${f}`, 'utf8');
    const priority = parseInt(content.match(/priority:\s*(\d+)/)?.[1] ?? '9');
    const payment = /payment:\s*true/.test(content);
    const legal = /legal:\s*true/.test(content);
    return { file: f, content, priority, payment, legal };
  });

  const eligible = tickets.filter(t => !t.payment && !t.legal).sort((a, b) => a.priority - b.priority);
  return eligible[0] ?? null;
}

// ── Action-exekvering ──────────────────────────────────────────────────────

function execActions(actions) {
  for (const action of actions) {
    console.log(`Action: ${action.type}`);

    if (action.type === 'regex_replace_files') {
      const files = globSync(action.glob, { ignore: ['.git/**', 'node_modules/**', 'scripts/**'] });
      const re = new RegExp(action.pattern, action.flags ?? 'g');
      let totalReplaced = 0;
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(re);
        if (!matches) continue;
        fs.writeFileSync(file, content.replace(re, action.replace), 'utf8');
        totalReplaced += matches.length;
        console.log(`  ${file}: ${matches.length} ersättning(ar)`);
      }
      console.log(`  Totalt: ${totalReplaced} ersättning(ar) i ${files.length} filer`);

    } else if (action.type === 'replace_in_file') {
      if (!fs.existsSync(action.file)) { console.log(`  Hoppar: ${action.file} saknas`); continue; }
      const content = fs.readFileSync(action.file, 'utf8');
      const count = content.split(action.search).length - 1;
      if (count === 0) { console.log(`  0 träffar i ${action.file}`); continue; }
      fs.writeFileSync(action.file, content.split(action.search).join(action.replace), 'utf8');
      console.log(`  ${action.file}: ${count} ersättning(ar)`);

    } else if (action.type === 'create_file') {
      const dir = path.dirname(action.file);
      if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(action.file, action.content, 'utf8');
      console.log(`  Skapad: ${action.file}`);

    } else if (action.type === 'move_file') {
      if (!fs.existsSync(action.from)) { console.log(`  Hoppar: ${action.from} saknas`); continue; }
      const dir = path.dirname(action.to);
      if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
      fs.renameSync(action.from, action.to);
      console.log(`  Flyttad: ${action.from} → ${action.to}`);

    } else {
      console.log(`  Okänd action-typ: ${action.type}`);
    }
  }
}

// ── Groq-anrop med modell-fallback och rate limit retry ───────────────────

async function callGroq(prompt, systemPrompt) {
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
          max_tokens: 2048
        });
        console.log(`Modell: ${model}`);
        return response.choices[0].message.content;
      } catch (e) {
        if (e.status === 429 || e.status === 413) {
          const match = String(e.message).match(/try again in ([\d.]+)s/i);
          const wait = Math.ceil(parseFloat(match?.[1] || '15')) + 2;
          console.log(`Rate limit (${model}) — väntar ${wait}s (försök ${attempt + 1}/4)...`);
          await new Promise(r => setTimeout(r, wait * 1000));
        } else if (e.message?.includes('decommissioned') || e.message?.includes('not found') || e.status === 404) {
          console.log(`Modell ${model} ej tillgänglig — provar nästa...`);
          break; // Prova nästa modell
        } else {
          throw e;
        }
      }
    }
  }
  throw new Error('Alla modeller misslyckades.');
}

// ── Roadmap-läge ───────────────────────────────────────────────────────────

async function runRoadmap() {
  const ticket = findBestTicket();
  if (!ticket) {
    console.log('Inga passande tickets i claude/open/ — avslutar.');
    return;
  }

  console.log(`Vald ticket: ${ticket.file}`);

  // Samla relevant kontext baserat på ticket-innehåll
  const ticketWords = ticket.content
    .replace(/[#*`\[\]():\-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 4 && /^[a-zA-ZåäöÅÄÖ]/.test(w))
    .slice(0, 4);

  let contextLines = `Projektstruktur:\n${listProjectFiles()}\n\n`;
  for (const word of ticketWords) {
    const sample = grepSample(word, '*.html', 600);
    if (sample) contextLines += `Grep "${word}" i HTML:\n${sample}\n\n`;
  }
  contextLines = contextLines.slice(0, MAX_CONTEXT_CHARS);

  const prompt = `Ticket att implementera:
\`\`\`
${ticket.content}
\`\`\`

Kontext från koden:
${contextLines}

Ticket-fil: claude/open/${ticket.file}

Generera en JSON action-plan för att implementera ticketen.`;

  const systemPrompt = `Du är efterplan-bot. Generera en JSON action-plan för att implementera en ticket i Efterplan (statisk webbplats, HTML/CSS/JS + Vercel serverless API).

Svara ENBART med JSON i detta format:
{
  "commit_message": "...",
  "skip": false,
  "skip_reason": null,
  "actions": [
    {"type": "regex_replace_files", "glob": "*.html", "pattern": "...", "replace": "...", "flags": "g"},
    {"type": "replace_in_file", "file": "path/to/file", "search": "...", "replace": "..."},
    {"type": "create_file", "file": "path/to/file", "content": "..."},
    {"type": "move_file", "from": "...", "to": "..."}
  ]
}

Inkludera ALLTID en move_file action för att flytta ticket-filen från claude/open/ till claude/done/.
Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js`;

  const raw = await callGroq(prompt, systemPrompt);

  let plan;
  try {
    plan = JSON.parse(raw);
  } catch {
    console.error('Ogiltigt JSON från AI:', raw.slice(0, 200));
    process.exit(1);
  }

  if (plan.skip) {
    console.log('Skip:', plan.skip_reason);
    return;
  }

  execActions(plan.actions ?? []);

  spawnSync('git', ['add', '-A'], { stdio: 'inherit' });
  const r = spawnSync('git', ['commit', '-m', plan.commit_message ?? 'chore: roadmap implementation'], { stdio: 'inherit' });
  if (r.status !== 0) console.log('Inga ändringar att commita.');
}

// ── Autofix-läge ───────────────────────────────────────────────────────────

async function runAutofix() {
  const sha = process.env.DEPLOY_SHA || '(okänd)';
  const desc = process.env.DEPLOY_DESC || '(inget felmeddelande)';
  const log = process.env.DEPLOY_LOG || '';

  // Samla kontext: grep för felrelaterade termer i api/-mappen
  const apiFiles = globSync('api/*.js').join('\n');
  const recentChanges = spawnSync('git', ['diff', '--stat', 'HEAD~1', 'HEAD'], { encoding: 'utf8' }).stdout;

  const prompt = `Vercel-deploy misslyckades.
Commit: ${sha}
Felmeddelande: ${desc}
${log ? 'Logg: ' + log : ''}

Filer i api/: ${apiFiles}
Senaste git diff --stat: ${recentChanges.slice(0, 500)}

Generera en JSON action-plan för att fixa deploy-felet.`;

  const systemPrompt = `Du är efterplan-bot. Generera en JSON action-plan för att fixa ett Vercel deploy-fel i Efterplan.

Svara ENBART med JSON:
{
  "commit_message": "...",
  "skip": false,
  "skip_reason": null,
  "actions": [
    {"type": "replace_in_file", "file": "path/to/file", "search": "...", "replace": "..."},
    {"type": "create_file", "file": "claude/autofix-notes/YYYYMMDD.md", "content": "..."}
  ]
}

Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js
Om felet ej kan identifieras: skapa en anteckningsfil i claude/autofix-notes/.`;

  const raw = await callGroq(prompt, systemPrompt);

  let plan;
  try {
    plan = JSON.parse(raw);
  } catch {
    console.error('Ogiltigt JSON från AI:', raw.slice(0, 200));
    process.exit(1);
  }

  if (plan.skip) {
    console.log('Skip:', plan.skip_reason);
    return;
  }

  execActions(plan.actions ?? []);

  spawnSync('git', ['add', '-A'], { stdio: 'inherit' });
  const r = spawnSync('git', ['commit', '-m', plan.commit_message ?? 'fix: autofix deployment error'], { stdio: 'inherit' });
  if (r.status !== 0) console.log('Inga ändringar att commita.');
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  if (MODE === 'roadmap') await runRoadmap();
  else if (MODE === 'autofix') await runAutofix();
  else { console.error(`Okänt läge: "${MODE}"`); process.exit(1); }
}

main().catch(err => {
  console.error('Agentfel:', err.message);
  process.exit(1);
});
