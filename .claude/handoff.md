# Session Handoff — 2026-04-29

**Projekt:** Efterplan
**Branch:** main (deployat skarpt via Vercel)
**Sessionens huvudmål:** Applicera redesign (varmare palett + mjukare ton) på publik sajt, fixa SEO för "fonus"-sökningar, lugna hero-typografin.

## Vad sessionen åstadkom

- **Redesign 2026 token-override** via ny `style-tokens.css` — varm sand/beige bakgrund, salviegrön accent ersätter ink-teal, varmare skuggor. Inga ändringar i style.css eller HTML-struktur. Inkluderas via en ny `<link>`-rad i 33 HTML-filer.
- **Mjukare hero-copy på startsidan** — "Det är mycket på en gång just nu" + "Du behöver inte hålla reda på allt själv. Vi reder ut det praktiska...". Bytt CTA till "Börja här". Aktivt undvikit AI-floskler.
- **Ny FAQ "Behöver jag en begravningsbyrå?"** på startsidan — generisk, namnger inga byråer öppet.
- **Begravningsbyrå-sidan ([begravningsbyra.html](../begravningsbyra.html)) omskriven** till ärlig jämförelse: Fonus, Lavendla, Memoria + lokala oberoende + SBF. Tagit bort hallucinerade "Fonus-Fenix/EFS" och felaktig "ägd av KF". Ny sektion "Hur du faktiskt väljer".
- **SEO-keywords i WebApplication structured data** på index — Fonus, Lavendla, Memoria, Familjens Jurist (osynligt, bara för Google).
- **Lugnare hero-storlek** — landing-headline 0.6× originalstorleken, lägre vikt, bättre line-height. Hero börjar högt på sidan istället för viewport-centrerat.
- **Cache-version `style-tokens.css?v=3`** över alla 33 HTML-filer.
- **Global personlighetsregel sparad** i `~/.claude/CLAUDE.md` (sektion 5): inga px-värden, CSS-properties eller tool-mekanik i chat-svar. Plain language, en-två meningar.

## Beslut tagna (med motivering)

- **Token-override istället för style.css-edit** — användaren ville behålla style.css orörd. Override-filen kan slängas eller versioneras separat.
- **Inga byrå-namn synligt på startsidan** — användaren vill undvika att framstå som promotion. Namnen fick endast finnas på [begravningsbyra.html](../begravningsbyra.html) (där de är legitimt informativa) och i index-ens `keywords`-fält. Förkastat: namnstoppning i meta description.
- **Memira borttaget från keywords** — det är en ögonklinik, inte begravningsbyrå. Ersatt av Memoria.
- **Ärlig SEO-bedömning levererad** — användaren fick veta att schema-`keywords` har ~0 ranking-vikt och att riktig "fonus"-ranking kräver namn synligt på sidan (vilket är därför [begravningsbyra.html](../begravningsbyra.html) blev jämförelseguide).
- **Hero-headline reducerad i två steg** — först 0.8×, användaren tyckte fortfarande "skrikigt", landade på 0.6× + lättare vikt + mjukare letter-spacing.

## Nuvarande state

**Filer ändrade i sessionen (alla committade på main):**
- `style-tokens.css` — ny fil, design-override
- `index.html` — meta description, structured data keywords, hero-copy, ny FAQ-post + matchande FAQ-schema, ny `<link>`-rad
- `begravningsbyra.html` — meta-tags, FAQ-schema, jämförelsesektion, dateModified
- 31 övriga HTML-filer i rooten — endast nya `<link>`-raden för style-tokens

**Git-status:**
- Branch: `main`
- Senaste commit: `3824750 Lugnare hero: mindre headline + content-driven height`
- Pushat och live på efterplan.se via Vercel
- Ej-committade: `.claude/launch.json` (lokal preview-config — användaren kan committa eller lämna)
- `redesign-2026`-branchen finns kvar både lokalt och på origin

**Tickets:** Ingen direkt ticket-koppling i sessionen, men relaterar till **T082 + T098** (meta) och **T093** (CTA/funnel) som enligt roadmap körs i Claude Code.

## Öppna frågor

- Inga. Användaren godkände varje steg innan commit.

## Användar-preferenser noterade (utöver global CLAUDE.md)

- **Inga AI-floskler i copy.** "Vi finns här för dig", "i dessa svåra tider", "du är inte ensam", "steg för steg" är förbjudna.
- **Inga begravningsbyrå-namn öppet på startsidan** — bara i jämförelseguide där det är informativt.
- **Faktakontroll viktig** — användaren rättade `bouppteckning-/dödsbo-forum existerar ej` när jag hallucinerade SEO-taktik. Var explicit kring vad som är verifierat vs gissning.
- **Commit på explicit begäran** — aldrig auto-commit. Push görs när användaren säger "push" eller "skarpt".

## Nästa konkreta steg

Vänta på användarens nästa instruktion. Sajten är live med ny design + uppdaterad copy. Om användaren vill iterera vidare på hero/typografin: justeringar görs i `style-tokens.css` och pushas via `main`.

Ev. därefter: kolla av om T082/T098 (meta) eller T093 (CTA/funnel) ska kvitteras som klara i [roadmap.md](../roadmap.md) — mycket av det arbetet skedde implicit i den här sessionen.

---

**För att fortsätta i ny session:** läs [roadmap.md](../roadmap.md) för aktuell ticket-status och prioriteringsordning. Den här handoffen kompletterar roadmappen med sessionens kontext som inte hunnit landa i tickets än.
