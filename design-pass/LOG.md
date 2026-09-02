# Designgenomgång Efterplan — logg

Branch: `design-pass` (från `main` @ 65287ca)
Plan: `.claude/plans/planera-f-r-k-rning-av-curried-map.md`

| # | Skill | Modell | Commit | Kostnad | Sammanfattning |
|---|-------|--------|--------|---------|----------------|
| 0 | teach-impeccable | Sonnet 5 | a0cc618 | ~$1 | Design context → `.impeccable.md` + `CLAUDE.md` |
| 1 | audit | Sonnet 5 | d562dcd | ~$3 | `01-audit.md` — 1 Critical, 4 High, 10 Medium, 4 Low |
| 2 | critique | Sonnet 5 | a1abcee | ~$3 | `02-critique.md` — 5 prioriterade UX-problem, PASS på anti-patterns |
| — | GRIND | — | — | onboard=JA · analytics: ta bort GA behåll Plausible · ordning: normalize först · security-review flyttad till slutet (design-pass har ej T244-koden) |
| 4 | normalize | Sonnet 5 | db5b699 | ~$6 | `04-normalize.md` — C1+H1+H4+M1+M2+M9+L2 fixade; M6/M8/M10/P4 vidare |
| 5 | harden | Sonnet 5 | 98929e0 | ~$4 | `05-harden.md` — H2 (bopp aria-labels), L1 (esc numeriska), M6 (landmarks); H2/L1 mest falsklarm |
| 6 | clarify | Sonnet 5 | a433ea1 | ~$3 | `06-clarify.md` — steg 4-etikett, frivilligt-formuleringar, 5 felmeddelanden; P5/döda länkar mest falsklarm |
| 7 | typeset | Sonnet 5 | d32d83b | ~$3 | `07-typeset.md` — ob/plan-rubriker in i Fraunces-systemet, near-dup-storlekar konsoliderade |
| 8 | arrange | Sonnet 5 | 2f6113b | ~$4 | `08-arrange.md` — howto avkortat, footer-träffytor 17→39px, Arkiv-emoji bort; P1 vidare |
| 9 | optimize | Sonnet 5 | c06ab65 | ~$5 | `09-optimize.md` — GA→Plausible (41 sidor), progress-bars→transform; M4 icke-problem |
| 10 | onboard | Sonnet 5 | _pågår_ | ~$4 | `10-onboard.md` — P1 "Fortsätt din plan" (retur-lucka), P2 "Fler steg"-taggen var felaktig |

## Steg 0 — teach-impeccable

Beslut från Jonas:
- **Token-sanningskälla:** `style-tokens.css` (2026-redesign, oklch soft sage + varm sand).
- **WCAG:** 2.2 AA som golv.
- **Dark mode:** nej, bara ljust läge.
- **Anti-referenser:** undvik (1) generisk AI/SaaS, (2) kliniskt/kallt, (3) lekfullt/pigg.

Skapade filer: `.impeccable.md`, `CLAUDE.md` (fanns inte tidigare).
Nyckelfynd under utforskning: två krockande token-lager (`style.css` hex ink-teal
vs `style-tokens.css` oklch sage) — normalize-steget ska räta upp detta.

## Steg 1 — audit

Rapport: `design-pass/01-audit.md`. Statisk granskning + körning i browser
(Chromium 375px & 1265px), canvas-resolverade kontrastmätningar.

Huvudfynd:
- **C1 (Critical):** `#screen-landing .nav { background: transparent }` + sticky
  → nav-text ovanpå brödtext vid scroll på `index.html`. Verifierat visuellt.
- **H1 (High):** 2026-sage-paletten under WCAG AA — `--accent`/paper 3,6:1,
  vit/primärknapp 4,16:1, `--ember`/paper 3,5:1, `--rule` 1,3:1.
- **H2:** ~22 formulärkontroller utan programmatisk etikett (placeholder-only).
- **H3:** footer-länkar 17–18px höga (AA 2.5.8 kräver 24px).
- **H4:** skip-länk saknas på 42 statiska sidor.
- Anti-patterns: PASS (ej AI-slop). Brödtextkontrast utmärkt (15:1).

Visuell bevisning: skärmdumpar inline i sessionen (nav-overlap 375px + 1265px,
hero mobil, FAQ).

## Steg 2 — critique

Rapport: `design-pass/02-critique.md`. Genomgång i browser av startsida, hela
onboarding-flödet (steg 1–4) och plan-vyns tomma läge.

Huvudfynd:
- **P1:** startsidan optimerad för Google, inte för användaren i kris —
  lång skroll (12 FAQ + 43-länkars sitemap), ingen "Fortsätt din plan".
- **P2:** "Fler steg visas här" är ett dött tomt läge i plan-vyn.
- **P3:** nav-överlast i plan-vyn (6 mål, blandade nivåer).
- **P4:** emoji som ikoner (🗂🔒🟢) krockar med den redaktionella tonen.
- **P5:** stegetiketterna vinglar ("Steg 1 av 4" vs "STEG 2 AV 4").
- **Fungerar:** microcopy/röst, onboardingens åtagandekurva, trafikljus-systemet,
  kvarhållningslöftet. Anti-patterns: PASS.
- **Rekommendation:** kör `onboard` (motiverat av P1+P2).
