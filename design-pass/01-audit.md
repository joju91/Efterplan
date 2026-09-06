# Audit — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/audit`
**Scope:** `index.html` (SPA-skal + onboarding + plan/brev), 42 statiska
innehållssidor, `style.css` (86 KB), `style-tokens.css`, `app.js` (156 KB).
**A11y-mål:** WCAG 2.2 AA. **Tema:** ljust läge endast.
**Metod:** statisk kodgranskning + körning i browser (Chromium, 375px & 1265px),
canvas-resolverade kontrastmätningar på faktiska token-värden.

> Detta är en **rapport, inga ändringar gjorda.** Åtgärder mappas till
> följande skills i genomgången: `normalize`, `harden`, `clarify`, `optimize`,
> `typeset`, `arrange`, `polish`.

---

## Anti-patterns — verdikt: **PASS (med en anmärkning)**

Ser det AI-genererat ut? **Nej.** Sajten har en tydlig egen hållning:
Fraunces display-serif + IBM Plex Sans, varmt sandpapper, oklch-palett,
streckade redaktionella linjer (`—`), inget gradient-text, ingen
glassmorphism, ingen "hero-metric"-mall, inga stora rundade ikoner ovanför
varje rubrik, ljust läge. De klassiska AI-slop-fingeravtrycken saknas.

**Anmärkning:** sektionen "Så här går det till" är fyra identiska kort med
cirkelsiffra + rubrik + text — det numrerade-cirkel-på-kort-mönstret är en
mild templat-signal. Enda stället som drar åt generiskt. → `arrange`.

---

## Sammanfattning

| Severitet | Antal |
|-----------|-------|
| Critical  | 1 |
| High      | 4 |
| Medium    | 10 |
| Low       | 4 |

**Topp 5 att åtgärda först:**

1. **[Critical] Sticky genomskinlig nav på `index.html`** — vid scroll
   ligger "Efterplan"-logon och navlänkarna ovanpå brödtexten, helt
   oläsbart. Värst på mobil.
2. **[High] Den valda accentpaletten klarar inte AA för text/UI** — sage
   `--accent` på papper = 3,6:1, `--ember` = 3,5:1, vit text på
   primärknapp = 4,16:1 (alla under 4,5:1). Ramar (`--rule`) = 1,3:1.
3. **[High] Formulärfält utan programmatiska etiketter** — ~14
   onboarding-kryssrutor + belopp/beskrivning-fält använder bara
   `placeholder` som etikett.
4. **[High] Träffytor för små** — footer-sitemapens ~45 länkar renderas
   17–18 px höga på hela sajten (AA kräver 24 px, bekvämt är 44 px).
5. **[High] Skip-länk saknas på alla 42 statiska sidor** (finns bara på
   `index.html`).

**Systemisk grundorsak bakom flera fynd:** två krockande token-lager.
`style.css` :root (hex, mörk ink-teal + terrakotta) skrivs över av
`style-tokens.css` (oklch, ljusare sage). Övergången mjukade upp
accenterna så mycket att de föll under AA, och lämnade ~50 hårdkodade
hex-värden + flera one-off-färger kvar i `style.css`.

---

## Kritiska fynd

### C1 · Sticky genomskinlig nav kolliderar med innehåll
- **Plats:** `style.css:283` `#screen-landing .nav { background: transparent; }`
  i kombination med `style.css:142` `.nav { position: sticky; top: 0; z-index: 100; }`.
  Markup: `index.html:143` `<nav class="nav">` (ingen `.nav-light`).
- **Kategori:** Responsiv / Läsbarhet / A11y
- **Beskrivning:** Navigationen är fastnålad i toppen men helt genomskinlig
  utan bakgrund eller `backdrop-filter`. Så fort sidan scrollas glider
  brödtext, rubriker och länkar rakt under "Efterplan"-ordmärket och
  länkarna "Om / Integritet / Mitt konto". Uppmätt: `background:
  rgba(0,0,0,0)`, `border-bottom: 0`.
- **Konsekvens:** Text-på-text, oläsbart i varje scrollat läge på
  startsidan. Drabbar exakt den målgrupp (stressad, låg ork, ofta mobil)
  som minst orkar kämpa med gränssnittet. Bekräftat på både 375 px och
  1265 px.
