



Ja. Jag gjorde en bredare kontroll med fokus på **BankID/e-legitimation, digital signering, fullmakter och vilka moment i ett dödsbo som redan håller på att gå från papper till digitala tjänster**.

Det finns mer som är relevant för Efterplan än bara den nya digitala bouppteckningen.

## 1. BankID: inte en ny lag som kräver BankID i Efterplan

Det viktiga här är att skilja på två saker:

**BankID blir inte obligatoriskt för Efterplan.**

Men den svenska infrastrukturen för e-legitimation har förändrats. Sedan **1 januari 2026** finns ett statligt auktorisationssystem för elektronisk identifiering. Det gör det möjligt för offentliga aktörer att ansluta bland annat BankID via Digg. citeturn1search4turn1search12

För ett privat företag som Efterplan innebär det inte att ni måste ansluta er.

Däremot blir BankID alltmer relevant som **identitets- och signeringslager**.

BankID kan användas för både identifiering och elektronisk underskrift, och BankID beskriver en elektronisk underskrift som juridiskt likvärdig med en fysisk underskrift i de situationer där elektronisk underskrift accepteras. citeturn1search1turn1search11

### Konsekvens för Efterplan

Claude Code bör undersöka om följande funktioner kan göras bättre med BankID:

- identifiera användaren
- verifiera vem som skapat en plan
- signera fullmakter
- signera dokument
- låta flera dödsbodelägare signera samma dokument
- skapa verifierbart underlag för vem som godkänt vad

**Men:** implementera inte BankID bara för att "det går". Det måste finnas ett konkret användningsfall.

---

# 2. Fullmakter är särskilt intressanta

Här finns en ganska stor möjlighet för Efterplan.

Domstolarna använder redan digital signering för handlingar och fullmakter. Sveriges Domstolars aktuella e-tjänst låter användaren:

1. skapa/ladda upp handling
2. signera med e-legitimation
3. skicka in digitalt.

För fullmakter kan den som ger fullmakten ladda upp och signera den digitalt. citeturn2search14

Högsta förvaltningsdomstolen har dessutom nyligen prövat ett mål där en **elektroniskt signerad fullmakt** validerades och accepterades som bevis för behörighet. citeturn2search1

### Det här är viktigt för Efterplan

Om Efterplan idag genererar:

> "Fullmakt – skriv ut, skriv under och skicka..."

bör Claude Code undersöka om flödet istället kan bli:

**Skapa fullmakt → skicka till övriga dödsbodelägare → alla identifierar/signera digitalt → färdig PDF.**

Men här måste en viktig juridisk kontroll göras:

> **En digital signatur gör inte automatiskt att varje mottagare, bank eller myndighet måste acceptera dokumentet i just den formen.**

Efterplan bör därför inte skriva:

> "Den här fullmakten accepteras av alla."

utan snarare:

> "Fullmakten kan signeras digitalt. Kontrollera med mottagaren om de accepterar digitalt signerade fullmakter."

---

# 3. Domstolarnas utveckling är en stark signal

Det här är kanske mer relevant än själva BankID-lagstiftningen.

Sveriges Domstolar har nu en generell tjänst för att:

**Skicka handlingar → logga in med e-legitimation → ladda upp PDF → signera → skicka.**

Den omfattar redan flera dödsborelaterade ärenden, exempelvis:

- boutredningsman
- skiftesman
- konkurs
- vissa fastighetsärenden. citeturn2search14turn2search9

Det betyder att Efterplan bör börja tänka:

> **"Vilka fysiska steg behöver användaren egentligen göra?"**

i stället för:

> "Vilka blanketter behöver användaren fylla i?"

Det är en viktig produktförskjutning.

---

# 4. Bouppteckningen är på väg från fysisk → digital

Här är förändringen uttrycklig.

Från **1 juli 2026** finns lagstöd för att bouppteckningar och dödsboanmälningar ska kunna upprättas och lämnas in elektroniskt.

Men **Skatteverkets digitala tjänst är ännu inte lanserad**.

Just nu måste bouppteckningen fortfarande lämnas in fysiskt. citeturn0search3turn0search5

