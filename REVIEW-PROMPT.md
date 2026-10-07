# Granskningsprompt — Efterplan

**Granska Efterplan. Ändra inget. Rapportera bara fynd, inga sammanfattningar av det som fungerar.**

## Arbetssätt (spara tokens)

- Sök med grep/glob först och läs bara de relevanta delarna av filerna, inte hela filer.
- Gå igenom ett område i taget i ordningen nedan.
- Ta inte med fynd du inte kan belägga med fil:rad.
- Hoppa över `node_modules`, bilder och minifierade filer.

## Områden (i prioritetsordning)

1. **Säkerhet:** `api/` – Stripe-webhooks (signatur, idempotens), Supabase (RLS, nycklar i frontend), indatavalidering, `innerHTML`/XSS, hemligheter i koden.
2. **Buggar:** JS-fel, trasiga länkar, localStorage-problem, kantfall.
3. **Knappar:** döda knappar eller sådana som gör fel sak, dubbelklick, saknad fel- eller laddningsrespons, träffytor < 44px.
4. **Flödet:** start → onboarding → checklista → brev → betalning på 375px. Återvändsgränder? Går det alltid att backa?
5. **UI/UX:** en handling per vy, konsekvens med `style-tokens.css`, WCAG 2.2 AA.
6. **Otydligheter:** oförklarad jargong, vaga knappetiketter, felmeddelanden utan nästa steg.

## Format, en rad per fynd

`[KRITISK|VIKTIG|LITEN] fil:rad – problem → åtgärd`

Användaren är sörjande, stressad och på mobil. Bedöm allt utifrån det.
