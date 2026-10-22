// Byter ut Plausible mot cookielös GA4 (ga.js) på alla HTML-sidor.
// Plausible-prenumerationen löpte ut 2026-10; GA4 körs med
// client_storage: 'none' (se ga.js) så inget sparas på besökarens enhet.
//
// Kör från repo-roten:  node scripts/swap-analytics.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GA_TAG = '<script src="ga.js?v=1" defer></script>';

const files = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

let changed = 0;
for (const file of files) {
  const fp = path.join(ROOT, file);
  let html = readFileSync(fp, 'utf8');
  const before = html;
  const eol = html.includes('\r\n') ? '\r\n' : '\n';

  // 1. Ta bort Plausible-taggen (var den än står)
  html = html.replace(/[ \t]*<script\b[^>]*\bsrc="https:\/\/plausible\.io\/js\/[^"]*"[^>]*>\s*<\/script>\r?\n?/g, '');

  // 2. Byt inline-anrop window.plausible('x', { props: {...} }) → window.gaEvent('x', {...})
  html = html.replace(
    /window\.plausible\s*&&\s*window\.plausible\(\s*('[^']+')\s*,\s*\{\s*props:\s*(\{[^}]*\})\s*\}\s*\)/g,
    'window.gaEvent && window.gaEvent($1, $2)',
  );
  html = html.replace(/data-action="plausibleFreeToApp"/g, 'data-action="trackFreeToApp"');

  // 3. Säkerställ GA-taggen (en gång, precis före </head>) — bara på sidor som hade spårning
  if (before.includes('plausible.io/js/') && !html.includes('ga.js')) {
    html = html.replace(/([ \t]*)<\/head>/i, `  ${GA_TAG}${eol}$1</head>`);
  }

  if (html !== before) {
    writeFileSync(fp, html, 'utf8');
    console.log(`✓ ${file}`);
    changed++;
  }
}
console.log(`\nFärdigt: ${changed} filer.`);
