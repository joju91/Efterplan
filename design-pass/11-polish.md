# polish — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/polish`
**Kvalitetsnivå:** flaggskepp (live-sajt, känslig målgrupp) — men kirurgiskt,
sista av 8 skills, inga regressioner.
**Verifierat:** i browser (hela flödet, console utan fel, ingen horisontell
scroll @375px, kontrast).

## Gjort

### Fokusring — helt konsekvent
`.task-card[tabindex="0"]:focus-visible` var `2px solid var(--accent)` —
sista komponent-överskrivningen som avvek. Nu `3px solid var(--focus-ring)`
som den globala regeln. En fokusstil i hela appen.

### `--bg-secondary` — odefinierad var med hårdkodad fallback
`background: var(--bg-secondary, #f7f7f5)` och `#f0f0ed` (2 ställen:
`.arkiv-*`, `.section-coming-tag`) → `var(--paper-soft)` (definierad,
varmtonad). Sista M2-resten i den synliga UI:n.

### reduced-motion — bredare hover-nollställning
`@media (prefers-reduced-motion)` nollställde bara `.btn-primary:hover`s
`transform`. Utökat till `.btn-large`, `.task-card`, `.howto-card`, `a`
på hover. (Blanket-regelns `transition-duration: .001ms` neutraliserade
redan rörelsen; detta är hängslen och livrem.)

### Cache-bust
`style.css?v=9` → `?v=10` (41 filer).

## Medvetet **inte** gjort — kräver eget beslut/uppdrag

### P4 — emoji som ikonografi (systemiskt)
Emoji används genomgående som funktionella glyfer: dokumentikoner
(🏦 📰 🛡 🏛 📋 ✉ 📞), integritetsbadges (🔒 🖥 📤 👤), trafikljus
(🟢 🟡 🔴), lås (🔒), kamera (📷), gnista (✨), bockar (✓), stäng (✕).
**25+ anropsställen** i `index.html` + `app.js`-mallar.

Att byta allt är ett eget projekt: kräver ett ikon-beslut (custom
SVG-set / bibliotek / behåll emoji) från Jonas, sedan utbyte + omstyling.
Att byta *halva* vore sämre än att låta bli. Arkiv-fliken (`🗂 Arkiv`)
togs redan i `arrange`. **Rekommendation: eget uppdrag.** (spawn_task
skapat.)

### M10 — inline `style=` + `.u-*`-utility-klasser
43 inline `style=` på `index.html`, egna `<style>`-block i 2 filer,
`.u-*`-klasser med `#ddd`/`#eee` hårdkodat (används i 9 HTML-filer).
Mekaniskt stort, regressionrisk över många filer — eget städuppdrag,
inte finputs. (spawn_task skapat.)

## Filer ändrade
- `style.css` — fokusring, `--bg-secondary`→`--paper-soft` ×2, reduced-motion
- 41 × `*.html` — `style.css?v=10`
