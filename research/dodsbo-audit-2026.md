# Dödsbo-audit 2026 — Efterplan.se

**Datum:** 12 augusti 2026
**Omfattning:** Samtliga 33 HTML-sidor i repo-roten med dödsbo-/bouppteckning-/arvsrelaterat sakinnehåll (begravningsrelaterade sidor har granskats översiktligt, se not i slutet).
**Metod:** Varje sida lästes i sin helhet och jämfördes mot primärkällor (Skatteverket, Pensionsmyndigheten, Lantmäteriet, Riksdagen/Regeringen, kommunal socialtjänst) samt sekundärkällor (Lawline, Familjens Jurist, SBF/begravningar.se) där primärkälla inte gick att nå direkt. Interna motsägelser mellan Efterplans egna sidor flaggas separat.
**Relation till annan research i mappen:** `Lagändringsaudit.md` (samma mapp) täcker samma lagändring per 1 juli 2026 men är skriven som ett kod-/produktlogik-underlag för app.js/Efterplan-flödet. Den här rapporten är en renodlad **innehållsaudit av de statiska guide-sidorna** och går djupare på sakfel (särskilt kapitalvinstskatt och efterlevandepension) som inte täcks där. Filerna motsäger inte varandra på punkten om bestyrkt kopia/digital inlämning — båda bekräftar att e-tjänsten **inte** är igång ännu.

---

## Sammanfattning — topp 5 efter användarpåverkan

| # | Fynd | Typ | Berör |
|---|------|-----|-------|
| 1 | **Fabricerad "uppstegsprincip"** för kapitalvinstskatt på ärvd fastighet — motsäger både lag och tre andra sidor på samma sajt | Sakfel, kan orsaka underskattad skatt | [dodsbo-fastighet.html](../dodsbo-fastighet.html) |
| 2 | **Sambo nekas felaktigt omställningspension** — sambo *med gemensamma barn* eller tidigare gift/partner har rätt till den | Sakfel + intern motsägelse | [efterlevandepension.html](../efterlevandepension.html), [index.html](../index.html) |
| 3 | **Dödsboanmälan saknas helt** i de sidor flest användare läser (checklistor, tidslinje) — det enklare, kostnadsfria alternativet till bouppteckning | Saknat steg, hög räckvidd | [checklista-dodsbo.html](../checklista-dodsbo.html), [bouppteckning-tidslinje.html](../bouppteckning-tidslinje.html), [dodsbo-checklista-7-dagar.html](../dodsbo-checklista-7-dagar.html), [vad-gora-nar-nagon-dor.html](../vad-gora-nar-nagon-dor.html), [index.html](../index.html) |
| 4 | **Dödsboanmälan felaktigt tillskriven Skatteverket** i stället för kommunens socialtjänst | Sakfel | [dodsbo-skulder.html](../dodsbo-skulder.html) |
| 5 | **Lagändring 1 juli 2026 (prop. 2025/26:46) saknas**: personnummer/samordningsnummer för alla kallade till förrättningen, krav på bestyrkt kopia borttaget | Föråldrad info | [bouppteckning-guide.html](../bouppteckning-guide.html), [bouppteckning-tidslinje.html](../bouppteckning-tidslinje.html) |
| 6 | **Felaktig stämpelskatt vid lagfart genom arv** — påstår 1,5 % stämpelskatt även vid rent arvskifte utan vederlag; ska normalt vara enbart 825 kr | Sakfel, felaktigt belopp | [arvskifte-guide.html](../arvskifte-guide.html), [dodsbo-fastighet.html](../dodsbo-fastighet.html) |

---

## KRITISKT (P0) — sakfel som kan leda till fel skatt/fel process

### 1. [dodsbo-fastighet.html](../dodsbo-fastighet.html) — fabricerad "uppstegsprincip"

**Problem:** Sidan skriver:
> "Anskaffningsvärdet = fastighetens marknadsvärde vid dödsfallet (inte ursprungligt köppris). Det s.k. 'uppstegsprincipen' innebär att dödsboet inte behöver betala skatt på värdeökning som skett under ägarens livstid."

