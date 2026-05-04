# Efterplan — 2026-05-04

🔢 Sessions: N/A (GA4 SAKNAS) | Organisk: N/A | Onboarding: N/A | Plan: N/A

🔧 Uptime: 403 Cloudflare-blockad (extern monitor saknas — T106) | Perf/A11y/SEO: ej mätt | Sårbarheter: 4 moderate i ga4-dashboard (T104 ☐) | Brutna länkar: ej mätt
   - `ga4-dashboard/public/index.html` rad 8: saknar `<meta name="robots" content="noindex">` — dashboard exponerad för crawlers (T105)
   - `sitemap.xml`: 32 URLs med `lastmod=2026-04-15`, inaktuellt efter nyare SEO-sidor (T107)

📣 Med 8 pågående tickets och T081 (drop-off-analys) redo att stängas är konverteringsoptimering snabbaste tillväxtvägen — prioritera T081 + stäng T104 (npm-sårbarheter) denna vecka.

🎫 Nya tickets: T105 – noindex ga4-dashboard (#13) | T106 – UptimeRobot (#14) | T107 – sitemap lastmod (#15)

---

## Roadmap-status

| Klara ✔ | Pågår ⧖ | Ej startade ☐ |
|---------|---------|---------------|
| 77      | 8       | 11 (inkl. T105–T107) |

### Pågår just nu
- T015 Validate step order with 2–3 real relatives
- T016 Adjust order and text based on interviews
- T026 Share with 5 target users, collect feedback
- T032 Test full purchase flow
- T034 Set up Bokio or Fortnox
- T047 Analyze drop‑off
- T079 Betald byrålisting
- T081 Analyze drop‑off + prioritize top 3 issues ← prioritera stänga

### Nästa öppna (gamla)
- T001 Read the entire Manifest sheet and confirm scope
- T002 Buy domain: kaascha.se
- T003 Register company / sole proprietorship + apply for F‑tax

---

## DEL 1 — GA4

GA4 SAKNAS — inga credentials i molnsandlådan. Hoppar över DEL 1.

---

## DEL 2 — Kodaudit

### Missing meta description
- `share-modal.html` — false positive (body-fragment, T100 stängd som `x`)
- `auth-modal.html` — false positive (body-fragment, T100 stängd som `x`)
- `ga4-dashboard/public/index.html` — intern dashboard, bör ha `noindex` istället → T105 ☐

### TODOs/FIXMEs
Inga hittade i `.js`/`.html` (grep mot node_modules exkluderad).

### GA4-events i app.js
```
rad 57:  function track(event, props)
rad 73:  track('onboarding_start')
rad 170: track('onboarding_step', { step })
rad 285: track('plan_generated', { relation, ansvar })
rad 1413: track('task_completed', { task, urgency })
```
Alla nyckel-events (onboarding_start, plan_generated, task_completed) är snake_case och implementerade ✔

### Sårbarheter (ga4-dashboard)
```
moderate: 4, high: 0, critical: 0
```
T103 (googleapis upgrade) ☐ och T104 (npm audit fix) ☐ kvarstår sedan förra veckan.

### Uptime
HTTP 403 från molnsandlådan — Cloudflare blockerar bot-requests. Sidan är troligen uppe men extern monitor saknas → T106 ☐.

---

## DEL 4 — Nya auto-tickets

| ID | Titel | Issue | Prio | Typ |
|----|-------|-------|------|-----|
| T105 | ga4-dashboard/public/index.html saknar noindex | [#13](https://github.com/joju91/Efterplan/issues/13) | 🟠 | SEO |
| T106 | Sätt upp extern uptime-monitor (UptimeRobot) | [#14](https://github.com/joju91/Efterplan/issues/14) | 🟠 | Dev |
| T107 | sitemap.xml: uppdatera lastmod-datum | [#15](https://github.com/joju91/Efterplan/issues/15) | 🟡 | SEO |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till `<meta name="robots" content="noindex, nofollow">` i `<head>` | ga4-dashboard/public/index.html rad 8 | 🟠 |
| 2 | Skapa UptimeRobot-monitor för https://efterplan.se (5 min intervall, e-post) | — | 🟠 |
| 3 | Uppdatera `<lastmod>` i sitemap.xml för sidor ändrade efter 2026-04-15 | sitemap.xml | 🟡 |
| 4 | Stäng T103: `npm install googleapis@latest` i ga4-dashboard | ga4-dashboard/package.json | 🟡 |
| 5 | Stäng T104: `npm audit fix` i ga4-dashboard (4 moderate vulns) | ga4-dashboard/ | 🟡 |
