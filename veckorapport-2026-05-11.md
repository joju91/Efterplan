# Efterplan — 2026-05-11

> Genererad automatiskt av Claude Code (veckovis måndag-rapport).

---

## 🔢 Nyckeltal (7 dagar — GA4)

GA4 SAKNAS — credentials inte tillgängliga i sandlådan. Hämta från GA4-connector eller kör manuellt via `ga4-dashboard/`.

| Mått | Värde |
|------|-------|
| Sessions | — |
| Organisk andel | — |
| onboarding_start | ✅ trackas (app.js:156) |
| plan_generated | ✅ trackas (app.js:368) |
| task_completed | ✅ trackas (app.js:1496) |

---

## 🟡 Uptime

| Path | Status | Tid |
|------|--------|-----|
| `/` | 403 (Cloudflare blockerar sandbox-IP) | — |

> **OBS:** 403 är känd Cloudflare-blockering från molnsandlådan — inte ett riktigt driftstopp. T106 (UptimeRobot) är öppen för att övervaka detta korrekt.

---

## 🔧 Teknisk audit

- **npm audit (ga4-dashboard):** 0 critical · 0 high · 0 moderate · 0 low ✅
- **TODOs/FIXMEs i kod:** 0 ✅
- **check-premium.js:** ren kod — debug-diagnostik korrekt revertad ✅
- **GA4 noindex (T105):** implementerad i `ga4-dashboard/public/index.html:5` men markeras ☐ i roadmap → nytt ticket T110

**Beroenden med åtgärdsbehov:**

| Paket | I package.json | Senaste | Gap |
|-------|---------------|---------|-----|
| stripe | ^17.5.0 | 22.1.1 | 5 major versioner |
| @supabase/supabase-js | ^2.45.4 | 2.105.4 | 60 minor versioner |

---

## 🗺️ Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 77 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 11 |

**Pågår (⧖):**
- T015 Validate step order with 2–3 real relatives
- T016 Adjust order and text based on interviews
- T026 Share with 5 target users, collect feedback
- T032 Test full purchase flow
- T034 Set up Bokio or Fortnox
- T047 Analyze drop-off
- T079 Betald byrålisting
- T081 Analyze drop-off + prioritize top 3 issues

**Nästa öppna (☐):**
- T001 Read the entire Manifest sheet and confirm scope
- T002 Buy domain: kaascha.se
- T003 Register company / sole proprietorship

---

## 📣 Marknadsinsikt

Organisk trafik är projektets mest kostnadseffektiva kanal men fortfarande svag — stäng T107 (sitemap lastmod-uppdatering, ~10 min) denna vecka för direkt GSC-effekt och prioritera sedan T108 (Stripe-uppgradering) inför nästa betaltest.

---

## 🎫 Nya tickets

| ID | Titel | Prioritet | Fil | Issue |
|----|-------|-----------|-----|-------|
| T108 | Stripe npm 5 major versioner föråldrat (^17.5.0 → 22.1.1) | 🟠 | package.json, api/_lib.js | [#17](https://github.com/joju91/Efterplan/issues/17) |
| T109 | @supabase/supabase-js 60 minor versioner bakom (^2.45.4 → 2.105.4) | 🟡 | package.json | [#18](https://github.com/joju91/Efterplan/issues/18) |
| T110 | Roadmap-status inkonsekvent — T105 implementerad men ☐ | 🟡 | roadmap.md | [#19](https://github.com/joju91/Efterplan/issues/19) |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Uppdatera `"stripe"` till `^22.1.1` + verifiera `apiVersion` i `_lib.js` | package.json, api/_lib.js | 🟠 |
| 2 | Uppdatera `"@supabase/supabase-js"` till `^2.105.4` | package.json | 🟡 |
| 3 | Stäng T107: uppdatera sitemap.xml lastmod-datum (10 min) | sitemap.xml | 🟡 |
| 4 | Granska T104/T105/T107 — sätt ✔ för implementerade | roadmap.md | 🟡 |