Detta är fel. Svensk rätt har **ingen** step-up i anskaffningsvärde vid arv. Det är tvärtom **kontinuitetsprincipen** som gäller: arvtagaren/dödsboet tar över den ursprunglige ägarens anskaffningsvärde, inte marknadsvärdet vid dödsfallet. Räkneexemplet på sidan ("fastigheten värderades till 3 500 000 kr vid dödsfallet och säljs för 3 800 000 kr... vinsten är 220 000 kr") bygger helt på den felaktiga principen och skulle ge en dramatiskt för låg skatteberäkning för ett hus som köpts billigt för länge sedan.

**Källa som motsäger:** Inkomstskattelagen 44 kap. 21 §; bekräftat av Skatteverkets vägledning om avyttring av fastigheter samt Familjens Jurist/Lawline/Minilex ("kontinuitetsprincipen... man träder in i den tidigare ägarens skattemässiga situation"). **Dessutom motsägs sidan av tre andra Efterplan-sidor**, som alla har det rätt:
- [arvsskatt.html](../arvsskatt.html): "Anskaffningsvärdet är det pris den ursprunglige ägaren betalade för fastigheten — inte värdet vid dödsfallet. Det kallas kontinuitetsprincipen."
- [salja-dodsbo.html](../salja-dodsbo.html): "Anskaffningsvärde (ursprungligt köppris)"
- [arvskifte-guide.html](../arvskifte-guide.html): "ingen kapitalvinstskatt utlöses vid den tidpunkten. Skatten betalas först när arvingen i sin tur säljer fastigheten, baserat på det ursprungliga anskaffningsvärdet."

**Förslag till ny text:**
> "Anskaffningsvärdet = det pris den ursprungliga ägaren betalade för fastigheten (plus förbättringsutgifter), inte marknadsvärdet vid dödsfallet. Det kallas **kontinuitetsprincipen**: dödsboet tar över den avlidnes skattemässiga situation. Har fastigheten gått i arv flera generationer utan att säljas kan den latenta skatten vara betydande — ta reda på det ursprungliga inköpspriset innan ni planerar en försäljning."

Räkneexemplet måste räknas om med ett realistiskt historiskt anskaffningsvärde i stället för dödsdagsvärdet.

---

### 2. [efterlevandepension.html](../efterlevandepension.html) — sambo nekas felaktigt omställningspension

**Problem:** Sidan skriver kategoriskt:
> "Sambo — gäller omställningspension? Nej, den statliga omställningspensionen gäller inte för sambor."

Detta stämmer bara delvis. Enligt Pensionsmyndigheten kan en sambo få omställningspension om paret **har eller har haft gemensamt barn, väntade gemensamt barn vid dödsfallet, eller tidigare varit gifta/registrerade partner**. Det är alltså inte korrekt att helt utesluta sambor — en stor andel svenska familjer med gemensamma barn är sambor, inte gifta, vilket gör detta till ett högfrekvent fel.

**Intern motsägelse:** [index.html](../index.html) FAQ säger tvärtom, utan villkor: *"Ja. Efterlevandepension kan utbetalas till make, maka, sambo och barn under 20 år."* — vilket är korrekt i sak (sambo *kan* få det) men saknar villkoret om gemensamt barn, så det blir missvisande åt andra hållet (låter ovillkorat). De två sidorna säger alltså rakt motsatta saker till samma användare.

