# normalize — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/normalize`
**Verifierat:** i browser (canvas-resolverad kontrast, nav vid scroll,
console utan fel, färsk flik på innehållssida).

## Gjort

### C1 (Critical) — landing-navets bakgrund
`style.css` `#screen-landing .nav` fick `background: var(--paper)` +
`border-bottom: 1px solid var(--rule)`. Sticky-navet kolliderar inte längre
med brödtext vid scroll. Verifierat visuellt (före/efter).

### H1 (High) — accentpaletten upp till WCAG 2.2 AA
`style-tokens.css` (nu dokumenterad som **sanningskälla**):

| Token | Före | Efter | Kontrast efter |
|-------|------|-------|----------------|
| `--ink-teal` (`--accent`) | `oklch(58% 0.07 150)` | `oklch(46% 0.10 150)` | 5.9:1 mot papper · 5.9:1 vit-på (knapp) |
| `--ink-teal-dk` | `oklch(50% 0.075 150)` | `oklch(40% 0.10 150)` | 7.6:1 — hover + fokusring |
| `--ink-teal-tn` | `oklch(91% 0.03 150)` | `oklch(93% 0.03 150)` | dekorativ tonad yta |
| `--ember` | `oklch(60% 0.08 50)` | `oklch(48% 0.11 45)` | 5.9:1 mot papper |
| `--ember-dk` | `oklch(50% 0.085 50)` | `oklch(42% 0.11 45)` | 7.7:1 |
| `--green` | `oklch(50% 0.09 150)` | `oklch(46% 0.10 150)` | matchar accent |
| `--rule` | `oklch(86% 0.022 80)` | `oklch(84% 0.022 80)` | mjuk, dekorativ |
| **`--rule-strong`** | `oklch(78% 0.028 80)` (1.7:1) | `oklch(62% 0.04 80)` | **3.2:1 — 1.4.11** |

Uppmätt efter ändring: FAQ/artikel-länkar 3.6 → **5.9:1**, primärknappens
etikett 4.16 → **5.9:1**, integritetsbadge 3.8 → **8.5:1**.

Formulärkontrollers ram → `--rule-strong` (WCAG 1.4.11): `.text-input`,
`.ob-text-input`, `.task-notes`, `.task-date-input`, `.notify-new-input`,
`.bill-input`.

### H4 (High) — skiplänk på innehållssidorna
Nytt skript `scripts/add-skip-link.mjs` (samma mönster som
`scripts/seo-patch.mjs`). Körde → **40 innehållssidor** fick
`<a href="#main" class="skip-link">Hoppa till innehållet</a>` direkt efter
`<body>` + `id="main"` på `<main class="seo-main">`. WCAG 2.4.1.

### M1 — ett token-lager
`style-tokens.css` fick ny header: den är sanningskälla, ändra tokens där,
inte i `style.css` :root. Kontrasttabell inlagd som referens. Lade till
`--focus-ring`-token.

### M2 — one-off-färger → tokens
`style.css`: `#a3312a`→`var(--red)`, `#2f6b4f`→`var(--green)`,
`#92400E`→`var(--ember-dk)`, grön ruta `#EBF5EE`/`#C3DFC9`→`var(--green-bg)`
+ `color-mix(--green)`, `#F4F4F2`→`var(--paper-soft)`, locked-check
`#DDD`/`#CCC`→`var(--paper-soft)`/`var(--rule-strong)`. Nytt token `--green-bg`.

### M9 — en fokusregel
Två krockande `:focus-visible` (rad ~106: 3px accent; rad ~2818: 2px ember)
→ **en** regel högst upp: `outline: 3px solid var(--focus-ring); outline-offset: 2px`.

### L2 (delvis) — cache-bust
Alla 41 HTML: `style.css?v=3`→`?v=4`, `style-tokens.css?v=5`→`?v=6`.

## Ej gjort — vidarebefordrat

| Fynd | Varför uppskjutet | Till |
|------|-------------------|------|
| M6 — `<div role="main">` → `<main>` på `index.html` | SPA:t har landmark på en av flera `.screen`; kräver JS-koordination + CSS-selektorändringar (`#screen-plan[role=main]`). Regressionrisk utanför normalize scope. | `harden` |
| M8 — brytpunktssystem (420/480/601/720/1024) | Att skriva om alla `@media` är invasivt; bättre som eget pass. | `adapt` |
| M10 — 43 inline `style=` på `index.html`, `<style>`-block i 2 filer | Bulk-städning, hög regressionrisk, passar slutpasset. | `polish` |
| P4 — emoji (🗂🔒🟢) → stylade prickar/ikoner | Kräver ikon-språk-beslut + markup-ändringar i flera filer. | `polish` |
| Kvarvarande `color: #fff` på knappetiketter | Korrekt som det är (mörk knappyta), inget AA-problem. | — |

## Filer ändrade

- `style-tokens.css` — palett, header, `--rule-strong`, `--green-bg`, `--focus-ring`
- `style.css` — nav-bg, fokusregel (×2 block → 1), form-ramar, one-off-färger
- 40 × `*.html` — skiplänk + `id="main"`
- 41 × `*.html` — `?v=`-bump
- `scripts/add-skip-link.mjs` — nytt
