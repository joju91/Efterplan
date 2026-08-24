# Efterplan — 2026-08-24

🔢 Sessions: GA4 SAKNAS | Organisk: — | Onboarding: — | Plan: —

---

## DEL 1 — GA4

GA4 SAKNAS — `$GOOGLE_APPLICATION_CREDENTIALS` ej satt i molnsandlådan. Hoppar över trafik-/konverteringsdata.

---

## DEL 2 — Kodaudit

🔧 Uptime: Ej nåbar från molnsandlådan (egress blockerad) | Sårbarheter: 0 | TODOs/FIXMEs: 0

**Fynd:**
- `auth-modal.html`: saknar `<meta name="description">` — känt false positive (T100, T212), filen är ett body-fragment som inlines i `index.html`, ingen egen sida.
- `npm outdated` visar `@supabase/supabase-js` + `stripe` som MISSING — förväntat i cloud-sandbox (node_modules ej installerade). `package-lock.json` EXISTS och T130 bekräftar att problemet lösts 2026-06-08.
- GA4-events: `onboarding_start` (rad 149), `plan_generated` (rad 313), `task_completed` (rad 2052) — alla korrekt spårade och kopplade till respektive funktion. ✅
- ga4-dashboard: 0 sårbarheter (`npm audit --json`: `total: 0`). ✅
- `vercel.json`: `X-Frame-Options`, `X-Content-Type-Options` och `Referrer-Policy` **saknas fortfarande** (T244 ☐ sedan 2026-08-17).
- `.github/workflows/gsc-positions.yml`: **enbart manuell trigger** (`workflow_dispatch`) — ingen schemalagd insamling av GSC-positionsdata. **Ny ticket: T245.**

---

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 184 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 40 |

**Pågående (urval):**
- T015 Validera stegordning med verkliga anhöriga
- T016 Justera ordning och text baserat på intervjuer
- T060 Push-notifications — ⚠️ koden finns bara på osammanlagd branch `origin/codex/t060-checkpoints`, inte på `main`
- T079 Betald byrålisting
- T081 Analysera drop-off + prioritera topp-3 frågor

**Nästa ☐ (öppna):**
- T001 Läs igenom hela Manifest-bladet
- T003 Registrera företag / enskild firma
- T004 Öppna företagsbankonto

**Öppna från förra veckan:**
- T243 ☐ Lighthouse-perf: LCP 3565ms (budget 2500ms), TBT 305ms (budget 300ms)
- T244 ☐ Security headers saknas i `vercel.json`

📣 **Insikt + åtgärd:** Fas 28 är "trafik före allt" — SEO-innehållet (arvskifte-mall.html, guidesidor) ger störst värde just nu. Konkret åtgärd denna vecka: implementera T244 (security headers i `vercel.json` — 10 minuter, tre rader, direkt SEO/säkerhetsnytta).

---

## DEL 4 — Auto-tickets

Sista befintlig ticket: T244. Ny ticket: T245.

| # | Ticket | Beskrivning |
|---|--------|-------------|
| 1 | T245 | `gsc-positions.yml` saknar schema — inget automatiskt GSC-positionsuttag varje vecka |

---

## DEL 5 — GitHub Issues

T245: https://github.com/joju91/Efterplan/issues/73

---

🎫 **Nya tickets:** T245 – gsc-positions.yml saknar schema (#73)

✅ **Åtgärder att godkänna:**

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till `schedule: cron '0 6 * * 1'` | `.github/workflows/gsc-positions.yml` | 🟡 |
| 2 | Implementera T244: X-Frame-Options + X-Content-Type-Options + Referrer-Policy | `vercel.json` | 🟡 |
| 3 | Besluta T060: merga `origin/codex/t060-checkpoints` eller stäng branchen | `app.js`, `origin/codex/t060-checkpoints` | 🟠 |
