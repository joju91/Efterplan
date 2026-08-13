Ja. Här är en version som är skriven för att **Claude Code ska kunna använda den som ett audit-/implementation-underlag**. Jag har samtidigt korrigerat en viktig detalj från min förra research: **digital inlämning av bouppteckning är lagreglerad men är inte tillgänglig hos Skatteverket ännu**. Skatteverket säger uttryckligen att inlämning fortfarande sker på papper i original just nu. ([Skatteverket][1])

---

# Lagändringsaudit för Efterplan – åtgärdsunderlag

**Datum för audit:** 12 augusti 2026
**Scope:** Lagändringar som trätt i kraft **1 juli 2026** samt beslutade förändringar med ikraftträdande **1 januari 2027**.
**Instruktion till Claude Code:** Använd detta som underlag för att granska hela Efterplans kodbas, innehåll, juridiska texter, checklistelogik, villkor och UI. Ändra inte juridisk information enbart utifrån detta dokument utan verifiera mot primärkälla som anges.

---

## 1. 🔴 BOUPPTECKNING – VIKTIGASTE ÄNDRINGEN

### Vad har ändrats?

Från **1 juli 2026** har reglerna om bouppteckningar ändrats.

Bland annat:

* en **bestyrkt kopia av bouppteckningen behöver inte längre skickas in**
* lagstiftningen har anpassats för **elektronisk ingivning**
* personnummer eller samordningsnummer ska anges för **alla som är kallade till bouppteckningsförrättningen**
* vissa juridiska begrepp har ändrats. ([Skatteverket][1])

### VIKTIGT: digital inlämning är inte tillgänglig ännu

Efterplan får **inte** skriva att användaren idag kan skicka in bouppteckningen digitalt till Skatteverket.

Skatteverket anger uttryckligen att:

> digital inlämning är i dagsläget inte möjlig.

Bouppteckningen ska fortfarande skickas in som **pappershandling i original**. Det nya är att lagstiftningen nu möjliggör digital ingivning, medan den praktiska tjänsten ännu inte är tillgänglig. ([Skatteverket][1])

### Claude Code ska kontrollera

Sök i hela projektet efter:

* `bestyrkt kopia`
* `bestyrkta kopior`
* `kopia`
* `förrättningsmän`
* `förrättningsman`
* `förrättningsperson`
* `bouppgivarens försäkran`
* `bouppgivarens bekräftelse`
* `digital bouppteckning`
* `skicka digitalt`
* `e-tjänst`
* `Skatteverket`

### Åtgärd

Om Efterplan fortfarande instruerar användaren att skicka:

> "bouppteckningen + bestyrkt kopia"

ska detta tas bort.

Korrekt information ska vara att **bestyrkt kopia inte längre behöver skickas med**.

Om Efterplan nämner digital inlämning ska formuleringen tydligt ange att möjligheten finns i lagstiftningen men att **Skatteverkets digitala inlämning ännu inte är tillgänglig**.

---

# 2. 🔴 BOUPPTECKNING – VILKA SKA ANGES/KALLAS?

Skatteverket anger efter lagändringen att **personnummer eller samordningsnummer ska anges för alla som är kallade till förrättningen**. ([Skatteverket][2])

Detta är viktigt eftersom Efterplans logik inte bör blanda ihop:

* dödsbodelägare
* efterarvingar
* testamentstagare
* personer som ska kallas till förrättningen

### Claude Code ska kontrollera

Granska alla frågor och checklistor som handlar om:

* vilka som ska delta
* vilka som ska kallas
* arvingar
* testamentstagare
* efterarvingar
* bouppteckningsförrättning

Kontrollera att systemets logik inte säger att **endast dödsbodelägarna** ska kallas.

### Åtgärd

Om logiken är förenklad:

> "De som har rätt att delta i bouppteckningen – arvingar och testamentstagare"

ska den juridiska logiken granskas och vid behov göras mer korrekt.

Det här ska **inte** lösas genom att Claude Code själv hittar på en ny juridisk definition. Använd primärkällorna och gör hellre en tydlig "kontrollera vilka som ska kallas"-uppgift än en överförenklad regel.

---

# 3. 🟠 TERMINOLOGI – FÖRRÄTTNINGSPERSON

Den nya lagstiftningen ändrar vissa begrepp.

Skatteverket anger bland annat att:

**förrättningsmän → förrättningspersoner**

och

**bouppgivarens försäkran → bouppgivarens bekräftelse**. ([Skatteverket][2])

### Claude Code ska göra

Global sökning efter de gamla termerna.

Om de förekommer i användargränssnitt, guider, checklistor eller juridisk information ska de uppdateras där det är juridiskt korrekt.

Ändra däremot **inte** historiska dokument eller citerad text mekaniskt utan att kontrollera kontexten.

---

