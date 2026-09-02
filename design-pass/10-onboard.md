# onboard — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/onboard`
**"Aha"-ögonblick:** användaren ser sin **personliga checklista** — "det
här är precis vad jag ska göra, i ordning, och jag slapp lista ut vad som
är viktigt". Publik: nybörjare i kris, engångsanvändning, lite tid.
**Verifierat:** i browser (plan genererad, tag-tillstånd, retur-flöde,
console utan fel, skärmdump).

## P1 — returnerande läge: mest redan löst, en lucka täppt

`init()`-IIFE:n **auto-återställer** redan en returnerande användare
rakt till plan-vyn (`if (saved) { … showScreen('screen-plan'); return; }`).
En besökare med sparad plan ser alltså aldrig startsidan — critiquens
"hero säger fortfarande 'Börja här'" gällde bara en kant: när man
**klickar loggan** på plan-vyn (`goToLanding()`) för att gå "hem".

→ `goToLanding()` visar nu en sekundär **"Fortsätt din plan →"**
(`.btn-ghost`, auto-bredd, bredvid "Börja här") när
`localStorage['efterplan_state']` finns. Ny `resumePlan()` bygger upp
planen från localStorage om den inte redan ligger i minnet, och visar
plan-vyn. Verifierat: knappen döljd som default (`hidden`-attribut),
syns efter `goToLanding()` med sparad plan, `w: 166px`.

## P2 — "Fler steg visas här" var en **felaktig etikett**, inte ett tomt läge

Kollen visade: med en riktig genererad plan har "Denna vecka" **10
uppgifter** och "Senare" **6** — ändå stod pillret "Fler steg visas här"
kvar (statiskt i markup, alltid synligt). Den sa alltså emot uppgifterna
som redan stod där.

→ Två fixar:
1. Copy: "Fler steg visas här" → **"Fylls på efterhand"** (×2) — säger
   något om det progressiva upplägget i stället för att låta som en
   trasig platshållare.
2. `renderPlan()` döljer nu taggen (`el.hidden = true`) när sektionen
   har fler än 1 uppgift. Den syns bara när sektionen faktiskt är gles
   — då är den ett ärligt "det kommer mer"-tips.

Verifierat: med 7/10/6-uppgifters plan är båda taggarna `hidden: true`.

## Filer ändrade
- `index.html` — `#landing-continue`-knapp i hero, "Fylls på efterhand" ×2
- `app.js` — `goToLanding()` (visa continue), ny `resumePlan()`,
  `renderPlan()` (toggla coming-tag)
- `style.css` — `#landing-continue.landing-continue` (auto-bredd, spacing)
- 41 × `*.html` — `style.css?v=9`; `app.js?v=29`
