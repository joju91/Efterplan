# Förskotts-formulär — kategori-inventering + förslag på datamodell/UI-flöde

Underlag för T232. Väntar Owner-godkännande innan bygge påbörjas.

## 1. Kategorier i befintlig checklista idag (`app.js` TASK_LIBRARY + onboarding)

Genomgången av `app.js` (TASK_LIBRARY, ~700 rader) och onboardingens trigger-frågor
(`index.html`) ger dessa kategorier/fält att spegla i förskotts-formuläret:

| Kategori | Nuvarande checklist-uppgifter/fält den bygger på |
|---|---|
| Kontakter & anhöriga | "Meddela närstående"-listan, begravningsbyrå-uppgiften |
| Viktiga dokument | Testamente, äktenskapsförord/samboavtal, försäkringsbrev, ID-handlingar — var de finns |
| Bank | `bank_kontakt` (fritextlista över banker, samma mönster som notesPlaceholder) |
| Försäkringar | `forsakringar` (TGL, livförsäkring, fackförbund) |
| Bostad | `fastighet_boende`/`bostadsratt_brf`/`lagfart` (äger/hyr, BRF, lantbruk) |
| Hyresrätt | `hyresratt_uppsagning` (hyresvärd, kontraktsvillkor) |
| Fordon | `fordon_transport` |
| Eget företag | `foretag_bolagsverket`/`foretag_avveckling` (bolagsform, revisor) |
| Värdepapper | `vardepapper_hantering` (bank/mäklare, ISK/depå/kapitalförsäkring) |
| Skulder | `skulder_inventering` (typ, borgenär — inte belopp/kontonr) |
| Digitala konton & lösenordshantering | `avsluta_konton` (Facebook, Google, Apple, e-post, Klarna, PayPal, streaming, spel) |
| Abonnemang & autogiron | `abonnemang`/`autogiron_avsluta` (samma checklista-nycklar återanvänds) |
| Husdjur | `husdjur_omplacering` |
| Utlandstillgångar | `utland_juridik` |
| Minderåriga barn | `minderarig_goman` (endast informativ notis i formuläret — vårdnadsfrågor ligger utanför scope) |
| Övrigt/fritext | matchar de generella `notesPlaceholder`-fälten som redan finns på varje uppgift |

**Ny kategori (per krav):** Begravningsönskemål — finns inte i dagens checklista
(byråkontakt finns, men inte den avlidnes egna önskemål i förväg).

## 2. Föreslagen datamodell

Följer samma mönster som `boppData` (Bouppteckningen) — ett enda localStorage-objekt,
inga obligatoriska fält, allt sparas som fritext/listor snarare än strikt schema (så
formuläret aldrig blockerar på ett tomt fält):

```js
// app.js — nytt state, samma mönster som BOPP_KEY/boppData
const FORSKOTT_KEY = 'efterplan_forskott';

const forskottData = {
  meta: { senastAndrad: null },              // ISO-datum, sätts vid varje save

  kontakter: {
    meddela: [],           // [{ namn: '', relation: '', kontaktvag: '' }]
    begravningsbyraNotering: '',
  },
  dokument: {
    testamente:        { finns: null, var: '' },  // finns: true/false/null (obesvarat)
    aktenskapsforord:   { finns: null, var: '' },
    forsakringsbrev:    { var: '' },
    idHandlingar:       { var: '' },
  },
  bank:          [],   // [{ bank: '', kontotyp: '', notering: '' }]  — ALDRIG kontonummer
  forsakringar:  [],   // [{ bolag: '', typ: '', notering: '' }]
  bostad: {
    typ: '',            // 'bostadsratt' | 'villa' | 'hyresratt' | 'lantbruk' | ''
    brfEllerHyresvard: '',
    notering: '',
  },
  fordon:        [],   // [{ typ: '', notering: '' }]
  foretag:       { finns: null, bolagsform: '', notering: '' },
  vardepapper:   [],   // [{ bankMaklare: '', typ: '', notering: '' }]
  skulder:       [],   // [{ typ: '', bank: '', notering: '' }]  — ALDRIG belopp/kontonr krävt
  digitaltArv: {
    losenordshanterare: '',   // t.ex. "1Password" — ALDRIG lösenordet självt
    appleDigitalArvskontakt: null,   // true/false/null
    googleInaktivKontohantering: null,
    ovrigt: '',
  },
  abonnemang:    [],   // [{ tjanst: '', notering: '' }] — återanvänder checklistans nycklar som förslag
  husdjur:       [],   // [{ namn: '', art: '', onskadOmhandertagare: '' }]
  utland:        { finns: null, notering: '' },
  begravning: {                              // NY kategori
    typ: '',            // 'jordbegravning' | 'kremering' | ''
    form: '',            // 'kyrklig' | 'borgerlig' | ''
    ovrigaOnskemal: '',  // fritext: musik, klädkod, blommor/donation, gravplats m.m.
  },
  fritext: '',           // catch-all, samma roll som notesPlaceholder gör idag
};
```

