# Efterplan Veckorapport — 2026-09-28

> Genererad automatiskt av GitHub Actions (`.github/workflows/weekly-report.yml`).

---

## 🔢 Nyckeltal (7 dagar — Plausible)

| Mått | Värde |
|------|-------|
| Sessions | **58** |
| Users | 54 |
| Engagement rate | 24.0% |
| Organisk andel | 14 (24.1%) |
| onboarding_start | 1 (1.7% av sessions) |
| plan_generated | 0 (0.0% av onboarding_start) |
| task_completed | 0 |

**Kanaler:**

- Paid Search: 22
- Organic Search: 14
- Direct: 11
- Referral: 11

## 🔍 GSC — Sidor på position 11–25 (90 dagar)

| Pos | Klick | Visn | CTR | Sida |
|-----|-------|------|-----|------|
| 12.2 | 32 | 1792 | 1.8% | `/dodsannons.html` |

## 🟢 Uptime

| Path | Status | Tid |
|------|--------|-----|
| `/` | 200 | 0.32s |
| `/sambo-arv.html` | 200 | 0.16s |
| `/efterlevandepension.html` | 200 | 0.07s |
| `/dodsbo-bostadsratt.html` | 200 | 0.08s |
| `/vad-gora-nar-nagon-dor.html` | 200 | 0.04s |

## 📊 Git-aktivitet

- **67** commits, **102** filer ändrade

### Commits