# 4. 🔴 MINDERÅRIG ARVINGE – NYA REGLER OM STÄLLFÖRETRÄDARSKAP

Det har skett en omfattande reform av reglerna om:

* gode män
* förvaltare
* förmyndare
* överförmyndare
* ställföreträdarskap

De flesta ändringarna trädde i kraft **1 juli 2026**. ([Riksdagen][3])

Det är relevant för Efterplan eftersom produkten uttryckligen hanterar situationen:

> "Minderårigt barn ärver"

### Claude Code ska därför granska hela detta flöde.

Sök efter:

* `minderårig`
* `barn ärver`
* `barn`
* `förmyndare`
* `god man`
* `överförmyndare`
* `spärrat konto`
* `överförmyndarens tillstånd`
* `arv till barn`

### Produktlogik

När användaren anger att en minderårig person ärver bör Efterplan **inte nöja sig med en generell informationsruta**.

Systemet bör utvärdera om det ska skapa en konkret uppgift i stil med:

**Kontrollera med överförmyndaren vilka regler som gäller för barnets arv.**

Det är särskilt viktigt när ett barns arv innebär att regler om överförmyndarens kontroll blir aktuella.

### Viktig begränsning

Claude Code ska **inte implementera ett hårdkodat juridiskt regelverk om "över ett prisbasbelopp" utan att verifiera den aktuella lydelsen och alla undantag**.

Det ska användas som en trigger för juridisk kontroll, inte som en förenklad universell regel.

Primärkälla: regeringens proposition om reformen av ställföreträdarskapet. ([Riksdagen][3])

---

# 5. 🟠 LANTBRUKSEGENDOM + TESTAMENTE – 1 JANUARI 2027

Det finns en beslutad ändring i jordförvärvslagen som träder i kraft **1 januari 2027**.

Den innebär att en **juridisk persons förvärv av lantbruksegendom genom testamente** omfattas av krav på förvärvstillstånd. ([Regeringskansliet][4])

Det är viktigt att förstå vad ändringen **inte** innebär:

Det blir inte förbjudet att testamentera lantbruksegendom till en juridisk person.

I stället kan den juridiska personen behöva **ansöka om förvärvstillstånd**. Det är fortfarande möjligt att testamentera lantbruksegendom till en fysisk person. ([Riksdagen][5])

### Påverkan på Efterplan

Detta är en **edge case**, inte något som ska dominera huvudflödet.

Claude Code ska kontrollera om Efterplan frågar om:

* lantbruksfastighet
* jordbruksfastighet
* skogsfastighet
* testamente
* juridisk person
* bolag

Om kombinationen:

**lantbruksegendom + testamente + juridisk person**

kan förekomma bör Efterplan kunna flagga:

> **Särskilda regler kan gälla för förvärv av lantbruksegendom genom testamente. Kontrollera om förvärvstillstånd krävs.**

### Datumlogik

Eftersom regeln träder i kraft **2027-01-01** ska den inte presenteras som gällande före detta datum.

---

# 6. 🟢 TESTAMENTSREGISTER – ÄNDRA INTE

Det finns ett aktuellt utredningsförslag om bland annat ett **statligt testamentsregister**.

Det är dock **inte gällande lag**.

Claude Code ska därför **inte** ändra Efterplans juridiska information och skriva att ett statligt testamentsregister finns eller är obligatoriskt.

Detta ska endast behandlas som något att bevaka. Utredningen föreslår ett frivilligt register som skulle administreras av Skatteverket. ([Riksdagens öppna data][6])

---

# 7. 🟢 NY ARVS- OCH TESTAMENTSRÄTT – ÄNDRA INTE ÄNNU

Det finns också ett större utredningsarbete om nya regler för arv och testamente.

Det kan på sikt påverka exempelvis:

* arv
* testamente
* sambor
* testamentsregister

Men det är **inte gällande lag**.

Claude Code ska därför **inte implementera dessa förslag som juridiska regler i Efterplan**.

De ska endast läggas i eventuell bevakningslista.

---

# 8. VIKTIG KONTROLL AV NUVARANDE INFORMATION

Claude Code ska särskilt kontrollera att följande fortfarande är korrekt:

### Bouppteckning

Efterplan bör fortfarande ange:

**Bouppteckning ska förrättas inom tre månader från dödsfallet.**

Och:

**Bouppteckningen ska lämnas in till Skatteverket inom fyra månader från dödsfallet.**

Dessa tidsfrister ska inte ändras bara på grund av lagändringen från 1 juli 2026.

---

# 9. KONKRET TASK FÖR CLAUDE CODE

Claude Code ska göra följande i denna ordning:

### Steg 1 – inventering

Crawla/inspektera hela Efterplans kodbas och identifiera alla ställen där följande områden förekommer:

