# Efterplan — 2026-10-26

🔢 Sessions: – | Organisk: – | Onboarding: – | Plan: –
_GA4 SAKNAS — connector ej ansluten i molnsandlådan. Hoppar över DEL 1._

🔧 Uptime: ej mätbar (sandbox proxy 403) | Sårbarheter: 0 (ga4-dashboard ren)
   - `auth-modal.html` saknar `<meta name="description">` — känd falskt positiv, åtgärdad via `X-Robots-Tag: noindex` i `vercel.json` (T274 ✔)
   - `stripe` latest 23.0.1 vs package.json `^22.1.1` (lock 22.6.2) — major-uppgradering pågår i T275 ☐

📣 Senaste fonts-PR (#163) säkrar typografikedjan på alla guidesidor; nästa värdedriv är att ta T275 (stripe 23-uppgradering) och T295 (verifieringsplan nu att T294 är klar) vidare.

🎫 Nya tickets: inga — alla granskningsfynd har befintliga ☐-tickets.

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| – | Inga automatiska ändringar gjorda denna körning | – | – |

---

## DEL 1 — GA4

GA4 SAKNAS — hoppar över DEL 1. Anslut en GA4-connector i projektet för att aktivera traffik-mätning.

---

## DEL 2 — Kodaudit

```
=MISSING META=
auth-modal.html  ← känd falskt positiv (body-fragment, ingen <head>; T274 ✔ via X-Robots-Tag)

=TODOS=
(inga)

=GA4 EVENTS=
app.js:184  track('premium_activated')
app.js:287  track('onboarding_start')
app.js:372  track('onboarding_step', { step })
app.js:430  track('checkbox_toggle', { key })
app.js:446  track('plan_generated', ...)
app.js:1150 track('deadline_dates_computed')
app.js:1201 track('note_saved', ...)
app.js:1358 track('preview_cta_clicked')
app.js:1759 track('bill_added')

=VULNS (ga4-dashboard)=
{'info': 0, 'low': 0, 'moderate': 0, 'high': 0, 'critical': 0, 'total': 0}  ← ren 🟢

=OUTDATED (root)=
@supabase/supabase-js  MISSING  2.118.0  2.118.0   (serverless-dep, ej installerad i sandbox)
stripe                 MISSING   22.6.2   23.0.1   ← major bump; T275 ☐ öppen
```

**Uptime:** ej mätbar — sandbox-proxy returnerar 403 Forbidden mot efterplan.se. Kontrollera manuellt på https://efterplan.se.

---

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 236 |
| ⧖ Pågår | 13 |
| ☐ Ej startade | 34 |

**Pågår (urval):**
- T015 Validera stegordning med 2–3 anhöriga
- T016 Justera ordning/text baserat på intervjuer
- T032 Testa fullständigt köpflöde
- T060 Push-notiser (koden finns bara på ohopslagen branch `origin/codex/t060-checkpoints`)
- T081 Analysera drop-off + prioritera topp 3

**Nästa öppna:**
- T001 Läs hela Manifest-bladet och bekräfta scope
- T003 Registrera företag / enskild firma + ansök om F-skatt
- T004 Öppna företagskonto (Lunar / Swedbank / Revolut Business)

**Observandum:** T295 ("Verifiera efter T294") har status ☐ "Väntar på T294" — men T294 är nu ✔. T295 är upplåst och kan påbörjas.

---

## DEL 4 — Auto-tickets

Inga nya tickets skapade denna körning. Alla granskningsfynd har befintliga öppna tickets:
- `stripe 23.0.1` → T275 ☐
- `auth-modal.html` meta → T274 ✔ (löst)

---

## DEL 5 — GitHub Issues

Inga nya issues skapade (inga nya tickets).

---

## Sammanfattning

- **Tickets skapade:** 0
- **Push:** roadmap.md oförändrad (inga auto-tickets) — veckorapporten committad och pushad
- **Issues:** inga nya
- **Rapport:** `veckorapport-2026-10-26.md`
