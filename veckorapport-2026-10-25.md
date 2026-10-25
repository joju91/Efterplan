# Efterplan — 2026-10-25

🔢 Sessions: GA4 SAKNAS — ingen connector ansluten till molnsandlådan. Hoppar DEL 1.

🔧 Uptime: ej mätbar via sandbox-proxy (403) | Sårbarheter: 1 HIGH (body-parser GHSA-27r3-jxmh-p828) i ga4-dashboard
   - `ga4-dashboard/package.json`: body-parser 2.3.0 sårbar för DoS via trailing bytes efter komprimerad request body. Fix: `cd ga4-dashboard && npm audit fix`.
   - `ga4-dashboard/package.json`: googleapis 186.0.0 → 188.0.0 tillgänglig (2 minor versioner sedan T282 ✔).

⚠️ **BRÅDSKANDE — T290:** Anthropic API-nyckel "Efterplan" (`api/categorize-document.js`) löper ut **2026-10-27** (om 2 dagar). AI-kategorisering i Arkiv slutar fungera om ej åtgärdat. Skapa ny nyckel på console.anthropic.com/settings/keys och kör `npm run keys:rotate -- anthropic`.

📊 Roadmap: 227 klara | 15 pågår | 44 ej startade
   Pågående: T294 (Vercel/Supabase-deploy blockad — blockerar T295, T296, T302–T303), T015–T016 (användarintervjuer), T060 (push-notiser ej mergade).

📣 Störst värde just nu: lås upp T294 (logga in på Vercel + Supabase och deploya säkerhetsarbetet från PR #142). Det är blockeraren för fem pågående säkerhets- och produktionstickets. Konkret åtgärd denna vecka: verifiera Vercel-plan (T299) och merge PR #142.

🎫 Nya tickets: T304 – body-parser HIGH DoS (ga4-dashboard) | T305 – googleapis 186→188 (ga4-dashboard)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | `cd ga4-dashboard && npm audit fix` (body-parser HIGH GHSA-27r3-jxmh-p828) | ga4-dashboard/package-lock.json | 🔴 |
| 2 | `cd ga4-dashboard && npm install googleapis@^188` | ga4-dashboard/package.json | 🟡 |
| 3 | Skapa ny Anthropic-nyckel och `npm run keys:rotate -- anthropic` (T290, deadline 2026-10-27) | — | 🔴 |
