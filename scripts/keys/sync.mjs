#!/usr/bin/env node
// Efterplan — npm run keys:sync
//
// Hämtar det som faktiskt går att hämta utan mänsklig inblandning:
//   1. Vercels produktions-env -> .env.local.
//   2. En jämförelse mot Supabase direkt, så du ser om .env.local är
//      föråldrad jämfört med det verkliga projektet.
//
// Viktigt: STRIPE_*, SUPABASE_SECRET_KEY och ANTHROPIC_API_KEY är sparade
// som "Sensitive" i Vercel — Vercel svarar då alltid med tomt värde, även
// om variabeln har ett riktigt värde där (det är avsiktligt, Vercel tillåter
// aldrig att läsa ut en Sensitive-variabel igen). Vi skriver därför ALDRIG
// över ett befintligt icke-tomt lokalt värde med ett tomt Vercel-svar —
// annars skulle en nyss roterad nyckel (npm run keys:rotate) nollställas
// nästa gång man kör sync. Vill man uppdatera en Sensitive-variabel lokalt
// måste man rotera den (npm run keys:rotate -- <tjänst>).
//
// Skriver aldrig ut hemliga värden — bara status (OK / saknas / avviker).

import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { SERVICES } from './config.mjs';
import { parseEnvFile, writeEnvFile } from './env-file.mjs';
import { run as runCmd } from './exec.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const envPath = path.join(root, '.env.local');
const tmpPullPath = path.join(root, '.env.local.keys-sync-tmp');

function run(cmd, args) {
  return runCmd(cmd, args, { cwd: root });
}

console.log('== Efterplan: synkar nycklar ==\n');

// 1. Vercel — pulla till en temp-fil och slå ihop, istället för att skriva
//    över .env.local direkt (se kommentar högst upp).
console.log('→ Vercel: hämtar produktionsvärden ...');
const vercelRes = run('vercel', ['env', 'pull', tmpPullPath, '--environment=production', '--yes']);
if (vercelRes.status !== 0) {
  console.error('  ✗ Misslyckades. Är du inloggad? Kör: vercel login');
  if (vercelRes.stderr) console.error('  ' + vercelRes.stderr.trim().split('\n').join('\n  '));
} else {
  const pulled = parseEnvFile(tmpPullPath);
  const current = parseEnvFile(envPath);
  const merged = { ...current };
  let changed = 0;
  let keptSensitive = 0;
  for (const [name, value] of Object.entries(pulled)) {
    if (value === '' && current[name]) {
      keptSensitive++; // Sensitive i Vercel — behåll befintligt lokalt värde.
      continue;
    }
    if (merged[name] !== value) changed++;
    merged[name] = value;
  }
  writeEnvFile(envPath, merged);
  fs.rmSync(tmpPullPath, { force: true });
  console.log(`  ✓ .env.local uppdaterad (${changed} värden uppdaterade från Vercel, ${keptSensitive} Sensitive-variabler lämnade orörda).`);
}

// 2. Supabase — kryssa av mot projektet direkt.
const supa = SERVICES.supabase;
console.log(`\n→ Supabase: jämför mot projektet (${supa.projectRef}) ...`);
const supaRes = run('npx', ['--yes', 'supabase', 'projects', 'api-keys', '--project-ref', supa.projectRef, '-o', 'json']);
if (supaRes.status !== 0) {
  console.log('  ⚠ Kunde inte hämta. Engångskommando om du inte gjort det än: npx supabase login');
} else {
  try {
    const keys = JSON.parse(supaRes.stdout);
    const localEnv = parseEnvFile(envPath);
    // Nya formatet (typ "secret") är det .env.example rekommenderar. Supabase
    // maskerar numera värdet i CLI-svaret (bara prefix + prickar), så vi kan
    // bara jämföra prefix — inte fullt värde. Ett projekt kan ha FLERA aktiva
    // secret-nycklar samtidigt (t.ex. en gammal "default" kvar efter en
    // rotation) — matcha mot alla, inte bara den första i listan.
    const secretKeys = Array.isArray(keys) ? keys.filter((k) => k.type === 'secret') : [];
    const legacyServiceRole = Array.isArray(keys) ? keys.find((k) => k.name === 'service_role') : null;
    if (localEnv.SUPABASE_SECRET_KEY && secretKeys.length > 0) {
      const match = secretKeys.some((k) => localEnv.SUPABASE_SECRET_KEY.startsWith(k.prefix));
      console.log(match
        ? '  ✓ SUPABASE_SECRET_KEY matchar en aktiv nyckel hos Supabase.'
        : '  ⚠ SUPABASE_SECRET_KEY i .env.local matchar ingen aktiv nyckel hos Supabase — rotera med: npm run keys:rotate -- supabase');
      if (secretKeys.length > 1) {
        console.log(`  ⚠ Supabase har ${secretKeys.length} aktiva "secret"-nycklar samtidigt (t.ex. en gammal kvar efter rotation) — överväg att ta bort den du inte längre använder i dashboarden.`);
      }
    } else if (localEnv.SUPABASE_SECRET_KEY && legacyServiceRole?.api_key) {
      console.log(legacyServiceRole.api_key === localEnv.SUPABASE_SECRET_KEY
        ? '  ✓ SUPABASE_SECRET_KEY matchar Supabase (legacy service_role).'
        : '  ⚠ SUPABASE_SECRET_KEY i .env.local avviker från Supabase — rotera med: npm run keys:rotate -- supabase');
    } else if (!localEnv.SUPABASE_SECRET_KEY && (secretKeys.length > 0 || legacyServiceRole)) {
      console.log('  ⚠ SUPABASE_SECRET_KEY är inte satt lokalt ännu — sätt den med: npm run keys:rotate -- supabase');
    } else {
      console.log('  ⚠ Kunde inte jämföra automatiskt (oväntat svarsformat från Supabase CLI) — kolla manuellt vid behov.');
    }
  } catch {
    console.log('  ⚠ Kunde inte tolka svaret från Supabase CLI.');
  }
}

// 3. Statusöversikt.
console.log('\n== Status per tjänst ==');
const localEnv = parseEnvFile(envPath);
for (const svc of Object.values(SERVICES)) {
  if (svc.vars.length === 0) {
    console.log(`${svc.label}: (inga Vercel-variabler — se GitHub Secrets manuellt)`);
    continue;
  }
  const missing = svc.vars.filter((v) => !localEnv[v]);
  if (missing.length === 0) {
    console.log(`${svc.label}: ✓ alla variabler finns lokalt`);
  } else if (svc.vercelSensitive) {
    console.log(`${svc.label}: ⚠ saknas lokalt (Sensitive i Vercel, går inte att hämta): ${missing.join(', ')} — rotera för att sätta ett lokalt värde: npm run keys:rotate -- ${Object.keys(SERVICES).find((k) => SERVICES[k] === svc)}`);
  } else {
    console.log(`${svc.label}: ⚠ saknas: ${missing.join(', ')}`);
  }
}

console.log('\nKlart. Inga hemliga värden skrevs ut ovan.');
