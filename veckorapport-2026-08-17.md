# Efterplan — 2026-08-17

> Genererad automatiskt av Claude Code (schemalagd veckojournalsrapport, måndag).

---

## 🔢 Nyckeltal (GA4)

GA4 SAKNAS — ingen credentials-fil i molnsandlådan. Se senaste kända siffror (2026-08-03): 12 sessioner, 75% organisk, 1 onboarding\_start, 1 plan\_generated.

---

## 🔧 Teknisk audit

**Uptime:** Ej verifierbar från molnsandlåda (proxy blockerar utgående HTTPS till efterplan.se). Senast känd: 200 OK.

**Lighthouse CI (weekly-health.yml — senaste körning 2026-08-16):** ✅ grön (warns ej fel)
- Perf: **0.76** (budget ≥0.80 — warn) ⚠️
- LCP: **3565ms** (budget ≤2500ms — warn) ⚠️
- TBT: **305ms** (budget ≤300ms — warn) ⚠️
- A11y & SEO: inom budget (≥0.90)

**npm audit (ga4-dashboard):** ✅ 0 sårbarheter (T242 fixad förra veckan)
**npm audit (root):** ej tillämpbar (MISSING-paket beror på att node_modules ej installerade i sandbox — normalt)

**TODOs/FIXMEs:** 0 hittade

**GA4-events:** ✅ `onboarding_start` (rad 149), `plan_generated` (rad 313), `task_completed` (rad 2052) — alla spåras korrekt

**Kodfynd:**
- `vercel.json`: security headers saknas globalt (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) — **T244**
- `app.js` / `style.css`: Lighthouse perf 0.76 + LCP 3565ms tyder på render-blockerande resurser — **T243**

---

## 🗺️ Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 184 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 38 |
| x Avskrivna | 11 |

**Pågår (urval):**
- T060 🟠 Push notifications (branch `origin/codex/t060-checkpoints` ej mergad till main — blockar T136)
- T145 🟠 AI-kategorisering (kräver `ANTHROPIC_API_KEY` i Vercel — Owner-åtgärd)
- T178 🟡 Deadline-mejl: insamling klar, utskick kvarstår (T136)
- T032 🔴 Testa hela köpflödet (pausad — T164 pausad av Owner)

**Denna vecka klart (sedan 2026-08-10):**
- ✔ T225 — `weekly-health.yml` skapad och testad (Lighthouse CI + broken-link-check)
- ✔ T195 — Telefonmanus i dokumentgeneratorn (byggd på riktigt, inte bara metadata)
- ✔ T242 — body-parser DoS-fix i ga4-dashboard

**Nästa högt värderade öppna tickets:**
- T135 🔴 Deadline-motor — räkna ut lagstadgade frister automatiskt
- T136 🟡 Påminnelsemejl om deadlines (blockas av T060)
- T237 🟠 Prisrad på startsidan stämmer inte med koden — Owner-beslut krävs

---

## 📣 Marknadsinsikt

**Fas 28: trafik är allt.** Sitemap-automation + GSC-submission fungerar nu end-to-end (T239–T241 ✔) och tre nya SEO-sidor är indexerade sedan 2026-08-14. **Konkret åtgärd denna vecka:** merga `origin/codex/t060-checkpoints` (T060) till main — det är det enda steget som frigör T136 (påminnelsemejl), och T136 är det näst viktigaste retention-verktyget efter att trafiken börjat komma in.

---

## 🎫 Nya tickets

| ID | Titel | Issue | Prioritet |
|----|-------|-------|-----------|
| T243 | Performance: Lighthouse perf 0.76, LCP 3565ms, TBT 305ms (warn) | [#69](https://github.com/joju91/Efterplan/issues/69) | 🟠 |
| T244 | Security headers saknas i vercel.json (X-Frame-Options m.fl.) | [#70](https://github.com/joju91/Efterplan/issues/70) | 🟡 |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Merga `origin/codex/t060-checkpoints` till main (frigör T136) | — | 🟠 |
| 2 | Sätt `ANTHROPIC_API_KEY` i Vercel env (frigör T145 AI-kategorisering) | Vercel dashboard | 🟠 |
| 3 | Lägg till security headers i vercel.json (T244) | vercel.json | 🟡 |
| 4 | Perf-session: optimera LCP/TBT via Lighthouse-artefakt i Actions (T243) | app.js, style.css | 🟠 |
