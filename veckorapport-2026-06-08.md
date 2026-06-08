# Efterplan — 2026-06-08

🔢 Sessions: GA4 SAKNAS | Organisk: — | Onboarding: — | Plan: —

🔧 Uptime: HTTP 403 (Vercel Bot Protection?) | Sårbarheter: 0 (ga4-dashboard) | TODOs: 0
   - `app.js:698` — synlig engelska kvarstår: "den deceased hade ett efterlevandeskydd" (T127 öppen)
   - `package-lock.json` saknas i repo-root; @supabase/supabase-js + stripe visas som MISSING (T130)

📣 Bouppteckning-formuläret (T126) är live och SEO-grunden är stark (97 klara tickets) — högst värde denna vecka: åtgärda T127 (engelska i synlig task-text, en rads fix i app.js:698) och T128 (sitemap lastmod) för att maximera GSC-crawlfrekvens.

🎫 Nya tickets: T130 – package-lock.json saknas (#37) | T131 – HTTP 403 live-check (#38) | T132 – weekly-report.yml committar ej roadmap.md (#39)

## Roadmap-status

| | Antal |
|---|---|
| ✔ Klara | 97 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 10 (+3 nya) |

**Pågående (⧖):**
- T015 Validate step order with 2–3 real relatives
- T016 Adjust order and text based on interviews
- T032 Test full purchase flow
- T034 Set up Bokio or Fortnox
- T047 Analyze drop-off
- T079 Betald byrålisting
- T081 Analyze drop-off + prioritize top 3 issues
- T123 De-inlining utility-klasser (återstår: övriga sidor)

**Nästa öppna (prioritet):**
- T127 Engelska "deceased" i barnpension_ansokan — app.js:698 (en rads fix)
- T128 Sitemap lastmod stale (bouppteckning-guide, vad-gora-nar-nagon-dor, arvskifte-guide m.fl.)
- T129 share-modal.html överblivet spöke — ta bort filen

## DEL 1 — GA4

GA4 SAKNAS — hoppades över. (Konfigurera GA4-credentials: T113)

## DEL 2 — Kodaudit

| Check | Resultat |
|---|---|
| Missing meta (HTML) | 3 filer (share-modal.html, auth-modal.html — partials, ej standalone; ga4-dashboard/public/index.html) |
| TODOs/FIXMEs | 0 |
| GA4 events | Korrekt — onboarding_start, plan_generated, checkbox_toggle m.fl. i app.js |
| Sårbarheter (ga4-dashboard) | 0 |
| npm outdated (root) | @supabase/supabase-js MISSING, stripe MISSING (package-lock.json saknas) |
| Live-check | 403 Forbidden (Vercel Bot Protection?) |

**Öppna tickets sedan förra rapporten (fortfarande ej åtgärdade):**
- T127 ☐ — "den deceased" i app.js:698
- T128 ☐ — sitemap.xml lastmod stale (bouppteckning-guide.html, vad-gora-nar-nagon-dor.html, arvskifte-guide.html — git-lastmod 2026-05-29, sitemap visar 2026-05-04)
- T129 ☐ — share-modal.html (183 rader) finns kvar trots T124 (inga referenser i index.html/app.js)

## DEL 3 — Marknadsinsikt

Sajten har nu en komplett bouppteckning-guide + interaktivt formulär, vilket är ett starkt SEO-ankare för en av de mest sökta dödsbo-frågorna. Konkret åtgärd denna vecka: åtgärda T127 (1 rads fix) + T128 (sitemap lastmod) — båda är snabba wins som direkt påverkar GSC-indexering och användarupplevelse.

## DEL 4 — Nya auto-tickets

| ID | Titel | Issue | Prioritet |
|----|-------|-------|-----------|
| T130 | package-lock.json saknas i repo-root | #37 | 🟡 |
| T131 | HTTP 403 vid automatisk live-check | #38 | 🟠 |
| T132 | weekly-report.yml committar inte roadmap.md | #39 | 🟡 |

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Fixa T127: byt "the deceased" → "den avlidne" | app.js:698 | 🟠 |
| 2 | Uppdatera sitemap lastmod (T128) | sitemap.xml | 🟠 |
| 3 | Ta bort share-modal.html (T129) | share-modal.html | 🟡 |
| 4 | Kör npm install + committa package-lock.json (T130) | package.json | 🟡 |
| 5 | Verifiera Vercel Bot Protection-nivå (T131) | Vercel Dashboard | 🟠 |
