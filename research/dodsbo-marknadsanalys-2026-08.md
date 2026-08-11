# Marknadsanalys: digitalisering av dödsbohantering (2026-08)

**Källa:** Extern research körd i Gemini, delad av Jonas 2026-08-11: https://share.gemini.google/RbkuxdKOv3PF ("Digitalisering av dödsbohantering: En jämförande marknadsanalys, teknisk replikeringsmodell och produktstrategi för nästa generations tjänster"). Detta dokument är en egen, kortare destillering för intern roadmap-användning — inte en ordagrann kopia av källan.

Refereras av roadmap-tickets **T149–T153** (Fas 14, `roadmap.md`).

---

## Marknadsgapet

Skatteverket aviserar automatiskt myndigheter, kommuner och banker vid ett dödsfall — men **aldrig privata avtal**: telekom, bredband, streaming, el, hyra, försäkring, föreningsmedlemskap. Samtidigt spärrar bankerna den avlidnes BankID/internetbank/Swish/kort omedelbart, medan autogiron och kortdebiteringar fortsätter dras så länge det finns täckning. Anhöriga hamnar i ett manuellt, känslomässigt tungt hålrum mellan dessa två system.

Juridiskt komplicerar det att personliga fullmakter och internetbanksfullmakter upphör vid dödsfallet, och framtidsfullmakter tappar sin huvudsakliga verkan (21 § avtalslagen — endast åtgärder som förhindrar akut ekonomisk skada). Formell förvaltning kräver dödsfallsintyg med släktutredning från Skatteverket + skriftlig, bevittnad fullmakt från samtliga dödsbodelägare, vilket ofta tar veckor.

## Konkurrentöversikt (komprimerad)

| Aktör | Marknad | Modell | Automatiseringsgrad |
|---|---|---|---|
| Efterlevandeguiden | SE | Offentlig, gratis | Ingen — passiva checklistor, ingen verkställighet |
| Lexly / Lavendla | SE | B2C juridik, fastpris/timarvode | Låg–medel — mallar + juristgranskning |
| **Dödsverket** | SE | B2C fast avgift per dödsbo | Medel — skriftlig handläggning (brev/e-post) mot operatörer |
| **Efterplan (vi)** | SE | B2C — gratis checklista + engångsbetalning (49 kr) för dokument | Medel — deterministisk checklista + text-brevgenerator (copy/paste), ingen orkestrering mot tredje part |
| Settld | UK | B2B (leverantörer betalar per avisering) + fastprisbouppteckning | Hög — automatiserad batch-notifiering till 1400+ organisationer |
| Empathy | US/UK | B2B2C via försäkringsbolag/arbetsgivare | Mycket hög — AI + 24/7 mänskliga "Care Managers", krypterat digitalt valv |

## Tre arkitektoniska byggstenar som skiljer de vassaste aktörerna (Settld, Empathy) från de svaga (Efterlevandeguiden, Dödsverket) — och som Efterplan idag saknar

1. **Identitets-/fullmaktsmotor** — BankID-flerpartssignering av en digital dödsbofullmakt, kopplad direkt mot Skatteverkets dödsfallsintyg. Eliminerar dagens pappersfullmakter och splittrade bankblanketter.
2. **Open Banking-skanning (PSD2)** — läs-API mot den avlidnes bankkonto, skannar 12 månaders transaktionshistorik och kategoriserar automatiskt alla återkommande utflöden (autogiron, e-fakturor, kortdebiteringar) — hittar även bortglömda avtal, istället för att anhöriga manuellt ska lista dem.
3. **Orkestrering i tre kanaler** — strukturerad API-koppling mot stora leverantörer, krypterad säker e-post mot medelstora, print-on-demand rekommenderat brev mot resten (föreningar, hyresvärdar).

## Var Efterplan står idag mot dessa tre byggstenar

- **Fullmaktsmotor**: `app.js` har `generateFullmakt()` — en text-generator (copy/paste), ingen digital signering, ingen BankID-koppling, ingen Skatteverket-integration. `fullmakt-dodsbo.html` är ren informationstext.
- **Open Banking**: inget alls — noll referenser till PSD2/Tink/Open Banking i kodbasen.
- **Orkestrering**: `app.js` genererar brevtext för Bank/Försäkring/Skatteverket/Dödsannons — men skickar dem aldrig. Användaren kopierar/skriver ut/mejlar manuellt själv. Ingen API- eller print-on-demand-koppling mot tredje part.

Slutsats: Efterplans nuvarande styrka är ett gratis, deterministiskt checklistflöde med bra SEO-räckvidd (33 sidor) — men noll av de tre byggstenarna som driver Settld/Empathys automatiseringsgrad är byggda. Detta är en stor investering (licenser, partnerskap, regelefterlevnad), inte en ren kodsprint — se research-tickets nedan.

## Differentiatorer att äga före konkurrenterna (om vi går vidare)

- Automatiserad PSD2-identifiering — ingen manuell gissning av avtal.
- En standardiserad, BankID-signerad dödsbofullmakt som alla svenska storbanker godtar (löser dagens splittrade bankblanketter per bank).
- B2B2C-distribution via livförsäkringsbolag/fackförbund (Empathy-modellen) — gratis för de sörjande, betalt av försäkringsbolaget vid utbetalning.
- Regelmotor: uppsägningstid räknas juridiskt från dödsdatum, inte aviseringsdatum, plus automatiska återbetalningskrav för felaktigt debiterad tid efter dödsfallet.

## Föreslagen fasindelning (Gemini)

1. **Fas 1 — Grundflöde**: BankID-flerpartssignering av dödsbofullmakt, dödsfallsintygsflöde (API om möjligt, annars uppladdning/manuell verifiering), mallbaserade uppsägningsbrev mot de ~50 största leverantörerna.
2. **Fas 2 — Open Banking-skanning**: PSD2-integration + kategorisering av återkommande utflöden, regelmotor för sista giltiga avtalsdag + återbetalningskrav.
3. **Fas 3 — B2B2C-distribution**: partnerskap med försäkringsbolag/fackförbund/begravningsbyråer som distributionskanal, gratis för slutanvändaren.

## Hur detta mappats mot Efterplans roadmap (beslut 2026-08-11)

Se `roadmap.md`, sektion **🧭 STRATEGISESSION — 2026-08-11**:

- Gemini-Fas 2:s "regelmotor" (uppsägningstid från dödsdatum) överlappar redan med **T135** (deadline-motor, redan planerad sedan 2026-07-18, näst på tur) — ingen ny ticket behövdes där.
- Resten av Gemini-visionen (BankID-fullmakt, Skatteverket-API, PSD2, standardiserad bankfullmakt, B2B2C-partnerskap) lades in som **rena research-tickets T149–T153** i en ny **Fas 14** — inget byggåtagande än. Kräver dels att researchen ger svar (finns API:er, vad kostar/kräver leverantörerna), dels att bolaget faktiskt är registrerat (T003/T004, fortfarande ☐) innan seriösa bank- eller försäkringsbolagssamtal ens är realistiska.
- En ny, oberoende funktion — **Dokumentcentral** (fota/kategorisera/flagga dokument, T143–T148 i ny **Fas 13**) — bedömdes vara byggbar redan nu med befintliga mönster (kamera-scan från T067, localStorage/Supabase-synk) och lades in i turordningen mellan T135 och T136.