Designval, med motivering:

- **Inget fält är `required`** — matchar kravet rakt av. `finns`/booleska fält har tre
  lägen (`true`/`false`/`null`=obesvarat) istället för tvingande ja/nej.
- **Inga kontonummer/belopp-fält på bank/skulder/värdepapper** — bara *var* (bank,
  typ, notering). Samma restriktion på `digitaltArv`: bara *var* lösenord förvaras,
  aldrig lösenordet.
- **Listor (`bank`, `forsakringar`, `fordon`, `vardepapper`, `skulder`, `abonnemang`,
  `husdjur`) återanvänder `createLSList()`-fabriken från T221** istället för att
  uppfinna en ny list-komponent — samma add/remove/notering-mönster som redan finns
  på fyra ställen i appen.
- **Ingen koppling till `state` (den sörjande-checklistans huvudobjekt) eller
  onboarding-triggers** — formuläret är helt fristående, ingen delad kod med
  dödsfalls-flödet, för att undvika att en framtida ändring i checklistan råkar
  påverka ett redan ifyllt förskotts-formulär (eller tvärtom).

## 3. Föreslaget UI-flöde

**Ingångspunkt**: ny länk/kort på `index.html`, separat från "Starta din plan"
(dödsfalls-onboardingen) — annan känsloregister (en frisk person som planerar i
förväg, inte någon nyss drabbad). Förslag på text: *"Förbered din egen efterplan —
så att dina närstående slipper leta."*

**Sida**: ny statisk sida `min-efterplan.html`, samma mall/header/footer som
`checklista-dodsbo.html`. Innehåll: en lång scroll av hopfällbara sektioner (samma
`<details>`/accordion-mönster som redan finns i FAQ:erna), en sektion per kategori
ovan, i samma ordning som tabellen. Varje sektion har en kort ingress (varför denna
kategori är bra att fylla i) — samma ton som `notesPlaceholder`-texterna idag.

- **Autosave**: samma `boppSave()`-mönster — spara till `localStorage` vid varje
  blur/change, ingen explicit "Spara"-knapp.
- **Progress**: en enkel räknare ("X av 16 kategorier påbörjade") — inte en
  procent-bar, eftersom inget är obligatoriskt och 0% inte ska kännas som ett fel.
- **Dela/exportera** (botten av sidan, tre knappar):
  1. **Skriv ut / spara som PDF** — återanvänder befintlig print-CSS
     (`window.print()`, samma mönster som checklistans PDF-knapp).
  2. **Kopiera som text** — genererar ett rent textformat av alla ifyllda fält,
     för att klistra in i ett mejl. Inget serverberoende.
  3. **Ingen "dela länk"-knapp** — se roadmap T124/T141: en delad, serverlagrad
     länk för känslig dödsbo-liknande data skrotades medvetet 2026-05-30 och ska
     inte återinföras utan ett nytt uttryckligt beslut. Export/utskrift/kopiera-text
     täcker kravet ("delas manuellt") utan att röra det beslutet.
- **Ingen betalspärr** — hela sidan ligger utanför `paywall`-logiken, matchar kravet.
- **Ingen trigger vid dödsfall** — formuläret har ingen koppling till
  dödsfalls-onboardingen eller `TASK_LIBRARY`. Ett framtida "importera mina
  förskotts-uppgifter till min plan"-steg är en egen, senare ticket om det blir
  aktuellt — inte del av denna.

## 4. Explicit avgränsat bort ur denna ticket

- Realtids-delning eller inloggningsbaserad synk av formuläret — samma skäl som
  T124/T141 (se roadmap.md).
- Automatisk import till checklistan vid registrerat dödsfall — kravet säger
  uttryckligen "ingen automatisk trigger i denna version".
- Digital signering/BankID av något slag — matchar redan T149 (Fas 14): väntar tills
  bolaget är registrerat.
