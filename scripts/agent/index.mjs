#!/usr/bin/env node
/**
 * Groq-driven autonom agent för Efterplan GitHub Actions.
 * Läge: 'roadmap' (implementera ticket) eller 'autofix' (fixa deploy-fel).
 *
 * Verktyg: glob, grep, read_file, write_file, move_file, done, skip
 */

import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { globSync } from 'glob';

const MODE = process.argv[2];
const MODEL = 'openai/gpt-oss-120b';
const MAX_TURNS = 30;
const MAX_FILE_BYTES = 60_000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Verktygsimplementationer ────────────────────────────────────────────────

function toolGlob({ pattern }) {
  const files = globSync(pattern, { ignore: ['.git/**', 'node_modules/**', 'scripts/agent/node_modules/**'] });
  return files.length ? files.join('\n') : 'Inga filer matchar mönstret.';
}

function toolGrep({ pattern, glob: g }) {
  const args = ['-rl'];
  if (g) args.push('--include=' + g);
  args.push(pattern, '.');
  const r = spawnSync('grep', args, { encoding: 'utf8' });
  const out = r.stdout.trim().replace(/^\.\//gm, '');
  return out || 'Inga träffar.';
}

function toolReadFile({ file }) {
  if (!fs.existsSync(file)) return `Fel: ${file} saknas.`;
  const buf = fs.readFileSync(file);
  if (buf.length > MAX_FILE_BYTES)
    return buf.slice(0, MAX_FILE_BYTES).toString('utf8') + '\n[...TRUNKERAD — filen är för stor...]';
  return buf.toString('utf8');
}

function toolWriteFile({ file, content }) {
  const dir = path.dirname(file);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return `Skriven: ${file} (${content.length} bytes)`;
}

function toolMoveFile({ from: src, to: dst }) {
  if (!fs.existsSync(src)) return `Fel: ${src} saknas.`;
  const dir = path.dirname(dst);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(src, dst);
  return `Flyttad: ${src} → ${dst}`;
}

const TOOLS = { glob: toolGlob, grep: toolGrep, read_file: toolReadFile, write_file: toolWriteFile, move_file: toolMoveFile };

// ── Verktygsdefinitioner för Groq ──────────────────────────────────────────

const TOOL_DEFS = [
  {
    type: 'function',
    function: {
      name: 'glob',
      description: 'Lista filer som matchar ett glob-mönster (t.ex. *.html, api/*.js)',
      parameters: {
        type: 'object',
        properties: { pattern: { type: 'string' } },
        required: ['pattern']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'grep',
      description: 'Sök text i filer. Returnerar filnamn med träffar.',
      parameters: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Sökterm eller regex' },
          glob: { type: 'string', description: 'Filmönster, t.ex. *.html' }
        },
        required: ['pattern']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Läs en fils innehåll',
      parameters: {
        type: 'object',
        properties: { file: { type: 'string', description: 'Relativ sökväg' } },
        required: ['file']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Skriv komplett nytt innehåll till en fil. Skapar filen om den saknas.',
      parameters: {
        type: 'object',
        properties: {
          file: { type: 'string', description: 'Relativ sökväg' },
          content: { type: 'string', description: 'Komplett nytt filinnehåll' }
        },
        required: ['file', 'content']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'move_file',
      description: 'Flytta eller byt namn på en fil',
      parameters: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' }
        },
        required: ['from', 'to']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'done',
      description: 'Alla ändringar är gjorda och klara. Committar med angivet meddelande.',
      parameters: {
        type: 'object',
        properties: {
          commit_message: { type: 'string', description: 'Git commit-meddelande' }
        },
        required: ['commit_message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'skip',
      description: 'Inget att göra — hoppar över utan att commita.',
      parameters: {
        type: 'object',
        properties: {
          reason: { type: 'string' }
        },
        required: ['reason']
      }
    }
  }
];

// ── Systemprompts ───────────────────────────────────────────────────────────

const SYSTEM = {
  roadmap: `Du är efterplan-bot, en autonom kodredigerare för Efterplan (svensk webbtjänst för dödsbohantering, statiska HTML-filer + Vercel serverless API).
Du implementerar exakt en ticket per körning.

Arbetsflöde:
1. Kör glob('claude/open/*.md') för att lista tickets.
2. Läs varje ticket och hitta frontmatter-fälten priority (heltal, 1=högst), payment (true/false), legal (true/false).
3. Välj ticketen med lägst priority-nummer som har payment:false OCH legal:false. Om inga sådana finns → skip().
4. Läs de relevanta källfilerna och förstå vad som ska ändras.
5. Implementera exakt vad ticketen beskriver.
6. Flytta ticket-filen från claude/open/ till claude/done/ med move_file().
7. Anropa done() med ett beskrivande commit-meddelande.

Absoluta gränser — rör ALDRIG dessa filer:
api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js

Max ${MAX_TURNS} verktygsanrop per körning.`,

  autofix: `Du är efterplan-bot. En Vercel-deploy av Efterplan misslyckades.
Implementera den minsta möjliga fix som löser det specifika deploy-felet.

Absoluta gränser — rör ALDRIG dessa filer:
api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js

Om felet inte kan identifieras eller fixas: skapa claude/autofix-notes/<datum>.md med analys och anropa done().
Avsluta alltid med done() eller skip().

Max ${MAX_TURNS} verktygsanrop per körning.`
};

// ── Groq-anrop med auto-retry på rate limit ─────────────────────────────────

async function callGroq(messages) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await groq.chat.completions.create({
        model: MODEL,
        messages,
        tools: TOOL_DEFS,
        tool_choice: 'auto',
        temperature: 0.1,
        max_tokens: 4096
      });
    } catch (e) {
      if (e.status === 429) {
        // Extrahera väntetid ur felmeddelandet, annars 15s
        const match = String(e.message).match(/try again in ([\d.]+)s/i);
        const wait = Math.ceil(parseFloat(match?.[1] || '15')) + 2;
        console.log(`Rate limit — väntar ${wait}s (försök ${attempt + 1}/5)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Rate limit kvarstår efter 5 försök.');
}

// Håll konversationshistorik liten: systemmeddelande + user + senaste N turns
function trimMessages(messages, keepTurns = 6) {
  const system = messages[0];
  const user = messages[1];
  const rest = messages.slice(2);
  // Varje "turn" = 1 assistant + N tool results. Behåll de senaste keepTurns.
  if (rest.length <= keepTurns * 4) return messages;
  return [system, user, ...rest.slice(-keepTurns * 4)];
}

// ── Huvudloop ───────────────────────────────────────────────────────────────

async function run() {
  if (!SYSTEM[MODE]) {
    console.error(`Okänt läge: "${MODE}". Använd 'roadmap' eller 'autofix'.`);
    process.exit(1);
  }

  let initialMsg;
  if (MODE === 'roadmap') {
    initialMsg = 'Lista tickets i claude/open/ och implementera den med högst prioritet som uppfyller filterkraven.';
  } else {
    const sha = process.env.DEPLOY_SHA || '(okänd commit)';
    const desc = process.env.DEPLOY_DESC || '(inget felmeddelande)';
    const log = process.env.DEPLOY_LOG || '';
    initialMsg = `Vercel-deploy misslyckades.\nCommit: ${sha}\nFelmeddelande: ${desc}${log ? '\nLogg: ' + log : ''}\n\nUndersök och fixa.`;
  }

  let messages = [
    { role: 'system', content: SYSTEM[MODE] },
    { role: 'user', content: initialMsg }
  ];

  let commitMessage = null;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    messages = trimMessages(messages);
    const response = await callGroq(messages);

    const msg = response.choices[0].message;
    messages.push(msg);

    if (!msg.tool_calls?.length) {
      if (msg.content) console.log('Agent:', msg.content);
      console.log('Inga fler verktygsanrop — avslutar loop.');
      break;
    }

    const toolResults = [];
    let finished = false;

    for (const tc of msg.tool_calls) {
      let args = {};
      try { args = JSON.parse(tc.function.arguments); } catch { /* lämna args tomt */ }

      const name = tc.function.name;
      console.log(`[${turn + 1}] ${name}(${JSON.stringify(args).slice(0, 100)})`);

      let result;
      if (name === 'done') {
        commitMessage = args.commit_message || 'chore: autonom uppdatering';
        result = 'OK — commit-meddelande registrerat.';
        finished = true;
      } else if (name === 'skip') {
        console.log('Skip:', args.reason);
        result = 'OK — hoppar över.';
        finished = true;
      } else if (TOOLS[name]) {
        try { result = TOOLS[name](args); } catch (e) { result = `Fel: ${e.message}`; }
      } else {
        result = `Fel: okänt verktyg "${name}"`;
      }

      toolResults.push({ tool_call_id: tc.id, role: 'tool', content: String(result) });
    }

    messages.push(...toolResults);
    if (finished) break;
  }

  // Commita om agenten anropade done()
  if (commitMessage) {
    spawnSync('git', ['add', '-A'], { stdio: 'inherit' });
    const r = spawnSync('git', ['commit', '-m', commitMessage], { stdio: 'inherit' });
    if (r.status !== 0) {
      console.log('Inga staged ändringar att commita — avslutar utan commit.');
    }
  } else {
    console.log('done() anropades inte — inga ändringar committades.');
  }
}

run().catch(err => {
  console.error('Agentfel:', err.message);
  process.exit(1);
});
