---
name: ga4
description: "Use this skill when you need to fetch, analyze, or report on GA4 data for efterplan.se — and translate findings into concrete Claude Code instructions. Triggers: any mention of GA4, trafik, konvertering, drop-off, sessions, bounce rate, CTR, or requests like 'analysera trafiken', 'vad säger GA4', 'månadsrapport', 'vad ska förbättras'. Output is always: (1) data summary, (2) prioritized issues, (3) ready-to-paste Claude Code instructions."
compatibility: "Claude Desktop, Cowork, Claude Code"
---

# GA4 Skill — Efterplan.se

## Syfte

Hämta data från GA4, analysera den mot efterplans mål (trafik → onboarding → plan genererad), och producera **exakta instruktioner till Claude Code** för förbättringar. Inga vaga rekommendationer — bara konkreta åtgärder.

---

## Steg 1 — Autentisering

GA4 Data API kräver en service account med JSON-nyckel.

```bash
# Verifiera att nyckeln finns
ls ~/.config/efterplan/ga4-service-account.json

# Installera klient
pip install google-analytics-data --break-system-packages
```

Service account behöver rollen **Viewer** i GA4-propertyn.  
Property ID finns i GA4 → Admin → Property Settings → Property ID (format: `123456789`).

Spara som miljövariabel:
```bash
export GA4_PROPERTY_ID="123456789"
export GOOGLE_APPLICATION_CREDENTIALS="~/.config/efterplan/ga4-service-account.json"
```

---

## Steg 2 — Hämta kärndata

Kör detta Python-script för att hämta de viktigaste måtten:

```python
# ga4_fetch.py
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    RunReportRequest, Dimension, Metric, DateRange, OrderBy
)
import os, json
from datetime import date, timedelta

PROPERTY_ID = os.environ["GA4_PROPERTY_ID"]
client = BetaAnalyticsDataClient()

def run(dimensions, metrics, start="30daysAgo", end="today", limit=20):
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        date_ranges=[DateRange(start_date=start, end_date=end)],
        limit=limit,
    )
    return client.run_report(req)

# 1. Trafik per sida
pages = run(["pagePath"], ["sessions", "screenPageViews", "bounceRate", "averageSessionDuration"])

# 2. Trafikkällor
sources = run(["sessionDefaultChannelGroup"], ["sessions", "newUsers"])

# 3. Konverteringsfunnel (events)
events = run(["eventName"], ["eventCount", "totalUsers"])

# 4. Enhet
devices = run(["deviceCategory"], ["sessions", "bounceRate"])

# Skriv ut
for report, label in [(pages,"PAGES"), (sources,"SOURCES"), (events,"EVENTS"), (devices,"DEVICES")]:
    print(f"\n=== {label} ===")
    headers = [h.name for h in report.dimension_headers] + [m.name for m in report.metric_headers]
    print("\t".join(headers))
    for row in report.rows:
        vals = [d.value for d in row.dimension_values] + [m.value for m in row.metric_values]
        print("\t".join(vals))
```

```bash
python ga4_fetch.py > ga4_raw.txt
```

---

## Steg 3 — Analysera mot efterplans funnel

Efterplans funnel är:

```
Organisk sökning
  → Landningssida (SEO-sida eller index)
    → Onboarding start (event: onboarding_start)
      → Plan genererad (event: plan_generated)
        → Uppgift avklarad (event: task_completed)
```

**Nyckelmått att utvärdera:**

| Mått | Bra | Varning | Kritiskt |
|---|---|---|---|
| Organic sessions (30d) | >200 | 50–200 | <50 |
| Bounce rate landningssidor | <60% | 60–75% | >75% |
| onboarding_start / sessions | >15% | 8–15% | <8% |
| plan_generated / onboarding_start | >70% | 40–70% | <40% |
| Mobil andel | — | — | Om desktop >40%: UX-problem |

---

## Steg 4 — Identifiera problem

Analysera rådata och matcha mot dessa mönster:

### Mönster A: Hög trafik, låg onboarding
**Symptom:** Många sessions på index/landningssida, få `onboarding_start`  
**Orsak:** CTA inte synlig, för mycket text, fel budskap  
**Åtgärd:** → Se Claude Code-instruktion #1

### Mönster B: Hög bounce på SEO-sidor
**Symptom:** >70% bounce på `/checklista-dodsbo`, `/bouppteckning-guide` etc.  
**Orsak:** Sidan svarar inte på sökavsikten, eller saknar tydlig nästa steg  
**Åtgärd:** → Se Claude Code-instruktion #2

### Mönster C: Drop-off i onboarding
**Symptom:** `onboarding_start` >> `plan_generated`  
**Orsak:** För många steg, förvirrande frågor, tekniskt fel  
**Åtgärd:** → Se Claude Code-instruktion #3

### Mönster D: Dålig mobilprestanda
**Symptom:** Mobil bounce rate >10pp högre än desktop  
**Orsak:** Layout, tappmål, laddtid  
**Åtgärd:** → Se Claude Code-instruktion #4

