# optimize — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/optimize`
**Verifierat:** i browser (network, console utan fel, progress-bar via
transform, `gtag` odefinierad).

## M4 — app.js på innehållssidor: **icke-problem**

Bara `index.html` laddar `app.js`/`supabase-client.js`. De 42
innehållssidorna gör det redan **inte** — auditens browserkoll såg
`app.js` för att den bara kördes på `index.html`. Inget att göra.

`style.css` (86 KB) laddas på alla sidor och behövs (delat designsystem).
Minifiering skulle hjälpa men repot har medvetet **ingen byggkedja**
(`package.json`: "The static site itself has no build step") — hoppar det.

## M3 — Google Analytics → Plausible (alla sidor)

Nytt skript `scripts/swap-analytics.mjs`:
- Tog bort gtag-blocken (två varianter: lazy-loaded på `index.html`,
  standard `async src` på innehållssidorna) från **41 filer**.
- Lade in Plausible-taggen (`script.outbound-links.js`, cookielöst, ~1 KB)
  på alla 41 — tidigare bara `index.html`, så innehållssidorna
  (SEO-trafiken!) hade tappat mätning annars.

Följdändringar:
- `arvskifte-mall.html` + `gratis-checklista-abonnemang.html` hade
  7 `gtag('event', …)`-anrop i onclick/inline-script → nu
  `window.plausible && window.plausible('<event>', { props: … })`
  (guardat, kraschar inte om skriptet blockeras).
- `app.js` `track()` — tog bort den döda gtag-grenen (den kollade redan
  `typeof window.gtag === 'function'`, så inget bröts; nu ren Plausible).

Verifierat: `typeof window.gtag === "undefined"`, `window.plausible`
finns, inga `googletagmanager`-requests, inga console-fel.

## M7 — layout-animationer → GPU

`.ob-progress-bar-fill` och `.progress-bar-fill` animerade `width`
(reflow varje frame). → `width: 100%` + `transform: scaleX(0)` +
`transform-origin: left` + `transition: transform`. JS uppdaterat på
2 ställen (`app.js:274`, `:1463`): `style.width = pct+'%'` →
`style.transform = 'scaleX(' + andel + ')'`. Verifierat: onboardingens
bar går till `scaleX(0.5)` vid steg 3.

`.skip-link { transition: top 0.15s }` lämnad — engångsreveal på Tab,
inte repeterad/scroll-driven; låg vinst, viss risk att byta.

## Bonus — clarify P5-läcka stängd

`obGoTo()` byggde om `.ob-label` på varje steg och **la tillbaka**
`' — helt frivilligt'` för steg 4 i JS (min HTML-fix i steg 6 räckte
inte). Suffixet borttaget även i `app.js`. Verifierat: steg 4 visar
"Steg 4 av 4".

## Ej gjort
- **L4** — `favicon.png` och `icon-512.png` identiska 11,5 KB. Kräver
  ombildning av assets, utanför scope. Noteras.

## Cache-bust
`style.css?v=6`→`?v=7` (41), `app.js?v=27`→`?v=28`.

## Filer ändrade
- 41 × `*.html` — gtag bort, Plausible in, `?v`-bump
- `arvskifte-mall.html`, `gratis-checklista-abonnemang.html` — 7 event-anrop
- `app.js` — `track()` rensad, 2 progress-bar-uppdateringar, label-suffix
- `style.css` — 2 progress-bar-regler
- `scripts/swap-analytics.mjs` — nytt