* bouppteckning
* dödsboanmälan
* Skatteverket
* bestyrkt kopia
* förrättningsman/förrättningsperson
* arv
* testamentstagare
* minderårig
* barn
* god man
* förmyndare
* överförmyndare
* lantbruksfastighet
* jordbruksfastighet
* skogsfastighet
* testamente
* juridisk person
* förvärvstillstånd

### Steg 2 – klassificera

För varje träff ska Claude Code ange:

**A. Korrekt och behöver inte ändras**
**B. Föråldrad information – måste ändras**
**C. Potentiellt juridiskt fel – måste verifieras**
**D. Produktlogik som behöver uppdateras**
**E. Edge case som bör läggas till**
**F. Ingen åtgärd**

### Steg 3 – juridisk verifiering

Alla ändringar som påverkar juridiska påståenden ska verifieras mot primärkällor:

* Skatteverket
* Riksdagen
* Regeringen
* Svensk författningssamling

Inte bloggar eller SEO-sidor.

### Steg 4 – implementera endast verifierade ändringar

Prioritet:

**P0**

* felaktig information om bestyrkt kopia
* felaktig information om digital inlämning
* felaktig bouppteckningslogik

**P1**

* minderårig arvinge/ställföreträdare
* terminologi

**P2**

* lantbruksegendom + juridisk person + testamente från 2027

**P3**

* framtida lagförslag ska endast läggas i bevakning, inte implementeras.

### Steg 5 – regressionstest

Efter ändringarna ska Claude Code verifiera:

1. vanlig bouppteckning
2. flera dödsbodelägare
3. testamentstagare
4. minderårig arvinge
5. lantbruksfastighet
6. lantbruksfastighet + testamente
7. juridisk person som testamentstagare
8. kombinationen minderårig + testamente
9. vanlig bostadsrätt
10. vanligt dödsbo utan specialfall

### Steg 6 – rapportera

Claude Code ska avsluta med:

* vilka juridiska fel som hittades
* vilka filer som ändrades
* vilka UI-texter som ändrades
* vilka regler som ändrades
* vilka regler som **inte** ändrades och varför
* vilka framtida lagändringar som bör bevakas
* eventuella kvarvarande juridiska osäkerheter

---

## Kort sagt

De **verkligt relevanta förändringarna för Efterplan** är:

**1 juli 2026**

* 🟥 Bouppteckningsreglerna har ändrats.
* 🟥 Bestyrkt kopia ska inte längre skickas.
* 🟥 Lagstiftningen möjliggör digital ingivning, men **Skatteverket tar fortfarande inte emot bouppteckningar digitalt idag**. ([Skatteverket][1])
* 🟧 Personnummer/samordningsnummer ska anges för alla kallade till förrättningen. ([Skatteverket][2])
* 🟧 Terminologin kring förrättningspersoner har ändrats.
* 🟥 Nya regler om ställföreträdarskap påverkar flödet för minderåriga arvingar. ([Riksdagen][3])

**1 januari 2027**

* 🟧 Juridiska personers förvärv av lantbruksegendom genom testamente kan kräva förvärvstillstånd. ([Regeringskansliet][4])

**Inte implementera ännu**

* 🟢 föreslaget testamentsregister
* 🟢 övriga förslag från den nya arvs- och testamentsutredningen

Det här är alltså främst en **juridisk regel-/innehållsaudit**, inte ett förslag på att bygga om Efterplans hela UX. Claude Code bör först inventera exakt vad som faktiskt finns i koden och därefter ändra endast sådant som behöver ändras.

[1]: https://www.skatteverket.se/omoss/pressochmedia/nyheter/2026/nyheter/forandringarsomrorbouppteckning.5.3129d65419ef1497c0615a8.html?utm_source=chatgpt.com "Förändringar som rör bouppteckningar"
[2]: https://www.skatteverket.se/privat/etjansterochblanketter/blanketterbroschyrer/blanketter/info/4600.4.39f16f103821c58f680006692.html?utm_source=chatgpt.com "Bouppteckning (SKV 4600)"
[3]: https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/ett-stallforetradarskap-att-lita-pa_hd0392/html/?utm_source=chatgpt.com "Ett ställföreträdarskap att lita på (Proposition 2025/26:92)"
[4]: https://www.regeringen.se/contentassets/8c2ca94ba2b74a279d653416af9e45ea/juridiska-personers-forvarv-av-lantbruksegendom-genom-testamente.pdf?utm_source=chatgpt.com "Juridiska personers förvärv av lantbruksegendom genom ..."
[5]: https://www.riksdagen.se/sv/dokument-och-lagar/dokument/proposition/juridiska-personers-forvarv-av-lantbruksegendom_hd0338/html/?utm_source=chatgpt.com "Juridiska personers förvärv av lantbruksegendom genom ..."
[6]: https://data.riksdagen.se/dokument/hdb391?utm_source=chatgpt.com "sou 2025 91"
