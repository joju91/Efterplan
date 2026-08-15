# Efterplan — Marketingplan (2026-08-13)

Byggd med `/marketer`-skillen. Grundat på: `app-plan.md`, `company-plan.md`, `efterplan-plan.md`, `manifest.md`, `roadmap.md`, `research/dodsbo-marknadsanalys-2026-08.md`, `outreach.md`, `reddit-poster.md`, `veckorapport-2026-08-10.md`, `NEXT_STEPS_FOR_JONAS.md`.

**Beslut som styr planen (Owner, 2026-08-13):**
1. **Aktivering före trafik.** 16 sessioner senaste veckan gav 0 onboarding_start, 0 plan_generated. Vi driver inte mer trafik in i en tratt vi inte vet fungerar.
2. **SEO-innehåll är huvudkanal** de kommande 90 dagarna. Backlinks/partnerskap och community är stödjande, inte huvudfokus.
3. **Bolagsregistrering/Stripe hålls utanför planen** — behandlas som en separat, redan pågående spår (T003/T004 i roadmap). Intäkts-KPI:er är därför medvetet utanför scope här.
4. **Fortfarande soft launch.** Ingen mediepitch eller stor distributionspush förrän aktivering och volym är stabil.

---

## A. Övergripande strategi

**Marknadsmöjlighet:** ~90 000 dödsfall/år i Sverige, varje ett dödsbo med i snitt flera anhöriga som måste hantera bouppteckning, arvskifte, myndighetskontakter och uppsägningar — ofta helt utan vägledning. Ingen dominerande, gratis, oberoende svensk digital lösning finns (Efterlevandeguiden är gratis men passiv/opersonlig).

**Konkurrensfördel:** Gratis + ingen registrering + data lämnar aldrig enheten (lokal lagring, zero-knowledge-delning) + 49 kr engångspris, långt under Dödsverket och juristbyråer (Lexly/Lavendla). Deterministisk, mobilanpassad, färdiga brevmallar.

**Tillväxttes:** Med $0 annonsbudget är sammansatt organisk SEO + gratis backlinks från förtroendeaktörer (banker, försäkringsbolag, sorgorganisationer) den enda rimliga kanalen just nu. Men det lönar sig bara om besökare faktiskt aktiveras — därför kommer aktiveringsfixen före kanalskalning i tidsplanen.

**Budgetram:** 100% organiskt, 100% svett-kapital (innehåll, teknisk SEO, utskick). Inga annonser denna period.

**Headline-KPI:er (denna period):**
- Organiska sessioner/vecka
- onboarding_start-andel (besök → påbörjad plan)
- plan_generated-andel (påbörjad → klar plan)
- *Inte* intäkt/konvertering till betalning — utanför scope tills Stripe är live (separat spår)

---

## B. Målgrupp & segmentering

**Primärt segment — Akut anhörig (0–14 dagar efter dödsfall).** Hög känslomässig belastning, låg tålamodsnivå, mobil, söker desperat efter "vad gör jag nu"-svar. Matchar den persona-simulering som redan gjorts i produktarbetet ("Du behöver inte hålla reda på allt själv" är löftet som ska möta henne direkt).

**Sekundärt segment — Bouppteckningsfasen (2 veckor–4 månader).** Mer specifika sökningar: bouppteckning kostnad, arvskifte mall, laglott. Redan väl täckt av befintliga 32 sidor.

**Tertiärt segment — Självplanerare.** Söker framtidsfullmakt/testamente proaktivt, ofta efter att själva ha upplevt hur krångligt det blir utan. Lägre akut behov men bygger domänauktoritet och matchar redan identifierat innehållsgap (T196).

**Var de söker:** Google i första hand. Sekundärt Flashback/Facebook-grupper (redan kartlagt i `Aktuella Flashback-trådar (2026) för efterplan.se.md`) och word-of-mouth via banker/begravningsbyråer om partnerskap landar.

---

## C. Kanalstrategi

