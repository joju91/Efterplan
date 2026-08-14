// Auto-genererar sitemap.xml från de HTML-sidor som faktiskt finns i repo-roten.
// Körs av .github/workflows/update-sitemap.yml vid varje push till main som
// rör en .html-fil. Ingen manuell sitemap-hantering ska behövas efter detta.
//
// Vad skriptet gör:
//   1. Skannar alla *.html i repo-roten (utom kända icke-sidor).
//   2. Kräver att varje sida har en korrekt <link rel="canonical"> och saknar
//      oavsiktlig <meta name="robots" content="noindex">. Bryter (exit 1) om
//      något inte stämmer — det ska aldrig smyga in en trasig sitemap.
//   3. Sätter <lastmod> från senaste git-commit som rörde filen.
//   4. Bevarar handkurerad <priority>/<changefreq> för sidor som redan finns
//      i sitemap.xml; nya sidor får default 0.7 / monthly.
//   5. Sidor som tagits bort från filsystemet försvinner automatiskt ur
//      sitemap.xml, eftersom de aldrig läggs till i den nya listan.
//
// Körs lokalt för test: node scripts/indexing/update-sitemap.mjs
// (från repo-roten eller från scripts/indexing/, path är relativ till repo-roten ändå)

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const SITE_ORIGIN = 'https://efterplan.se';
const SITEMAP_PATH = path.join(REPO_ROOT, 'sitemap.xml');

// Kända filer i repo-roten som är .html men INTE egna sidor (fragment etc.)
const EXCLUDE = new Set(['auth-modal.html']);

// Sidor som medvetet ska vara noindex trots att de ligger i repo-roten.
// Tomt idag — lägg till filnamn här om en sida uttryckligen ska undantas.
const NOINDEX_ALLOWLIST = new Set([]);

const DEFAULT_PRIORITY = '0.7';
const DEFAULT_CHANGEFREQ = 'monthly';

function urlForFile(file) {
  return file === 'index.html' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${file}`;
}

function canonicalMatches(html, file) {
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']\s*\/?>/i);
  if (!m) return { ok: false, reason: 'saknar <link rel="canonical">' };
  const expected = urlForFile(file);
  // Tillåt både med och utan avslutande slash för index.
  const normalized = m[1] === `${SITE_ORIGIN}` ? `${SITE_ORIGIN}/` : m[1];
  if (normalized !== expected) {
    return { ok: false, reason: `canonical är "${m[1]}", förväntade "${expected}"` };
  }
  return { ok: true };
}

function hasUnintendedNoindex(html, file) {
  const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']\s*\/?>/i);
  if (!m) return false;
  const isNoindex = /noindex/i.test(m[1]);
  if (!isNoindex) return false;
  return !NOINDEX_ALLOWLIST.has(file);
}

function lastmodFor(file) {
  try {
    const out = execSync(`git log -1 --format=%aI -- "${file}"`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    }).trim();
    if (out) return out.slice(0, 10); // YYYY-MM-DD, matchar befintligt format
  } catch {
    // git-kommando misslyckades (t.ex. inte en git-repo i testmiljö) — fall igenom
  }
  return new Date().toISOString().slice(0, 10);
}

function parseExistingSitemap() {
  const existing = new Map(); // url -> { priority, changefreq }
  if (!existsSync(SITEMAP_PATH)) return existing;
  const xml = readFileSync(SITEMAP_PATH, 'utf8');
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const priority = block.match(/<priority>([^<]+)<\/priority>/)?.[1] ?? DEFAULT_PRIORITY;
    const changefreq = block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] ?? DEFAULT_CHANGEFREQ;
    if (loc) existing.set(loc, { priority, changefreq });
  }
  return existing;
}

function buildSitemapXml(entries) {
  const urlXml = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${e.loc}</loc>\n` +
        `    <lastmod>${e.lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlXml}\n</urlset>\n`;
}

function main() {
  const allHtmlFiles = readdirSync(REPO_ROOT).filter((f) => f.endsWith('.html'));
  const pageFiles = allHtmlFiles.filter((f) => !EXCLUDE.has(f));

  const errors = [];
  const included = [];

  for (const file of pageFiles) {
    const html = readFileSync(path.join(REPO_ROOT, file), 'utf8');

    if (hasUnintendedNoindex(html, file)) {
      errors.push(`${file}: har <meta name="robots" content="noindex"> men står inte i NOINDEX_ALLOWLIST`);
      continue;
    }

    const canon = canonicalMatches(html, file);
    if (!canon.ok) {
      errors.push(`${file}: ${canon.reason}`);
      continue;
    }

    included.push(file);
  }

  if (errors.length) {
    console.error('Sitemap-validering misslyckades:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }

  const existing = parseExistingSitemap();

  // Bevara nuvarande ordning i sitemap.xml för de sidor som redan fanns där,
  // lägg nya sidor sist (alfabetiskt) så diffen blir liten och begriplig.
  const existingOrder = [...existing.keys()];
  const known = pageFiles.filter((f) => existingOrder.includes(urlForFile(f)));
  const brandNew = pageFiles.filter((f) => !existingOrder.includes(urlForFile(f))).sort();
  const orderedFiles = [
    ...existingOrder.map((loc) => known.find((f) => urlForFile(f) === loc)).filter(Boolean),
    ...brandNew,
  ];

  const removedUrls = existingOrder.filter((loc) => !pageFiles.some((f) => urlForFile(f) === loc));

  const entries = orderedFiles.map((file) => {
    const loc = urlForFile(file);
    const prior = existing.get(loc);
    return {
      loc,
      lastmod: lastmodFor(file),
      changefreq: prior?.changefreq ?? DEFAULT_CHANGEFREQ,
      priority: prior?.priority ?? DEFAULT_PRIORITY,
    };
  });

  const newXml = buildSitemapXml(entries);
  const oldXml = existsSync(SITEMAP_PATH) ? readFileSync(SITEMAP_PATH, 'utf8') : '';
  const changed = newXml !== oldXml;

  if (changed) {
    writeFileSync(SITEMAP_PATH, newXml, 'utf8');
  }

  const summary = {
    changed,
    totalUrls: entries.length,
    added: brandNew.map(urlForFile),
    removed: removedUrls,
  };

  console.log(JSON.stringify(summary, null, 2));

  // Exponera för workflow-steg via GITHUB_OUTPUT om tillgängligt.
  if (process.env.GITHUB_OUTPUT) {
    writeFileSync(process.env.GITHUB_OUTPUT, `sitemap_changed=${changed}\n`, { flag: 'a' });
  }
}

main();
