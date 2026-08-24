#!/usr/bin/env node
// Nyckelhantering, samlat på ett ställe.
//
// Problemet det löser: nycklar (Stripe, Supabase, Anthropic, GA4/GSC service
// accounts) har hittills fått klistras in manuellt i tre olika ställen —
// Vercel-dashboarden, GitHub Actions secrets, och lokal .env.local — varje
// gång en nyckel roterats eller lagts till. Med det här skriptet skriver du
// nyckeln EN gång, på EN plats, och kör ett kommando.
//
// Källan till sanning: ~/.config/efterplan/secrets.env (utanför repot,
// aldrig committad). Samma mapp som redan används för
// ga4-service-account.json (se roadmap.md T209).
//
//   node scripts/sync-secrets.mjs --init         Skapa mall-filen (en gång)
//   node scripts/sync-secrets.mjs                Synka allt till Vercel + GitHub + .env.local
//   node scripts/sync-secrets.mjs --only=STRIPE_SECRET_KEY,SUPABASE_URL
//   node scripts/sync-secrets.mjs --dry-run       Visa vad som skulle hända, ändra inget
//
// Krav: `vercel` och `gh` CLI installerade och redan inloggade
// (`vercel link` kört i repot, `gh auth login` kört) — skriptet autentiserar
// inget själv, det bara skickar vidare det som redan står i secrets.env.

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONFIG_DIR = path.join(homedir(), '.config', 'efterplan');
const SECRETS_FILE = path.join(CONFIG_DIR, 'secrets.env');

// Vilken nyckel ska till vilket ställe. Lägg till en rad här när en ny
// integration behöver en secret — det är den enda plats som behöver ändras.
const TARGETS = {
  STRIPE_SECRET_KEY:        { vercel: ['production', 'preview', 'development'], local: true },
  STRIPE_WEBHOOK_SECRET:    { vercel: ['production', 'preview', 'development'], local: true },
  STRIPE_PRICE_ID:          { vercel: ['production', 'preview', 'development'], local: true },
  SUPABASE_URL:              { vercel: ['production', 'preview', 'development'], local: true },
  // Delas mellan Vercel (api/*.js) och GitHub Actions (supabase-keepalive.yml).
  SUPABASE_SECRET_KEY:       { vercel: ['production', 'preview', 'development'], local: true, github: true },
  ANTHROPIC_API_KEY:         { vercel: ['production', 'preview', 'development'], local: true },
  // Bara GitHub Actions (schemalagda workflows, ingen Vercel-runtime inblandad).
  GA4_PROPERTY_ID:           { github: true },
  GA4_SERVICE_ACCOUNT_JSON:  { github: true },
  GSC_SERVICE_ACCOUNT_JSON:  { github: true },
};

const TEMPLATE = `# Efterplan — samlade nycklar. Enda stället du behöver skriva en nyckel.
# Kör "node scripts/sync-secrets.mjs" efter varje ändring för att synka till
# Vercel, GitHub Actions och lokal .env.local automatiskt.
#
# Ett värde som börjar med @ läses som filsökväg (för JSON-blobbar, t.ex.
# service accounts) — filens innehåll blir secreten, inte texten "@...".

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
ANTHROPIC_API_KEY=
GA4_PROPERTY_ID=
GA4_SERVICE_ACCOUNT_JSON=@${path.join(CONFIG_DIR, 'ga4-service-account.json')}
GSC_SERVICE_ACCOUNT_JSON=@${path.join(CONFIG_DIR, 'gsc-service-account.json')}
`;

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    init: args.includes('--init'),
    dryRun: args.includes('--dry-run'),
    only: (args.find((a) => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean),
  };
}

function expandHome(p) {
  return p.startsWith('~') ? path.join(homedir(), p.slice(1)) : p;
}

function loadSecretsFile() {
  const raw = readFileSync(SECRETS_FILE, 'utf8');
  const out = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (!value) continue; // tom rad i mallen, hoppa över tyst
    if (value.startsWith('@')) {
      const filePath = expandHome(value.slice(1));
      if (!existsSync(filePath)) {
        console.warn(`⚠️  ${key}: refererad fil saknas (${filePath}) — hoppar över.`);
        continue;
      }
      value = readFileSync(filePath, 'utf8');
    }
    out[key] = value;
  }
  return out;
}

