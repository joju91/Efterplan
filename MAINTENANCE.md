# Efterplan — Underhållsplan

Senast uppdaterad: april 2026

Princip: Allt körs automatiskt. Jonas involveras bara vid (1) larm, (2) månadsgodkännande, (3) större beslut.

---

## Automatiserat (GitHub Actions)

### `.github/workflows/weekly-health.yml`
Körs: varje måndag 08:00

```yaml
name: Weekly Health Check
on:
  schedule:
    - cron: '0 8 * * 1'

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Broken link check
        uses: lycheeverse/lychee-action@v1
        with:
          args: --verbose --no-progress './**.html'
          fail: true

      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            https://efterplan.se
            https://efterplan.se/checklista-dodsbo.html
            https://efterplan.se/bouppteckning-guide.html
          budgetPath: .lighthouserc.json
          uploadArtifacts: true

      - name: Open issue on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '⚠️ Weekly health check failed — ' + new Date().toISOString().slice(0,10),
              labels: ['maintenance'],
              body: 'Se Actions-loggen för detaljer.'
            })
```

---

### `.github/workflows/monthly-report.yml`
Körs: 1:a varje månad 09:00

```yaml
name: Monthly GA4 Report
on:
  schedule:
    - cron: '0 9 1 * *'

jobs:
  report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install deps
        run: pip install google-analytics-data anthropic

      - name: Fetch GA4 + analyze
        env:
          GA4_PROPERTY_ID: ${{ secrets.GA4_PROPERTY_ID }}
          GOOGLE_APPLICATION_CREDENTIALS_JSON: ${{ secrets.GA4_SERVICE_ACCOUNT_JSON }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: python .github/scripts/monthly_report.py

      - name: Post GitHub Issue
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('report_output.md', 'utf8');
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '📊 Månadsrapport — ' + new Date().toLocaleString('sv-SE', {month:'long', year:'numeric'}),
              labels: ['monthly-report'],
              body: report
            })
```

---

### `.github/scripts/monthly_report.py`

```python
import os, json, anthropic
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunReportRequest, Dimension, Metric, DateRange

# Auth
creds_json = os.environ["GOOGLE_APPLICATION_CREDENTIALS_JSON"]
with open("/tmp/sa.json", "w") as f:
    f.write(creds_json)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/tmp/sa.json"

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
    r = client.run_report(req)
    headers = [h.name for h in r.dimension_headers] + [m.name for m in r.metric_headers]
    rows = [[d.value for d in row.dimension_values] + [m.value for m in row.metric_values] for row in r.rows]
    return {"headers": headers, "rows": rows}

data = {
    "pages": run(["pagePath"], ["sessions", "bounceRate", "averageSessionDuration"]),
    "sources": run(["sessionDefaultChannelGroup"], ["sessions", "newUsers"]),
    "events": run(["eventName"], ["eventCount", "totalUsers"]),
    "devices": run(["deviceCategory"], ["sessions", "bounceRate"]),
}

# Skicka till Claude för analys
claude = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

prompt = f"""Du är en GA4-analytiker för efterplan.se.

Efterplans funnel: Organisk sökning → Landningssida → onboarding_start → plan_generated → task_completed

Här är GA4-data för de senaste 30 dagarna:
{json.dumps(data, ensure_ascii=False, indent=2)}

Producera en månadsrapport i exakt detta format:

# GA4 Månadsrapport

## Trafik
- Sessions: X
- Organisk andel: X%
- Top 3 landningssidor med bounce rate

## Funnel
- onboarding_start rate: X%
- plan_generated rate: X%
- Kritiskt drop-off: [steg om identifierbart]

## Prioriterade åtgärder
Lista max 3 åtgärder. För varje:
- Vilket problem den löser (data-driven)
- Exakt vilken fil/komponent som ska ändras
- Förväntad effekt

## Godkänn eller avvisa
- [ ] Åtgärd 1
- [ ] Åtgärd 2
- [ ] Åtgärd 3

Var konkret. Inga vaga rekommendationer."""

response = claude.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1500,
    messages=[{"role": "user", "content": prompt}]
)

with open("report_output.md", "w") as f:
    f.write(response.content[0].text)

print("Report generated.")
```

---

### `.lighthouserc.json`

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.80}],
        "first-contentful-paint": ["warn", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 3000}]
      }
    }
  }
}
```

---

## GitHub Secrets som behöver sättas

Gå till: `github.com/joju91/efterplan → Settings → Secrets → Actions`

| Secret | Värde |
|---|---|
| `GA4_PROPERTY_ID` | Ditt GA4 property-ID (siffror) |
| `GA4_SERVICE_ACCOUNT_JSON` | Innehållet i service account JSON-filen |
| `ANTHROPIC_API_KEY` | Din Anthropic API-nyckel |

---

## Jonas roll

| Trigger | Åtgärd |
|---|---|
| GitHub Issue: `⚠️ Weekly health check failed` | Läs loggen, godkänn fix |
| GitHub Issue: `📊 Månadsrapport` | Bocka av åtgärder du vill köra, kör i Claude Code |
| Inget Issue den 1:a | Allt fungerar — gör ingenting |

---

## Parkerat tills vidare

| Ticket | Villkor för aktivering |
|---|---|
| T032 Stripe | När trafiken motiverar betalvägg |
| T048 A/B-test pris | Kräver Stripe |
| T079 Byrålisting | Affärsbeslut av Jonas |
| T015/T016 Användarintervjuer | När organisk trafik >100 sessioner/månad |
