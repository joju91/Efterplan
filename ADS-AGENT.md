# Google Ads-agenten — driftsdokumentation

Systemet hanterar Google Ads-kampanjerna för efterplan.se autonomt. Det enda du behöver göra är att installera Google Ads Script (en gång, ~10 min) och läsa de veckovisa GitHub Issues.

---

## Hur det fungerar

```
Google Ads (kampanjdata)
    ↕  ads-script.js — dagligen 06:00
api/ads-telemetry.js  →  Supabase (ads_performance, ads_search_terms)
api/ads-decisions.js  ←  Supabase (ads_decisions)

GitHub Action (måndag 08:00)
    → läser Supabase + Plausible
    → anropar Claude för analys
    → skriver beslut till ads_decisions
    → öppnar GitHub Issue med rapport
```

---

## Installation (en gång)

Se `scripts/google-ads/README.md` för fullständiga steg-för-steg-instruktioner.

Kortversion:
1. Generera `ADS_AGENT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
2. Lägg till i Vercel: `vercel env add ADS_AGENT_SECRET production`
3. Lägg till i GitHub: `gh secret set ADS_AGENT_SECRET`
4. Lägg till i GitHub: `gh secret set ANTHROPIC_API_KEY` (om det saknas)
5. Lägg till i GitHub: `gh secret set SUPABASE_URL` med värdet `https://vjupkemzpnrahdsljenl.supabase.co`
6. Klistra in `scripts/google-ads/ads-script.js` i Google Ads Scripts, lägg till Properties, schemalägg dagligen 06:00

---

## Vad agenten gör varje vecka

**Måndag 06:00** — Google Ads Script exporterar söktermsrapport (senaste 30 dygnen)  
**Måndag 08:00** — GitHub Action analyserar data och genererar beslut  
**Tisdag 06:00** — Google Ads Script hämtar och implementerar besluten  
**Varje dag 06:00** — Google Ads Script exporterar daglig sökordsprestanda  

Du får ett **GitHub Issue** (label: `google-ads`) varje måndag med:
- Nyckeltal (klick, kostnad, konverteringar, CPA)
- Vilka autonoma beslut som tagits och varför
- Eventuella budgetförslag som kräver ditt godkännande

---

## Dina enda ansvar

| Uppgift | Frekvens | Tid |
|---------|----------|-----|
| Läs veckans GitHub Issue | Måndag | 2 min |
| Godkänn/avvisa budgetförslag (om de uppkommer) | Sällan | 5 min |
| Bekräfta betalning om Google begär det | Sällan | 2 min |

---

## Vad agenten aldrig gör utan ditt OK

- Höjer daglig budget
- Skapar nya kampanjer
- Byter budstrategi (t.ex. till Target CPA)

Sådana förslag hamnar alltid i ett GitHub Issue med `⚠️ Kräver godkännande`.

---

## Manuell kontroll via `/google-ads`

```
/google-ads             — full rapport + status
/google-ads report      — nyckeltal 7 och 30 dagar
/google-ads decisions   — se väntande och genomförda beslut
/google-ads optimize    — kör optimering nu (istället för att vänta till måndag)
/google-ads expand      — föreslå nya sökord/annonsgrupper
/google-ads budget 60   — föreslå ny daglig budget (60 kr) med motivering
/google-ads pause arvskiftesavtal — pausa ett sökord direkt
/google-ads setup       — kontrollera att systemet är korrekt installerat
```

---

## Supabase-tabeller

| Tabell | Innehåll |
|--------|---------|
| `ads_performance` | Dagliga sökordssnapshots från Google Ads Script |
| `ads_search_terms` | Söktermsrapport (varje måndag) |
| `ads_decisions` | Alla beslut — autonoma och de som kräver godkännande |
| `ads_budget` | Godkänd budget — INSERT-only, aldrig UPDATE |

---

## Trösklar för autonoma beslut

| Beslut | Kriterium |
|--------|-----------|
| Pausa sökord | ≥10 klick, 0 konv., avg CPC >8 kr, ≥14 dagars data |
| Lägg till negativt sökord | Irrelevant sökterm med ≥1 klick |
| Lägg till sökord | Relevant sökterm, ≥3 klick, <8 kr CPC, ej redan sökord |
| Budgetförslag (kräver OK) | CPA <50 kr OCH ≥5 köp senaste 30 dagar |

---

## Konverteringslogik

**Mjuk konvertering** — `ADS_LABEL_PLAN` (`07qVCNedmoIdEPbG38FE`): personlig plan skapad  
**Hård konvertering** — `ADS_LABEL_PURCHASE` (`_6NoCNqdmoIdEPbG38FE`): köp 49 kr

Konverteringar rapporteras i Google Ads (via gtag i app.js) OCH i Plausible (event: `premium_activated`). CPA-beräkningen i agenten använder Plausible-data (utm-filtrerat) som primär källa eftersom den inte är beroende av cookiesamtycke.

**Lönsamhetsgräns:** CPA <49 kr = lönsam kampanj (köppriset täcker annonskostnaden).

---

## Felsökning

**Ingen data i rapport**  
→ Google Ads Script har inte kört. Öppna Google Ads → Scripts → Förhandsgranska och kontrollera loggen.

**HTTP 401 i Script-loggen**  
→ ADS_AGENT_SECRET matchar inte. Kontrollera att Script Properties och Vercel-env har exakt samma värde.

**GitHub Action misslyckas**  
→ Kontrollera att ANTHROPIC_API_KEY och SUPABASE_URL är satta som GitHub Actions-secrets (`gh secret list`).

**Beslut implementeras inte**  
→ Script kör 06:00 nästa dag. Om det fortfarande inte händer: kontrollera Script-logg i Google Ads.
