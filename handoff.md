# Handoff — aktiveringsundersökning (2026-08-13)

Utgångsläge: veckorapporten för 2026-08-10 visade 16 sessioner, 0 `onboarding_start`, 0 `plan_generated`. Uppgiften var att avgöra varför — inte gissa.

**Princip för det här arbetet: aldrig gissa.** Allt nedan är antingen verifierat direkt (kod läst, kod körd, output observerat) eller uttryckligen markerat som okänt. Inga hypoteser listas som om de vore slutsatser.

---

## Blockering

Sessionens nätverkspolicy nekar all utgående trafik till `efterplan.se` — bekräftat både via headless webbläsare (Playwright: `net::ERR_TUNNEL_CONNECTION_FAILED`, proxyn svarade 403 på CONNECT) och via `WebFetch` (`EGRESS_BLOCKED`). Enligt miljöns egna regler ska en sådan policy-nekning rapporteras, inte rundas. **Den skarpa produktionssajten kunde alltså inte testas direkt från den här sessionen.**

---

## Vad som är verifierat (kod + lokal körning)

1. **Onboarding-koden fungerar.** Körde exakt samma kod (`index.html` + `app.js`) lokalt via `python -m http.server` + headless Chromium (mobil viewport), klickade på "Börja här":
   - Inga JavaScript-fel
   - `screen-onboarding` och `ob-step-1` blev korrekt aktiva efter klick
   - `startOnboarding()` (`app.js:147`) körde igenom helt — dess första rad är `track('onboarding_start')`, och resten av funktionen (som är beroende av att `track()` inte kastar fel) exekverade också

2. **Eventnamnet matchar exakt mellan klient och rapport.** `app.js` skickar `track('onboarding_start')`. Veckorapportens GA4-fråga (`ga4-dashboard/scripts/weekly-kpis.js:52-54`) filtrerar på `eventName in ['onboarding_start', 'plan_generated', 'task_completed']`. Ingen namn-mismatch.

3. **`gtag`-shimmen är synkron.** `index.html:4-16` definierar `window.gtag` som en fungerande funktion direkt (pushar till `dataLayer`) — det riktiga `gtag/js`-scriptet laddas separat, lazy, på `window.load`. Så `track()`s check `typeof window.gtag === 'function'` är sann redan innan det riktiga scriptet hunnit ladda.

4. **Ingen Content-Security-Policy finns.** Varken i `index.html` eller `vercel.json` — inget CSP-block kan hindra `googletagmanager.com` från att laddas.

5. **Cache-bustning finns redan.** `<script src="app.js?v=23" defer>` (`index.html:1053`) — en gammal cachad version av `app.js` (trots `Cache-Control: immutable, max-age=31536000` i `vercel.json`) är alltså inte förklaringen.

6. **Ingen dold overlay/consent-banner.** Sökte igenom `index.html` efter cookie/consent/overlay-mönster — de enda overlayserna är `completion-overlay`, `auth-modal`, `share-modal`, samtliga `hidden` som default. Inget som skulle kunna blockera klick på "Börja här" osynligt.

**Slutsats av kodgenomgången:** Inget kodfel hittades som skulle förklara 0/16. Alla kontroller som går att göra utan tillgång till skarp trafik/GA4-konto är uttömda.

---

## Vad som är okänt — och som INTE ska gissas på

Varför de 16 verkliga sessionerna gav 0 `onboarding_start` är okänt. Det finns ingen ytterligare kodanalys eller lokal simulering som kan svara på det — det kräver att någon med tillgång till GA4-kontot observerar riktig trafik.

---

## Nästa steg (kräver Jonas — enda faktabaserade väg framåt)

1. Öppna GA4 → **Realtid** (eller DebugView)
2. Besök `efterplan.se` i en vanlig webbläsare
3. Klicka på "Börja här"
4. Observera: dyker `onboarding_start` upp i realtidsvyn inom några sekunder?

**Om ja:** spårningen fungerar för riktiga besökare — nästa fråga (varför färre klickar än förväntat) är en separat undersökning som kräver egna data, inte gissningar.

**Om nej:** det är ett verkligt spårningsfel hos riktiga besökare (specifikt, inte hypotetiskt) — då finns ett konkret fel att felsöka vidare.

Rapportera bara vad som faktiskt observerades i Realtid/DebugView, så tas nästa steg därifrån.
