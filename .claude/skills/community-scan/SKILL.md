---
name: community-scan
description: Veckovis sökning på Reddit, Flashback och Familjeliv efter nya trådar om dödsbo/bouppteckning/arvskifte där efterplan.se kan nämnas naturligt. Loggar fynd i community-watch.md och öppnar PR.
---

# Community-scan — Efterplan

Söker Reddit (r/sweden, r/privateeconomy), Flashback (Ekonomi & juridik,
Familjeliv & relationer) och Familjeliv.se efter trådar om dödsbo,
bouppteckning, arvskifte, arv eller myndighetskontakt efter dödsfall —
sådant efterplan.se konkret hjälper med.

## Hård gräns: max 1 år gamla trådar

**Inkludera aldrig trådar äldre än 12 månader från dagens datum.**
Kontrollera alltid att senaste inlägget är inom det senaste året innan du
loggar en tråd. Trådar med sista aktivitet > 1 år sedan ska uteslutas helt —
inte flaggas, inte loggfört, bara ignoreras. En svarsperson i en död tråd
hjälper ingen.

Dagens datum finns i `currentDate` i systemkontexten. Räkna 12 månader
bakåt som hård cutoff.

## Regler

- **Aldrig posta automatiskt.** Jonas granskar och väljer själv om/hur han svarar.
- Skriv föreslagna svar på svenska, i en jordnära och hjälpsam ton.
- Nämn efterplan.se bara när det är naturligt och relevant — inte i varje tråd.
- Om forumet är blockerat av nätverkspolicyn: anteckna det tydligt i loggposten.

## Loggformat (lägg till i `community-watch.md`)

```
## ÅÅÅÅ-MM-DD (dagens datum)

**Forum:** Flashback / Familjeliv / Reddit
**Tråd:** [Titel](URL)
**Senaste inlägg:** ÅÅÅÅ-MM-DD   ← verifiera att detta är < 1 år
**Fråga:** En mening om vad tråden handlar om.

**Föreslaget svar:**
> …
```

Inga fynd → skriv ändå en kort post: `## ÅÅÅÅ-MM-DD — inga nya relevanta trådar`.

## PR-flöde

1. Skapa branch `community-scan-ÅÅÅÅ-MM-DD` från `main`.
2. Uppdatera `community-watch.md` med dagens logg.
3. Öppna PR med titel `Community-scan: ÅÅÅÅ-MM-DD — N nya trådar hittade`.

## Gotcha

Flashback-tråd-ID under t3800000 (t.ex. t3314685, t3607656, t3725209) är
från 2022 eller tidigare — uteslut dem direkt. Kan ett datum inom 12 månader
inte verifieras via sökmotorns utdrag eller tråden: uteslut. Fabricera aldrig
datum. Prompten i molnrutinen `trig_01RSTqpLnTb2UapAYiYvkrFw` är
sanningskällan — håll den här filen i synk med den.
