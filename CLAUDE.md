# CLAUDE.md — Efterplan

Efterplan är en statisk svensk webbtjänst (HTML/CSS/vanilla-JS, ingen
byggkedja) som hjälper anhöriga att hantera praktiska göromål efter ett
dödsfall. Serverlösa Vercel-funktioner under `api/` (Stripe + Supabase).

- Frontend körs lokalt via `.claude/launch.json` ("Efterplan static", port 3001).
- `/api/*` testas mot `https://efterplan.se` (statiska servern serverar dem inte).
- Nyckelhantering: `npm run keys:sync` / `keys:rotate` (se `SECRETS.md`).

## Design Context

Full version i [`.impeccable.md`](.impeccable.md). Sammanfattning:

### Users

Anhöriga i Sverige, dagarna–veckorna efter ett dödsfall. Stressade, sörjande,
låg ork, ofta på mobil via Google-sökning. Vill få ordning på det praktiska
som varken myndigheter eller begravningsbyrån tar (bank, bouppteckning,
arvskifte, abonnemang, post, bostad, papper). Efterplan ger personlig
checklista, prioriterade uppgifter, arbetsfördelning och färdiga brev —
gratis, ingen registrering. Inte terapi eller samtalsstöd.

### Brand Personality

**Varm, tydlig, pålitlig.** Copy is action — direkt, uppmanande språk, en
handling per mening. One decision per step. Varm utan att bli terapeutisk.
Gränssnittet ska ge lugn, ordning och tillit. Aldrig brådska, krav eller skuld.

### Aesthetic Direction

Svensk redaktionell / print-känsla — lugn, textdriven, som en välsatt bok.
**Tokens: `style-tokens.css` ("Redesign 2026", oklch) är sanningskällan** —
det laddas efter `style.css` och vinner; `style.css` :root och de 43
HTML-sidorna ska rätas upp mot det. Palett: varm sand-papper, djup varm
bläckton, **soft sage** primäraccent, **dämpad terrakotta** sekundär (sparsamt).
Typografi: Fraunces (display) + IBM Plex Sans (brödtext) + IBM Plex Mono.
Fluid type/space-skalor, läsbredd 62ch. Mobile-first. **Ljust läge endast.**

### Anti-references

1. Generisk AI/SaaS-look (gradient-rubriker, glassmorphism, hero-metrics,
   identiska kort-rutnät, generiska typsnitt).
2. Kliniskt/kallt (1177, Skatteverket, sjukhusformulär).
3. Lekfullt/pigg (glada figurer, "delightful" mikrointeraktioner,
   utropstecken, konfetti).

### Design Principles

1. **En handling per vy.** Måste man läsa två gånger är vyn för tung.
2. **Copy bär gränssnittet.** Text före ikoner, verb före dekoration.
   Felmeddelanden säger vad som hände och vad man gör nu.
3. **Lugn hierarki.** Space och vikt skapar ordning — inte färg/ramar/skuggor.
   Terrakotta-accenten bara för det enskilt viktigaste på sidan.
4. **Redaktionell rytm, inte rutnät.** Variera sektionsstruktur, radlängd 45–75 tecken.
5. **Tillgänglighet är omsorg.** WCAG 2.2 AA som golv: kontrast 4.5:1 / 3:1,
   synlig fokus, semantisk HTML, `prefers-reduced-motion`, träffytor ≥ 44px.
6. **Determinism i kärnan.** Ingen AI som gissar åt användaren i huvudflödet.