**Källa som motsäger:** [Pensionsmyndigheten – Omställningspension](https://www.pensionsmyndigheten.se/forsta-din-pension/ekonomiskt-stod/omstallningspension): "Du kan alltså inte få omställningspension enbart för att du bodde tillsammans" — men *kan* få det med gemensamt barn (nuvarande, tidigare eller väntat) eller om ni tidigare varit gifta/registrerade partner.

**Förslag till ny text (efterlevandepension.html):**
> "Sambo — gäller omställningspension? Ja, under vissa villkor. En sambo kan få omställningspension om ni har eller har haft gemensamt barn, väntade barn tillsammans vid dödsfallet, eller tidigare varit gifta eller registrerade partner. Enbart samboskap utan gemensamt barn eller tidigare äktenskap ger däremot **ingen** rätt till omställningspension."

**Förslag till ny text (index.html FAQ):** lägg till villkoret — "...make, maka, registrerad partner och sambo *med gemensamt barn* (nuvarande, tidigare eller väntat), samt barn under 20 år."

Passa också på att lägga till: förlängd omställningspension gäller till barnets 12-årsdag *eller*, om 12-månadersperioden annars tar slut innan barnet fyllt 18, till 18-årsmånaden (nuvarande text nämner bara 12 år, vilket är en förenkling som kan underskatta utbetalningstiden i vissa fall).

---

### 3. [dodsbo-skulder.html](../dodsbo-skulder.html) — dödsboanmälan felaktigt tillskriven Skatteverket

**Problem:** "Dödsboanmälan göras — om tillgångarna inte ens täcker begravningskostnaderna kan **Skatteverket** göra en förenklad dödsboanmälan istället för bouppteckning. Det innebär att dödsboet avskrivs utan formellt skifte."

Två fel i en mening: (1) Det är **kommunens socialtjänst** som utreder och upprättar dödsboanmälan (20 kap. 8 a § ärvdabalken), inte Skatteverket — Skatteverket tar bara emot och registrerar den färdiga anmälan. (2) Formuleringen "dödsboet avskrivs" är missvisande — det är bouppteckningsplikten som faller bort, inte skulderna eller boet i sig.

**Källa som motsäger:** Skatteverkets rättsliga vägledning om dödsboanmälan; samstämmigt hos samtliga kommuner (t.ex. Norrköping, Enköping, Kalmar): "Dödsboanmälan upprättas av kommunens socialtjänst och ska vara skriftlig."

**Förslag till ny text:**
> "Dödsboanmälan kan göras i stället — om tillgångarna inte räcker till mer än begravningskostnader och andra utgifter i samband med dödsfallet, och det inte finns fastighet eller bostadsrätt i boet, kan **kommunens socialtjänst** upprätta en dödsboanmälan och skicka den till Skatteverket. Det innebär att ingen bouppteckning behöver göras — men skulderna försvinner inte, det är bara den formella utredningsplikten som faller bort. Läs mer i vår guide om [checklista dödsbo]."

---

### 4. [arvskifte-guide.html](../arvskifte-guide.html) och [dodsbo-fastighet.html](../dodsbo-fastighet.html) — fel stämpelskatt vid lagfart genom arv

**Problem:**
- arvskifte-guide.html: "Glöm inte att anmäla ägarbytet till Lantmäteriet (lagfartsansökan) inom tre månader från arvskiftesdatumet. Kostnaden är 825 kr plus 1,5 % av fastighetens taxeringsvärde i stämpelskatt."
- dodsbo-fastighet.html: "Om en arvinge ska behålla fastigheten (inte sälja den) måste lagfart tas ut efter att arvskiftet är genomfört. Lagfarten kostar 1,5 % av köpeskillingen (stämpelskatt) + 825 kr administrativ avgift."

Båda presenterar 1,5 % stämpelskatt som standard vid arv. Det stämmer inte för det vanliga fallet — ett rent arvskifte utan att någon betalar de andra arvingarna. Då utgår **ingen stämpelskatt alls**, bara expeditionsavgiften på 825 kr. Stämpelskatt (1,5 %) blir aktuell bara om en arvinge löser ut de andra med ersättning som når **85 % eller mer av taxeringsvärdet** — då behandlas den delen skattemässigt som ett köp.

**Källa som motsäger:** Lantmäteriet, "Stämpelskatt och avgifter": "Vid arv och bodelning behöver du inte betala någon stämpelskatt, utan bara expeditionsavgiften" (825 kr). 85-procentsgränsen för när en utlösen räknas som köp bekräftas av Lawline/Jurio/Ekonomifokus.

**Förslag till ny text (båda sidorna):**
> "Lagfart vid ett rent arvskifte (ingen arvinge betalar de andra) kostar bara **825 kr i expeditionsavgift** — ingen stämpelskatt utgår. Löser en arvinge ut de andra med kontanter och ersättningen når 85 % eller mer av fastighetens taxeringsvärde, behandlas det skattemässigt som ett köp och **1,5 % stämpelskatt** tillkommer på den delen. Kontrollera med Lantmäteriet om er specifika situation faller under gränsen."

---

## HÖGT (P1) — saknat processteg med stor räckvidd

### 5. Dödsboanmälan saknas i de mest lästa checklistorna

**Berörda filer och vad som saknas:**

| Fil | Nuläge | Förslag |
|---|---|---|
| [checklista-dodsbo.html](../checklista-dodsbo.html) | Nämner bara bouppteckning, inget om dödsboanmälan | Lägg till en kort ruta under "Planera bouppteckningen": "Om dödsboets tillgångar bara täcker begravningskostnaderna och det inte finns fastighet eller bostadsrätt kan en **dödsboanmälan** hos kommunens socialtjänst ersätta bouppteckningen — kostnadsfritt, men med egen tidsfrist (bör göras inom ca 2 månader). Läs mer i vår bouppteckningsguide." |
| [bouppteckning-tidslinje.html](../bouppteckning-tidslinje.html) | Presenterar bouppteckningens 3/4-månadersfrister som om det alltid är den enda vägen | Lägg till en tydlig förgrening tidigt i tidslinjen: "Innan ni börjar — kontrollera om dödsboanmälan räcker. Om dödsboet saknar fastighet/bostadsrätt och tillgångarna bara täcker begravningskostnaderna kan kommunens socialtjänst göra en dödsboanmälan i stället, med en egen (kortare) tidsram på ca 2 månader." |
| [dodsbo-checklista-7-dagar.html](../dodsbo-checklista-7-dagar.html) | Går rakt på att "kontakta jurist för bouppteckning" dag 6–7 utan alternativ | Lägg till en mening: "Om dödsboet är mycket litet (bara täcker begravningskostnaderna, ingen fastighet/bostadsrätt) — kontakta i stället kommunens socialtjänst om dödsboanmälan, som är gratis och går snabbare." |
| [vad-gora-nar-nagon-dor.html](../vad-gora-nar-nagon-dor.html) | Samma — bouppteckning presenteras som enda vägen | Lägg till kort rad i "Vad händer sen?"-listan med länk. |
| [index.html](../index.html) | FAQ "Hur lång tid har man på sig att göra bouppteckning?" nämner inget alternativ; onboardingflödet frågar inte om boets storlek på ett sätt som triggar dödsboanmälan | Lägg till en mening i FAQ-svaret + överväg en fråga i onboardingflödet ("Är dödsboets tillgångar mycket små — täcker de knappt begravningskostnaderna?") som kan styra användaren till rätt process |

**Varför hög prioritet:** Dödsboanmälan används i en betydande andel av alla dödsfall i Sverige (framför allt vid låg inkomst, ensamboende äldre utan fastighet) och har helt andra tidsfrister, kostnader (gratis) och krav (hembesök, kontoutdrag 3 månader tillbaka, orörd bostad) än bouppteckning. Att helt utelämna det i de sidor flest användare landar på riskerar att skicka folk in i en onödigt dyr och tidskrävande process de inte behöver.

**Källa:** 20 kap. 8 a § ärvdabalken; kommunal praxis (Norrköping, Enköping, Kalmar, Tomelilla m.fl.): dödsboanmälan bör vara kommunen tillhanda inom två månader efter dödsfallet (inte en absolut frist, men styrande eftersom bouppteckningens 3-månadersfrist annars börjar närma sig); kräver kontoutdrag 3 månader bakåt i tiden, hembesök i bostaden och att bostaden lämnas orörd fram till besöket; **gäller inte** om den avlidne ägde fastighet eller tomträtt (bostadsrätt behandlas restriktivt och leder normalt också till att bouppteckning krävs).

**Fördjupning finns redan delvis:** [bouppteckning-guide.html](../bouppteckning-guide.html) har en kort och i grunden korrekt ruta om dödsboanmälan, men saknar tidsfrist, villkor (ingen fastighet/bostadsrätt) och dokumentkrav (kontoutdrag, hembesök). Komplettera den med:
> "Dödsboanmälan görs av kommunens socialtjänst — inte av dig själv eller Skatteverket. Den förutsätter att det inte finns fastighet eller bostadsrätt i boet. Socialtjänsten begär vanligen kontoutdrag för de senaste 3 månaderna och gör ett hembesök i bostaden, som bör lämnas orörd fram till dess. Anmälan bör vara kommunen tillhanda inom cirka 2 månader efter dödsfallet — en kortare tidsram än bouppteckningens 3/4 månader."

---

### 6. Lagändring 1 juli 2026 (prop. 2025/26:46) saknas

**Berörda filer:** [bouppteckning-guide.html](../bouppteckning-guide.html), [bouppteckning-tidslinje.html](../bouppteckning-tidslinje.html)

**Problem:** Ingen av sidorna nämner att:
1. **Personnummer eller samordningsnummer** (eller födelsedatum om sådant saknas) numera ska anges för **alla som kallas till bouppteckningsförrättningen** — inte bara dödsbodelägarna.
2. Kravet på att skicka in en **bestyrkt kopia** tillsammans med originalet är borttaget.
3. Lagstiftningen möjliggör **elektronisk inlämning**, men Skatteverkets e-tjänst för detta är **inte lanserad ännu** (utvecklingskostnad ca 100 miljoner kr enligt propositionen) — pappersinlämning i original gäller fortsatt.
4. Termen "gode män" vid förrättningen byts till "förrättningspersoner" (lägre prioritet, kosmetiskt).

**Källa:** [Prop. 2025/26:46 Elektronisk inlämning av bouppteckningar](https://www.regeringen.se/contentassets/632735d768a44f20a8e1f3c84a5b9bcc/elektronisk-inlamning-av-bouppteckningar-prop.-20252646.pdf), ikraftträdande 1 juli 2026; Skatteverkets nyhetssida "Förändringar som rör bouppteckningar".

**Förslag till ny text (bouppteckning-guide.html, i steg-för-steg-avsnittet "Vecka 3"):**
> "Boka datum för bouppteckningsförrättningen. Kalla alla dödsbodelägare och övriga som ska kallas (t.ex. efterarvingar) — sedan 1 juli 2026 ska personnummer eller samordningsnummer anges för var och en som kallas, inte bara för delägarna."

Och i "Vecka 4":
> "Håll förrättningen med två vittnen. Fyll i Skatteverkets blankett (SKV 4600) och skicka in originalet inom 4 månader från dödsfallet. Sedan 1 juli 2026 behöver ni **inte längre** skicka med en bestyrkt kopia. Elektronisk inlämning är förberedd i lagstiftningen men Skatteverkets e-tjänst för detta är i skrivande stund inte i drift — handlingen ska fortfarande skickas in i original på papper."

**Notera:** Ändringen påverkar inte de faktiska 3-/4-månadersfristerna — dessa är fortsatt korrekta på båda sidorna och behöver inte ändras.

---

## MEDEL (P2)

### 7. [dodsbo-deklaration.html](../dodsbo-deklaration.html) — förenklad skattesats för näringsverksamhet

**Problem:** "Näringsinkomster: 20 % (proportionell statlig inkomstskatt)" presenteras som dödsboets skattesats rakt av. I praktiken gäller det bara **från och med det fjärde kalenderåret efter dödsfallsåret** — under de första åren beskattas dödsboet i huvudsak som den avlidne skulle ha beskattats (progressivt), inte platt 20 %.

**Källa som motsäger:** Samstämmig branschinformation (redovisningsbyråer, Skatteverkets systematik för dödsbon): "Från och med det fjärde året efter dödsfallsåret betalar dödsboet statlig inkomstskatt med 20 procent på hela den beskattningsbara förvärvsinkomsten."

**Förslag till ny text:**
> "Näringsinkomster: beskattas under de tre första åren efter dödsfallet ungefär som om den avlidne fortfarande levde (progressiv skatt). Först från och med det **fjärde kalenderåret** efter dödsfallsåret övergår dödsboet till en platt statlig inkomstskatt på 20 % av hela den beskattningsbara förvärvsinkomsten. De flesta dödsbon avvecklas långt innan dess, men driver dödsboet en verksamhet vidare i flera år är detta viktigt att känna till — anlita en redovisningskonsult."

**Prioritet:** Medel — träffar bara dödsbon som driver enskild firma/handelsbolag vidare i flera år, en mindre men inte försumbar grupp.

---

### 8. [fullmakt-dodsbo.html](../fullmakt-dodsbo.html) — saknar jävssituationen för minderårig arvinge

**Problem:** Sidan skriver korrekt att "Barnets förälder (eller god man) agerar å barnets vägnar", men nämner inte att föräldern **själv ofta är dödsbodelägare** i samma dödsbo (t.ex. efterlevande make/maka vid barnets förälders bortgång) — vilket är en jävssituation. I sådana fall kan överförmyndaren behöva förordna en **särskild förmyndare/god man** för barnet vid just bouppteckning och arvskifte, eftersom föräldern inte kan företräda både sig själv och barnet i en intressemotsättning.

**Källa:** Föräldrabalken 12 kap. 3 §, praxis hos landets överförmyndare; se även proposition 2025/26:92 "Ett ställföreträdarskap att lita på" (i kraft 1 juli 2026), som stärker tillsynen över gode män/förvaltare/förmyndare men inte ändrar denna grundregel i sak.

**Förslag till ny text (lägg till under "Kan ett barn under 18 år vara dödsbodelägare?"):**
> "...Är föräldern själv också dödsbodelägare i samma dödsbo (vanligt när efterlevande make/maka och gemensamma barn ärver tillsammans) uppstår en jävssituation — föräldern kan då inte företräda barnet i bouppteckning och arvskifte. Kontakta överförmyndaren i kommunen för att få en särskild förmyndare/god man förordnad åt barnet."

**Prioritet:** Medel — berör en tydligt avgränsad men vanlig situation (omgift förälder med gemensamma minderåriga barn) och är helt frånvarande idag.

---

### 9. Deklarationsdatum "2 maj" presenteras som fast

**Berörda filer:** [dodsbo-deklaration.html](../dodsbo-deklaration.html), [checklista-dodsbo.html](../checklista-dodsbo.html)

**Problem:** Båda sidor skriver "senast 2 maj" som om datumet alltid infaller då. Regeln är egentligen "2 maj, eller nästa vardag om 2 maj är en helgdag". **För 2026 specifikt infaller 2 maj på en lördag, så deklarationen för inkomståret 2025 ska lämnas senast måndag 4 maj 2026.**

**Källa som motsäger:** Skatteverkets datumsida för deklaration 2026.

**Förslag till ny text:** "senast 2 maj året efter dödsfallet (flyttas till närmast följande vardag om datumet infaller på en helg — för deklarationen som lämnas 2026 är sista dag 4 maj)."

**Prioritet:** Medel-låg — påverkar ett exakt datum snarare än en process, men är lätt att fixa och undviker att användare missar en flyttad deadline.

---

### 10. [vad-kostar-en-begravning.html](../vad-kostar-en-begravning.html) och [index.html](../index.html) — begravningsavgiftens intervall bör verifieras för 2026

**Problem:** Båda anger "0,065–0,28 % av inkomsten beroende på folkbokföringskommun". Kammarkollegiet fastställde begravningsavgiften för 2026 till ett **riksgenomsnitt på 29,2 öre per hundralapp (0,292 %)**. Ett riksgenomsnitt på 0,292 % är svårt att förena med ett angivet tak på 0,28 % om spridningen mellan kommuner är symmetrisk kring genomsnittet — intervallet är sannolikt inaktuellt eller ofullständigt (avgiften varierar dessutom särskilt i Stockholms och Tranås kommuner, som har egna huvudmän och inte ingår i Svenska kyrkans avgiftssystem).

**Källa som motsäger:** [Kammarkollegiet, "Kammarkollegiet har beslutat om begravningsavgiften för 2026"](https://www.kammarkollegiet.se/aktuellt/nyheter/2025-11-28-kammarkollegiet-har-beslutat-om-begravningsavgiften-for-2026); Svenska kyrkan.

**Förslag:** Verifiera det faktiska min/max-intervallet för 2026 direkt hos Skatteverket eller Kammarkollegiet (per-kommun-tabell) innan intervallet publiceras igen. Skriv om till något i stil med: "Begravningsavgiften för 2026 ligger på i genomsnitt 0,292 % av den beskattningsbara inkomsten (Kammarkollegiets riksgenomsnitt), men exakt belopp varierar per kommun/församling — det finns angivet på din skattsedel." Undvik att ange ett exakt intervall utan färsk källa.

**Prioritet:** Medel-låg — beloppet är litet i sammanhanget och syns på skattsedeln ändå, men ett direkt fel intervall skadar trovärdigheten.

---

## LÅGT (P3) — bevakningspunkter, inga ändringar ännu

Dessa ska **inte** implementeras nu men är värda att hålla koll på inför nästa revidering:

- **Statligt testamentsregister** — ett utredningsförslag finns (frivilligt register administrerat av Skatteverket) men är inte gällande lag. [testamente-guide.html](../testamente-guide.html) och [sambo-arv.html](../sambo-arv.html) beskriver korrekt dagens ordning (SBF:s register via begravningar.se) och ska inte ändras förrän/om förslaget blir lag.
- **Lantbruksegendom + juridisk person + testamente** — ny regel om förvärvstillstånd träder i kraft 1 januari 2027. Ingen av Efterplans sidor diskuterar i dag testamentering av jord-/skogsfastighet till en juridisk person specifikt, så det finns inget att ändra ännu, men [dodsbo-fastighet.html](../dodsbo-fastighet.html) nämner "jordbruksfastighet" i förbigående och bör uppdateras när datumet närmar sig.
- **Ny arvs- och testamentsutredning** (SOU 2025:91 m.fl.) — pågående utredningsarbete som på sikt kan påverka sambors ställning och testamentsregler. Inte gällande lag, ingen åtgärd nu.
- **Proposition 2025/26:92 "Ett ställföreträdarskap att lita på"** — träder i kraft 1 juli 2026, men handlar huvudsakligen om tillsyn, kvalitet och ett nytt ställföreträdarregister för gode män/förvaltare, inte om grundreglerna för föräldrars företrädarskap av barn. Se punkt 8 ovan för den konkreta åtgärden som redan är relevant idag oavsett reformen.

---

## Sidor granskade utan sakfel av betydelse

Följande sidor stämde vid granskning väl överens med primärkällorna och gav inte upphov till några fynd som motiverar ändring: [dodsbo-bostadsratt.html](../dodsbo-bostadsratt.html) (korrekt kontinuitetsprincip, till skillnad från dodsbo-fastighet.html), [dodsbo-bil.html](../dodsbo-bil.html), [dodsbo-auktion.html](../dodsbo-auktion.html), [boutredningsman.html](../boutredningsman.html) (900 kr ansökningsavgift och arvodesintervall stämmer), [tomma-dodsbo.html](../tomma-dodsbo.html), [salja-dodsbo.html](../salja-dodsbo.html), [saga-upp-hyresratt-dodsbo.html](../saga-upp-hyresratt-dodsbo.html) (12 kap. 5 § och 12 kap. 34 § jordabalken korrekt återgivna), [dodsfallsintyg.html](../dodsfallsintyg.html), [arvsskatt.html](../arvsskatt.html) (förutom att den korrekt beskrivna kontinuitetsprincipen bör spegla sig även i dodsbo-fastighet.html, se P0-punkt 1), [laglott.html](../laglott.html), [sarkullbarn.html](../sarkullbarn.html), [sambo-arv.html](../sambo-arv.html) (arvsrätt — att skilja från pensionsrätt, se P0-punkt 2), [testamente-guide.html](../testamente-guide.html), [dodsannons.html](../dodsannons.html), [gravsten.html](../gravsten.html), [begravningsbyra.html](../begravningsbyra.html) (nämner dödsboanmälan korrekt, om än kortfattat), [begravning-utomlands.html](../begravning-utomlands.html), [om.html](../om.html), [auth-modal.html](../auth-modal.html).

Begravnings-/ceremonirelaterade sidor (kista, gravsten, begravningsbyråval m.m.) har bara granskats översiktligt eftersom en separat research-anteckning (`Vad Efterplan bör täcka.md`) redan diskuterar om detta innehåll ens ska ligga kvar inom produktens scope — det är en produktbeslutsfråga, inte en sakfelsfråga, och har därför inte prioriterats här.

---

## Källförteckning

- [Prop. 2025/26:46 Elektronisk inlämning av bouppteckningar](https://www.regeringen.se/contentassets/632735d768a44f20a8e1f3c84a5b9bcc/elektronisk-inlamning-av-bouppteckningar-prop.-20252646.pdf) / [Riksdagen](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/elektronisk-inlamning-av-bouppteckningar_hd0346/html/)
- [Skatteverket — Förändringar som rör bouppteckningar](https://www.skatteverket.se/omoss/pressochmedia/nyheter/2026/nyheter/forandringarsomrorbouppteckning.5.3129d65419ef1497c0615a8.html)
- 20 kap. 8 a § ärvdabalken (dödsboanmälan) — se t.ex. kommunal tillämpning: [Norrköpings kommun](https://norrkoping.se/stod-och-omsorg/vigsel-och-begravning/dodsboanmalan), [Enköpings kommun](https://enkoping.se/omsorg-och-stod/dodsboanmalan.html), [Kalmar kommun](https://kalmar.se/omsorg-och-stod/dodsfall-och-begravning/dodsboanmalan.html)
- [Pensionsmyndigheten — Omställningspension](https://www.pensionsmyndigheten.se/forsta-din-pension/ekonomiskt-stod/omstallningspension)
- [Pensionsmyndigheten — Barnpension och efterlevandestöd till barn](https://www.pensionsmyndigheten.se/forsta-din-pension/ekonomiskt-stod/barnpension-och-efterlevandestod-till-barn)
- [Lantmäteriet — Stämpelskatt och avgifter](https://www.lantmateriet.se/sv/fastighet-och-mark/kopa-aga-salja-eller-ge-bort/Stampelskatt-och-avgifter/)
- Inkomstskattelagen 44 kap. 21 § (kontinuitetsprincipen vid arv/gåva) — se tillämpning hos [Familjens Jurist](https://www.familjensjurist.se/fraga-juristen/bostad--fastighet/reavinstskatt-vid-forsaljning-av-fastighet-som-forvarvats-genom-arv/) och [Lawline](https://lawline.se/answers/skatt-pa-skogsfastighet-och-kontinuitetsprincipen)
- [Kammarkollegiet — Begravningsavgiften för 2026](https://www.kammarkollegiet.se/aktuellt/nyheter/2025-11-28-kammarkollegiet-har-beslutat-om-begravningsavgiften-for-2026)
- [Skatteverket — Datum för deklarationen 2026](https://www.skatteverket.se/privat/deklaration/datumfordeklarationen2026.4.1997e70d1848dabbac95d72.html)
- [Sveriges Domstolar — Ansök om boutredningsman](https://www.domstol.se/amnen/familj/dodsfall-och-arv/ansok-om-boutredningsman/)
- [Prop. 2025/26:92 Ett ställföreträdarskap att lita på](https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/ett-stallforetradarskap-att-lita-pa_hd0392/html/)

---

## Rekommenderad åtgärdsordning

1. **P0 (denna vecka):** Rätta kapitalvinstexemplet i dodsbo-fastighet.html, sambo/omställningspension i efterlevandepension.html + index.html, dödsboanmälan-attributionen i dodsbo-skulder.html, stämpelskatte-påståendena i arvskifte-guide.html + dodsbo-fastighet.html. Dessa är rena sakfel som kan kosta användare pengar eller onödig byråkrati.
2. **P1 (denna månad):** Lägg till dödsboanmälan som tydlig förgrening i checklista-dodsbo.html, bouppteckning-tidslinje.html, dodsbo-checklista-7-dagar.html, vad-gora-nar-nagon-dor.html och index.html. Lägg till prop. 2025/26:46-ändringarna i bouppteckning-guide.html och bouppteckning-tidslinje.html.
3. **P2 (nästa revidering):** Deklarationsdatum, dödsboskattesats för näringsverksamhet, jävssituation i fullmakt-dodsbo.html, verifiera begravningsavgiftens intervall.
4. **P3 (bevakning):** Håll ett ögon på testamentsregister-utredningen, lantbruksegendomsregeln (2027-01-01) och SOU 2025:91.
