#!/usr/bin/env node
// Efterplan — npm run keys:rotate -- <stripe|supabase|anthropic|google>
//
// Det enda steget som inte går att automatisera (leverantörerna tillåter det
// inte av säkerhetsskäl): du klickar "skapa ny nyckel" i deras dashboard.
// Allt efter det — sprida värdet till Vercel, GitHub Actions och din lokala
// .env.local — sköter det här scriptet åt dig.

import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SERVICES } from './config.mjs';
import { upsertEnvValue } from './env-file.mjs';
import { openUrl } from './browser.mjs';
import { run as runCmd } from './exec.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const envPath = path.join(root, '.env.local');
const serviceKey = process.argv[2];

if (!serviceKey || !SERVICES[serviceKey]) {
  console.log('Använd: npm run keys:rotate -- <tjänst>');
  console.log('Tjänster: ' + Object.keys(SERVICES).join(', '));
  process.exit(1);
}

const svc = SERVICES[serviceKey];
console.log(`\n== Rotera: ${svc.label} ==`);
console.log('Varje variabel kan ligga på en egen sida i dashboarden — scriptet öppnar rätt sida för respektive variabel innan den frågar efter värdet.\n');
if (svc.warning) {
  console.log(svc.warning);
  console.log('');
}

const allVars = [...new Set([...svc.vars, ...svc.githubSecrets])];
if (allVars.length === 0) {
  console.log('Den här tjänsten har inga variabler kopplade till Vercel/GitHub i det här scriptet — uppdatera manuellt.');
  process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let rlClosed = false;
rl.once('close', () => { rlClosed = true; });

let lastUrl = null;
const updated = [];
for (const name of allVars) {
  const url = svc.varUrls?.[name] || svc.dashboardUrl;
  if (url !== lastUrl) {
    const opened = openUrl(url);
    console.log(opened ? `→ Öppnar automatiskt: ${url}` : `→ Öppna: ${url}`);
    lastUrl = url;
  }
  const value = await prompt(`Nytt värde för ${name} (tomt = hoppa över): `);
  if (!value) {
    console.log(`  ↷ Hoppar över ${name}`);
    continue;
  }

  if (svc.vars.includes(name)) {
    run('vercel', ['env', 'rm', name, 'production', '--yes']); // ok om den inte fanns sen innan
    const add = run('vercel', ['env', 'add', name, 'production'], value + '\n');
    console.log(add.status === 0
      ? `  ✓ ${name} uppdaterad i Vercel (production)`
      : `  ✗ Vercel-uppdatering av ${name} misslyckades — kör "vercel env add ${name} production" manuellt.`);
  }
  if (svc.githubSecrets.includes(name)) {
    // Äldre gh CLI-versioner saknar --body-file, men läser alltid stdin om -b utelämnas.
    const set = run('gh', ['secret', 'set', name], value);
    console.log(set.status === 0
      ? `  ✓ ${name} uppdaterad som GitHub Actions-secret`
      : `  ✗ GitHub-uppdatering av ${name} misslyckades — kör "gh secret set ${name}" manuellt.`);
  }
  // Skriv direkt in i .env.local — vercel env pull skulle svara tomt för
  // Sensitive-variabler och nolla det vi precis satte.
  if (svc.vars.includes(name)) {
    upsertEnvValue(envPath, name, value);
  }
  updated.push(name);
}

console.log(updated.length > 0
  ? `\n.env.local uppdaterad lokalt för: ${updated.filter((n) => svc.vars.includes(n)).join(', ') || '(inga Vercel-variabler i den här tjänsten)'}`
  : '\nInget uppdaterat.');

console.log('\nKlart.');
rl.close();

function run(cmd, args, input) {
  return runCmd(cmd, args, { cwd: root, input });
}

// En delad readline-instans för hela körningen (istället för en ny per fråga)
// — annars missar en ny instans ibland 'close'-eventet när stdin redan tagit
// slut, och hänger/kraschar istället för att hoppa över.
function prompt(question) {
  // Om stdin redan tagit slut (t.ex. skriptad/icke-interaktiv körning) är
  // readline-instansen stängd sen tidigare — fråga inte, hoppa bara över.
  if (rlClosed) return Promise.resolve('');
  return new Promise((resolve) => {
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      resolve(answer.trim());
    });
    rl.once('close', () => {
      if (!answered) resolve('');
    });
  });
}
