# Designgenomgång Efterplan — logg

Branch: `design-pass` (från `main` @ 65287ca)
Plan: `.claude/plans/planera-f-r-k-rning-av-curried-map.md`

| # | Skill | Modell | Commit | Kostnad | Sammanfattning |
|---|-------|--------|--------|---------|----------------|
| 0 | teach-impeccable | Sonnet 5 | a0cc618 | ~$1 | Design context → `.impeccable.md` + `CLAUDE.md` |
| 1 | audit | Sonnet 5 | d562dcd | ~$3 | `01-audit.md` — 1 Critical, 4 High, 10 Medium, 4 Low |
| 2 | critique | Sonnet 5 | _pågår_ | ~$3 | `02-critique.md` — 5 prioriterade UX-problem, PASS på anti-patterns |

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