- **Standard:** WCAG 1.4.3 (kontrast), 1.4.10 (reflow), allmän användbarhet.
- **Rekommendation:** Antingen (a) ge landing-navet solid `var(--paper)`-bakgrund
  + 1px `border-bottom` (som `.seo-nav` på innehållssidorna redan har och
  där fungerar), eller (b) gör navet icke-sticky på landing, eller (c)
  lägg till bakgrund vid scroll (`.is-scrolled`-klass). Alternativ (a) är
  enklast och mest konsekvent.
- **Skill:** `normalize` (rikta landing-nav mot samma mönster som `.seo-nav`).

---

## High-severity

### H1 · Accentpaletten (2026-tokens) klarar inte WCAG 2.2 AA
- **Plats:** `style-tokens.css` — `--ink-teal: oklch(58% 0.07 150)` (→ `--accent`),
  `--ember: oklch(60% 0.08 50)`, `--rule: oklch(86% 0.022 80)`,
  `--rule-strong: oklch(78% 0.028 80)`.
- **Kategori:** A11y / Theming
- **Uppmätta kontraster (canvas-resolverat mot faktiska värden):**

  | Kombination | Ratio | AA normal (4,5) | AA stor/UI (3,0) |
  |---|---|---|---|
  | `--ink` / paper (brödtext) | 14,97 | ✅ | ✅ |
  | `--ink-soft` / paper | 7,97 | ✅ | ✅ |
  | `--ink-muted` / paper | 5,17 | ✅ | ✅ |
  | `--ink-muted` / `--paper-soft` | 4,57 | ✅ knappt | ✅ |
  | **`--accent` (sage) / paper** — länktext, små rubriker | **3,60** | ❌ | ✅ |
  | **`--accent` / `--paper-card`** | **3,82** | ❌ | ✅ |
  | **vit / `--accent`** — primärknappens text | **4,16** | ❌ | ✅ |
  | **vit / `--ember`** — sekundärknappens text | **4,06** | ❌ | ✅ |
  | **`--ember` / paper** — accenttext | **3,51** | ❌ | ✅ |
  | **`--rule` / paper** — ramar/avgränsare | **1,32** | – | ❌ (1.4.11) |
  | `--rule-strong` / paper | 1,73 | – | ❌ |

- **Konsekvens:** Alla inline-länkar i FAQ och på innehållssidorna (sage,
  understrukna) ligger på 3,6:1 i brödtextstorlek → under AA. Primär- och
  sekundärknapparnas etiketter klarar bara AA om texten är ≥ 18,66 px
  **fet** ("stor text", 3:1-gränsen) — "Börja här" är fet och stor nog och
  scrapar förbi, men mindre knappar gör det inte. Formulärfält och kort
  som bara avgränsas av `--rule` (1,3:1) uppfyller inte 1.4.11
  Non-text Contrast.
- **Standard:** WCAG 1.4.3 (text), 1.4.11 (non-text/UI).
- **Rekommendation:** Mörka ner de funktionella varianterna utan att röra
  den lugna känslan: en `--accent-text` / `--link` runt `oklch(45–48%
  0.08 150)` ger ~5–5,5:1 mot papper; `--ember` för text likaså. Låt den
  ljusare sagen leva kvar som *yt-/dekorfärg* (badges, tunna linjer) men
  aldrig som text eller enda knappfärg. Höj `--rule` för
  input/kort-ramar till ≥ 3:1 (t.ex. `oklch(70% 0.025 80)`), eller
  komplettera ramen med bakgrundsskillnad/skugga.
- **Skill:** `normalize` (definiera semantiska text-vs-yt-tokens),
  därefter `harden` (verifiera ramkontrast på fält).

### H2 · Formulärkontroller utan programmatisk etikett
- **Plats:** `index.html` — onboarding steg 2 (~14 `<input type="checkbox">`
  utan `id`/`<label>`), tillgångar/skulder- och räkningsrader
  (`placeholder="Beskrivning (t.ex. Bankkonto Swedbank)"` /
  `placeholder="Belopp (kr)"` utan label), `doc-photo-input` &
  `bill-photo-input` (`type=file`, ingen label/aria-label),
  `ob-reminder-optin` (checkbox utan label).
- **Kategori:** A11y
- **Beskrivning:** Fälten identifieras bara via `placeholder`. Placeholder
  försvinner vid inmatning, exponeras inte konsekvent för hjälpmedel och
  räknas inte som `accessible name`. ~22 kontroller totalt.
- **Konsekvens:** Skärmläsare läser "redigeringsfält, tomt" utan syfte.
  Röststyrning kan inte adressera fältet. Kognitiv last för alla när
  etiketten försvinner mitt i ifyllnaden.
