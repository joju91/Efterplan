// Efterplan — delad .env-fil-hantering för scripts/keys/*.
import fs from 'node:fs';

export function parseEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  const out = {};
  for (const rawLine of fs.readFileSync(p, 'utf8').split('\n')) {
    const line = rawLine.replace(/\r$/, ''); // vercel env pull skriver CRLF
    const m = line.match(/^([A-Z0-9_]+)="?(.*?)"?$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

export function writeEnvFile(p, values) {
  const lines = Object.entries(values).map(
    ([name, value]) => `${name}="${String(value).replace(/"/g, '\\"')}"`
  );
  fs.writeFileSync(p, lines.join('\n') + '\n', 'utf8');
}

// Skriver in/ersätter en enda variabel utan att röra resten av filen.
export function upsertEnvValue(p, name, value) {
  const current = parseEnvFile(p);
  current[name] = value;
  writeEnvFile(p, current);
}
