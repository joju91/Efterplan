// Byter ut Google Analytics (gtag) mot Plausible på alla HTML-sidor.
// Plausible är cookielöst och matchar sajtens integritetslöfte; ~1 KB.
//
// Kör från repo-roten:  node scripts/swap-analytics.mjs

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PLAUSIBLE =
  '<script defer data-domain="efterplan.se" src="https://plausible.io/js/script.outbound-links.js"></script>';

const files = readdirSync(ROOT).filter((f) => f.endsWith('.html'));

let changed = 0;
for (const file of files) {
  const fp = path.join(ROOT, file);
  let html = readFileSync(fp, 'utf8');
  const before = html;

  // 1. Ta bort ev. "<!-- Google tag (gtag.js) ... -->"-kommentar
  html = html.replace(/[ \t]*<!--\s*Google tag \(gtag\.js\)[^>]*-->\r?\n?/g, '');

  // 2. Ta bort alla <script>-block som rör gtag/googletagmanager
  //    (både "<script async src=...gtag/js...></script>" och inline-configen)
  html = html.replace(
    /[ \t]*<script\b[^>]*\bsrc="https:\/\/www\.googletagmanager\.com\/[^"]*"[^>]*>\s*<\/script>\r?\n?/g,
    '',
  );
  html = html.replace(
    /[ \t]*<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?\bgtag\(\s*['"]config['"][\s\S]*?<\/script>\r?\n?/g,
    '',
  );
  html = html.replace(
    /[ \t]*<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?googletagmanager\.com[\s\S]*?<\/script>\r?\n?/g,
    '',
  );

  // 3. Säkerställ Plausible-taggen (en gång, precis före </head>)
  if (!html.includes('plausible.io/js/')) {
    html = html.replace(/([ \t]*)<\/head>/i, `  ${PLAUSIBLE}\n$1</head>`);
  }

  if (html !== before) {
    writeFileSync(fp, html, 'utf8');
    console.log(`✓ ${file}`);
    changed++;
  }
}
console.log(`\nFärdigt: ${changed} filer.`);
