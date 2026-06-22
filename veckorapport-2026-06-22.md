# Efterplan — Veckorapport 2026-06-22

> Genererad automatiskt av Claude Code (måndag-rutin).

---

## 🔢 Nyckeltal (7 dagar — GA4)

**GA4 SAKNAS** — credentials ej tillgängliga i molnsandlådan. Föregående veckas siffror (2026-06-15): 15 sessions, 73% organisk, 1 onboarding_start, 1 plan_generated, 0 task_completed.

---

## 🔧 Teknisk audit

| Kontroll | Resultat |
|----------|----------|
| Uptime (automatiserad) | HTTP 403 — Vercel Bot Protection blockerar sandlådan (se T131) |
| npm audit (ga4-dashboard) | **0** sårbarheter |
| npm root-paket | `@supabase/supabase-js` + `stripe` MISSING — T130 ☐ |
| TODOs/FIXMEs | 0 funna |
| Engelska strängar i innehåll | `app.js:698` — "den deceased hade" kvar → T127 ☐ |
| Missing meta description | `ga4-dashboard/public/index.html` → T134 ☐ |

**Kodfynd (max 2):**
- `app.js:698` — `"den deceased hade ett efterlevandeskydd"` — byt till `"den avlidne hade"` (T127, öppen sedan 2026-06-01)
- `app.js:2286` — `boppSave()` kallar inte `track()` — bouppteckning-aktivitet omätbar i GA4 (T133, öppen sedan 2026-06-15)

---

## 🗺️ Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 97 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 15 |

**Pågår:** T015, T016, T032, T034, T047, T079, T081, T123 (de-inlining — ⧖ sedan 2026-05-29)

**Nästa öppna:** T001 (läs manifest), T003 (registrera bolag), T004 (öppna företagskonto)

**Öppna ☐-tickets (7 st) att prioritera:**

| Ticket | Beskrivning | Prio |
|--------|-------------|------|
| T127 | "deceased" → "den avlidne" i app.js:698 | 🟠 |
| T128 | Sitemap lastmod stale — uppdatera per git log | 🟠 |
| T129 | share-modal.html överblivet spöke — ta bort filen | 🟡 |
| T130 | Kör npm install i root och committa package-lock.json | 🟡 |
| T131 | Verifiera att UptimeRobot når sajten trots Bot Protection | 🟠 |
| T133 | Lägg till track('bouppteckning_saved') i boppSave() | 🟠 |
| T134 | Lägg till meta description i ga4-dashboard/public/index.html | 🟡 |

---

## 📣 Marknadsinsikt

Organisk söktrafik stod för 73% av förra veckans sessions — SEO är den enda kanalen som rör sig. Prioritera **T128** (sitemap lastmod) denna vecka för att ge Googlebot korrekta datum på de sidor som uppdaterats sedan maj.

---

## 🎫 Nya tickets

**Inga nya tickets denna vecka.** Alla fynd från kodauditen täcks av befintliga öppna ärenden (T127–T134). Kodbasen har inte ändrats sedan förra veckans rapport (enda commit: veckorapporten 2026-06-15).

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | Prio |
|---|--------|-----|------|
| 1 | Byt "den deceased hade" → "den avlidne hade" | app.js:698 | 🟠 |
| 2 | Uppdatera sitemap.xml lastmod-datum per git log | sitemap.xml | 🟠 |
| 3 | Ta bort share-modal.html (inga referenser kvar) | share-modal.html | 🟡 |