### Mönster E: Svaga sidor (impressions utan klick i GSC)
**Symptom:** Sida har visningar men CTR <2%  
**Orsak:** Svag meta title/description  
**Åtgärd:** → Se Claude Code-instruktion #5

---

## Steg 5 — Claude Code-instruktioner

Välj instruktion baserat på identifierat mönster. Klistra in direkt i Claude Code.

---

### Instruktion #1 — CTA-optimering (Mönster A)

```
Öppna index.html.

Hitta den primära CTA-knappen (troligen "Kom igång" eller liknande).

Gör följande:
1. Se till att knappen är synlig above the fold på 375px viewport utan scroll
2. Lägg till en kort subtext direkt under knappen: "Gratis · Ingen registrering · 2 minuter"
3. Öka knappens padding till minst 16px vertikalt
4. Kontrollera att knappens kontrastratio är >4.5:1

Kör sedan: npx lighthouse https://efterplan.se --only-categories=performance,accessibility --output=json
Rapportera CLS och LCP.
```

---

### Instruktion #2 — SEO-sida bounce (Mönster B)

```
Öppna [SIDNAMN].html (ersätt med aktuell sida från GA4-data).

Analysera:
1. Finns en tydlig intern länk till verktyget (index.html) above the fold?
2. Matchar H1 den sannolika sökfrågan för sidan?
3. Finns FAQ-schema i <head>?

Åtgärda:
1. Lägg till en "Använd verktyget gratis →"-länk direkt under H1, styled som en mjuk CTA (ej primärknapp)
2. Om H1 inte innehåller primärt sökord — uppdatera den
3. Kontrollera att schema.org FAQPage är korrekt implementerad

Validera schema: https://validator.schema.org
```

---

### Instruktion #3 — Onboarding drop-off (Mönster C)

```
Öppna onboarding-flödet i koden (leta efter onboarding_start-eventet).

1. Räkna antalet steg i onboardingen — målet är max 4 steg
2. Om fler: identifiera vilket steg som kan tas bort eller slås ihop
3. Kontrollera att varje steg har ett tydligt "Nästa"-mål
4. Lägg till progress-indikator om den saknas (steg X av Y)
5. Kontrollera att plan_generated-eventet faktiskt triggas — logga i console om det saknas

Rapportera: antal steg före och efter, vilka ändringar gjordes.
```

---

### Instruktion #4 — Mobiloptimering (Mönster D)

```
Kör Lighthouse mot https://efterplan.se med mobile-preset:
npx lighthouse https://efterplan.se --emulated-form-factor=mobile --output=json > lh_mobile.json

Identifiera top 3 opportunities från rapporten.

För varje opportunity:
1. Beskriv filen och raden som behöver ändras
2. Gör ändringen
3. Bekräfta att den inte bryter layout på 375px

Fokusera i ordning: LCP → CLS → TBT
```

---

### Instruktion #5 — Meta title/description (Mönster E)

```
Sidan [SIDNAMN].html har låg CTR i Google Search Console.

1. Läs nuvarande <title> och <meta name="description">
2. Kontrollera: är primärt sökord med i title? Är description 120–155 tecken?
3. Skriv ny title: max 60 tecken, sökord först, varumärke sist
   Format: "[Primärt sökord] — Efterplan"
4. Skriv ny description: 130–150 tecken, inkludera sökord + tydlig nytta + implicit CTA
5. Uppdatera filen

Rapportera: gamla vs nya värden.
```

---

## Steg 6 — Månadsrapport (output-format)

När du kör en månadsanalys, producera alltid denna struktur:

```markdown
# GA4 Månadsrapport — [månad år]

## Trafik
- Sessions: X (±% vs förra månaden)
- Organisk andel: X%
- Top 3 landningssidor: ...

## Funnel
- onboarding_start rate: X%
- plan_generated rate: X%
- Kritiskt drop-off: [steg]

## Prioriterade åtgärder (Claude Code)
1. [Mönster X] — Instruktion #N — Förväntad effekt: ...
2. ...
3. ...

## Godkänn eller avvisa
[ ] Åtgärd 1
[ ] Åtgärd 2
[ ] Åtgärd 3
```

Presentera alltid rapporten för Jonas innan något körs. Han godkänner varje åtgärd.

---

## Snabbreferens — vanliga GA4-dimensioner för efterplan

| Dimension | Namn i API |
|---|---|
| Sida | `pagePath` |
| Trafikkälla | `sessionDefaultChannelGroup` |
| Enhet | `deviceCategory` |
| Land | `country` |
| Event | `eventName` |

| Metric | Namn i API |
|---|---|
| Sessioner | `sessions` |
| Nya användare | `newUsers` |
| Bounce rate | `bounceRate` |
| Snittid på sida | `averageSessionDuration` |
| Event-antal | `eventCount` |