- **Standard:** WCAG 1.3.1 (Info & Relationships), 3.3.2 (Labels or
  Instructions), 4.1.2 (Name, Role, Value).
- **Rekommendation:** Riktig `<label for>` (visuellt dold via
  `.visually-hidden` där designen kräver det), eller minst `aria-label`.
  För checkbox-grupperna: `<fieldset>` + `<legend>`.
- **Skill:** `harden` (primärt) + `clarify` (etiketttexterna).

### H3 · Träffytor under minimistorlek
- **Plats:** `footer`-sitemap på alla sidor (`index.html` ~45 länkar à
  18 px höjd; `.seo-nav`/`footer` på innehållssidor ~15 länkar à 17 px).
  Även nav-länk "Om" (40 px bred).
- **Kategori:** Responsiv / A11y
- **Beskrivning:** Länkarna i footerns länklista ligger tätt radvis med
  ~17–18 px klickhöjd.
- **Konsekvens:** Feltryck på mobil, särskilt för äldre användare och
  personer med motorik-/darrningsbesvär — en stor del av målgruppen.
- **Standard:** WCAG 2.5.8 Target Size (Minimum, AA) — 24×24 px; bekväm
  standard 44×44 px.
- **Rekommendation:** Öka radhöjd/`padding` i footer-länklistan till minst
  ~40 px effektiv träffyta; överväg 2-kolumnslayout på mobil istället för
  en lång tät rad.
- **Skill:** `arrange` (footer-layout) + `harden`.

### H4 · Skip-länk saknas på 42 statiska sidor
- **Plats:** Alla `*.html` utom `index.html`. `index.html` har
  `.skip-link` "Hoppa till innehållet"; innehållssidorna har ingen
  (verifierat på `bouppteckning-guide.html`).
- **Kategori:** A11y
- **Konsekvens:** Tangentbords- och skärmläsaranvändare måste tabba genom
  hela toppnavet på varje innehållssida.
- **Standard:** WCAG 2.4.1 Bypass Blocks (A).
- **Rekommendation:** Lägg `.skip-link` + `id="main"` på `<main>` i den
  gemensamma sidmallen för innehållssidorna.
- **Skill:** `normalize` (gemensam mall) + `harden`.

---

## Medium-severity

### M1 · Två krockande token-lager
- `style.css:8–60` :root (hex: `--ink-teal #1F3A4E`, `--ember #B4552E`, m.fl.)
  skrivs helt över av `style-tokens.css` (oklch). `style.css` :root är i
  praktiken dödvikt men ser ut att gälla vid läsning.
- **Konsekvens:** Förvirrande sanningskälla; risk att framtida ändringar
  görs i fel fil. **Beslut (Jonas):** `style-tokens.css` gäller.
- **Rekommendation:** Flytta in de slutgiltiga token-värdena i `style.css`
  :root och ta bort `style-tokens.css` som separat override-lager — eller
  töm `style.css` :root och dokumentera att tokens bara bor i
  `style-tokens.css`. Ett ställe, inte två.
- **Skill:** `normalize`.

### M2 · ~50 hårdkodade färger + one-off-nyanser i `style.css`
- `color: #fff` × ~15 (knapptext), `.app-toast.is-error #a3312a`,
  `.is-success #2f6b4f`, `#92400E`, grön ruta `#EBF5EE` / `#C3DFC9`
  (annan grön än sage-token), `#F4F4F2`, `#DDD/#CCC` (locked task).
  15 `rgba()`-literaler.
- **Konsekvens:** Färgändringar måste jagas på flera ställen; "Gratis/49 kr"-rutan
  har en grön som inte hör ihop med paletten.
- **Skill:** `normalize`.

### M3 · Google Analytics på alla sidor vs. integritetslöftet
- `gtag`/`googletagmanager` på 41 sidor; Plausible på 1 (`index.html`) →
  dubbelmätning på startsidan, ~45 KB Google-script överallt.
- **Konsekvens:** Sajten har ett eget "Din integritet"-avsnitt och säljer
  "ingen registrering" — GA på varje sida är en positioneringskonflikt
  och en prestanda-/tredjepartskostnad. (Produkt-/integritetsbeslut, inte
  ren UI — tas med som observation.)
- **Rekommendation:** Välj ett verktyg. Plausible räcker för det som
  mäts och matchar löftet.
- **Skill:** — (beslut för Jonas; ev. `optimize` för borttag).

