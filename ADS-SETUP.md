# Google Ads — konverteringsspårning (aktivering)

Koden är på plats (`app.js`, PR från branch `ads-conversion-tracking`).
Den är **avstängd tills du fyllt i tre värden**. Fram till dess laddas
ingen Google-kod och inga mätcookies sätts.

Kampanjunderlaget (annonsgrupper, sökord, budget): `google-ads-underlag-2026-08.md`.

---

## Vad du gör i Google Ads (engångs)

1. **Verktyg → Konverteringar → + Ny konverteringsåtgärd → Webbplats**.
2. Skapa **två** åtgärder:

   | Namn | Kategori | Värde | Räkning | Används för |
   |------|----------|-------|---------|-------------|
   | `Personlig plan skapad` | Skicka in leadformulär (eller "Övrigt") | Inget värde | En | mjuk signal — någon gick igenom onboardingen och fick en plan |
   | `Köp 49 kr` | Köp | **Använd olika värden** (skickas från koden) | En | hård signal — betalning genomförd |

3. För varje åtgärd väljer du **"Använd Google-taggen"** (inte Google Tag Manager,
   inte "importera från GA4" — GA4 finns inte längre).
4. Google visar då ett **konverterings-ID** (`AW-XXXXXXXXXX`) och en
   **konverteringsetikett** per åtgärd (`abCdEfGhIjKlMnOp`).
   ID:t är samma för båda; etiketten är olika.

## Vad du (eller Claude) fyller i

I `app.js`, längst upp (sök på `ADS_CONVERSION_ID`):

```js
const ADS_CONVERSION_ID   = 'AW-XXXXXXXXXX';   // ditt konverterings-ID
const ADS_LABEL_PLAN      = 'xxxxxxxxxxxxxxxx'; // etikett för "Personlig plan skapad"
const ADS_LABEL_PURCHASE  = 'yyyyyyyyyyyyyyyy'; // etikett för "Köp 49 kr"
```

Bumpa `app.js?v=30` → `?v=31` i `index.html` och deploya. Klart.

## Vad koden gör när det är ifyllt

| Händelse | Var i koden | Konvertering |
|----------|-------------|--------------|
| Onboarding klar → plan visas | `generatePlan()` | `ADS_LABEL_PLAN` (mjuk, inget värde) |
| Stripe-betalning bekräftad vid retur | `handlePremiumReturn()` | `ADS_LABEL_PURCHASE` med värde (49 kr, eller faktiskt `amount_total` från Stripe) och `transaction_id = Stripe-sessionen` → Google dedupar, en omladdning dubbelräknar inte |

Dessutom, oberoende av om taggen är på: `gclid` och `utm_*` från
annons-URL:en sparas i `localStorage` (`efterplan_gclid`, `efterplan_utm`)
vid landning — underlag för **offline conversion import** (Stripe-webhook
→ Ads) om du vill ha exakt CAC per sökord senare.

## Annons-URL:er — UTM-tagga alltid

Även med taggen på, sätt final URL i varje annons till t.ex.:

```
https://efterplan.se/arvskifte-mall.html?utm_source=google&utm_medium=cpc&utm_campaign=arvskifte&utm_term={keyword}&utm_content={creative}
```

`{keyword}` / `{creative}` är Google ValueTrack — fylls i automatiskt.
Ger sökordsnivå i Plausible också.

## Integritetsnotis

När `ADS_CONVERSION_ID` är ifyllt sätter Google-taggen `_gcl_*`-cookies
för den som klickat en annons. Det är en medveten avvikelse från
"ingen Google-kod / sparas bara lokalt" (PR #85 tog bort GA4). Överväg
att nämna det i `index.html` §"Din integritet" när du aktiverar, eller
håll det avstängt och kör Plausible-only (Alternativ A i underlaget).

## Efter 2 veckor

- Ads → Sökord → kolumn **Konv.** och **Kostn./konv.**: pausa sökord med
  0 konverteringar eller CPC > 10 kr.
- Söktermsrapporten varje vecka → lägg irrelevanta som negativa sökord.
- Transaktionsord ("arvskifte mall") utvärderas på **Kostn./konv. för Köp 49 kr**.
- Informationsord ("vad gör man när någon dör") på **Kostn./konv. för plan skapad**
  — och överväg att pausa dem om de bara dubblerar din gratis organiska trafik.
