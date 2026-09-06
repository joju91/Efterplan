# harden — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/harden`
**Verifierat:** i browser (console utan fel, landmark-räkning, bopp-rader
renderade och inspekterade).

## Vad som visade sig — auditens H2/L1 var delvis falsklarm

Audit-browserkollen räknade "~22 fält utan etikett" för att heuristiken
bara letade `<label for>` / `aria-label`, **inte omslutande `<label>`**.

- **Onboarding steg 1–4:** alla kryssrutor sitter i omslutande
  `<label class="ob-check">`, alla textfält har redan `aria-label`
  ("Den avlidnes förnamn…", "Dödsdatum"). **Inget WCAG-fel.**
- **Räkningsfälten** (`bill-desc-input`, `bill-amount-input`) har redan
  `aria-label` i HTML. Dolda filinputs (`doc-photo-input`,
  `bill-photo-input`) är `hidden` och triggas via knappar med
  `aria-label` — accepterat mönster.
- **Brevgeneratorn (L1):** bygger brev som ren sträng och renderar via
  `doc-output-text.textContent` + `mailto` via `encodeURIComponent`.
  **Ingen injektionsyta.** Uppgiftsbeskrivningar med `<strong>`/`<br>`
  som renderas via `innerHTML` är statiskt författarinnehåll, inte
  användardata.

## Gjort

### H2 — de faktiskt oetiketterade fälten (JS-genererade)
`app.js` — bouppteckningens rad-byggare (`boppRowDelbagare`,
`boppRowTillgang`, `boppRowSkuld`) hade `placeholder` men ingen etikett.
Lagt `aria-label` på alla 8 kontroller:

| Fält | aria-label |
|------|-----------|
| delägare namn | "Dödsbodelägarens namn" |
| delägare roll (select) | "Roll i dödsboet" |
| tillgång beskrivning | "Tillgångens beskrivning" |
| tillgång värde | "Tillgångens värde i kronor" |
| skuld borgenär | "Borgenär — vem skulden gäller" |
| skuld belopp | "Skuldens belopp i kronor" |
| ta bort-knappar | "Ta bort delägare / tillgång / skuld" (var "Ta bort") |

### L1 — härdning av bopp-radernas `value=`-interpolation
`value="${item.varde||''}"` / `${item.belopp||''}` var **oescapade**
(numeriska, låg risk, men matas från `localStorage` / delad plan som kan
manipuleras). Nu `value="${_esc(String(item.varde||''))}"`. Text­fälten
använde redan `_esc()`.

### M6 — landmarks
`index.html` SPA:t hade `role="main"` bara på `#screen-plan`. När
`#screen-landing` var aktiv fanns ingen main-landmark alls. Lagt
`role="main"` på `#screen-landing`, `#screen-onboarding`, `#shared-view`
så varje skärm har en main när den är aktiv. `.screen{display:none}`
tar bort inaktiva ur tillgänglighetsträdet → **exakt 1 synlig main**
åt gången (verifierat: `visibleMainCount: 1`). axe ignorerar
`display:none`-landmarks, så regeln "en main" hålls.

### Cache-bust
`app.js?v=25` → `?v=26`.

## Bedömt acceptabelt som det är

- **M5 — dubbla `<h1>`** (`index.html` rad 155 landing + 1168
  `#shared-view`): båda skärmarna är `display:none` utom den aktiva, så
  bara ett `<h1>` ligger i tillgänglighetsträdet åt gången. Inget fel.
- **Onboarding-grupprubriker** ("Juridiskt/Bostad/Övrigt" som `<p>`):
  kryssrutorna har fullständiga tillgängliga namn; grupprubrikerna läses
  i läsordning. `role="group"`+`aria-labelledby` vore en förbättring men
  bär layoutrisk på ett fungerande flöde — hänskjuts som frivillig
  senare finputsning.

## Filer ändrade
- `index.html` — `role="main"` ×3, `app.js?v=26`
- `app.js` — 8 `aria-label` på bopp-rader, `_esc(String())` på numeriska värden
