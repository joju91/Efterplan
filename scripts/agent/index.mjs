#!/usr/bin/env node
/**
 * Groq-driven autonom agent för Efterplan GitHub Actions.
 * Läge: 'roadmap' (implementera ticket) eller 'autofix' (fixa deploy-fel).
 *
 * Designad för låg token-förbrukning: agenten använder bash (grep/sed/find)
 * för att utforska och modifiera filer utan att skicka filinnehåll till LLM.
 * read_file finns men är reserverad för små filer (<3 KB).
 */

import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const MODE = process.argv[2];
const MODEL = 'openai/gpt-oss-120b';
const MAX_TURNS = 15;
const MAX_FILE_BYTES = 3_000;
const MAX_OUTPUT_CHARS = 2_000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Verktygsimplementationer ────────────────────────────────────────────────

// Tillåtna bash-kommandon: enbart säkra utforsknings- och modifieringskommandon
const BASH_ALLOWLIST = ['find', 'grep', 'sed', 'ls', 'cat', 'git', 'wc', 'head', 'tail', 'mkdir'];

function toolBash({ command }) {
  const cmd = command.trim().split(/\s+/)[0];
  if (!BASH_ALLOWLIST.includes(cmd)) {
    return `Fel: "${cmd}" är inte tillåtet. Tillåtna: ${BASH_ALLOWLIST.join(', ')}`;
  }
  const r = spawnSync('bash', ['-c', command], {
    encoding: 'utf8',
    cwd: process.cwd(),
    timeout: 15_000
  });
  const out = ((r.stdout || '') + (r.stderr || '')).trim();
  return out.slice(0, MAX_OUTPUT_CHARS) || '(inget output)';
}

function toolReadFile({ file }) {
  if (!fs.existsSync(file)) return `Fel: ${file} saknas`;
  const buf = fs.readFileSync(file);
  if (buf.length > MAX_FILE_BYTES)
    return `Fel: ${file} är ${buf.length} bytes — för stor (max ${MAX_FILE_BYTES}). Använd grep/sed istället.`;
  return buf.toString('utf8');
}

function toolWriteFile({ file, content }) {
  if (content.length > 50_000) return 'Fel: content är för stort. Använd sed för att modifiera filer.';
  const dir = path.dirname(file);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return `Skriven: ${file} (${content.length} bytes)`;
}

function toolMoveFile({ from: src, to: dst }) {
  if (!fs.existsSync(src)) return `Fel: ${src} saknas`;
  const dir = path.dirname(dst);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(src, dst);
  return `OK: ${src} → ${dst}`;
}

const TOOLS_IMPL = { bash: toolBash, read_file: toolReadFile, write_file: toolWriteFile, move_file: toolMoveFile };

// ── Verktygsdefinitioner ────────────────────────────────────────────────────

