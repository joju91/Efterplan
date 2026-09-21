# Efterplan — 2026-09-21

🔢 Sessions: GA4 SAKNAS — hoppar över DEL 1 (credentials ej tillgängliga i molnsandlådan)

🔧 Uptime: ej verifierbar via molnsandlåda (proxyrestriktion 403) | Sårbarheter: 0 | Brutna länkar: ej testat (körs av weekly-health.yml måndag 08:00 UTC)
   - `package.json` engine `">=18"` stämmer ej — `@supabase/*` 2.112.3 kräver `>=22.0.0` (fil: `package.json`)
   - `package-lock.json` stale: `@supabase/supabase-js` 2.112.3 → 2.116.0, `stripe` 22.5.0 → 22.6.2 (fil: `package-lock.json`)

📣 Ads-kampanjen är byggd men ej lanserad — konkret åtgärd denna vecka: Owner kör dashboard-stegen 1–4 i `ADS-LAUNCH-A.md` för att få Plausible-mål och UTM-tracking på plats innan kampanjen aktiveras.

🎫 Nya tickets: T261 – package.json engine-field felaktig | T262 – package-lock.json inaktuell

## Roadmap-status

| Klara | Pågår | Ej startade |
|-------|-------|-------------|
| 190   | 11    | 50+         |

**Pågår (urval):** T015 (användarintervjuer), T016 (stegordning), T032 (köpflödestest), T034 (Bokio/Fortnox), T047 (drop-off analys), T060 (push-notiser — ej mergad till main), T079 (betald byrålisting), T081 (drop-off + top-3)

**Nästa öppna:** T001 (läs Manifest), T003 (bolag), T004 (bankkonto)

## Öppna tickets från förra veckan

| T258 | vad-gora-nar-nagon-dor.html saknas i Lighthouse CI | ☐ |
| T259 | gratis-checklista-abonnemang.html saknas i Lighthouse CI | ☐ |
| T260 | 101 inline onclick= blockerar CSP-förstärkning | ☐ |

## Kodfynd DEL 2

```
=MISSING META=
./auth-modal.html  ← känd false positive (T100): body-fragment, inlines i index.html

=TODOS=
(inga TODOs/FIXMEs hittades)

=GA4/PLAUSIBLE EVENTS (app.js)=
rad 149: track('premium_activated')
rad 243: track('onboarding_start')
rad 328: track('onboarding_step', { step })
rad 375: track('checkbox_toggle', { key })
rad 391: track('plan_generated', ...)
rad 406: track('reminder_optin')
rad 1124: track('deadline_dates_computed')
rad 1175: track('note_saved', ...)
rad 1328: track('preview_cta_clicked')

=VULNS (ga4-dashboard)=
{'info': 0, 'low': 0, 'moderate': 0, 'high': 0, 'critical': 0, 'total': 0}

=OUTDATED (root)=
@supabase/supabase-js: lock 2.112.3 → latest 2.116.0 (^ tillåter uppdatering)
stripe: lock 22.5.0 → latest 22.6.2 (^ tillåter uppdatering)
```

## Auto-tickets 2026-09-21

| ID | Task | Fil | P |
|----|------|-----|---|
| T261 | `package.json` engine `">=18"` stämmer ej — `@supabase/*` 2.112.3 kräver `>=22.0.0` | `package.json` | 🟠 |
| T262 | `package-lock.json` stale: supabase 2.112.3→2.116.0, stripe 22.5.0→22.6.2; kör `npm install` | `package-lock.json` | 🟡 |

## Push-status

Commit: `Veckorapport 2026-09-21: auto-tickets T261–T262 + status`
Branch: `main`
