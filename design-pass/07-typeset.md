# typeset — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/typeset`
**Verifierat:** i browser (computed font-family/size, skärmdump onboarding,
console utan fel).

## Bedömning

**Innehållssidornas typografi (`.seo-article`) är redan förstklassig** —
Fraunces variabel med `opsz`/`SOFT`/`wght`-axlar, numrerade `h2`
(`decimal-leading-zero` + ember-linje), brödtext `line-height: 1.78`,
`max-width: var(--measure)` (62ch), `text-wrap: balance` på `h1`.
Ingen ändring behövd. Det här är mönstret att rikta resten mot.

**Svagheten:** de två skärmar där en sörjande faktiskt *arbetar* —
onboarding och plan-vyn — hade **generiska fet-sans-rubriker** medan
marknadsförings- och SEO-sidorna fick den omsorgsfulla Fraunces-behandlingen.
Precis critique-frågan: "tröstar det visuella systemet, eller håller det
sig bara undan?" Svar: på app-skärmarna höll det sig undan.

## Gjort

### Onboarding + plan-rubriker in i Fraunces-systemet
`style.css`:

| Selektor | Före | Efter |
|----------|------|-------|
| `.ob-title` | `clamp(1.7rem,4vw,2.4rem)`, `font-weight:700`, `letter-spacing:-0.5px`, **sans** (fallback) | `var(--font-display)`, `font-variation-settings: 'opsz' 60,'SOFT' 40,'wght' 460`, `var(--fs-2xl)`, `line-height:1.15`, `letter-spacing:-0.02em`, `text-wrap:balance` |
| `.plan-title` | `1.8rem` fast, `font-weight:700`, **sans** | `var(--font-display)`, `'opsz' 48,'SOFT' 40,'wght' 460`, `var(--fs-xl)`, `line-height:1.2`, `text-wrap:balance` |

Nu renderas "Vem har gått bort?" och "Din plan" i samma varma
editorial-serif som startsidan och guiderna (verifierat: `fontFamily:
Fraunces`, skärmdump). Storlekarna sitter på `--fs-*`-skalan
(fluid) i stället för godtyckliga fasta värden. Underrubrik/hint
(`.ob-hint`, `.plan-sub`) lämnade som sans brödtext — korrekt roll.

### Konsoliderat near-duplicate-storlekar (app-UI)
`style.css` hade ~20 distinkta hårdkodade sub-`1rem` `font-size` —
`0.82`/`0.83`/`0.86`/`0.85` osv. är visuellt omöjliga att skilja men
signalerar olika avsikt. Kollapsade de osynliga dubbletterna:
`0.82`/`0.83`/`0.86rem` → `0.85rem`, `0.78rem` → `0.8rem`,
`0.68rem` → `0.7rem` (~20 förekomster, 5 storlekar borta). Rendering
oförändrad (< 0.5px skillnad).

### Cache-bust
`style.css?v=4` → `?v=5` (41 filer).

## Ej gjort — vidare

- **Kvarvarande app-UI-storlekar** (`0.88`/`0.9`/`0.92`/`0.95`/`0.97rem`
  m.fl.) sitter fortfarande utanför `--fs-*`-tokens. En full mappning till
  `--fs-xs`/`--fs-sm` är mekaniskt stor med layoutrisk — lämnas som
  finputsning. → `polish` / framtida token-arbete.
- **`px`-glyfer** (`font-size: 11/12/14px` på `::before` med `content:'✓'/'–'`)
  — avsiktligt fasta ikon-glyfer i fasta rutor. Lämnade.

## Filer ändrade
- `style.css` — `.ob-title`, `.plan-title`, near-dup-storlekar
- 41 × `*.html` — `style.css?v=5`