### Efterplan bör därför byggas för två lägen

**Nu:**

> Skapa bouppteckning → skriv ut → signera → skicka till Skatteverket.

**Framtida:**

> Skapa digital bouppteckning → signera → lämna direkt till Skatteverket.

Det är värt att arkitekturen förbereds för detta redan nu.

---

# 5. Lantmäteriet är redan digitalt

Det här är ett mycket konkret exempel som Efterplan bör ta hänsyn till.

Lantmäteriet låter användaren ansöka om lagfart:

**digitalt eller via post.**

Signering kan ske digitalt beroende på hur ansökan lämnas in. citeturn1search15

Ännu viktigare för Efterplan:

När ett dödsbo ska sälja eller ge bort en fastighet finns en **e-tjänst för dödsbo**. Lantmäteriet anger också att dödsboet ska ha organisationsnummer när dödsboet söker lagfart/inskrivning, för dödsbon där bouppteckningen förrättats från och med **1 juli 2026**. citeturn1search5

### Efterplan bör därför ha ett tydligt fastighetsflöde

Om:

> "Den avlidne ägde fastighet"

bör checklistan kunna skilja mellan:

- behålla fastigheten
- sälja fastigheten
- överlåta fastigheten
- arvskifte av fastigheten

och länka användaren vidare till Lantmäteriets aktuella digitala tjänst när det är relevant.

---

# 6. Dödsfallsintyg är redan digitaliserat – men inte för privatpersonen

Det finns en intressant asymmetri.

Banker, försäkringsbolag, pensionsbolag, begravningsbyråer m.fl. kan redan använda Skatteverkets e-tjänst för att beställa och skriva ut:

- dödsfallsintyg
- dödsfallsintyg med släktutredning
- intyg för kremering/gravsättning
- registerutdrag för avliden. citeturn2search2turn2search7

Privatpersoner kan däremot fortfarande inte använda samma e-tjänst. De får beställa dödsfallsintyget via Skatteverket. citeturn2search2turn2search7

### Produktkonsekvens

Efterplan bör inte säga:

> "Logga in och hämta dödsfallsintyget digitalt."

Det går inte för privatpersonen.

Men Efterplan kan göra något bättre:

> **"Beställ dödsfallsintyg med släktutredning"**

och ge en direkt väg till rätt Skatteverket-funktion.

---

# 7. Deklarationen är redan digital

Dödsbon kan redan deklarera digitalt.

Om dödsboet har fått deklarationskoder kan deklarationen göras digitalt.

Om någon är registrerad som **deklarationsombud** kan denne logga in med e-legitimation och deklarera för dödsboet. citeturn1search16

Det är intressant eftersom själva ombudsprocessen fortfarande delvis är fysisk:

> Ansökan om deklarationsombud för dödsbo kan bara göras med pappersblankett.

citeturn1search16turn1search13

Det visar ganska tydligt var Sverige befinner sig just nu:

**vissa delar är helt digitala, andra är fortfarande hybrid.**

Efterplan måste därför inte anta att "digitalt" betyder "allting kan göras digitalt".

---

# 8. Konkurs för dödsbo är redan digital

Det här är ytterligare ett bra exempel.

Sveriges Domstolar låter ett dödsbo ansöka om egen konkurs digitalt.

Dödsbodelägarna kan signera ansökan med e-legitimation och skicka in PDF-dokument digitalt. citeturn2search3

Det betyder att Efterplan i ett framtida mer avancerat flöde kan ha:

> **Dödsboet kan inte betala skulder → undersök konkurs → digital ansökan via Domstolarna.**

---

# 9. En mycket viktig produktidé: "Digitalt eller fysiskt?"

Jag tycker Claude Code bör utvärdera en generell egenskap i Efterplan.

Varje uppgift skulle kunna ha metadata:

```text
action_type:
- digital
- physical
- hybrid

authority:
- Skatteverket
- Lantmäteriet
- Sveriges Domstolar
- bank
- försäkringsbolag
- kommun
- annan

authentication:
- none
- BankID
- e-legitimation
- physical_signature
- multiple_signatures

submission:
- online
- email
- post
- in_person
```

