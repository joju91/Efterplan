#!/usr/bin/env node
/**
 * Groq-driven autonom agent för Efterplan GitHub Actions.
 * Läge: 'roadmap' (implementera ticket) eller 'autofix' (fixa deploy-fel).
 *
 * Token-snål design: grep-verktyg för kompakt sökning,
 * replace-verktyg för modifiering utan att skicka stora filer.
 */

import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { globSync } from 'glob';

const MODE = process.argv[2];
const MODEL = 'openai/gpt-oss-120b';
const MAX_TURNS = 20;
const MAX_FILE_BYTES = 3_000;
const MAX_OUT = 2_000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Verktygsimplementationer ────────────────────────────────────────────────

function toolGrep({ pattern, glob: g, context: ctx = 0 }) {
  const args = ['-rn'];
  if (ctx > 0) args.push(`-A${ctx}`, `-B${ctx}`);
  if (g) args.push('--include=' + g);
  args.push(pattern, '.');
  const r = spawnSync('grep', args, { encoding: 'utf8' });
  return (r.stdout.replace(/^\.\//gm, '') || 'Inga träffar.').slice(0, MAX_OUT);
}

function toolReplaceInFile({ file, search, replace }) {
  if (!fs.existsSync(file)) return `Fel: ${file} saknas`;
  const content = fs.readFileSync(file, 'utf8');
  const count = content.split(search).length - 1;
  if (count === 0) return `0 träffar — ingenting ersatt i ${file}`;
  fs.writeFileSync(file, content.split(search).join(replace), 'utf8');
  return `${count} ersättning(ar) i ${file}`;
}

function toolRegexReplaceFiles({ glob: g, pattern, replace }) {
  const files = globSync(g, { ignore: ['.git/**', 'node_modules/**', 'scripts/**'] });
  let totalReplaced = 0;
  let filesChanged = 0;
  const re = new RegExp(pattern, 'g');
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(re);
    if (!matches) continue;
    fs.writeFileSync(file, content.replace(re, replace), 'utf8');
    totalReplaced += matches.length;
    filesChanged++;
  }
  return `${totalReplaced} ersättning(ar) i ${filesChanged} filer (av ${files.length} granskade)`;
}

function toolReadFile({ file }) {
  if (!fs.existsSync(file)) return `Fel: ${file} saknas`;
  const buf = fs.readFileSync(file);
  if (buf.length > MAX_FILE_BYTES)
    return `Fel: ${file} är ${buf.length} bytes (max ${MAX_FILE_BYTES}). Använd grep för att se specifika delar.`;
  return buf.toString('utf8');
}

function toolWriteFile({ file, content }) {
  const dir = path.dirname(file);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
  return `Skriven: ${file}`;
}

function toolMoveFile({ from: src, to: dst }) {
  if (!fs.existsSync(src)) return `Fel: ${src} saknas`;
  const dir = path.dirname(dst);
  if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.renameSync(src, dst);
  return `OK: ${src} → ${dst}`;
}

function toolListFiles({ glob: g }) {
  const files = globSync(g, { ignore: ['.git/**', 'node_modules/**'] });
  return files.join('\n') || 'Inga filer.';
}

const TOOLS_IMPL = {
  grep: toolGrep,
  replace_in_file: toolReplaceInFile,
  regex_replace_files: toolRegexReplaceFiles,
  read_file: toolReadFile,
  write_file: toolWriteFile,
  move_file: toolMoveFile,
  list_files: toolListFiles
};

// ── Verktygsdefinitioner ────────────────────────────────────────────────────

const TOOL_DEFS = [
  {
    type: 'function',
    function: {
      name: 'grep',
      description: 'Sök efter ett textmönster i filer. Returnerar filer och radnummer med träffar.',
      parameters: {
        type: 'object',
        properties: {
          pattern: { type: 'string', description: 'Sökterm (regex OK)' },
          glob: { type: 'string', description: 'Filmönster: t.ex. *.html, api/*.js' },
          context: { type: 'number', description: 'Antal kontextrader runt varje träff (default 0)' }
        },
        required: ['pattern']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'replace_in_file',
      description: 'Ersätt en exakt sträng i en fil (alla förekomster). Skickar INTE filens innehåll — ange exakt sök-sträng.',
      parameters: {
        type: 'object',
        properties: {
          file: { type: 'string', description: 'Relativ sökväg' },
          search: { type: 'string', description: 'Exakt sträng att hitta' },
          replace: { type: 'string', description: 'Sträng att ersätta med' }
        },
        required: ['file', 'search', 'replace']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'regex_replace_files',
      description: 'Applicera ett regex-mönster på ALLA filer som matchar glob. Effektivt för att ändra många filer på en gång.',
      parameters: {
        type: 'object',
        properties: {
          glob: { type: 'string', description: 'Filmönster, t.ex. *.html' },
          pattern: { type: 'string', description: 'JavaScript-regex (utan /.../ — bara mönstret)' },
          replace: { type: 'string', description: 'Ersättningssträng (stöder $1, $2 för capture groups)' }
        },
        required: ['glob', 'pattern', 'replace']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'list_files',
      description: 'Lista filer som matchar ett glob-mönster',
      parameters: {
        type: 'object',
        properties: { glob: { type: 'string' } },
        required: ['glob']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'read_file',
      description: 'Läs en fil (max 3 KB). Använd grep för att se delar av större filer.',
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
      description: 'Skriv en ny liten fil (t.ex. anteckningar, konfiguration).',
      parameters: {
        type: 'object',
        properties: {
          file: { type: 'string' },
          content: { type: 'string' }
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
      description: 'Uppgiften är klar. Committar alla ändringar med angivet meddelande.',
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
  roadmap: `Du är efterplan-bot, autonom kodredigerare för Efterplan (statisk webbplats: HTML/CSS/JS + Vercel serverless API i api/).
Implementera exakt en ticket per körning.

Tillgängliga verktyg: grep, replace_in_file, regex_replace_files, list_files, read_file, write_file, move_file, done, skip.
Undvik att läsa stora filer — använd grep + replace-verktyg istället.

Arbetsflöde:
1. Läs ticket-filen med read_file.
2. Välj ticket med lägst priority-nummer och payment:false, legal:false. Om inga finns: skip().
3. Utforska berörda filer med grep och list_files.
4. Gör ändringarna med replace_in_file eller regex_replace_files.
5. Verifiera med grep.
6. Flytta ticket: move_file("claude/open/X.md", "claude/done/X.md").
7. Anropa done() med commit-meddelande.

Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js`,

  autofix: `Du är efterplan-bot. En Vercel-deploy av Efterplan misslyckades. Implementera minimal fix.

Tillgängliga verktyg: grep, replace_in_file, regex_replace_files, list_files, read_file, write_file, move_file, done, skip.

Rör ALDRIG: api/create-checkout.js, api/verify-checkout.js, api/stripe-webhook.js, api/check-premium.js
Om ej fixbart: write_file("claude/autofix-notes/<datum>.md") med analys.
Avsluta alltid med done() eller skip().`
};

// ── Groq-anrop med retry ────────────────────────────────────────────────────

async function callGroq(messages) {
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      return await groq.chat.completions.create({
        model: MODEL,
        messages,
        tools: TOOL_DEFS,
        tool_choice: 'required',
        temperature: 0.1,
        max_tokens: 1024
      });
    } catch (e) {
      if (e.status === 429 || e.status === 413) {
        const match = String(e.message).match(/try again in ([\d.]+)s/i);
        const wait = Math.ceil(parseFloat(match?.[1] || '15')) + 2;
        console.log(`Rate limit (${e.status}) — väntar ${wait}s (försök ${attempt + 1}/6)...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Rate limit kvarstår efter 6 försök.');
}

// Håll kontext liten — behåll system + user + senaste 3 turns (12 meddelanden)
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
    const ticketFiles = fs.existsSync('claude/open')
      ? fs.readdirSync('claude/open').filter(f => f.endsWith('.md'))
      : [];
    if (ticketFiles.length === 0) {
      console.log('Inga tickets i claude/open/ — avslutar.');
      return;
    }
    initialMsg = `Tickets i claude/open/: ${ticketFiles.join(', ')}\n\nLäs dem och implementera den med högst prioritet.`;
  } else {
    const sha = process.env.DEPLOY_SHA || '(okänd)';
    const desc = process.env.DEPLOY_DESC || '(inget felmeddelande)';
    const log = process.env.DEPLOY_LOG ? `\nLogg: ${process.env.DEPLOY_LOG}` : '';
    initialMsg = `Vercel-deploy misslyckades.\nCommit: ${sha}\nFelmeddelande: ${desc}${log}\nUndersök och fixa.`;
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
        result = `Okänt verktyg "${name}". Tillgängliga: ${Object.keys(TOOLS_IMPL).concat(['done','skip']).join(', ')}`;
      }

      results.push({ tool_call_id: tc.id, role: 'tool', content: String(result).slice(0, MAX_OUT) });
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
