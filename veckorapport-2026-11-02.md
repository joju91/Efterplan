# Efterplan — 2026-11-02

🔢 Sessions: GA4 SAKNAS — creds ej i sandlåda (T270 ☐)

🔧 Uptime: ej verifierbar (sandlådeproxy returnerar 403) | Sårbarheter: 0 | Beroenden: 1 patch
   - `@supabase/supabase-js` låst 2.117.2, latest 2.118.0 — T310 ☐ (ny)
   - `stripe` 22.6.2 vs latest 23.1.0 — T275 ☐ (öppen sedan 2026-10-05)

📣 T307 (Anthropic-krediter slut) blockerar Arkiv-AI och T309 kräver Google-nyckel senast **4 nov (om 2 dagar)** — Owner måste agera idag.

🎫 Nya tickets: T310 – supabase-js 2.118.0 patch (#169)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | T310 lagt till i roadmap.md | roadmap.md | 0 |
| 2 | veckorapport-2026-11-02.md skapad | veckorapport-2026-11-02.md | 0 |

---

## DEL 1 — GA4

GA4 SAKNAS — hoppar över DEL 1. `GA4_SERVICE_ACCOUNT_JSON` finns bara som GitHub Actions-secret, inte i molnsandlådan. T270 ☐ blockerar GA4-analys.

## DEL 2 — Kodaudit

**Missing meta descriptions:** `auth-modal.html` — känd falskt positiv (body-fragment, ej standalone-sida). T100 `x`, T274 ✔.

**TODOs/FIXMEs:** Inga hittade.

**GA4-events i app.js:**
- `onboarding_start` (rad 287), `onboarding_step` (rad 372), `checkbox_toggle` (rad 430)
- `plan_generated` (rad 446), `note_saved` (rad 1201), `deadline_dates_computed` (rad 1150)
- `premium_activated` (rad 184), `bill_added` (rad 1759), `preview_cta_clicked` (rad 1358)

**Sårbarheter (ga4-dashboard):** 0 — rent.

**npm outdated:**
- `@supabase/supabase-js`: lock 2.117.2, latest 2.118.0 → T310 (ny, 🟡)
- `stripe`: lock 22.6.2, latest 23.1.0 → T275 ☐ (öppen)

**Uptime:** Ej verifierbar från sandlåda (proxy blockerar utgående HTTPS till efterplan.se).

## DEL 3 — Roadmap-status

| Klara | Pågår | Ej startade |
|-------|-------|-------------|
| 238   | 13    | 36          |

**Pågående (urval):**
- T015/T016 Validera stegordning med riktiga användare
- T032 Test av hela köpflödet
- T034 Bokio/Fortnox setup
- T047/T081 Drop-off-analys
- T060 Push-notiser (ej på main)
- T079 Betald byrålisting
- T307 🔴 Anthropic-krediter slut (Owner, nu)
- T309 🟠 Google-nyckel senast **4 nov** (Owner, idag)

**Nästa öppna (T001, T003, T004):** företagsregistrering och bankärenden.

**Marknadsinsikt:** Kampanjen är live men konverteringsdata saknas så länge Anthropic-kontot är urladdat (T307) — köp krediter idag och verifiera att Arkiv-AI svarar 200 igen.

## DEL 4 — Auto-tickets

| ID | Beskrivning | Fil | Prio |
|----|-------------|-----|------|
| T310 | `@supabase/supabase-js` 2.117.2 → 2.118.0 patch-uppdatering | package-lock.json | 🟡 |

## DEL 5 — GitHub Issues

- T310: https://github.com/joju91/Efterplan/issues/169