Då kan Efterplan automatiskt visa exempelvis:

> 🟢 **Gör digitalt**  
> Logga in med BankID

eller:

> 🟡 **Delvis digitalt**  
> Fyll i digitalt, skriv under och skicka med post

eller:

> 🔴 **Fysiskt**  
> Originalhandling måste fortfarande skickas.

Det skulle göra Efterplan betydligt mer användbar än en vanlig checklista.

---

# 10. Det här är särskilt viktigt för användarens "Vad gör jag nu?"

Efterplan skulle kunna ge varje uppgift en tydlig väg:

### Exempel

**Ansök om lagfart**

🟢 Digitalt möjligt  
**Lantmäteriets e-tjänst**

**Bouppteckning**

🟡 Hybrid  
**Kan förberedas digitalt – fysisk inlämning gäller fortfarande tills Skatteverkets nya e-tjänst lanserats.** citeturn0search3

**Ansök om boutredningsman**

🟢 Digitalt  
**Signera med BankID/e-legitimation och skicka till domstolen.** citeturn2search9

**Deklarera dödsbo**

🟢 Digitalt i vissa fall  
**Deklarationskoder eller registrerat deklarationsombud krävs.** citeturn1search16

**Dödsfallsintyg**

🟡 Hybrid  
**Privatperson beställer via Skatteverket; vissa professionella aktörer har e-tjänst.** citeturn2search2turn2search7

---

# 11. BankID:s nya roll bör därför inte vara "logga in på Efterplan"

Jag skulle inte börja med:

> **"Logga in med BankID på Efterplan."**

Det löser inte det huvudsakliga problemet.

Den intressantare användningen är:

### A. Signering

> "Signera fullmakt"

### B. Flera dödsbodelägare

> "Skicka till Anna och Erik för signering"

### C. Verifierbar plan

> "Den här handlingen skapades och signerades av Jonas..."

### D. Extern myndighet

> "Fortsätt till Skatteverket/Lantmäteriet/Domstolarna"

Det är där BankID faktiskt skapar produktvärde.

---

# 12. Ytterligare en sak Claude Code bör kontrollera: digitala fullmakter

Jag skulle specifikt be Claude Code undersöka **hela fullmaktsarkitekturen**.

Det finns redan en tydlig utveckling mot digital hantering av fullmakter och elektroniskt signerade dokument. Domstolarna har digitala flöden och HFD har nyligen bekräftat att en elektroniskt signerad fullmakt kan verifieras och styrka behörighet. citeturn2search1turn2search14

Det betyder att Efterplans framtida dokumentgenerator kan gå från:

**PDF → skriv ut → skriv under → skanna → mejla**

till:

**PDF → digital signering → verifierad PDF → skicka.**

Det är sannolikt en av de mest naturliga digitaliseringsmöjligheterna i hela produkten.

---

## Min prioritering för Efterplan

| Område | Status | Efterplan |
|---|---|---|
| Bouppteckning | 🟡 På väg digitalt | **Förbered arkitekturen** |
| BankID | 🟢 Etablerat | **Utvärdera för signering** |
| Digitala fullmakter | 🟢 Växande | **Hög potential** |
| Lantmäteriet | 🟢 Digitalt | **Länka direkt från uppgifter** |
| Domstolar | 🟢 Digitalt | **Länka/signaler om digital ansökan** |
| Dödsfallsintyg | 🟡 Hybrid | **Visa rätt väg beroende på användare** |
| Dödsbodeklaration | 🟡 Hybrid/digital | **Visa digitalt alternativ när möjligt** |
| Pappersoriginal | 🔴 Finns fortfarande | **Behåll fallback** |

### Den större slutsatsen

Det finns alltså en tydlig utveckling:

**Fysisk blankett → digital blankett → e-signering → digital inlämning → myndighetens digitala handläggning.**

Efterplan bör därför inte bara vara en **checklista över vad som ska göras**, utan också förstå **hur uppgiften faktiskt ska genomföras**.

Det är där jag tror att lagändringarna och den pågående digitaliseringen kan ge Efterplan en betydligt starkare produktmodell.