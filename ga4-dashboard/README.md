# Efterplan GA4 Dashboard

En enkel dashboard som hamtar data direkt fran Google Analytics 4 Data API.

## 1. Skapa GA4-behorighet

1. Skapa ett service account i Google Cloud.
2. Aktivera **Google Analytics Data API** i samma projekt.
3. Ladda ned JSON-nyckeln.
4. I GA4 for `efterplan.se`: ge servicekontot rollen **Viewer** pa property-niva.

## 2. Konfigurera

```bash
cd ga4-dashboard
copy .env.example .env
```

Fyll i i `.env`:
- `GA4_PROPERTY_ID` (numeriskt ID, t.ex. `123456789`)
- `GOOGLE_APPLICATION_CREDENTIALS` med absolut sokvag till JSON-nyckeln
- (valfritt) `PAID_PRICE_SEK` for intaktsestimat nar `purchaseRevenue` saknas

## 3. Starta

```bash
npm install
npm start
```

Oppna sedan:
- http://localhost:8787

## KPI-logik (T037)

Dashboarden visar fyra nyckeltal:
- `Conversion`: `Plan Completed / Plan Generated`
- `Trafik`: `sessions`
- `Intakt`: `purchaseRevenue` (fallback: `Purchases x PAID_PRICE_SEK`, default 149 kr)
- `Leads`: `Lead Submitted + lead_generated + Paywall CTA Clicked + paywall_hit`

## API-endpoints

- `GET /api/overview?days=30`
- `GET /api/kpis?days=30`
- `GET /api/timeseries?days=30`
- `GET /api/pages?days=30&limit=10`
- `GET /api/events?days=30&limit=10`

## Tips for produktion

- Behall dashboarden bakom inloggning/reverse proxy.
- Exponera aldrig service account-nyckeln i frontend.
- Satt credentials i miljo-variabler i stallet for lokal fil i prod.
