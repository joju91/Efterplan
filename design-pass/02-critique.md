# Critique — Efterplan

**Datum:** 2026-09-02 · **Modell:** Sonnet 5 · **Skill:** `/critique`
**Vad gränssnittet ska åstadkomma:** låta en stressad, sörjande anhörig få
ordning på det praktiska efter ett dödsfall — personlig checklista,
prioriterade uppgifter, färdiga brev, arbetsfördelning. Gratis, ingen
registrering; 49 kr engångs för breven.
**Metod:** genomgång i browser av startsida, hela onboarding-flödet
(steg 1–4) och plan-vyns tomma läge.

> Rapport, inga ändringar gjorda.

---

## Anti-patterns — verdikt: **PASS**

Ingen som fick se det här skulle säga "AI gjorde det". Fraunces + IBM Plex,
varmt papper, streckade linjer, ljust läge, inget gradient-text, ingen
glassmorphism, ingen hero-metric-mall, inga stora rundade ikoner över varje
rubrik. Egen redaktionell hållning.

**Två milda signaler:**
1. "Så här går det till" — fyra identiska kort med cirkelsiffra + rubrik +
   text. Det numrerade-kort-mönstret är templat-doft.
2. **Emoji som gränssnittsikoner** — 🗂 🔒 🖥 📤 👤 🔗 🟢🟡🔴 i
   integritetsbadges, Arkiv-fliken, plan-vyns knappar. Mot ett
   Fraunces/sandpapper-system och en uttalad "inte lekfullt"-brief läser
   emoji som en annan, mer konsumentapp-ig produkt.

---

## Helhetsintryck

**Texten är produktens supermakt.** Copy gör hela det känslomässiga
arbetet, och den visuella designen håller sig klokt undan medan det sker —
vilket är rätt för sammanhanget. "Du kan inte göra fel." "Börja med det som
känns minst tungt." "Frivilligt — du kan lägga till det senare." Varje
ångestladdat ögonblick har en lugnande mening. Det är ovanligt och svårt.

**Största möjligheten:** startsidan är byggd för Google, inte för personen i
kris. En sörjande som redan klickat sig hit får skrolla förbi 12
FAQ-frågor och en 43-länkars sitemap för att nå sidans slut. Den som kom
från en annons om "bouppteckning" behöver inte säljas in igen — den
behöver en tydlig väg in.

---

## Vad som fungerar

1. **Microcopy och röst.** Genomgående. "Du kan inte göra fel — vi guidar
   dig hela vägen." "Sparas bara lokalt i din webbläsare, aldrig på någon
   server." "Stäng sidan och kom tillbaka när du orkar — inget försvinner."
   Rösten är varm utan att bli terapeutisk, konkret utan att bli kylig.
   Precis den brief som står i `.impeccable.md`.

2. **Onboardingens åtagandekurva.** Ett tryck för att börja (relation),
   allt därefter frivilligt, den svåraste frågan (personnummer) sist och
   uttryckligen överhoppbar — med *varför* bifogat vid varje ask
   ("Så kan vi räkna ut bouppteckningsfrist … som riktiga datum"). Progressiv
   disclosure utförd med empati, inte bara struktur.

3. **Trafikljus-systemet på planen.** 🟢 digitalt med BankID · 🟡 delvis ·
   🔴 kräver post/original. Genuint användbar informationsdesign — talar om
   vilka uppgifter man kan beta av från soffan. (Betydelsen är bra;
   *utförandet* som emoji är svagare — se P4.)

4. **Kvarhållningslöftet upprepas vid varje utgång.** "Det du fyller i
   finns kvar — även om du stänger sidan." Tar bort "kommer jag förlora
   det här"-rädslan innan den hinner uppstå.

---

## Prioriterade problem

### P1 · Startsidan tjänar Google före användaren
- **Vad:** Hero → 4-stegs "Så här går det till" → 12-frågors FAQ → "Om
  Efterplan" → "Din integritet" → 43-länkars footer-sitemap. Mycket lång
  skroll. En återvändande användare med sparad plan möter samma "Börja
  här" som en förstagångsbesökare — ingen "Fortsätt din plan".
- **Varför det spelar roll:** Målgruppen är per definition lågenergi och
  ofta på mobil. Varje skärm de måste skrolla förbi utan att komma
  vidare är ett litet tapp i tillit. Den som klickat en annons om
  bouppteckning har redan bestämt sig — de ska in i flödet, inte
  åter-övertygas.
- **Fix:** Känn av sparat läge och byt hero-CTA till "Fortsätt din plan" +
  kort progress när sådan finns. Flytta SEO-FAQ:n under en tydlig vikning
  eller till en egen kunskaps-hub. Låt de första två skärmarna vara
  hero + en enda väg in.
- **Skill:** `onboard` (returnerande läge, hero-logik) + `arrange` (ordna
  om landningens sektioner).

### P2 · "Fler steg visas här" är ett dött tomt läge
- **Vad:** Plan-vyns "Denna vecka" och "Senare" visar platshållartexten
  "Fler steg visas här". I planens tomma/förberedande läge finns ingen
  guidning om vad som kommer att dyka upp eller varför det är tomt.
- **Varför det spelar roll:** Tomma lägen är undervisningstillfällen. Just
  den här produktens tomma plan-vy är första gången användaren ser
  "resultatet" — och den säger ingenting.
