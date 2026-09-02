# Google Ads — kampanjunderlag för efterplan.se (snabbstart)

Byggt på riktig Search Console-data (90 dagar, hämtad 2026-08-15): snittposition 43 organiskt, nästan ingen trafik. Målet är att fylla trafikgapet med billig betald trafik på lågkonkurrens-sökord medan länkbyggandet (SBF, Lavendla, Röda Korset m.fl.) ger effekt på sikt.

## Så här kommer du igång
1. Skapa ett Google Ads-konto på [ads.google.com](https://ads.google.com) om du inte redan har ett.
2. Skapa en **Sökkampanj** (Search), mål: Webbplatstrafik eller Leads (inte "Försäljning" — ni har inget e-handelsflöde att spåra ännu).
3. Bygg annonsgrupperna nedan, en i taget. Kopiera in sökord + annonstexter rakt av.
4. Koppla konverteringsspårning innan du sätter kampanjen live (se sist i dokumentet) — annars flyger du blint.

## Budget
**Förslag: 75 kr/dag (~2 250 kr/månad), testperiod 2 veckor.** Lågkonkurrens-sökorden nedan har historiskt legat under 5 kr/klick i liknande nischer, så 75 kr/dag ger uppskattningsvis 15–25 klick/dag att lära av. Justera ner om CPC blir högre än väntat — pausa annonsgrupper med CPC över 10 kr snarare än att låta budgeten ätas upp av ett enda dyrt sökord.

## Annonsgrupp 1: Arvskiftesavtal
**Landningssida:** [arvskifte-mall.html](https://efterplan.se/arvskifte-mall.html)

**Sökord (fras-/exaktmatchning):**
- "arvskiftesavtal mall"
- "arvskifte mall gratis"
- "arvskifteshandling mall"
- "mall arvskifte"
- "hur skriver man arvskiftesavtal"

**Annonstext (Responsiv sökannons — 3 rubriker, 2 beskrivningar räcker att börja med):**
- Rubrik 1: Arvskiftesavtal — gratis mall
- Rubrik 2: Fyll i direkt, inget konto
- Rubrik 3: Klart avtal på under en minut
- Beskrivning 1: Fyll i arvingar och tillgångar — få ett komplett arvskiftesavtal direkt på sidan. Gratis, ingen nedladdning.
- Beskrivning 2: Skriv ut eller spara som PDF direkt från webbläsaren. Inget skickas till någon server.

## Annonsgrupp 2: Dödsboanmälan
**Landningssida:** [checklista-dodsbo.html](https://efterplan.se/checklista-dodsbo.html)

**Sökord:**
- "dödsboanmälan hjälp"
- "dödsboanmälan mall"
- "hur gör man dödsboanmälan"
- "dödsboanmälan checklista"

**Annonstext:**
- Rubrik 1: Dödsboanmälan — steg för steg
- Rubrik 2: Gratis checklista, i rätt ordning
- Rubrik 3: Vet du vad som ska göras först?
- Beskrivning 1: Personlig checklista för dödsbohantering — dödsboanmälan, bouppteckning, arvskifte. Gratis, ingen inloggning.
- Beskrivning 2: Se exakt vad som ska göras och i vilken ordning. Byggd av Efterplan.

## Annonsgrupp 3: Säga upp abonnemang vid dödsfall
**Landningssida:** [gratis-checklista-abonnemang.html](https://efterplan.se/gratis-checklista-abonnemang.html)

**Sökord:**
- "säga upp abonnemang dödsfall"
- "avsluta abonnemang dödsbo"
- "uppsägningsbrev dödsbo mall"

**Annonstext:**
- Rubrik 1: Säg upp abonnemang — gratis brev
- Rubrik 2: Färdigskrivet på under en minut
- Rubrik 3: Ingen inloggning krävs
- Beskrivning 1: Kryssa i vilka abonnemang som fanns — få en checklista och ett färdigskrivet uppsägningsbrev direkt.
- Beskrivning 2: Helt gratis. Inget konto, inget skickas till någon server.

## Annonsgrupp 4: Bouppteckning
**Landningssida:** [bouppteckning-guide.html](https://efterplan.se/bouppteckning-guide.html)

**Sökord:**
- "bouppteckning hjälp"
- "bouppteckning mall gratis"
- "göra bouppteckning själv"

**Annonstext:**
- Rubrik 1: Bouppteckning — så gör du steg för steg
- Rubrik 2: Gratis guide, inga dolda avgifter
- Rubrik 3: Tidsgränser du inte får missa
- Beskrivning 1: Komplett guide till bouppteckning 2026 — vad som krävs, kostnad, och när ni behöver jurist.
- Beskrivning 2: Byggd av Efterplan, samma verktyg som ger dig en fullständig gratis checklista.

## Targeting
- **Geografi:** Sverige, svenska språket
- **Nätverk:** Bara Sökresultat (Search), inte Display eller Sökpartners till att börja med — renare data
- **Enheter:** Alla, men höj budet något på mobil (+10-15%) eftersom sökningar strax efter ett dödsfall ofta görs på mobilen
- **Schemaläggning:** Ingen begränsning inledningsvis — samla data först, optimera sen

## Konverteringsspårning (gör detta innan launch)

> **OBS (uppdaterad 2026-09-02, PR #85):** Google Analytics (gtag/GA4) är
> **borttaget** från hela sajten — bara Plausible (cookielöst) körs nu.
> Den gamla vägen "importera från GA4" fungerar **inte längre**. Se
> roadmap **T254** för hela beslutet. Kortversion:
>
> **Alternativ A — Plausible-only (ingen Google-kod):** UTM-tagga varje
> annons (`utm_source=google&utm_medium=cpc&utm_term={keyword}`), aktivera
> Plausible-goals (roadmap **T252**: `onboarding_start`, `plan_completed`,
> `free_tool_letter_generated`), och läs goal-konvertering filtrerad på
> `utm_source=google` / per landningssida. Google Ads ser inga
> konverteringar → ingen Smart Bidding, du optimerar manuellt på
> CPC/CTR + Söktermsrapporten.
>
> **Alternativ B (rekommenderat om budget > någon tusenlapp/mån):**
> **koden är redan byggd** (branch `ads-conversion-tracking`) — mjuk
> konvertering fyr:s i `generatePlan()`, hård (49 kr, med värde,
> `transaction_id` = Stripe-sessionen) i `handlePremiumReturn()`.
> Aktiveras genom att fylla i tre värden i `app.js`
> (`ADS_CONVERSION_ID` + två etiketter). **Fullständig instruktion:
> `ADS-SETUP.md`.** Tills dess laddas ingen Google-kod. När det är på
> får du konverteringar + kostnad/konv. **per sökord** i Ads-tabellen
> och kan köra Smart Bidding (men taggen sätter `_gcl_*`-cookies).
> `gclid`/`utm_*` sparas redan i `localStorage` vid landning oavsett,
> som underlag för offline conversion import senare.

**Utvärdering per sökord (gäller båda alternativen):**
- Tighta annonsgrupper (1–3 sökord/grupp) mot **rätt landningssida** (inte
  startsidan) — annonsgrupperna ovan är redan byggda så.
- Dela sökorden i två hinkar och utvärdera olika:
  - **Informationssökning** ("vad gör man när någon dör", "bouppteckning tid")
    — hög volym, låg köpintention, konkurrerar med er egen organiska
    ranking. Mät kostnad per `onboarding_start` / `plan_completed`. Ofta
    bortkastat att betala för trafik ni redan får gratis.
  - **Transaktionsnära** ("arvskifte mall", "uppsägningsbrev abonnemang
    dödsfall", "fullmakt dödsbo mall") — närmast 49 kr-brevet. Mät
    kostnad per Stripe-betalning (CAC).
- **Söktermsrapporten** (Ads → Sökord → Söktermer) varje vecka: lägg till
  irrelevanta söktermer som negativa sökord.
- Utan alternativ B ger Plausibles **per-sida goal-konvertering** en bra
  proxy för annonsgruppens effektivitet (eftersom varje grupp pekar på
  en egen sida).

## Efter 2 veckors testperiod
- Pausa annonsgrupper med CPC > 10 kr eller 0 konverteringar
- Dubbla budget på annonsgrupper som ger `onboarding_start` under 50 kr/konvertering
- Rapportera tillbaka så vi bestämmer nästa steg tillsammans