| Kanal | Prioritet denna period | Motivering |
|---|---|---|
| SEO/innehåll | **Primär** | Enda kanalen som sammansatt växer utan löpande tidskostnad. Redan stark bas (32 sidor, teknisk SEO precis uppdaterad). |
| Backlinks/partnerskap | Stödjande | Färdiga utkast finns (`outreach.md`) — låg kostnad att skicka, hög SEO-hävstång (domänauktoritet), men långsam säljcykel — kör i bakgrunden, inte huvudfokus. |
| Community (Reddit/FB) | Stödjande, låg kadens | Färdiga utkast finns (`reddit-poster.md`). Kräver personlig närvaro från Jonas för att inte se ut som reklam — låg volym per vecka. |
| Betald annonsering | **Ingen denna period** | $0-budget, bolaget oregistrerat. Återuppta när T003/T004 är klara. |

**Attribution:** GA4 redan på plats, kanalfördelning redan synlig i veckorapporten (Organic/Direct/Unassigned).

---

## D. SEO-strategi

**Sökordsresearch:** Ingen levande Search Console-data i produktionen ännu (`NEXT_STEPS_FOR_JONAS.md` #2 väntar på Owner-åtgärd). Tills den finns: bredda långsvans-täckning inom befintligt mönster snarare än gissa nya pelare.

**Innehållspelare (befintliga + ett nytt):**
1. Akutfasen (0–7 dagar) — `vad-gora-nar-nagon-dor`, `checklista-dodsbo`, `dodsbo-checklista-7-dagar`
2. Juridisk kärna — bouppteckning, arvskifte, testamente, laglott, sarkullbarn
3. Ekonomi — efterlevandepension, arvsskatt, dödsbo-skulder, deklaration
4. Praktiskt/närliggande — bostad, bil, gravsten, dödsannons, digitalt dödsbo
5. **Nytt: Självplanering** — framtidsfullmakt (T196), riktar sig till samma målgrupp men i "nu ordnar jag mitt eget"-läge

**On-page:** Redan i gott skick — canonical-taggar, FAQPage-schema, og/twitter-cards och titeltaggar under 65 tecken uppdaterade 2026-08-13.

**Teknisk SEO-checklista:**
- [x] `sitemap.xml` lastmod-datum uppdaterade till faktiska ändringsdatum
- [x] `twitter:card` på alla 32 sidor
- [ ] Search Console verifierad + sitemap inskickad (Owner-åtgärd, `NEXT_STEPS_FOR_JONAS.md` #2)
- [ ] Indexeringsstatus kontrollerad (hur många av 32 sidor är faktiskt indexerade?)

**Länkbyggnad:** Fem färdigskrivna mejl i `outreach.md` (sorg.se, SPES, Svenska kyrkan, 1177-redaktionen) — redo att skickas, ingen ny copy behövs.

**Mätning:** Organiska sessioner/vecka (redan i veckorapporten), impressions/CTR per sida (kräver Search Console-data).

---

## E. Innehållsstrategi

**Format:** Långformade guider i befintligt mönster — inte volym för volymens skull. Juridiskt innehåll kräver samma källbeläggnings-rigör som Fas 21-audten (sakfel kostar användare pengar eller fel process).

**Meddelanderam:** "Du behöver inte hålla reda på allt själv" — det centrala löftet ska vara igenkännbart konsekvent över hero, alla guide-sidor och onboarding.

**Distribution/förstärkning:** Intern länkning mellan guide-sidor (redan delvis på plats via `resources`-listor i appens regelmotor) — stärk detta ytterligare genom att varje guide-sida länkar till 2–3 relaterade sidor.

**Mätning:** Sessioner per sida, engagement rate per sida (kräver GSC/GA4-nedbrytning per URL).

---

## F. Betald annonsering

**Medvetet pausad denna period.** Ingen budget, bolaget oregistrerat, ingen fungerande betalningsspårning för att räkna CAC/ROAS ändå. Trigger för att återuppta: T003/T004 klara + Stripe live (T032). Ingen ytterligare planering här förrän dess.

---

## G. Viral- & communitytillväxt

**Delningsfunktionen som redan finns:** T177 (krypterad, läsbar delningslänk) gör att en anhörig kan dela sin plan med syskon/familj. Det är en inbyggd spridningsloop som redan är byggd men inte aktivt lyfts fram i copy — en låg kostnad att förstärka ("Dela planen med syskon eller andra i familjen") i onboarding/plan-vyn.

**Community:** Reddit-utkast finns (r/sweden, r/privatekonomi) med tydlig kadensregel (max en post i taget, minst en vecka mellan subreddits, svara aktivt första timmarna). Körs via `community-distributor`-skillen med Jonas godkännande varje gång — låg volym, inte huvudinsats denna period.

**PR/förtjänad media:** Mediepitchar (Aftonbladet, Råd & Rön) finns färdiga i `outreach.md` men **hålls tillbaka till dag 60+**, styrt av soft launch-beslutet — en mediepik in i en otestad tratt är ett slösat enda-skott-tillfälle.

**Retention/loopar:** Efterplan är i grunden en engångsanvändning (dödsbo-processen tar slut), så klassisk retention/LTV är mindre relevant än **task_completed-frekvens inom en session/vecka** — det är den återkommande-loop som faktiskt finns i produkten.

---

## H. Tratt & konverteringsoptimering (CRO) — högst prioritet denna period

**Trattkarta:**
Organisk sökning → landningssida → klick på "Kom igång" → `onboarding_start` → 4-stegs onboarding → `plan_generated` → uppgiftsinteraktion → (senare, separat spår) 49 kr-uppgradering

**Observerat dropoff:** 16 sessioner senaste veckan, **0 onboarding_start**. Det är inte bevisat att det är ett UX-problem — det kan lika gärna vara en spårningsbugg, eget testtrafik som inte filtrerats bort (`NEXT_STEPS_FOR_JONAS.md` #1, fortfarande ogjord), eller helt enkelt för litet sampel (16 är litet). **Diagnos före redesign** — se P0-uppgifter nedan.

**A/B-testning:** Inte meningsfullt vid nuvarande volym (16 sessioner/vecka är för litet för statistisk signifikans). Sätt en tröskel — t.ex. 150–200 sessioner/vecka — innan formell A/B-testning påbörjas. Fram tills dess: kvalitativa fixar baserade på sessionsinspelning/felsökning, inte gissningar.

**Mätdashboard:** Den automatiska veckorapporten (`weekly-report.yml`) finns redan — komplettera den med onboarding_start-andel och plan_generated-andel mer framträdande (se P1-uppgift nedan) så aktiveringsmåttet inte begravs i sessionssiffror.

---

## I. KPI:er & mätplan

| Kategori | Mått | Källa |
|---|---|---|
| Topline | Organiska sessioner/vecka | GA4 (redan i veckorapport) |
| Aktivering | onboarding_start / sessions | GA4 |
| Aktivering | plan_generated / onboarding_start | GA4 |
| Innehåll | Indexerade sidor / 32 totalt | Search Console (väntar på Owner-åtgärd) |
| Innehåll | Impressions/CTR per sida | Search Console |
| Produktloop | task_completed-frekvens per session | GA4 |

**Verktyg:** GA4 + automatisk GitHub Actions-veckorapport (befintlig). Rekommenderar Microsoft Clarity (gratis, ingen kostnad, session-inspelning) som komplement — GA4:s aggregerade siffror visar *att* något läcker, inte *varför*.

---

## J. 30/60/90-dagarsplan

### Dag 1–30 — Diagnostisera och laga aktivering (ingen ny trafiksatsning)
- Verifiera att `onboarding_start`-spårningen faktiskt fungerar (GA4 DebugView, kontrollera JS-fel i produktion)
- Filtrera bort Jonas egen IP i GA4 (redan dokumenterat, ogjort — `NEXT_STEPS_FOR_JONAS.md` #1)
- Installera gratis sessionsinspelning (Microsoft Clarity) för att se faktiskt beteende på hero/CTA
- Kör igenom `PRE_LAUNCH_CHECKLIST.md` på nytt mot produktionssajten (mobil Safari + Chrome) efter alla senare kodändringar
- Skicka de 4 färdigskrivna outreach-mejlen (sorg.se, SPES, Svenska kyrkan, 1177) — lågkostnad, kräver bara Jonas godkännande att skicka
- Verifiera Search Console + skicka in sitemap (`NEXT_STEPS_FOR_JONAS.md` #2)

**Förväntat utfall:** Antingen (a) spårningen var trasig och aktiveringen är faktiskt högre än 0%, eller (b) ett konkret, videoinspelat UX-hinder identifierat att åtgärda.

### Dag 31–60 — Skala SEO-innehåll, håll community/backlinks i bakgrunden
- Kör om T196–T198-gapanalysen mot riktig Search Console-data, skriv den högst prioriterade sidan
- Förstärk intern länkning mellan guide-sidor
- Lyft fram delningsfunktionen (T177) tydligare i copy — gratis spridningsloop som redan är byggd
- Fortsätt lågkadens community-postning (max varannan vecka) via `community-distributor`-skillen

### Dag 61–90 — Utvärdera: redo att lämna soft launch?
- Om onboarding_start-andelen är stabilt frisk och organisk trafik vuxit: skicka mediepitcharna (Aftonbladet, Råd & Rön) från `outreach.md`
- Om inte: fortsätt aktiveringsarbetet, skjut mediepitch till nästa 90-dagarsperiod
- Sätt tröskeln för formell A/B-testning (150–200 sessioner/vecka) och starta om den nåtts

---

## K. Konkreta, agent-exekverbara uppgifter

**P0 — blockerar allt annat**

1. **GA4-spårningsaudit.** Verifiera att `onboarding_start`-eventet faktiskt triggas korrekt vid klick på "Kom igång" (DebugView-test), kontrollera webbläsarkonsolen för JS-fel på produktions-URL:en på mobil. Leverabel: kort rapport — fungerar spårningen, och om inte, vad är felet.
2. **Manuell trattgenomgång.** Kör `PRE_LAUNCH_CHECKLIST.md` mot https://efterplan.se på riktig mobil (iOS Safari + Android Chrome), dokumentera varje friktionspunkt. Leverabel: uppdaterad checklista med resultat + skärmdumpar av eventuella fel.
3. **Sessionsinspelning.** Sätt upp Microsoft Clarity (gratis) på produktionssajten. Leverabel: installerad tracking-kod + bekräftelse att inspelningar kommer in.

**P1 — hög prioritet, kräver Owner-godkännande innan utskick**

4. **Skicka outreach-mejlen.** De 4 mejlen i `outreach.md` (sorg.se, SPES, Svenska kyrkan, 1177) är färdigskrivna — kräver bara Jonas godkännande och avsändande. Leverabel: mejl skickade, mottagare och datum loggat.
5. **Search Console-verifiering.** Följ `NEXT_STEPS_FOR_JONAS.md` #2 — verifiera egendom, skicka in sitemap, exportera Performance-CSV (28 dagar). Leverabel: CSV skickad tillbaka för sökordsanalys.
6. **Veckorapport-komplettering.** Lägg till onboarding_start-andel och plan_generated-andel som egna, framträdande rader (inte bara råa antal) i `weekly-report.yml`. Leverabel: uppdaterat GitHub Actions-skript, verifierat i nästa körning.

**P2 — medium prioritet, låg kostnad**

7. **Skriv T196 (framtidsfullmakt)** när Search Console-data bekräftar prioritering — annars vänta enligt tidigare Owner-beslut.
8. **Community-postning enligt kadens** — en post var 14:e dag max, via `community-distributor`-skillen, Jonas godkänner varje inlägg innan det går live.
9. **Förstärk delningscopy** (T177-funktionen) i plan-vyn — "Dela planen med syskon eller andra i familjen", låg kodinsats.

---

*Denna plan utgår explicit ifrån att bolagsregistrering/Stripe (T003/T004/T032) hanteras separat och inte är en del av detta spår, samt att ingen betald annonsering körs denna period.*