### M4 · `app.js` (156 KB) + `style.css` (86 KB) laddas på alla 42 innehållssidor
- Omingad, ingen kodsplitt. Innehållssidorna är statisk text och behöver
  sannolikt en bråkdel av `app.js` (onboarding/brev/plan-logik).
- **Konsekvens:** Onödig parse/exekvering och bandbredd på just de sidor
  som får mest söktrafik (LCP/INP på mobil).
- **Rekommendation:** Ladda inte `app.js` på rena innehållssidor, eller
  splitta ut det de faktiskt använder; minifiera CSS/JS i deploy-steget.
- **Skill:** `optimize`.

### M5 · Två `<h1>` i DOM på `index.html`
- Ett för `#screen-landing`, ett för app-skärmen; växlas med `display`.
- **Konsekvens:** Skärmläsare i "list headings"-läge kan se båda beroende
  på hur `display:none` tolkas; svag dokumentöversikt.
- **Rekommendation:** Säkerställ att inaktiv skärm är `hidden`/`display:none`
  (inte bara visuellt gömd) så bara ett `<h1>` är i tillgänglighetsträdet
  åt gången; eller gör app-skärmens rubrik till `<h1>` bara när den är aktiv.
- **Skill:** `harden`.

### M6 · Inkonsekvent landmark-markup
- `index.html`: `<div role="main">`, inget `<header>`.
  Innehållssidor: äkta `<main>`.
- **Rekommendation:** Använd `<main>` / `<header>` / `<footer>` genomgående;
  ta bort `role="main"` när elementet är `<main>`.
- **Skill:** `normalize` + `harden`.

### M7 · CSS-transitioner på layout-egenskaper
- 3 regler animerar `width`/`height`/`top`/`left`/`margin`/`padding`
  (av 65 anim/transition-regler totalt).
- **Konsekvens:** Layout-thrash / hackig animation på svagare mobiler.
- **Rekommendation:** Animera `transform`/`opacity`; för höjd använd
  `grid-template-rows`.
- **Skill:** `optimize` + `animate`.

### M8 · Brytpunkts-röra
- `@media` på 420, 480, 601, 720, 1024 px, blandat `min-`/`max-width`,
  inga tokens.
- **Konsekvens:** Svårt att resonera om responsivt beteende; "601px" är
  en godtycklig gräns.
- **Rekommendation:** Etablera 3–4 namngivna brytpunkter, mobile-first
  (`min-width`), och håll dig till dem.
- **Skill:** `normalize` + `adapt`.

### M9 · `:focus-visible` överskrivs mot designintentionen
- `style.css:107` deklarerar `outline: 3px solid var(--accent)` + 3px
  offset; datoruppmätt värde på navlänk = `2px solid var(--ember)`.
  En senare regel vinner.
- **Konsekvens:** Fokusringen finns (bra) men är tunnare och i annan färg
  än avsett; inkonsekvent mellan komponenter.
- **Rekommendation:** En fokus-token, en regel, `:focus-visible` överallt;
  ta bort konkurrerande `outline`-deklarationer.
- **Skill:** `normalize` + `polish`.

### M10 · Stilar utanför systemet
- `index.html`: 43 inline `style=`-attribut. Egna `<style>`-block i
  `arvskifte-mall.html` och `bouppteckning-tidslinje.html`.
- **Konsekvens:** Drift; ändringar i systemet slår inte igenom här.
- **Skill:** `normalize` + `extract` (om mönstren återkommer).

---

## Low-severity

### L1 · `.innerHTML =` × 30 i `app.js`
Brevgeneratorn tar fritext (namn, adress, tjänst). Om något av det
interpoleras i `innerHTML` utan escaping → risk för layout-brott eller
injektion. Ej bekräftad sårbarhet — **verifiera** i `harden` /
`security-review`. Föredra `textContent` / `<template>` / DOM-API.

### L2 · Tomma cache-bust-parametrar
`app.js?v=` och `supabase-client.js?v=` ser ut att sakna värde. Koppla
till en build-hash eller ta bort. → `optimize`.

### L3 · `prefers-reduced-motion` täcker bara `.btn-primary:hover` explicit
Blanket-regeln (`animation-duration: .001ms` m.m.) neutraliserar det
mesta, men andra `:hover`-transforms nollställs inte uttryckligen. Lägg
till `transform: none` för hover-tillstånd generellt. → `animate` / `polish`.

### L4 · Ikon-/bildassets
`favicon.png` och `icon-512.png` är identiska 11,5 KB — `icon-512` bör
vara högre upplösning eller döpas om. `og.png` 35 KB är OK. → `optimize`.

