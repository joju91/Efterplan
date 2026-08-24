// Efterplan — öppnar en URL i standardwebbläsaren, cross-platform.
//
// rundll32/open/xdg-open är riktiga binärer (till skillnad från vercel/gh/npx
// som är npm-globala .cmd-shims) — de behöver inte gå via exec.mjs
// shell-hantering. rundll32 url.dll,FileProtocolHandler är den klassiska
// lätta Windows-vägen att öppna en URL; PowerShell Start-Process funkar men
// tar 3+ sekunder att starta bara för det, rundll32 tar under en sekund.
import { spawnSync } from 'node:child_process';

export function openUrl(url) {
  try {
    const platform = process.platform;
    const res = platform === 'win32'
      ? spawnSync('rundll32', ['url.dll,FileProtocolHandler', url])
      : platform === 'darwin'
        ? spawnSync('open', [url])
        : spawnSync('xdg-open', [url]);
    return res.status === 0;
  } catch {
    return false;
  }
}