- **Fix:** Tomma lägen som förhandsvisar värdet — "När du svarat på
  frågorna dyker uppgifterna upp här, sorterade efter hur bråttom de är"
  — eller dölj tomma hinkar helt tills de har innehåll.
- **Skill:** `onboard`.

### P3 · Nav-överlast i plan-vyn
- **Vad:** "Mitt konto · Ändra svar · Min plan · Dokument · Bouppteckning ·
  🗂 Arkiv" — sex mål på samma rad, blandade nivåer: kontohandling vs
  vy-flikar vs en enskild dokumenttyp ("Bouppteckning" som jämbördig med
  "Dokument" — är det en flik eller en uppgift?).
- **Varför det spelar roll:** Användaren kan inte snabbt se var hen är
  eller vad som är primärt. Kognitiv last i exakt det läge produkten
  lovar att minska den.
- **Fix:** Skilj vy-växlaren (Plan / Dokument / Arkiv) från konto-/meta-handlingar
  ("Mitt konto", "Ändra svar"). Klargör "Bouppteckning" — om det är en
  vy under Dokument, lägg den där.
- **Skill:** `arrange` + `clarify`.

### P4 · Emoji som ikoner underminerar tonen
- **Vad:** 🗂 🔒 🖥 📤 👤 🔗 🟢🟡🔴 i integritetsbadges, Arkiv-flik,
  plan-vyns åtgärdsknappar, trafikljus.
- **Varför det spelar roll:** Mot Fraunces/varmt-papper och briefens
  "inte lekfullt/pigg" läser emoji som en annan, mer casual produkt.
  Systemets omsorg i texten möts inte av samma omsorg i symbolerna.
- **Fix:** Byt emoji mot stylade prickar/streck och ev. en liten
  konsekvent ikonuppsättning i samma vikt som typografin. Trafikljusets
  *betydelse* behålls — bara som CSS-prickar, inte 🟢.
- **Skill:** `normalize` (ikon-/badge-språk) + `polish`.

### P5 · Stegetiketterna vinglar
- **Vad:** "Steg 1 av 4" / "STEG 2 AV 4" / "Steg 3 av 4" / "Steg 4 av 4 —
  helt frivilligt". Blandad versalisering, ett steg i GEMENER-VERSALER.
- **Varför det spelar roll:** I ett flöde vars hela uppgift är att kännas
  lugnt och kontrollerat är en darrande etikett en spricka i lugnet.
- **Fix:** En form, konsekvent. "Steg X av 4", och lägg "frivilligt" som
  underrad snarare än i rubriken.
- **Skill:** `clarify` + `polish`.

---

## Mindre observationer

- **Döda länkar:** "Kontakt" → `href="#"` (2 ställen, footer + Om-sektion),
  "Mitt konto" → `href="#"`. Koppla dem eller gör om till `<button>`.
- **Offline-bannern** ("Ingen uppkoppling just nu — dina ändringar sparas
  ändå lokalt") är en prominent top-alert. För någon på ostadig
  mobil i en sjukhuskorridor är den en stöt, även om texten lugnar.
  Överväg ett tystare inline-läge, avfärdbart.
- **Hero-rubriken är lång** (4 rader: "Du behöver inte hålla reda på allt
  själv. Vi reder ut det praktiska — bank, bouppteckning, hyresrätt,
  papper — så att du kan ta det i din takt."). Renderas OK men kunde
  strammas.
- **Footer:** `© 2026 Efterplan · · ·` renderar bara mittprickar mellan
  till synes tomma länkar — visuellt skräp.
- **Fri vs betald.** "49 kr engångsbetalning" introduceras i en tonad ruta
  i hero. Vad man får gratis vs för 49 kr kunde vara tydligare *innan*
  man investerar två minuter i frågorna.
- **Steg 3 & 4 blandar frivilligt-formuleringar:** "Frivilligt — du kan
  hoppa över detta" / "Frivilligt — du kan lägga till det senare" / "helt
  frivilligt". Samla till en formulering.

---

## Frågor att fundera på

- Om startsidan för någon som kom från en "bouppteckning"-sökning *var*
  bouppteckningssvaret — med "Börja här" som naturligt nästa steg — istället
  för en allmän hemsida?
- Behöver en sörjande användare se 12 FAQ-frågor och 43 länkar innan hen
  gjort någonting? Vad kostar den skrollen i tillit?
- Hur skulle "Din plan" se ut om det tomma läget vore lika omsorgsfullt
  skrivet som onboardingen?
- Texten behandlar användaren med enorm omsorg. Gör det visuella systemet
  det också — eller håller det sig mest undan? Var kan typografi och rum
  *aktivt trösta* i stället för att bara inte-skada? (→ `typeset`, `arrange`)

---

## Skill-mappning

| Skill | Adresserar |
|-------|-----------|
| `onboard` | P1 (returnerande läge), P2 (tomma lägen) |
| `arrange` | P1 (landningsordning), P3 (nav-struktur), anti-pattern-kortet |
| `clarify` | P3 (etiketter), P5 (stegetiketter), frivilligt-formuleringar, döda länkar |
| `normalize` | P4 (ikon-/badge-språk) |
| `polish` | P4, P5, footer-skräp, slutpass |
| `typeset` | Öppen fråga — kan type/rum trösta mer aktivt |
| `quieter` | Offline-bannern (om den upplevs för skarp) |

**Rekommendation till granskningsgrinden:** kör `onboard` — flödet är
välskrivet men har konkreta hål (P1, P2) och a11y-brister från auditet (H2).
Det motiverar sin plats.
