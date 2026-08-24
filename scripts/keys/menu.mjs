#!/usr/bin/env node
// Efterplan — npm run keys
// Enkel svensk meny ovanpå sync/rotate/open, så man slipper komma ihåg flaggor.

import { spawnSync } from 'node:child_process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { SERVICES } from './config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const scriptsDir = path.join(root, 'scripts', 'keys');
const serviceNames = Object.keys(SERVICES);

console.log('\n== Efterplan — nycklar ==\n');
console.log('1. Synka nycklar (hämta det som går, till .env.local)');
serviceNames.forEach((key, i) => {
  console.log(`${i + 2}. Rotera ${SERVICES[key].label}`);
});
console.log(`${serviceNames.length + 2}. Öppna en dashboard-sida (utan att rotera)`);
console.log('0. Avsluta\n');

const choice = await prompt('Val: ');
const n = Number(choice.trim());

if (n === 0 || !choice.trim()) {
  console.log('Avslutar.');
  process.exit(0);
} else if (n === 1) {
  run('sync.mjs');
} else if (n >= 2 && n <= serviceNames.length + 1) {
  const service = serviceNames[n - 2];
  run('rotate.mjs', [service]);
} else if (n === serviceNames.length + 2) {
  console.log('\nVilken tjänst?');
  serviceNames.forEach((key, i) => console.log(`${i + 1}. ${SERVICES[key].label}`));
  const svcChoice = await prompt('Val: ');
  const svcIndex = Number(svcChoice.trim()) - 1;
  if (serviceNames[svcIndex]) {
    run('open.mjs', [serviceNames[svcIndex]]);
  } else {
    console.log('Ogiltigt val.');
  }
} else {
  console.log('Ogiltigt val.');
}

function run(script, args = []) {
  spawnSync('node', [path.join(scriptsDir, script), ...args], { cwd: root, stdio: 'inherit' });
}

function prompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}
