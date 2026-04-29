# Efterplan Veckorapport — 2026-04-29

## 🔢 Nyckeltal (7 dagar)
- Sessions: **ej tillgängligt** — GA4-credentials saknas i sandboxmiljön
- Organisk andel: —
- onboarding_start rate: —
- plan_generated rate: —

> **Obs:** GA4 API kräver `~/.config/efterplan/ga4-service-account.json` på den maskin som kör rapporten. Filen hittades inte i sandboxen. Lägg till den för att aktivera GA4-delen av rapporten.

---

## 📊 GA4-fynd

- GA4 är installerat i `index.html` (property `G-T1T40TYPQB`) och laddas lazy.
- Events **finns** i koden men med annan namnkonvention än vad rapporten söker efter: koden skickar `'Onboarding Start'`, `'Plan Generated'`, `'Task Complete'` — inte snake_case. Det kan göra GA4-filtrering opålitlig om dashboardar eller mål är satta på snake_case-namn.
- Funnel-events täcker: Onboarding Start → Onboarding Step → Plan Generated → Task Complete → Plan Completed → Paywall CTA Clicked. Kedjan ser komplett ut i koden.
- Drop-off analytics (T047, T081) väntar fortfarande på ~100 organiska sessioner innan meningsfull analys är möjlig.

---

## 🔧 Teknisk audit

- **Uptime:** Kunde inte nås från sandboxmiljön (egress blockerad för efterplan.se). Kontrollera manuellt eller lägg till domänen i Capabilities → Network.
- **Performance / A11y / SEO:** Lighthouse ej tillgängligt i sandboxen. Kör `npx lighthouse https://efterplan.se` lokalt för senaste tal.
- **Säkerhet:** 4 moderate sårbarheter i `ga4-dashboard/` (npm audit). Inga critical/high. Låg risk eftersom ga4-dashboard är ett internt verktyg.
- **Brutna länkar:** Ej kontrollerat (egress blockerad).
- **Saknade meta descriptions:**
  - `ga4-dashboard/public/index.html`
  - `share-modal.html`
  - `auth-modal.html`
- **Föråldrade paket (ga4-dashboard):**
  - `express` 4.22 → 5.2 (major)
  - `googleapis` 144 → 171
  - `dotenv` 16 → 17
- **Console-varningar i produktion:** `supabase-client.js` har tre `console.warn`-anrop som kan läcka felinfo till användare (rad 145, 193, 256).
- **Event-namnkonvention:** Koden använder title case med mellanslag (`'Onboarding Start'`) men rapporten och GA4-dashboards söker på snake_case (`onboarding_start`). Inkonsekvens att rätta till.

---

## 📣 Marknadsföring

- **Veckoinsikt:** Repot är aktivt (senaste commits: sharing-feature, Supabase, ny ikon). Produkten är tekniskt klar för organisk tillväxt. Den kritiska blockeringen är nu inte kod utan **ägaråtgärder**: Supabase-konfiguration och Stripe.
- **SEO-möjlighet:** `share-modal.html` och `auth-modal.html` saknar meta description — dessa sidor indexeras potentiellt av Google men skickar inga SEO-signaler. Snabb vinst att fixa.
- **Rekommendation denna vecka:** Prioritera de två Owner-åtgärderna (Supabase live-setup + Stripe-konto) som håller tillbaka T032, T051–T053. Utan dem kan varken delningsfunktionen eller betalning verifieras live.

---

## Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 75 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 6 |

**Pågående blockeringar (Owner-åtgärder):**
- **Supabase** (T051–T053): Kod klar. Kräver: skapa projekt, kör `supabase/schema.sql`, stäng av lösenords-auth, fyll i URL + anon key i `supabase-client.js`.
- **Stripe** (T032): Parkerad. Kräver: skapa Stripe-konto, integrera checkout. Pris: 49 kr.

---

## ✅ Föreslagna åtgärder (godkänn innan körning)

| # | Åtgärd | Fil/URL | Prioritet |
|---|--------|---------|-----------|
| 1 | Lägg till `meta name="description"` i share-modal.html och auth-modal.html | `share-modal.html`, `auth-modal.html` | P1 |
| 2 | Standardisera event-namn till snake_case i app.js (`'Onboarding Start'` → `'onboarding_start'` etc.) | `app.js` rad 73, 170, 285, 1267 | P1 |
| 3 | Konfigurera Supabase live-projekt (Owner-åtgärd, ej kodändring) | `supabase-client.js` | P0 |
| 4 | Uppgradera `express` 4→5 i ga4-dashboard | `ga4-dashboard/package.json` | P2 |
| 5 | Lägg till `~/.config/efterplan/ga4-service-account.json` på rapport-maskinen | Lokal fil | P1 |

- [ ] Godkänn åtgärd 1 (meta descriptions)
- [ ] Godkänn åtgärd 2 (event-namnkonvention)
- [ ] Godkänn åtgärd 3 (Supabase live-setup — Owner-åtgärd)
- [ ] Godkänn åtgärd 4 (express upgrade)
- [ ] Godkänn åtgärd 5 (GA4 credentials)

---

*Rapport genererad automatiskt 2026-04-29. Live-sajt och GA4 kräver utökad nätverksåtkomst för fullständiga data nästa körning.*