- `87190c2 agent: dedikerade grep/replace-verktyg (inget bash) — löser tool-name-konflikten`
- `aec9c19 agent: tool_choice required — tvingar agenten att alltid kalla ett verktyg`
- `174175b agent: bash-baserad strategi (grep/sed) — undviker att skicka stora filer till LLM`
- `8ee9ecf agent: retry vid rate limit (429) + trimma kontext för att hålla nere TPM`
- `20cb437 agent: byt till openai/gpt-oss-120b (llama-3.1-70b-versatile avvecklad på Groq)`
- `0618dfa ci: byt till Groq-agent (llama-3.1-70b-versatile, gratis)`
- `4ea2a7d ci: autofix + roadmap — autonoma GitHub Actions med Claude Code`
- `678b666 Veckorapport 2026-09-28: auto-tickets + status`
- `c8fad4e ads-script: platshållare för SECRET (PropertiesService stöds ej i Ads Scripts)`
- `a514cf3 Google Ads-rapport 2026-09-27 (auto, GitHub Actions)`
- `e22f657 ads-optimize: byt till openai/gpt-oss-120b (tillgänglig på detta Groq-konto)`
- `cc88aa5 Google Ads-rapport 2026-09-27 (auto, GitHub Actions)`
- `7b764cf ads-optimize: byt till llama-3.1-70b-versatile (finns på Groq free tier)`
- `c4b64f4 Google Ads-rapport 2026-09-27 (auto, GitHub Actions)`
- `baa87dd ads-optimize: byt från Anthropic till Groq (gratis)`
- `e3e6998 Google Ads-rapport 2026-09-27 (auto, GitHub Actions)`
- `512e35e Google Ads-rapport 2026-09-27 (auto, GitHub Actions)`
- `c602cf4 security: rotera ADS_AGENT_SECRET, läs från Script Properties`
- `890c6e9 T228: byt avsändaradress till paminnelse@efterplan.se (ASCII)`
- `758a516 T228: gör FROM-adressen konfigurerbar via RESEND_FROM env var`
- `d6296a3 T249 fas 2: alla 43 inline style= borttagna från index.html`
- `c673bad T249 fas 1: dedup/tokenisera .u-*-klasser, de-inlinea auth-modal`
- `17b8776 T164: Stripe QA — kodgranskning + 500→400 fix i verify-checkout`
- `d4dda1f T228/T136: deadline-påminnelse-mejl via Resend`
- `e69661d feat: add letter templates for landlord (T139) and Pensionsmyndigheten (T140)`
- `7876bea Auto: uppdatera sitemap.xml (GitHub Actions)`
- `2f13239 seo: add dodsbo-eget-foretag + tjanstepension-dodsfall (T197, T198)`
- `5f16b59 roadmap: T243 + T260 markerade klara`
- `a6e7e2b Auto: uppdatera sitemap.xml (GitHub Actions)`
- `be764b9 T260+T264+T265: onclick→addEventListener, roadmap, Stripe price fix`
- `cfd1836 perf: font preload + fetchpriority på alla sidor (T243)`
- `2e91623 ads-agent: ny skill som hanterar Google Ads autonomt`
- `90be99e bouppteckning-guide: precisera SFS 2026:251 e-tjänst öppnar 2027`
- `73ec53f Auto: uppdatera sitemap.xml (GitHub Actions)`
- `4aa9cf4 T222: add 4 SEO pages + community thread drafts`
- `dd8a789 csp: allow ad.doubleclick.net for Google Ads conversion tracking`
- `2a7bfc1 Auto: uppdatera sitemap.xml (GitHub Actions)`
- `7cd94b5 T223: self-host Google Fonts — eliminate external CDN dependency`
- `03fd824 ads-optimize: graceful fallback when Claude API key is invalid`
- `6b84f5b CI: uppgradera alla workflows från Node 20 → 22`
- `223b2e1 Auto: uppdatera sitemap.xml (GitHub Actions)`
- `91aadbb Roadmap-städning: T258/T259/T261/T262/T132/T251 ✔ + index.html UX-fixar`
- `d7753e3 ads-telemetry: bypass supabase-js, use raw fetch + anon key + RLS`
- `8669ebd ads-script: remove getConversionValue + orderBy (not in Scripts API)`
- `9259cf6 ads-script: remove withDateRange (not available in this runtime)`
- `975597b ads-decisions: hardcode public Supabase URL + anon key`
- `bc15fcb ads-decisions: use anon key + RLS instead of broken service role key`
- `8478fa1 ads-decisions: bypass supabase-js, use raw fetch to REST API`
- `201e7bc ads-decisions: verbose error detail for 500 diagnosis`
- `0e47e6f Google Ads Script: fixa withDateRange-ordning + hårdkoda secrets`
- `13f76b0 Google Ads autonom agent — full implementation`
- `306003f Auto: uppdatera sitemap.xml (GitHub Actions)`
- `3cf1bf1 Security & accessibility audit fixes (27 findings)`
- `821ba19 ADS-LAUNCH-A: skriv om till läget efter launch (kampanj live, mätning, uppföljning)`
- `335cf23 Roadmap: Google Ads-kampanjen live (T254 ✔), Plausible-mål klara (T252 ✔), T264 dag 5-utvärdering`
- `a8d2d4e Google Ads-konverteringsetiketter: Personlig plan skapad + Köp 49 kr`
- `23a57c5 Google Ads-tagg statiskt i index.html så att Googles tagg-kontroll hittar den`
- `b792963 Auto: uppdatera sitemap.xml (GitHub Actions)`
- `e93ace3 Google Ads-tagg AW-18391491446: app.js + annonslandningssidor, CSP öppnad för Googles domäner`
- `99d5297 funnel-check: lägg till sidbreakdown för att se var trafiken faktiskt landar`
- `ccd3686 funnel-check: skriv output till loggen också, inte bara step summary`
- `2d9febd Lägg till funnel-check: diagnostiskt Plausible-verktyg för onboarding-tratten`
- `d536985 Veckorapport 2026-09-22 (auto, GitHub Actions)`
- `c403f7b Veckorapport 2026-09-22 (auto, GitHub Actions)`
- `013dc93 Veckorapport: byt GA4 mot Plausible för nyckeltal`
- `2177033 Uppdatera run-efterplan skill: lägg till Playwright-fallback för molnsessioner`
- `8ae488e Roadmap: T263 — community-scan-rutinen blockerad av nätverkspolicy`

## 🔧 Teknisk audit

- **npm audit (ga4-dashboard):** 0 critical · 0 high · 0 moderate · 0 low
- **Live-sajt:** 200 på 0.32s

## 🗺️ Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 222 |
| ⧖ Pågår | 14 |
| ☐ Ej startade | 37 |

