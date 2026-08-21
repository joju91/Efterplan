# Extern analys + funktionsförslag — 2026-08-21

Inklistrad av Owner. Två delar: (1) en spec för en ny funktion ("förskotts-formulär"),
(2) en extern konkurrensanalys av efterplan.se med ett åtgärdsförslag i botten
("Prioriterad lista"). Destillerad till tickets i `roadmap.md` Fas 27 — se den för
vad som blev en ticket, vad som redan var täckt (Fas 14/T124/T141 m.fl.) och varför.

---

## Del 1: Förskotts-formulär — spec från Owner

> Läs igenom Efterplans checklista/dataschema (leta i repo-strukturen, sannolikt
> content/data-filer för checklistan eller motsvarande komponent) och lista alla
> kategorier och fält som finns i den befintliga checklistan idag.
>
> Bygg sedan en ny sido-feature: ett förskotts-formulär där en levande användare kan
> fylla i sin egen "efterplan" i förväg, som senare kan delas manuellt
> (export/länk/utskrift) med efterlevande.
>
> Krav:
> - Formuläret ska täcka SAMMA kategorier som befintlig checklista, plus en egen
>   kategori för begravningsönskemål (typ av begravning + fritext övriga önskemål)
> - Inga fält är obligatoriska
> - Aldrig lagra lösenord/kontonummer i klartext — bara var saker finns
>   (t.ex. "lösenordshanterare: 1Password", inte lösenordet)
> - Ingen automatisk trigger vid dödsfall i denna version — dela sker manuellt av
>   användaren
> - Gratis i beta, ingen betalspärr
> - Följ befintlig kodstil (statisk HTML/vanilla JS)
>
> Föreslå datamodell och UI-flöde innan du börjar bygga, så jag kan godkänna.

→ Kategori-inventeringen och det föreslagna datamodell/UI-flödet ligger i
`research/forskotts-formular-forslag.md`. Byggticket: T232 (väntar godkännande).

---

## Del 2: Konkreta förbättringspunkter (Owners egna anteckningar)

- **Direktintegration med myndigheter och bolag**: BankID-signering av uppsägningar,
  direktkoppling till t.ex. Jordbruksverket och försäkringsbolag.
- **Ekonomisk översikt för löpande kostnader**: syskon lägger in utlägg (kattmat,
  BRF-avgift) för automatisk avräkning vid arvsskifte.
- **Tydligare guider för fysisk tömning**: värderingsmän, mäklare, organisationer som
  hämtar möbler.
- **Automatisk bevakning av avtal**: skanna dödsboets post/banktransaktioner (med
  godkännande) för att hitta dolda prenumerationer.
- **Flexiblare ansvarsfördelning**: tilldela uppgifter till en specifik person
  ("Anna ansvarar för katten") med påminnelser via e-post/SMS.

## Del 3: Extern konkurrensanalys (fullständig text)

**Efterplan.se är en oberoende, praktisk digital guide- och checklistatjänst**
(grundad av privatpersonen Jonas Söderström efter egna erfarenheter) som hjälper
anhöriga att strukturera det praktiska efter ett dödsfall. Den konkurrerar inte med
myndighetsinformation (t.ex. Efterlevandeguiden) utan fokuserar på *att göra*:
personlig prioriterad checklista, brevmallar och översikt.

Tjänsten är i huvudsak gratis (checklista, plan, PDF, bouppteckningsöversikt). För
49 kr engångsbetalning låses alla färdigskrivna brev upp (bank, försäkringsbolag,
Skatteverket, uppsägningar, fullmakt, dödsannons m.m.). Data sparas lokalt i
webbläsaren (ingen registrering krävs); inloggning möjliggör synk. Den är inte
juridisk rådgivning och rekommenderar jurist vid komplexa fall.

### Användarresan
1. **Start (gratis, ingen registrering)**: frågor om relation, bostadstyp,
   barn/värdepapper (~2 min).
2. **Personlig plan**: Gör idag / Denna vecka / Senare, statusmarkeringar, PDF,
   delbar läsbar länk.
3. **Brev & dokument**: uppsägningar, fullmakt, bankbrev (delvis betalvägg).
4. **Guider**: bouppteckning, arvskifte, bostadsrätt, husdjur, fullmakt m.fl.
5. **Avslut**: bocka av allt → uppmuntran + PDF.

### Styrkor vs. svagheter (scenario: tre syskon, bostadsrätt + katt)

| Aspekt | Styrkor | Svagheter / Luckor |
|---|---|---|
| Bostadsrätt | Detaljerad guide (avgift, överlåtelse, försäljning, skatt, BRF) | Ingen BRF/mäklare-integration, ingen automatisk kostnadsspårning |
| Katt | Omedelbar omsorg + juridik + ägarbyte + kostnader | Ingen Jordbruksverket/chipregister-koppling, begränsat djup om försäkring |
| Syskon-samarbete | Fullmaktsguide + krav på enhällighet + mallar + delbar plan | Ingen multi-user realtid, roller, gemensam task-lista |
| UX | Personlig, prioriterad, lokalt sparande, PDF | Enanvändare, betalvägg för brev, ingen delad progress |
| Juridik | Korrekt översikt, hänvisar till jurist | Ingen rådgivning, saknar BRF-stadge-/Jordbruksverket-djup |
| Logistik | Brev-mallar, bulk-uppsägning, tidslinje | Inga automatiska betalningar/inventeringsverktyg/tömningsfirma-partnerskap |
| Transparens | Användaren behåller kontroll, oberoende | Begränsad spårbarhet mellan syskon |

### Prioriterad lista på tekniska och funktionella förbättringsförslag (original)
1. **Hög — Multi-user & samarbete**: delad redigerbar plan, roller, statusar per
   uppgift, kommentarer, godkännandeflöden, realtidssynk, notiser, transparenslogg.
2. **Hög — Specifika integrations- och checklistor**: BRF-meddelandemall +
   avgiftspåminnelser, mäklarprocess-checklista; katt: Jordbruksverket/chipregister,
   kostnadsspårare, djurhems-partnerskap.
3. **Medel–hög — Automatisering & verktyg**: AI-dokumentanalys, inventeringslista för
   bohag, automatisk tidsfrist-beräkning, bulk-export.
4. **Medel — Fullmakt/arvskifte**: digital signering (BankID), versionering, mallar
   för flera delägare.
5. **Medel — Kostnadsspårning & påminnelser**: ledger för löpande kostnader med
   kvittouppladdning, push/e-postpåminnelser.
6. **Låg–medel — Övrigt**: PWA/offline, djupare myndighetsjämförelser, partnerskap
   med oberoende jurister/mäklare/djurorganisationer, tillgänglighet.

**Sammanfattning**: Efterplan är starkt på struktur och mallar men saknar inbyggt
samarbetsstöd och tredjeparts-integrationer — användaren koordinerar fortfarande
manuellt mellan syskon och externa aktörer.
