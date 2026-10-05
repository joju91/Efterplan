# Efterplan — 2026-10-05

🔢 Sessions: — | Organisk: — | Onboarding: — | Plan: —
*(GA4 SAKNAS — molnsandlådan saknar credentials, hoppar över DEL 1)*

🔧 Uptime: ✅ (weekly-health 2026-09-28 + 2026-10-03: success) | Sårbarheter: 0 (ga4-dashboard)
   - `stripe` major version 23.0.0 tillgänglig — package.json låst på `^22.1.1` (`package.json`, rad ~3)
   - Proxy blockerar direkt HTTP-anrop till efterplan.se från sandboxen (403) — ej en riktig downtime

📣 Google Ads har kört sedan 2026-09-23 (17 klick, 123 kr, 0 riktiga köp per T264) — 2-veckorsgränsen nås 2026-10-07, prioritera att hämta Ads conversion-data och ta beslut om skala/stoppa innan budget byggs ut ytterligare.

🎫 Nya tickets: T275 – stripe 23.0 major version (#136)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Granska stripe 23 changelog + uppgradera `^22.1.1 → ^23.x` | `package.json`, `api/_lib.js` | 🟡 |

---

## Detaljer

### Roadmap-status
- **Klara:** 218 ✔
- **Pågår:** 12 ⧖
- **Ej startade:** 32 ☐

### Pågående (urval)
- T060 — Push notifications (koden finns på ej-mergrad branch `origin/codex/t060-checkpoints`, ej på main)
- T271 — Traffic-sprint (inlägg klara, väntar på Owner för postning)
- T263 — Community-scan blockerad av nätverkspolicy (Owner-beslut krävs)
- T270 — GA4-månadsanalys blockerad (Owner-inloggning krävs)

### Nästa öppna tickets
- T001 — Read the entire Manifest sheet and confirm scope
- T003 — Register company / sole proprietorship + apply for F-tax
- T004 — Open business bank account

### Ny ticket denna vecka
- **T275** — stripe 23.0 major version upgrade ([#136](https://github.com/joju91/Efterplan/issues/136))

### Kodfynd
- Inga TODOs/FIXMEs i JS/HTML
- ga4-dashboard npm audit: 0 sårbarheter
- `auth-modal.html` saknar meta description → T274 (☐) sedan 2026-09-28

### Webbhälsa (GitHub Actions)
- weekly-health run #13 (2026-09-28, scheduled): ✅ success
- weekly-health run #14 (2026-10-03, manuell): ✅ success
- Uptime, broken links, Lighthouse CI: alla gröna vid senaste körning
