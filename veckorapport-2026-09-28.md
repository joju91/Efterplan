# Efterplan — 2026-09-28

🔢 Sessions: GA4 SAKNAS — connector ej ansluten | Organisk: — | Onboarding: — | Plan: —

🔧 Uptime: Ej mätbar (agent-proxy 403, nätverkspolicyn blockerar utgående HTTPS — ej site-fel) | Sårbarheter: 0 | Paket saknar lock-fix: @supabase/supabase-js + stripe (T262 öppen)
   - `auth-modal.html` saknar `<meta name="description">` — SEO-lucka på auth-sidan (T274)
   - `@supabase/supabase-js` + `stripe` saknas i node_modules — `npm install` behövs; T262 täcker lock-fil

📣 T264 Google Ads dag 5-utvärdering är schemalagd till idag (2026-09-28) — kör den nu för att avgöra om kampanjen skalas upp, pajas eller stoppas; det är den enskilt viktigaste åtgärden denna vecka.

🎫 Nya tickets: T274 – auth-modal.html saknar meta description (#115 https://github.com/joju91/Efterplan/issues/115)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till `<meta name="description">` i auth-modal.html | auth-modal.html | 🟡 |

---

## DEL 1 — GA4

GA4 SAKNAS — ingen connector ansluten i molnsandlådan. Hoppar över.

---

## DEL 2 — Kodaudit

| Kontroll | Resultat |
|----------|----------|
| HTML utan meta description | `auth-modal.html` |
| TODOs / FIXMEs | 0 |
| GA4-events i app.js | ✅ `onboarding_start`, `plan_generated`, `checkbox_toggle`, `reminder_optin`, `deadline_dates_computed`, `note_saved`, `preview_cta_clicked` m.fl. |
| Sårbarheter (npm audit) | 0 (info 0, low 0, moderate 0, high 0, critical 0) |
| Outdated packages | `@supabase/supabase-js` MISSING → 2.117.2, `stripe` MISSING → 22.6.2 (T262 öppen) |
| Uptime efterplan.se | Ej mätbar — agent-proxyn 403 Forbidden på HTTPS CONNECT (nätverkspolicy, inte site-fel) |

---

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 192 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 52 |

**Pågår (urval):**
- T015 Validera stegordning med 2–3 riktiga anhöriga
- T016 Justera ordning och text utifrån intervjuer
- T032 Testa hela köpflödet
- T034 Sätt upp Bokio eller Fortnox
- T047 Analysera drop-off
- T060 Push-notiser (7/30/90 dagar) — branch `origin/codex/t060-checkpoints` ej mergad till main
- T079 Betald byrålisting — affärsmodell ej beslutad
- T081 Analysera drop-off + prioritera top 3

**Nästa öppna:**
- T001 Läs hela Manifest-bladet och bekräfta scope
- T003 Registrera bolag / enskild firma + F-skatt
- T004 Öppna företagskonto

**Marknadsinsikt:** T264 Google Ads dag 5-utvärdering är schemalagd till idag — kör utvärderingen nu för att avgöra om kampanjen (live sedan 2026-09-23) ska skalas upp (kostnad/köp < 50 kr), landningssidan justeras (klick men inga brev) eller stoppas (> 50 kr/köp) och pengarna läggs på SEO.

---

## DEL 4 — Auto-tickets

1 ny ticket identifierad (ny finding, saknar befintlig ☐/⧖-ticket):

| ID | Beskrivning | Fil | Prio | Typ |
|----|-------------|-----|------|-----|
| T274 | `auth-modal.html` saknar `<meta name="description">` — auth-modalen är en indexerbar HTML-sida men saknar meta-description, vilket ger tomt snippettext i SERP och kan sänka CTR för inloggningssidan | auth-modal.html | 🟡 | SEO |

---

*Rapport genererad automatiskt 2026-09-28 av veckorutin monday-efterplan-weekly-update.*
