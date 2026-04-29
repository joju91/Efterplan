# Efterplan Veckorapport — 2026-04-29

## 🔢 Nyckeltal (7 dagar)
- Sessions: **ej tillgängligt** — GA4-credentials saknas i körmiljön (`~/.config/efterplan/ga4-service-account.json`)
- Organisk andel: —
- onboarding_start rate: —
- plan_generated rate: —

> Lägg till GA4 service-account-nyckeln på rapport-maskinen för att aktivera DEL 1 nästa körning.

---

## 📊 GA4 — kodverifiering

- GA4-script (`G-T1T40TYPQB`) lazy-loadas i `index.html`. ✔
- Funnel-events i `app.js`: `onboarding_start` (rad 73) → `onboarding_step` (170) → `plan_generated` (285) → `task_completed` (1267) → `Plan Completed` → `Preview CTA Clicked` (916). Kedjan komplett.
- T101 (snake_case-standardisering) markerad ✔ i roadmap — events använder nu konsekvent snake_case.

---

## 🔧 Teknisk audit

| Kontroll | Resultat |
|---|---|
| Live-sajt | **200 OK · 1.1s** (efterplan.se) ✔ |
| TODO/FIXME i koden | **0** ✔ |
| npm audit (ga4-dashboard) | 4 moderate · 0 high · 0 critical |
| Föråldrade paket | `dotenv` 16→17 · `googleapis` 144→171 (express 4→5 åtgärdat via T102) |
| Saknade meta description | `share-modal.html`, `auth-modal.html`, `ga4-dashboard/public/index.html` — modaler/intern dashboard, ej SEO-relevant (T100 stängd som false positive) |

**Kodfynd att åtgärda:**
- `ga4-dashboard/package.json` — googleapis 27 versioner efter senaste, bör uppgraderas (T103).
- `ga4-dashboard` — verifiera om de 4 moderate sårbarheterna kvarstår efter express 5-upgraden (T104).

---

## 🗺️ Roadmap-status

| Status | Antal | Δ vs föregående körning |
|--------|-------|---|
| ✔ Klara | 77 | +2 (T101, T102) |
| ⧖ Pågår | 8 | 0 |
| ☐ Ej startade | 6 | 0 |

**Pågående blockeringar (Owner-åtgärder):**
- **Supabase live-setup** (T051–T053): kod klar, kräver projektskapande + schema-deploy + URL/anon key i `supabase-client.js`.
- **Stripe** (T032): parkerad, kräver Stripe-konto + checkout-integration. Pris: 49 kr.
- **Användarvalidering** (T015–T016, T026): kräver 5 testanvändare för flödesvalidering och feedback.

---

## 📣 Marknadsföring — veckans insikt

Tekniska blockeringar är minimala (live-sajten svarar, koden trackar funneln, build är ren). Det som driver mest värde just nu är **användarvalidering på riktiga anhöriga (T015, T016, T026)**. Utan det stannar drop-off-analysen (T047, T081) på vänteläge och produktiterationer blir gissningar. **Konkret åtgärd denna vecka:** boka 3 användarintervjuer via redan etablerade kanaler (Flashback-trådar i 2026-listan, sorgforum). 30 min/intervju räcker för att hitta de första topp-3-friktionspunkterna.

---

## 🎫 Nya tickets denna körning

| ID | Titel | Prioritet |
|---|---|---|
| T103 | Uppgradera googleapis 144→171 i ga4-dashboard | 🟡 |
| T104 | Verifiera 4 moderate npm audit-sårbarheter efter T102 | 🟡 |

(T100–T102 skapades i morgonkörningen samma datum; T101 + T102 redan slutförda.)

---

## ✅ Föreslagna åtgärder (godkänn innan körning)

| # | Åtgärd | Fil/URL | Prioritet |
|---|--------|---------|-----------|
| 1 | Boka 3 användarintervjuer för T015/T016/T026 | Flashback-listan + sorgforum | P0 |
| 2 | Konfigurera Supabase live-projekt (Owner) | `supabase-client.js` | P0 |
| 3 | Uppgradera googleapis i ga4-dashboard (T103) | `ga4-dashboard/package.json` | P2 |
| 4 | Verifiera npm audit kvarvarande sårbarheter (T104) | `ga4-dashboard/` | P2 |
| 5 | Lägg till GA4 service-account-nyckel på rapport-maskinen | `~/.config/efterplan/ga4-service-account.json` | P1 |

- [ ] Godkänn åtgärd 1 (användarintervjuer)
- [ ] Godkänn åtgärd 2 (Supabase live-setup)
- [ ] Godkänn åtgärd 3 (googleapis upgrade)
- [ ] Godkänn åtgärd 4 (audit-verifiering)
- [ ] Godkänn åtgärd 5 (GA4 credentials)

---

## ℹ️ Anmärkningar för denna körning

- **DEL 1 (GA4):** överhoppad, credentials saknas.
- **DEL 5 (Skicka tickets till Claude Code via Chrome):** **ej genomförd**. Skäl: detta är en automatisk körning utan ägaren närvarande, en separat morgonkörning samma dag har redan producerat T100–T102, och att skicka prompts till claude.ai utan godkännande riskerar duplicerade arbetspass. T103/T104 väntar på Owner-godkännande innan delegering.

*Rapport genererad automatiskt 2026-04-29 (eftermiddagskörning, ersätter morgonens version).*
