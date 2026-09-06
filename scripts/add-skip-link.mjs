// Lägger till en "Hoppa till innehållet"-skiplänk på alla innehållssidor
// (WCAG 2.4.1 Bypass Blocks). index.html har redan en egen.
//
// Kör från repo-roten:  node scripts/add-skip-link.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP = new Set(['index.html', 'auth-modal.html']);

const files = readdirSync(ROOT).filter(
  (f) => f.endsWith('.html') && !SKIP.has(f),
);

let patched = 0;
for (const file of files) {
  const filePath = path.join(ROOT, file);
  let html = readFileSync(filePath, 'utf8');

  if (!html.includes('<main class="seo-main"')) continue; // inte en artikelsida
  if (/class="[^"]*\bskip-link\b/.test(html)) continue; // redan gjort

  html = html.replace(
    /<body>\s*\n/,
    '<body>\n  <a href="#main" class="skip-link">Hoppa till innehållet</a>\n',
  );
  html = html.replace(
    '<main class="seo-main">',
    '<main class="seo-main" id="main">',
  );

  writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${file}`);
  patched++;
}

console.log(`\nFärdigt: ${patched} filer fick skiplänk.`);
