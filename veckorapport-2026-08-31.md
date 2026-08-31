# Efterplan — Veckorapport 2026-08-31

> Genererad automatiskt av Claude Code (molnsandlåda, schemalagd måndag).

---

## 🔢 Nyckeltal (7 dagar — GA4)

**GA4 SAKNAS — hoppar över DEL 1.** Inga Google Application Credentials i molnsandlådan.

_Referens förra veckan (2026-08-24):_ 23 sessions | 22 unika | engagement 39.1% | 47.8% organisk | 1 `onboarding_start` | 1 `plan_generated` | 0 `task_completed`

---

## 🟢 Uptime & Teknisk audit

| Kontroll | Resultat |
|----------|---------|
| Live-check efterplan.se | ⚠️ Proxy 403 i sandlådan (nätverksbegränsning) — ej verklig downtime. Senast verifierat: 200 / 0.16s (2026-08-24). |
| npm audit (ga4-dashboard) | ✅ 0 kritiska · 0 höga · 0 måttliga · 0 låga |
| TODOs / FIXMEs | ✅ Inga hittade |

**Kodfynd:**

- `auth-modal.html`: flaggas av `grep -rL 'meta name="description"'` — **känd falsk positiv** (T100, T212). Filen är ett body-fragment som inlines i `index.html`; `<meta>`-tagg är ogiltig där.
- `npm outdated`: `@supabase/supabase-js` + `stripe` visas som MISSING — **sandlåda**, `node_modules/` ej installerade. `package-lock.json` finns i repo. T130 ✔.

**GA4 track()-händelser i app.js (bekräftade):**

| Event | Rad |
|-------|-----|
| `onboarding_start` | 149 |
| `plan_generated` | 313 |
| `task_completed` | 2052 |
| `premium_activated` | 79 |
| `reminder_optin` | 327 |

---

## 📊 Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 185 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 42 |

**Pågående (urval):**

- T015 – Validera stegordning med 2–3 verkliga anhöriga
- T060 – Push-notiser ⚠️ koden finns bara på `origin/codex/t060-checkpoints`, ej på `main`
- T123 – De-inlining: utility-klasser (.u-*) — återstår att rulla ut på fler sidor

**Nästa att starta:**

- T001 – Läs hela Manifest-arket och bekräfta scope
- T003 – Registrera företag + F-skatteansökan
- T004 – Öppna företagskonto

---

## 🔑 Viktigaste händelse denna vecka

**Commit 0060552 (2026-08-24):** Felaktig service-account-email korrigerad. Det riktiga kontot är `efterplan@efterplan.iam.gserviceaccount.com` — inte `ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com` som angavs i T239/T246. Ägaren har av den felaktiga dokumentationen lagts till fel konto i Search Console **två gånger**. Nu är rätt e-post dokumenterad i `SECRETS.md` och `scripts/keys/config.mjs`.

**T246 (GSC 403) är nu aktionsbar:** Lägg till `efterplan@efterplan.iam.gserviceaccount.com` på **URL-prefix-egendomen** (inte sc-domain):  
→ https://search.google.com/search-console/users?resource_id=https://efterplan.se/  
Kör sedan `.github/workflows/gsc-positions.yml` manuellt för att verifiera.

---

## 📣 Marknadsinsikt

Med rätt service-account dokumenterat är GSC-åtkomsten en Owner-klick bort — högsta prioritet är att lägga till kontot i Search Console, så att nästkommande veckorapport kan visa sökpositioner och bekräfta om Fas 28-innehållet (testamente-guide, vad-kostar-en-begravning, tomma-dodsbo) börjar ranka.

---

## 🎫 Nya auto-tickets

**Inga nya tickets denna vecka.** Inga problem hittades i DEL 2 som saknar befintlig ☐/⧖-ticket.

**Öppna tickets som kräver ägaråtgärd:**

| Ticket | Beskrivning | Prioritet |
|--------|-------------|-----------|
| T246 ☐ | Lägg till rätt service-account i Search Console (URL-prefix, ej sc-domain) | 🔴 |
| T247 ☐ | Kolla Google Ads-konto: Paid Search gick till 0 (trafik 82→23) | 🟠 |
| T243 ☐ | Lighthouse: LCP 3565ms > budget 2500ms, TBT 305ms > 300ms | 🟠 |
| T244 ☐ | Security headers saknas i `vercel.json` | 🟡 |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Mål | P |
|---|--------|-----|---|
| 1 | Lägg till `efterplan@efterplan.iam.gserviceaccount.com` i Search Console (URL-prefix-egendom) | search.google.com | 🔴 |
| 2 | Kör `gsc-positions.yml` manuellt efter punkt 1 | GitHub Actions | 🟠 |
| 3 | Kolla Google Ads-status (T247) | Google Ads | 🟠 |

---

_Rapport: `veckorapport-2026-08-31.md` · Push: se commit · Tickets skapade: 0 · Issues öppnade: 0_