---

## Systemiska mönster

1. **Token-migreringen är halvklar.** `style-tokens.css` införde en ny
   palett men (a) sänkte accent/ram-kontrast under AA och (b) lämnade
   `style.css` :root + ~50 hårdkodade värden orörda. Ett `normalize`-pass
   som konsoliderar tokens **och** fixar kontrast löser C1-fragment, H1,
   M1, M2, M9 i ett svep.
2. **`index.html` är efter innehållssidorna i grundstruktur.** De statiska
   sidorna har äkta `<main>`, solid nav och korrekt en `<h1>`.
   `index.html` (SPA-skalet) har `role="main"`, genomskinlig sticky-nav,
   dubbla `<h1>`. Rikta `index.html` mot innehållssidornas mönster.
3. **Formulär-a11y är genomgående svagt** i onboarding och
   tillgångar/räkningar: placeholder-som-etikett, checkboxgrupper utan
   `fieldset`, filfält utan namn. Ett samlat `harden`-pass över alla
   formulärytor.
4. **Prestanda-taxan betalas på fel sidor.** Söktrafiken landar på de 42
   innehållssidorna, men de bär hela `app.js`+`style.css` omingat.

---

## Positiva fynd (behåll / replikera)

- **Egen, sammanhållen redaktionell estetik** som matchar briefen —
  Fraunces + IBM Plex, varmt papper, streckade linjer, ljust läge, inga
  AI-slop-signaler.
- **Brödtextens kontrast är utmärkt:** 15:1 / 8:1 / 5,2:1 för
  ink / ink-soft / ink-muted.
- **Blanket `prefers-reduced-motion`** finns och är korrekt uppbyggd.
- **Ingen horisontell scroll** vid 375 px eller 1265 px; inga element
  bredare än viewporten.
- **Äkta `<button>` / `<a>`** överallt — inga `<div onclick>`-attrapper.
- **Innehållssidorna:** en `<h1>`, äkta `<main>`, solid `.seo-nav` med
  border — mönstret att rikta resten mot.
- **Fluid type/space-skalor** med `clamp()`.
- **Copy-rösten är på varumärket:** "Börja här", "i din takt", "Det du
  fyller i finns kvar — även om du stänger sidan."

---

## Rekommendationer per prioritet

### Omedelbart (blockerande)
1. **C1** — solid bakgrund på landing-navet (eller icke-sticky). En rad CSS.

### Kort sikt (denna genomgång, High)
2. **H1** — semantiska text-/länk-/ram-tokens med AA-kontrast (`normalize`).
3. **H2** — etiketter på alla formulärkontroller (`harden` + `clarify`).
4. **H3** — träffytor i footer ≥ 40 px (`arrange`).
5. **H4** — skip-länk i innehållssidornas mall (`normalize`).

### Medellång sikt (Medium)
6. **M1–M2, M9** — konsolidera tokens till ett lager, rensa hårdkodade
   färger, en fokusregel (`normalize` + `polish`).
7. **M4** — sluta ladda `app.js` på rena innehållssidor; minifiera
   (`optimize`).
8. **M5–M6** — en `<h1>`, äkta landmarks på `index.html` (`harden`).
9. **M7–M8** — transform/opacity-animationer, brytpunktssystem
   (`optimize`, `adapt`).
10. **M3** — beslut om GA vs Plausible (Jonas).

### Lång sikt (Low / nice-to-have)
11. **L1** — audita `innerHTML`-användningen (`security-review`).
12. **L2–L4** — cache-bust, reduced-motion-hover, assets (`optimize`).

---

## Skill-mappning

| Skill | Adresserar |
|-------|-----------|
| `normalize` | C1 (nav-mönster), H1 (tokens), H4 (mall), M1, M2, M6, M8, M9, M10 |
| `harden` | H2, H3 (del), H4 (del), M5, M6, L1 |
| `clarify` | H2 (etikett-/felmeddelandetexter) |
| `arrange` | H3 (footer-layout), anti-pattern-kortet i "Så här går det till" |
| `optimize` | M3 (del), M4, M7, L2, L4 |
| `typeset` | (separat pass — ej primärt drivet av audit-fynd) |
| `adapt` | M8 (brytpunkter) |
| `animate` | M7, L3 |
| `polish` | M9, L3, slutpass |
| `onboard` | Villkorlig — onboarding-flödet har a11y-brister (H2) men flödeslogiken granskas i `critique` innan beslut |
