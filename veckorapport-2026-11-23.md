# Efterplan — 2026-11-23

> Genererad automatiskt av Claude Code (molnroutine, måndag 2026-11-23).

---

## 🔢 Nyckeltal (7 dagar — GA4)

**GA4 SAKNAS** — inga credentials i molnsandlådan. Koppla GA4-connector (T113 ☐) för att aktivera statistik i veckorapporten.

*Referens förra veckan (2026-11-16): 79 sessions, 57% organisk, onboarding_start 2.5%, plan_generated 0.*

---

## 🔧 Teknisk status

| Kontroll | Resultat |
|----------|----------|
| Uptime | Ej verifierbar från molnet (Vercel Bot Protection, T131 ☐) |
| Sårbarheter (ga4-dashboard) | **0** |
| TODOs / FIXMEs | 0 |
| Saknar meta description | `auth-modal.html` (fragment, ej egen sida — T100, ej åtgärdas) |
| stripe | Locked 22.6.2, Latest 23.2.0 — T275 ☐ (öppen sedan 2026-10-05) |
| @supabase/supabase-js | Locked 2.119.0, Latest **2.119.2** — ny ticket T316 |

**Kodfynd:**
- `package-lock.json` låser `@supabase/supabase-js` 2.119.0, senaste patch är 2.119.2 — kör `npm update @supabase/supabase-js` och committa. Fil: `package-lock.json`.

---

## 📊 Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 242 |
| ⧖ Pågår | 13 |
| ☐ Ej startade | 38 |

**Pågår just nu (urval):**
- T060 — Push notifications (branch orsamlad, ej på main — kräver åtgärd)
- T079 — Betald byrålisting
- T081 — Analysera drop-off + prioritera top 3
- T123 — De-inlining utility-klasser (pågående)

**Nästa öppna:**
- T113 — Konfigurera GA4-credentials i sandlådan
- T122 — Tokenisera 135 hårdkodade hex-färger
- T131 — HTTP 403 vid live-check (Bot Protection)

---

## 📣 Marknadsinsikt

Förra veckans data visade 79 sessions med god engagement (53%) men extremt låg onboarding-konversion (2.5%) — prioritet denna vecka är att undersöka varför besökare inte startar onboarding, t.ex. testa CTA-texten på startsidan (T048 ☐ eller ny A/B-test).

---

## 🎫 Nya tickets

**T316** – `@supabase/supabase-js` patch 2.119.0 → 2.119.2

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | `npm update @supabase/supabase-js` + commit package-lock.json | `package-lock.json` | 🟡 |
