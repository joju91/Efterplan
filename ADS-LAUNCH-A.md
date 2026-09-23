# Google Ads — kampanjen är live

Startad 2026-09-23. Du behöver bara följa upp — allt är uppsatt.

---

## Vad som körs

**Campaign #1** (Sök) — [ads.google.com](https://ads.google.com)

| Inställning | Värde |
|---|---|
| Nätverk | Bara Googles söknätverk |
| Geografi / språk | Sverige / svenska |
| Dygnsbudget | **30 kr** |
| Budstrategi | Maximera klick (inget max-CPC-tak) |
| Bred matchning | Av |

| Annonsgrupp | Sökord | Landningssida |
|---|---|---|
| Arvskifte | "arvskiftesavtal mall", "arvskifteshandling mall", "mall arvskifte", "arvskifte mall", "hur skriver man arvskiftesavtal", [arvskiftesavtal] | `arvskifte-mall.html` |
| Säga upp abonnemang | "säga upp abonnemang dödsfall", "avsluta abonnemang dödsbo", "uppsägningsbrev dödsbo mall", "säga upp abonnemang dödsbo", "uppsägning abonnemang dödsfall" | `gratis-checklista-abonnemang.html` |

Landnings-URL:erna har `utm_source=google&utm_medium=cpc&utm_campaign=…` så trafiken syns i Plausible.

**Negativa sökord (kampanjnivå):** gratis, jobb, kurs, mall word, mall excel, blankett, flashback, lön, skatteverket blankett.

Dödsboanmälan och Bouppteckning är medvetet inte med — informationssökningar, dyra, konverterar inte till 49 kr.

---

## Mätning

**Plausible** — mål: `free_tool_letter_generated`, `premium_activated` (m.fl.).

**Google Ads** — tagg `AW-18391491446` på `index.html` + båda landningssidorna. Konverteringsåtgärder:

| Åtgärd | Etikett | Skickas från |
|---|---|---|
| Personlig plan skapad | `07qVCNedmoIdEPbG38FE` | `generatePlan()` i `app.js` |
| Köp 49 kr | `_6NoCNqdmoIdEPbG38FE` | `handlePremiumReturn()` i `app.js` (belopp + Stripe-session som `transaction_id`) |

OBS: en testkonvertering från 2026-09-23 (`transaction_id = cs_test`, 49 kr) + en plan-konvertering kan synas — räkna bort dem.

---

## Dag 1–5: kolla varannan dag (2 min)

**Plausible:** Filtrera på `utm_source = google`. Kolla `free_tool_letter_generated`.

**Google Ads → Sökord → Söktermer:** om något ser irrelevant ut, lägg till som negativt sökord.

---

## Dag 5 (2026-09-28): skicka mig det här

Klistra in siffrorna så gör jag analysen åt dig (roadmap T264):

```
Klick totalt:
Kostnad totalt:
Köp 49 kr (Google Ads, konverteringar):
free_tool_letter_generated (Plausible, utm_source=google):
premium_activated (Plausible, utm_source=google):
```

**Är det värt att fortsätta?** Tumregel:
- Kostnad per 49 kr-köp **< 50 kr** → fortsätt, skala
- Många klick, noll brev → landningssidan är problemet, inte annonsen
- Kostnad per 49 kr-köp **> 50 kr** konsekvent → stoppa, lägg pengarna på SEO

Städa samtidigt: den gamla konverteringsåtgärden "Köp" (felkonfigurerad) kan tas bort under Mål → Konverteringar.
