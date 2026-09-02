# arrange — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/arrange`
**Verifierat:** i browser (computed layout, träffytehöjd, console utan fel).

## Gjort

### Anti-pattern-kortet — "Så här går det till"
`.howto-grid` var fyra identiska kort (`border` + `border-radius` +
gradient-bakgrund + `padding`, alternerande sage/ember-toning) med
cirkelsiffra + `h3` + `p`. Exakt "identical card grid"-tellet.

→ Ombyggt till **numrerad stegsekvens**: kort-kromet borttaget
(`border`, `radius`, `background`, `padding` bort), bara en hårfin
`border-top` + siffran som ankare. Toning-varianterna (`--2`/`--4`)
tömda — lugnare. Grid: 1 kolonn mobil, `repeat(2, 1fr)` ≥ 640px
(var `auto-fit minmax(200px)` → 4 i rad, feature-strip-känsla).
Verifierat: `backgroundColor: transparent`, `padding: 2px 0 0`.

### H3 — footer-sitemapens träffytor
`.landing-footer-links` var en `<p>` med ~40 inline-länkar separerade av
`&nbsp;·&nbsp;`-text, **17 px** klickhöjd.

→ `display: flex; flex-wrap: wrap; font-size: 0` på behållaren
(kollapsar `·`-textnoderna), länkarna `display` som flöde med
`font-size: var(--fs-xs)` + `padding: 11px 12px` + `border-radius` +
hover-yta. **Träffytehöjd nu 39 px** (WCAG 2.5.8 AA-golv 24 px,
bekvämt ~44). Separatorerna försvinner visuellt utan HTML-ändring.
Tog bort en **duplicerad `.landing-footer-links`-regel** (rad ~2858)
som skrev över `font-size` tillbaka till `0.8rem`.

### P3 / P4 — plan-vyns flik-rad
Flik-raden var redan 2-nivåad (`.nav-plan-actions` = "Mitt konto" /
"Ändra svar"; `.plan-tabs` = vy-växlare) — critiquens "6 mål på en rad"
var något överdrivet. Kvarvarande skavank: **"🗂 Arkiv" hade en emoji**
som de andra tre flikarna saknade. Emojin borttagen → "Arkiv"
(konsekvent, matchar "inte lekfullt"-briefen).

### Cache-bust
`style.css?v=5` → `?v=6` (43 filer).

## Ej gjort — vidare

- **P1 — SEO-FAQ + landningsordning:** att kollapsa de 12 FAQ-blocken
  till `<details>`/`<summary>` (så sidan blir skannbar utan att tappa
  SEO) är en IA-omstrukturering med större risk — hänskjuts till
  `onboard`/eget pass. Landningens sektionsordning lämnad.
- **P3 — "Bouppteckning" som jämbördig flik med "Dokument":**
  bedömt acceptabelt (det är en egen arbetsyta).
- **`.u-*`-utility-klasserna** (rad ~2862, `#ddd`/`#eee` hårdkodat)
  används i 9 HTML-filer — kan inte tas bort här. → `polish`.

## Filer ändrade
- `style.css` — `.howto-grid`/`.howto-card`, `.landing-footer-links` (+ dedup)
- `index.html` — "🗂 Arkiv" → "Arkiv"
- 43 × `*.html` — `style.css?v=6`
