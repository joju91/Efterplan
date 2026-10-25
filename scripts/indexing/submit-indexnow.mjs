// Notifierar Bing (och därmed ChatGPT-sök, Copilot och DuckDuckGo, som bygger
// på Bings index) samt Yandex/Seznam/Naver om ändrade sidor via IndexNow.
// Google stödjer inte IndexNow — där sköts det av submit-sitemap.mjs.
//
// IndexNow-nyckeln är publik per design: den ligger som <nyckel>.txt i
// repo-roten och bevisar bara att vi äger domänen. Ingen secret behövs.
//
// Vilka URL:er som skickas:
//   - UPDATED_URLS (JSON-array från update-sitemap.mjs) — sidor som är nya
//     eller har fått ny lastmod i denna körning.
//   - SUBMIT_ALL=true skickar istället alla URL:er i sitemap.xml (manuell
//     körning via workflow_dispatch, t.ex. första gången).
//
// Körs lokalt för test (skickar inget, visar bara payload):
//   DRY_RUN=true SUBMIT_ALL=true node scripts/indexing/submit-indexnow.mjs

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const HOST = 'efterplan.se';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function findKey() {
  const keyFile = readdirSync(REPO_ROOT).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
  if (!keyFile) throw new Error('Hittar ingen IndexNow-nyckelfil (<32 hex>.txt) i repo-roten.');
  const key = readFileSync(path.join(REPO_ROOT, keyFile), 'utf8').trim();
  if (`${key}.txt` !== keyFile) throw new Error(`${keyFile} innehåller inte sin egen nyckel.`);
  return key;
}

function urlsFromSitemap() {
  const xml = readFileSync(path.join(REPO_ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function urlsToSubmit() {
  if (process.env.SUBMIT_ALL === 'true') return urlsFromSitemap();
  const raw = process.env.UPDATED_URLS || '[]';
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`UPDATED_URLS är inte giltig JSON: ${raw}`);
  }
}

async function main() {
  const key = findKey();
  const urlList = urlsToSubmit().filter((u) => new URL(u).host === HOST);

  if (!urlList.length) {
    console.log('Inga ändrade URL:er — inget att skicka till IndexNow.');
    return;
  }

  const body = { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList };
  console.log(`IndexNow: ${urlList.length} URL:er\n` + urlList.map((u) => `  - ${u}`).join('\n'));

  if (process.env.DRY_RUN === 'true') {
    console.log('DRY_RUN — skickar inget.');
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  // 200 = mottaget, 202 = mottaget men nyckeln valideras fortfarande.
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow svarade ${res.status} — klart.`);
    return;
  }
  const text = await res.text().catch(() => '');
  throw new Error(`IndexNow svarade ${res.status}: ${text.slice(0, 300)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
