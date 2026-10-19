# Efterplan — 2026-10-19

🔢 Sessions: GA4 SAKNAS (ingen connector i sandlådan) | Organisk: N/A | Onboarding: N/A | Plan: N/A

🔧 Uptime: ej verifierbar (proxy 403 i sandlåda — weekly-health.yml hanterar prod-uptime) | ga4-dashboard: 0 sårbarheter
   - `ga4-dashboard/package.json`: `dotenv 16.6.1 → 18.0.8` (2 major versioner, breaking changes-risk) — `ga4-dashboard/package.json`
   - `ga4-dashboard/package.json`: `googleapis 171.4.0 → 186.0.0` (15 minor versioner, troligen bakåtkompatibel) — `ga4-dashboard/package.json`

📣 Google Ads-kampanjen är live (T254 ✔) och T278–T279 diskuterar gratis-modell + Buy Me a Coffee. Avgör freemium-riktningen denna vecka — det blockerar optimeringen av kampanjbudget och copy.

🎫 Nya tickets: T281 – dotenv 16→18 major i ga4-dashboard | T282 – googleapis 171→186 i ga4-dashboard

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till roadmap-tickets T281–T282 + push rapport | roadmap.md, veckorapport-2026-10-19.md | 0 |

---

## DEL 1 — GA4
GA4 SAKNAS — hoppade över DEL 1 (ingen Google-connector ansluten till molnsandlådan).

## DEL 2 — Kodaudit

**Missing meta description:** `./auth-modal.html` (T274 ✔ — fixad med X-Robots-Tag: noindex i vercel.json)

**TODOs/FIXMEs:** inga hittades

**GA4 Events i app.js:**
- `onboarding_start` (rad 253)
- `plan_generated` (rad 401)
- `checkbox_toggle`, `note_saved`, `reminder_optin`, `deadline_dates_computed`, `preview_cta_clicked`

**Sårbarheter (ga4-dashboard npm audit):** 0 totalt ✅

**npm outdated (root):**
- `stripe`: locked 22.6.2, latest 23.0.0 — T275 ☐ (öppen)
- `@supabase/supabase-js`: MISSING, wanted/latest 2.118.0 (ok inom `^`)

**npm outdated (ga4-dashboard):**
- `dotenv`: locked 16.6.1, latest 18.0.8 — **2 major versioner** → T281 (ny)
- `googleapis`: locked 171.4.0, latest 186.0.0 — **15 minor versioner** → T282 (ny)
- `express`: locked 5.3.0, latest 5.3.0 — ok

**Uptime-check:** Ej körbar från molnsandlåda (proxy 403). Produktions-uptime hanteras av `weekly-health.yml` i GitHub Actions.

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 220 |
| ⧖ Pågår | 12 |
| ☐ Ej startade | 36 |

**Pågående (urval):**
- T015/T016: Validera/justera steg-ordning med riktiga anhöriga
- T032: Testa hela köpflödet
- T047/T081: Analysera drop-off
- T060: Push-notiser (kod finns på inaktiv branch `codex/t060-checkpoints`, ej mergad)
- T079: Betald byrålisting

**Nästa öppna:**
- T001: Läs hela Manifest
- T003: Registrera företag/enskild firma
- T004: Öppna företagskonto

**Marknadsinsikt:** Google Ads är live (T254 ✔) men freemium-beslutet (T278/T279) är olöst — utan ett klart erbjudande kan ads-copy och conversion goals inte optimeras. Prioritera beslutet T278 denna vecka.

## DEL 4 — Auto-tickets

Nästa ticket-ID: T281. Inga befintliga tickets täcker dotenv 16→18 eller googleapis 171→186 i `ga4-dashboard/`.

### T281 — dotenv major-uppgradering i ga4-dashboard (16→18)
`npm outdated` i `ga4-dashboard/` visar `dotenv Latest: 18.0.8` mot locked `16.6.1`. Två major versioner — dotenv 17 och 18 har ändringar i `populate`-API, `processEnv`-hantering och default-beteenden för `.env`-parsing. Breaking change-risk för `scripts/weekly-report.mjs` som laddar env-variabler via `dotenv/config` eller `dotenv.config()`. Granska [dotenv changelog](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) för v17/v18, kör `cd ga4-dashboard && npm install dotenv@^18`, verifiera att rapporten fortfarande genereras korrekt. Fil: `ga4-dashboard/package.json`, `ga4-dashboard/package-lock.json`.

### T282 — googleapis minor-uppgradering i ga4-dashboard (171→186)
`npm outdated` visar `googleapis Latest: 186.0.0` mot locked `171.4.0`. Samma major, 15 minor versioner, troligen bakåtkompatibel — men GA4 Analytics Data API-schemat (`analyticsdata_v1beta`) kan ha fått nya fält eller borttagna metoder. Kör `cd ga4-dashboard && npm update googleapis`, verifiera att `scripts/weekly-report.mjs` och GA4-klientkoden fortfarande returnerar korrekt data. Fil: `ga4-dashboard/package.json`, `ga4-dashboard/package-lock.json`.
