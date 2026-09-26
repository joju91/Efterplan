# Google Ads Agent — installationsguide

## Vad det här är

Ett autonomt system som optimerar Efterplans Google Ads-kampanjer utan att Jonas behöver logga in i Google Ads. Systemet består av tre delar:

1. **Google Ads Script** (det här dokumentet) — körs inne i Google Ads, exporterar data och implementerar beslut
2. **GitHub Action** — körs varje måndag, analyserar data med Claude och genererar beslut  
3. **Vercel API** — mellanled som tar emot data från Google Ads och skickar tillbaka beslut

---

## Steg 1: Generera hemlig nyckel (ADS_AGENT_SECRET)

Nyckeln autentiserar kommunikationen mellan Google Ads och ditt Vercel-API.

Kör i terminalen:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Spara värdet — du behöver det i steg 2 och 3.

---

## Steg 2: Lägg till ADS_AGENT_SECRET i Vercel och GitHub

### Vercel (krävs för att API-endpoints ska fungera)
```bash
vercel env add ADS_AGENT_SECRET production
# Klistra in nyckeln när prompten frågar
```

### GitHub Actions (krävs för att optimeringsskriptet ska kunna skriva beslut)
```bash
gh secret set ADS_AGENT_SECRET
# Klistra in nyckeln när prompten frågar
```

Lägg även till dessa GitHub Actions-secrets om de saknas:
```bash
gh secret set ANTHROPIC_API_KEY    # från console.anthropic.com/settings/keys
gh secret set SUPABASE_URL         # https://vjupkemzpnrahdsljenl.supabase.co
```

---

## Steg 3: Installera Google Ads Script

1. Öppna [Google Ads](https://ads.google.com) → **Verktyg & Inställningar** → **Massåtgärder** → **Scripts**
2. Klicka **+ Nytt skript** (blå knapp, uppe till höger)
3. Klistra in hela innehållet från `scripts/google-ads/ads-script.js`
4. Namnge skriptet: `Efterplan Agent`
5. Klicka på **kugghjulsikonen** (⚙) bredvid "Förhandsgranska"
6. Lägg till dessa **Script Properties**:
   - `VERCEL_BASE_URL` = `https://efterplan.se`
   - `ADS_AGENT_SECRET` = *(nyckeln från Steg 1)*
7. Klicka **Stäng**
8. Klicka **Förhandsgranska** → loggen ska visa `=== Klar ===` utan FEL-rader
9. Klicka **Spara**
10. Schemalägg: **Dagligen** kl. **06:00**

---

## Vad händer nu?

- **Varje dag 06:00**: Skriptet exporterar sökordsprestanda till databasen
- **Varje måndag 06:00**: Skriptet exporterar även söktermsrapporten
- **Varje måndag 08:00**: GitHub Action analyserar data med Claude och skapar beslut
- **Varje måndag 06:00 (nästa dag)**: Skriptet hämtar och implementerar besluten

Du får ett **GitHub Issue** varje måndag med en sammanfattning av vad som gjorts.

---

## Vad agenten kan göra autonomt

| Åtgärd | Kräver godkännande? |
|--------|---------------------|
| Pausa sökord (hög CPC, noll konverteringar) | Nej |
| Lägga till negativa sökord | Nej |
| Lägga till nya sökord från söktermsdata | Nej |
| Återaktivera pausade sökord | Nej |
| Höja daglig budget | **Ja — GitHub Issue** |
| Skapa ny kampanj/annonsgrupp | **Ja — GitHub Issue** |
| Byta budstrategi | **Ja — GitHub Issue** |

---

## Manuell körning

```bash
# Kör optimering direkt (kräver .env.local med secrets)
node scripts/google-ads/optimize.mjs

# Bara rapport, inga ändringar
node scripts/google-ads/optimize.mjs --report-only
```

---

## Felsökning

**Skriptet i Google Ads loggar `HTTP 401`**
→ ADS_AGENT_SECRET stämmer inte. Kontrollera att värdet i Script Properties och Vercel är exakt samma.

**GitHub Action misslyckas med "ANTHROPIC_API_KEY missing"**
→ Kör `gh secret set ANTHROPIC_API_KEY` (se Steg 2).

**Ingen data visas i rapport**
→ Google Ads Script har inte kört än. Klicka "Förhandsgranska" i Google Ads och kontrollera loggen.