const TOOL_DEFS = [
  {
    type: 'function',
    function: {
      name: 'bash',
      description: 'Kör ett bash-kommando. Tillåtna prefix: find, grep, sed, ls, cat, git, wc, head, tail, mkdir. Använd grep för att hitta mönster, sed -i för att modifiera filer in-place.',
      parameters: {
        type: 'object',
        properties: { command: { type: 'string', description: 'Bash-kommando att köra' } },
        required: ['command']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Läs en liten fil (<3 KB). Använd för ticket-filer och konfig. Stora filer: använd grep/cat+head istället.',
      parameters: {
        type: 'object',
        properties: { file: { type: 'string' } },
        required: ['file']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'write_file',
      description: 'Skriv en ny liten fil. För att modifiera befintliga filer: använd bash sed -i.',
      parameters: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          content: { type: 'string', description: 'Komplett filinnehåll (max 50 KB)' }
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
        properties: { from: { type: 'string' }, to: { type: 'string' } },
        required: ['from', 'to']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'done',
      description: 'Klart. Committar alla ändringar med angivet meddelande.',
      parameters: {
        type: 'object',
        properties: { commit_message: { type: 'string' } },
        required: ['commit_message']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'skip',
      description: 'Inget att göra — avslutar utan ändringar.',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string' } },
        required: ['reason']
      }
    }
  }
];

// ── Systemprompts ───────────────────────────────────────────────────────────

const SYSTEM = {
  roadmap: `Du är efterplan-bot, autonom kodredigerare för Efterplan (statisk webbplats, HTML/CSS/JS + Vercel serverless API).
Implementera exakt en ticket per körning.

Strategi: Använd bash (grep, sed -i, find) för att utforska och modifiera filer — skicka INTE stora filinnehåll i svaret.

Arbetsflöde:
1. read_file("claude/open/...") för att läsa tickets. Välj lägst priority-nummer med payment:false och legal:false. Om inga finns → skip().
2. Använd grep för att förstå mönster i koden.
3. Använd sed -i för in-place-redigering av filer. Verifiera med grep efteråt.
4. move_file: flytta ticket från claude/open/ till claude/done/.
5. done() med commit-meddelande.

Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js`,

  autofix: `Du är efterplan-bot. En Vercel-deploy misslyckades. Implementera minimal fix.

Strategi: Använd bash (grep, sed -i) — skicka INTE stora filinnehåll i svaret.

Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js
Om ej fixbart: write_file("claude/autofix-notes/<datum>.md") med analys, sedan done().
Avsluta alltid med done() eller skip().`
};

// ── Groq-anrop med retry vid rate limit ────────────────────────────────────

async function callGroq(messages) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      return await groq.chat.completions.create({
        model: MODEL,
        messages,
        tools: TOOL_DEFS,
        tool_choice: 'auto',
        temperature: 0.1,
        max_tokens: 1024
      });
    } catch (e) {
      if (e.status === 429) {
        const match = String(e.message).match(/try again in ([\d.]+)s/i);
        const wait = Math.ceil(parseFloat(match?.[1] || '15')) + 2;
        console.log(`Rate limit — väntar ${wait}s (försök ${attempt + 1}/6)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Rate limit kvarstår efter 6 försök.');
}

// Håll kontext liten: behåll system + user + senaste 3 turns
function trimMessages(messages) {
  const fixed = messages.slice(0, 2);
  const rest = messages.slice(2);
  return rest.length <= 12 ? messages : [...fixed, ...rest.slice(-12)];
}

// ── Huvudloop ───────────────────────────────────────────────────────────────

async function run() {
  if (!SYSTEM[MODE]) {
    console.error(`Okänt läge: "${MODE}". Använd 'roadmap' eller 'autofix'.`);
    process.exit(1);
  }

  let initialMsg;
  if (MODE === 'roadmap') {
    // Lista tickets i prompten direkt för att spara ett API-anrop
    const ticketFiles = fs.existsSync('claude/open')
      ? fs.readdirSync('claude/open').filter(f => f.endsWith('.md'))
      : [];
    if (ticketFiles.length === 0) {
      console.log('Inga tickets i claude/open/ — avslutar.');
      return;
    }
    initialMsg = `Tickets i claude/open/:\n${ticketFiles.join('\n')}\n\nLäs dem och implementera den med högst prioritet.`;
  } else {
    const sha = process.env.DEPLOY_SHA || '(okänd)';
    const desc = process.env.DEPLOY_DESC || '(inget felmeddelande)';
    const log = process.env.DEPLOY_LOG ? `\nLogg: ${process.env.DEPLOY_LOG}` : '';
    initialMsg = `Vercel-deploy misslyckades.\nCommit: ${sha}\nFelmeddelande: ${desc}${log}\n\nUndersök och fixa.`;
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
      console.log('Inga fler verktygsanrop — avslutar.');
      break;
    }

    const results = [];
    let finished = false;

    for (const tc of msg.tool_calls) {
      let args = {};
      try { args = JSON.parse(tc.function.arguments); } catch { /* lämna tomt */ }

      const name = tc.function.name;
      console.log(`[${turn + 1}] ${name}(${JSON.stringify(args).slice(0, 120)})`);

      let result;
      if (name === 'done') {
        commitMessage = args.commit_message || 'chore: autonom uppdatering';
        result = 'OK';
        finished = true;
      } else if (name === 'skip') {
        console.log('Skip:', args.reason);
        result = 'OK';
        finished = true;
      } else if (TOOLS_IMPL[name]) {
        try { result = TOOLS_IMPL[name](args); } catch (e) { result = `Fel: ${e.message}`; }
      } else {
        result = `Fel: okänt verktyg "${name}"`;
      }

      results.push({ tool_call_id: tc.id, role: 'tool', content: String(result).slice(0, MAX_OUTPUT_CHARS) });
    }

    messages.push(...results);
    if (finished) break;
  }

  if (commitMessage) {
    spawnSync('git', ['add', '-A'], { stdio: 'inherit' });
    const r = spawnSync('git', ['commit', '-m', commitMessage], { stdio: 'inherit' });
    if (r.status !== 0) console.log('Inga staged ändringar — inget commit.');
  } else {
    console.log('done() anropades inte — inga ändringar committades.');
  }
}

run().catch(err => {
  console.error('Agentfel:', err.message);
  process.exit(1);
});
