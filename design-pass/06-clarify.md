# clarify — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/clarify`
**Publik:** anhöriga i sorg, icke-tekniska, låg ork, ofta mobil. Mental
status: överväldigad, vill ha lugn och tydlighet.
**Verifierat:** i browser (copy live, console utan fel).

## Flera critique-fynd var falsklarm

- **P5 "vinglande stegetiketter":** källtexten är konsekvent "Steg X av 4".
  ALLA-VERSALER kommer från `.ob-label { text-transform: uppercase }` —
  ett enhetligt CSS-val, inte innehållsinkonsekvens. Enda avvikaren var
  steg 4:s suffix (se nedan).
- **"Döda länkar" ("Kontakt"/"Mitt konto" → `href="#"`):** fungerar.
  "Kontakt" sätter `href='mailto:...'` från `data-mail`/`data-domain` vid
  klick (spam-obfuskering). "Mitt konto" öppnar auth-modalen via
  `onclick`. Semantiskt vore `<button>` bättre för "Mitt konto" — men
  det är ett `normalize`/`polish`-jobb, inte copy.

## Gjort

### P5 — steg 4:s etikett konsekvent
`index.html` `#ob-step-4`:
- `<p class="ob-label">Steg 4 av 4 — helt frivilligt</p>` →
  `Steg 4 av 4` (renderades annars "STEG 4 AV 4 — HELT FRIVILLIGT",
  långt och skrikigt, bröt mönstret från steg 1–3).
- "Helt frivilligt." flyttat till hintens öppning, som samtidigt
  skrevs om aktivare: *"Helt frivilligt. Fyller du i det nu skriver vi
  in det åt dig i alla brev — annars fyller du i det för hand direkt i
  breven. Sparas bara lokalt…"* (var passivt "Vi fyller i det
  automatiskt…").

### Frivilligt-formuleringar samlade
`#ob-step-3`:
- "Frivilligt — du kan hoppa över detta." → **"Frivilligt. Du kan lägga
  till det senare."**
- "Frivilligt — du kan lägga till det senare." → samma (redan nära).
- Datum-hinten skrevs om aktivt: *"Då räknar vi ut bouppteckningsfristen,
  Skatteverkets frist och de andra tidsgränserna som riktiga datum åt
  dig. Utan datum visar vi ungefärlig text i stället."* (var
  "Så kan vi räkna ut … m.fl. som riktiga datum … annars visar vi …").

Steg 2:s "Vet du inte säkert? Hoppa bara vidare — du kan ändra senare."
lämnad — annat syfte (osäkerhet, inte frivillighet).

### Felmeddelanden — en form
`app.js` — 5 identiska generiska fel:
"Fyll i de obligatoriska fälten (märkta med *)." →
**"Fyll i alla fält markerade med *."** (kortare, standardsvenska
"markerade" i st.f. "märkta", parentesen borta). De specifika felen
("Fyll i ditt namn och din e-post.", "Ange den avlidnes namn.",
"Lägg till minst en tjänst med namn.") lämnade — de är redan bra.

### Cache-bust
`app.js?v=26` → `?v=27`.

## Ej gjort — vidare

- **"Mitt konto" `<a href="#">` → `<button>`** — semantik, inte copy.
  → `polish`.
- **P2 "Fler steg visas här"** (plan-vyns tomma lägen) — struktur, inte
  bara ordval. → `onboard`.

## Filer ändrade
- `index.html` — steg 3–4-copy, `app.js?v=27`
- `app.js` — 5 felmeddelanden
