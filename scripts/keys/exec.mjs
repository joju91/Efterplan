// Efterplan — delad hjälpfunktion för att köra externa CLI:er (vercel/gh/npx)
// från scripts/keys/*. Finns på ett ställe istället för kopierad i varje fil.
//
// Windows behöver shell:true för att hitta npm-globala .cmd-shims, men att
// skicka en args-array rakt in med shell:true gör att Node varnar (DEP0190)
// och konkatenerar argumenten utan citering — potentiellt farligt om ett
// argument innehåller specialtecken. Vi bygger därför själva ihop en enda,
// korrekt citerad kommandosträng och skickar den utan separat args-array.
import { spawnSync } from 'node:child_process';

function quote(arg) {
  return `"${String(arg).replace(/"/g, '\\"')}"`;
}

export function run(cmd, args = [], { input, cwd } = {}) {
  const isWin = process.platform === 'win32';
  const command = isWin ? `${cmd} ${args.map(quote).join(' ')}` : cmd;
  return spawnSync(command, isWin ? [] : args, {
    cwd,
    input,
    stdio: [input !== undefined ? 'pipe' : 'ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    shell: isWin,
  });
}