function sh(cmd, args, input) {
  return execFileSync(cmd, args, { input, stdio: ['pipe', 'pipe', 'pipe'], encoding: 'utf8' });
}

function commandExists(cmd) {
  try {
    execFileSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function syncVercel(key, value, envs, dryRun) {
  for (const env of envs) {
    if (dryRun) {
      console.log(`  [dry-run] vercel env set ${key} → ${env}`);
      continue;
    }
    try {
      // vercel har ingen "set", bara add/rm — rm är no-op om värdet inte finns.
      try { sh('vercel', ['env', 'rm', key, env, '-y'], undefined); } catch { /* fanns inte sedan innan */ }
      sh('vercel', ['env', 'add', key, env], value);
      console.log(`  ✓ Vercel/${env}: ${key}`);
    } catch (err) {
      console.error(`  ✗ Vercel/${env}: ${key} — ${err.message.split('\n')[0]}`);
    }
  }
}

function syncGithub(key, value, dryRun) {
  if (dryRun) {
    console.log(`  [dry-run] gh secret set ${key}`);
    return;
  }
  try {
    sh('gh', ['secret', 'set', key], value);
    console.log(`  ✓ GitHub Actions: ${key}`);
  } catch (err) {
    console.error(`  ✗ GitHub Actions: ${key} — ${err.message.split('\n')[0]}`);
  }
}

function writeLocalEnv(values, dryRun) {
  const localKeys = Object.entries(TARGETS)
    .filter(([, t]) => t.local)
    .map(([k]) => k)
    .filter((k) => values[k] !== undefined);
  if (!localKeys.length) return;
  const body = localKeys.map((k) => `${k}=${values[k]}`).join('\n') + '\n';
  const target = path.join(ROOT, '.env.local');
  if (dryRun) {
    console.log(`  [dry-run] skriv ${localKeys.length} nycklar till .env.local`);
    return;
  }
  writeFileSync(target, body, { mode: 0o600 });
  console.log(`  ✓ Lokal fil: .env.local (${localKeys.length} nycklar)`);
}

function main() {
  const { init, dryRun, only } = parseArgs();

  if (init) {
    mkdirSync(CONFIG_DIR, { recursive: true });
    if (existsSync(SECRETS_FILE)) {
      console.log(`Finns redan: ${SECRETS_FILE} — rör den inte, redigera manuellt.`);
      return;
    }
    writeFileSync(SECRETS_FILE, TEMPLATE, { mode: 0o600 });
    console.log(`Skapad: ${SECRETS_FILE} (chmod 600).`);
    console.log('Fyll i nycklarna där, kör sedan: node scripts/sync-secrets.mjs');
    return;
  }

  if (!existsSync(SECRETS_FILE)) {
    console.error(`Ingen secrets.env hittad på ${SECRETS_FILE}.`);
    console.error('Kör först: node scripts/sync-secrets.mjs --init');
    process.exit(1);
  }

  const haveVercel = commandExists('vercel');
  const haveGh = commandExists('gh');
  if (!haveVercel) console.warn('⚠️  vercel-CLI hittades inte — Vercel-env hoppas över.');
  if (!haveGh) console.warn('⚠️  gh-CLI hittades inte — GitHub secrets hoppas över.');

  const values = loadSecretsFile();
  const keys = (only.length ? only : Object.keys(TARGETS)).filter((k) => values[k] !== undefined);

  if (!keys.length) {
    console.log('Inget att synka (secrets.env är tom, eller --only matchade inget).');
    return;
  }

  console.log(`Synkar ${keys.length} nyckel/nycklar${dryRun ? ' (dry-run, inget skrivs)' : ''}...\n`);

  for (const key of keys) {
    const target = TARGETS[key];
    if (!target) {
      console.warn(`⚠️  ${key} finns i secrets.env men saknar mål i TARGETS — lägg till i scripts/sync-secrets.mjs.`);
      continue;
    }
    console.log(`${key}:`);
    if (target.vercel && haveVercel) syncVercel(key, values[key], target.vercel, dryRun);
    if (target.github && haveGh) syncGithub(key, values[key], dryRun);
  }

  console.log('');
  writeLocalEnv(values, dryRun);
  console.log('\nKlart.');
}

main();
