# Efterplan — 2026-06-15

🔢 Sessions: N/A (GA4 saknas i sandlåda) | Organisk: N/A | Onboarding: N/A | Plan: N/A

🔧 Uptime: 403 Forbidden (Vercel Bot Protection, T131 öppen) | Sårbarheter: 0 | Brutna länkar: 0
   - T127 öppen: app.js:698 innehåller "den deceased hade" — engelska i annars svensk text
   - T133 ny: app.js:2286 `boppSave()` kallar inte `track()` — bouppteckning-formuläret (T126) saknar GA4-events

📣 Bouppteckning-formuläret är den senaste lanserade funktionen men saknar analytics — prioritera T133 (en-rads-fix i `boppSave()`) så att vi kan mäta faktisk användning innan nästa produktbeslut.

🎫 Nya tickets: T133 – bouppteckning_saved analytics saknas (#41) | T134 – ga4-dashboard meta description (#42)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till `track('bouppteckning_saved', {...})` i `boppSave()` | app.js:2286 | 🟠 |
| 2 | Fix "den deceased hade" → "den avlidne hade" | app.js:698 | 🟠 |
| 3 | Ta bort spökfil | share-modal.html | 🟡 |

---

## DEL 1 — GA4

GA4 SAKNAS — credentials ej tillgängliga i molnsandlådan. Hoppar över.

---

## DEL 2 — Kodaudit

| Check | Resultat |
|-------|---------|
| Missing meta (html) | share-modal.html, auth-modal.html (false positive — T100 x), ga4-dashboard/public/index.html (ny → T134) |
| TODOs/FIXMEs | 0 hittade |
| GA4 events | onboarding_start ✓, plan_generated ✓, task_completed ✓, premium_activated ✓ |
| Sårbarheter (ga4-dashboard) | 0 (info:0 low:0 moderate:0 high:0 critical:0) |
| npm outdated (root) | @supabase/supabase-js MISSING, stripe MISSING — T130 öppen |
| Uptime efterplan.se | HTTP 403 Forbidden — T131 öppen (Vercel Bot Protection) |
| console.log i prod | 0 |
| Bouppteckning analytics | ❌ `boppSave()` saknar track() — ny → T133 |

---

## DEL 3 — Roadmap-status

| Kategori | Antal |
|----------|-------|
| Klara (✔) | 97 |
| Pågår (⧖) | 8 |
| Ej startade (☐) | 15 (inkl. T133–T134) |

**Pågår just nu:**
- T015 — Validate step order with 2–3 real relatives
- T016 — Adjust order and text based on interviews
- T032 — Test full purchase flow
- T034 — Set up Bokio or Fortnox
- T047 — Analyze drop-off
- T079 — Betald byrålisting
- T081 — Analyze drop-off + prioritize top 3 issues
- T123 — De-inlining utility-klasser (återstår: rulla ut på övriga sidor)

**Nästa öppna (top 3):**
- T001 — Read the entire Manifest sheet and confirm scope
- T003 — Register company / sole proprietorship + apply for F-tax
- T004 — Open business bank account

---

## DEL 4 — Auto-tickets

Nya tickets denna körning: **2** (T133, T134)

**T133** — `bouppteckning_saved` analytics saknas
- Fil: `app.js` rad 2286
- `boppSave()` kallar inte `track()` — bouppteckning-formuläret (T126, shipad 2026-05-30) genererar inga GA4-events
- Fix: `track('bouppteckning_saved', { delbagare: boppData.delbagare.length, tillgangar: boppData.tillgangar.length, skulder: boppData.skulder.length })`
- Prioritet: 🟠

**T134** — `ga4-dashboard/public/index.html` saknar meta description
- Fil: `ga4-dashboard/public/index.html`
- Flaggas av `grep -rL 'meta name="description"'`
- Fix: lägg till `<meta name="description" content="Efterplan GA4-dashboard — intern analys">` i `<head>`
- Prioritet: 🟡

---

## DEL 5 — GitHub Issues

| Ticket | Issue | URL |
|--------|-------|-----|
| T133 | #41 | https://github.com/joju91/Efterplan/issues/41 |
| T134 | #42 | https://github.com/joju91/Efterplan/issues/42 |

---

*Rapport genererad automatiskt av Claude Code — 2026-06-15*
