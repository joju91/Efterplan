# Google Ads — launch-checklista (Alternativ A: Plausible + UTM)

Byggd 2026-09-10. Alt A = ingen ny Google-kod, ingen mätcookie. Du gör allt
i två dashboards; koden är redan klar. AW-taggen (Alt B) finns kvar i
`app.js` avstängd — spara den till om testet visar att annonser är värt att
skala. Kampanjstruktur: `google-ads-underlag-2026-08.md`.

**Testomfattning:** bara de två köpnära annonsgrupperna, 75 kr/dag, 2 veckor
(~1 050 kr). Informationssökorden ("vad gör man när någon dör",
"bouppteckning") är avsiktligt bortvalda — dyra, konkurrerar med eget
gratismaterial, konverterar inte till 49 kr.

**Landningssidorna är trycktestade 2026-09-10** (browser, mobil + desktop):
formulär → generera → färdigt brev + `free_tool_letter_generated`-event.
Ingen horisontell scroll, inga fel. Tratten är hel — säkert att skicka
betald trafik dit.

---

## ☐ Steg 1 — Plausible (5 min)

[plausible.io](https://plausible.io) → **efterplan.se** → **Settings → Goals
→ + Add goal → Custom event**. Lägg till dessa (de fyras redan från koden —
du registrerar dem bara som mål så de räknas som konverteringar):

```
onboarding_start
plan_generated
free_tool_letter_generated
free_tool_to_app_click
premium_activated
```

Viktigast för det här testet: **`free_tool_letter_generated`** (brev skapat
på landningssidan) och **`premium_activated`** (49 kr betalt).

---

## ☐ Steg 2 — Google Ads: trimma kampanjen (10 min)

Logga in → öppna den pausade kampanjen ("vi satte upp allt men aktiverade
aldrig").

**Behåll två annonsgrupper:**

| Annonsgrupp | Landningssida |
|---|---|
| Arvskiftesavtal | `https://efterplan.se/arvskifte-mall.html` |
| Säga upp abonnemang | `https://efterplan.se/gratis-checklista-abonnemang.html` |

**Pausa** annonsgrupp "Dödsboanmälan" och "Bouppteckning" (behåll dem för
senare, aktivera inte nu).

**Sökord — behåll (exakt-/frasmatchning):**

Arvskiftesavtal:
```
"arvskiftesavtal mall"
"arvskifte mall gratis"
"arvskifteshandling mall"
"mall arvskifte"
```

Säga upp abonnemang:
```
"uppsägningsbrev dödsbo mall"
"säga upp abonnemang dödsfall"
"avsluta abonnemang dödsbo"
```

(Ta bort bredare varianter som "hur skriver man arvskiftesavtal" — mer
informations- än köpintention.)

---

## ☐ Steg 3 — Final URL med UTM (5 min)

Sätt **Final URL** per annonsgrupp. `{keyword}` / `{creative}` fyller Google
i automatiskt (ValueTrack).

Arvskiftesavtal:
```
https://efterplan.se/arvskifte-mall.html?utm_source=google&utm_medium=cpc&utm_campaign=arvskifte&utm_term={keyword}&utm_content={creative}
```

Säga upp abonnemang:
```
https://efterplan.se/gratis-checklista-abonnemang.html?utm_source=google&utm_medium=cpc&utm_campaign=abonnemang&utm_term={keyword}&utm_content={creative}
```

---

## ☐ Steg 4 — Kampanjinställningar & aktivera (5 min)

| Inställning | Värde |
|---|---|
| Kampanjtyp | Bara Sök (ej Display, ej Sökpartners) |
| Geografi | Sverige |
| Språk | Svenska |
| Dygnsbudget | **75 kr** |
| Budstrategi | Maximera antal klick, **max-CPC-tak ~8 kr** |
| Enheter | Alla (Google klarar mobiljusteringen själv) |
| Schema | Ingen begränsning |

→ **Sätt kampanjen till Aktiv.**

---

## ☐ Steg 5 — Negativa startsökord (klistra in direkt)

Kampanjnivå → Negativa sökord → klistra in:

```
gratis
jobb
kurs
mall word
mall excel
blankett
flashback
lön
skatteverket blankett
```

Lägg till fler varje vecka från **Sökord → Söktermer** (se steg 6).

---

## ☐ Steg 6 — Vecka 1: kolla var 2–3 dag (5 min/gång)

- **Google Ads → Sökord → Söktermer:** allt irrelevant → negativt sökord.
- **Plausible:** filtrera `Visitors` på `Source is google` (eller
  `utm_source is google`). Titta på **goal-konvertering per landningssida**.
- Pausa sökord med **0 `free_tool_letter_generated` efter ~15–20 klick**.

---

## ☐ Steg 7 — Efter 2 veckor: skicka siffrorna hit

Från Google Ads (per sökord): **klick, kostnad**.
Från Plausible: **`free_tool_letter_generated`** och **`premium_activated`**
för `utm_source=google`, gärna per `utm_campaign`.

Klistra in det så räknas kostnad per brev och kostnad per 49 kr-köp ut, med
rekommendation om vad som ska dödas, behållas eller skalas.

**Tumregel:**

| Utfall | Gör |
|---|---|
| Kostnad per 49 kr-köp > ~50 kr genomgående | Stoppa. Betalar inte tillbaka — behåll lärdomarna, lägg pengarna på SEO/outreach |
| En sökordshink billig + konverterar | Skala den; slå då på AW-taggen (`ADS-SETUP.md`) för Smart Bidding |
| Mycket klick, inga brev skapade | Landningssidan är problemet — säg till |
