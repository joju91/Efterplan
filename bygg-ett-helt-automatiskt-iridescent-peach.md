# Fas 26 — SEO-utbyggnad + produktförenkling ("minsta möjliga insats")

## Context

Fas 25 (idag, 2026-08-14) fixade akuta SEO-problem: långa titlar, svag interlänkning, och en helautomatisk sitemap/indexerings-pipeline (T217). NEXT_STEPS_FOR_JONAS.md är tydlig med ägarens egen prioritering: *"Skriva nya SEO-sidor — du har redan 33. Optimera först, bygg sen där det finns hål."* Samtidigt visar trafikdatan (75 sessioner/30 dagar, mål 200) att det fortfarande finns mycket väg kvar, och roadmap.md har en stor backlog (T137–T142, T194, T208) av produktförbättringar som aldrig prioriterats.

Den här planen har två spår som körs enligt samma princip: **gör det åt användaren istället för att be dem göra det** — gäller både Google (automatiserad indexering, redan klar) och den sörjande användaren i appen (färre klick, färre tomma listor att fylla i, färre saker att komma ihåg).

Omfattningen är för stor för en session. Planen delar upp i: **(A) bygg nu** — låg risk, hög hävstång, klart i denna PR — och **(B) backlog** — loggas som nya roadmap-tickets (Fas 26) för kommande sessioner, med motivering så nästa session inte behöver gissa varför.

---

## Del A — Bygger nu

### A1. SEO — tekniska snabbvinster
1. **`om.html` saknar helt JSON-LD** (enda sidan utan strukturerad data) och är tunt innehåll (90 ord). Lägg till `Organization`+`WebPage` schema, matcha mönstret från övriga guider ([se t.ex. `arvsskatt.html:6-14`](arvsskatt.html)).
2. **Cannibalization**: `checklista-dodsbo.html` och `dodsbo-checklista-7-dagar.html` konkurrerar om samma sökintention. Lösning: gör `dodsbo-checklista-7-dagar.html` tydligt smalare (bara de akuta 7-dagarsuppgifterna, länka till `checklista-dodsbo.html` för helheten) och omvänt — differentiera titel/meta/H1 så de äger olika sökfraser istället för att krocka.
3. **HowTo-schema saknas på de mest processorienterade guiderna** (`bouppteckning-guide.html`, `arvskifte-guide.html`, `checklista-dodsbo.html`) trots att `dodsfallsintyg.html`/`saga-upp-hyresratt-dodsbo.html` redan visar mönstret. Lägg till `HowTo`/`HowToStep` på dessa tre — konkret CTR/rich-snippet-hävstång.

### A2. SEO — täpp de två tydligaste luckorna
Bygg **2 nya guide-sidor** (samma mall som befintliga 32: canonical, meta, Article+FAQPage+BreadcrumbList JSON-LD, interlänkar till 5–8 relaterade guider, läggs automatiskt till i sitemap av T217:s pipeline):
1. **`dodsboanmalan.html`** — löser cannibalization-problemet i A1.2 på riktigt (egen sida för det förenklade alternativet till bouppteckning) och är redan en känd term i appens egen logik (`litetDodsbo`-trigger, `app.js`) som saknar sin egen landningssida idag.
2. **`framtidsfullmakt.html`** — hög sökvolym-term, naturlig granne till `fullmakt-dodsbo.html`, inget existerande innehåll krockar.

Övriga identifierade luckor (internationellt arv, arvsavstående, gåvobrev, äktenskapsförord som egen sida, regionala sidor) → backlog, se B1.

### A3. Produkt — minska vad användaren måste göra själv
Följande är redan identifierade i roadmap.md (T208, "Grok-bevakningslista") men aldrig byggda. Alla fyra är direkta instanser av "gör det åt användaren":
1. **Förifyllda default-rader i Bouppteckning** (`app.js:3106-3251`, `boppRenderSection`) — istället för tomma listor för tillgångar/skulder, starta med vanliga rader (Bankkonto, Bostad, Bil, Bohag) ifyllningsbara/borttagbara. Användaren slipper komma på vad som ska fyllas i.
2. **Ersätt blockerande `alert()`** vid betalningsfel (`app.js:82`, `app.js:3065`) med samma `showFormError`/toast-mönster som redan används överallt annars (`app.js:2865-2877`) — konsekvens, inte ny mekanik.
3. **Slå ihop de tre duplicerade localStorage-list-implementationerna** (notify-list, doc-location-list, generisk `_getLSList`, `app.js:2081-2239`) till en delad komponent — minskar framtida bugytor, gör det lättare att snabbt lägga till fler "hjälp mig komma ihåg X"-listor utan att återuppfinna mönstret varje gång.
4. **Utöka AI-kategorisering till Räkningar** (`Arkiv` har redan `categorize-document.js`/`explain-document.js`, `app.js:1916-1934` — `Bills`-sektionen (`app.js:1534-1753`) har det inte). Samma redan etablerade "misslyckas tyst"-mönster återanvänds, inget nytt att bygga från grunden.

**Explicit avgränsat bort** (redan avvisat/kräver ägarbeslut, byggs inte): visa fler brev gratis (prissättningsfråga, `roadmap.md` AVVISAT), dela-länk mellan arvingar (medvetet borttaget T124, byggs ej om utan nytt beslut), lawyer-referral kickbacks (T207, affärsbeslut).

---

## Del B — Backlog (nya roadmap-tickets, byggs inte i denna session)

Loggas i `roadmap.md` som öppna tickets under **Fas 26** så nästa session har full kontext:

**SEO**
- B1. Fler content-luckor: `internationellt-arv.html`, `arvsavstaende.html`, `gavobrev.html`, `aktenskapsforord.html` som egna sidor (idag bara nämnda i app-logik/tickets, ingen SEO-landningssida).
- B2. Self-hosta Google Fonts (Fraunces/IBM Plex Sans) istället för `fonts.googleapis.com` — tar bort en extern render-blocking request, ren perf/Core-Web-Vitals-vinst.
- B3. Minifiera `style.css` (84KB)/`app.js` (150KB) — inget build-verktyg finns idag (T122/T123 är release om samma design-skuld); kräver att välja ett verktyg (esbuild/terser) och en CI-steg, större beslut än denna PR.
- B4. Bekräfta att `weekly-health.yml` (Lighthouse CI-budgets, beskrivet i `MAINTENANCE.md` men aldrig verifierat som en faktisk aktiv workflow) faktiskt finns/körs — annars saknas SEO/perf-regressionsskydd helt.
- B5. T216 (redan i roadmap): kör `/ga4` + GSC-koll om 2–4 veckor för att mäta effekten av Fas 25 + denna Fas 26.

**Produkt**
- B6. "Jag orkar inte just nu"-pausläge för checklistan (T208.1) — kräver UX-design av hur pausat state visas, större grepp än en enkel patch.
- B7. Deadline-påminnelse-mejl (T136) — opt-in-checkbox finns redan, men själva utskicksinfrastrukturen (Resend/SendGrid + cron) är obyggd; kräver ny extern tjänst-integration, egen session.
- B8. Onboarding steg 2 (12 kryssrutor): utreda om något kan förifyllas/gissas automatiskt (t.ex. baserat på postnummer om personen äger fastighet) istället för att alltid frågas — kräver research i vilka fält som faktiskt går att härleda, inte en säker snabbfix.
- B9. Fler brevmallar: hyresvärd (T139), Pensionsmyndigheten (T140), arvskiftesavtal-generator (T138) — var och en är en egen liten funktion, görs bäst separat.
- B10. Diskret inloggnings-nudge efter första sessionen (T208.4) för cross-device-sync.

---

## Filer att ändra (Del A)

- `om.html` — JSON-LD + utökat innehåll
- `dodsbo-checklista-7-dagar.html` — omfokuserad titel/meta/H1/innehåll
- `bouppteckning-guide.html`, `arvskifte-guide.html`, `checklista-dodsbo.html` — HowTo/HowToStep JSON-LD tillägg
- Nya: `dodsboanmalan.html`, `framtidsfullmakt.html` (fullständig sidmall, interlänkade från relevanta befintliga guider + `index.html`-footern)
- `app.js` — `boppRenderSection`/default-rader (Bouppteckning), `alert()`→`showFormError`-ersättning, ny delad list-helper som ersätter `_getLSList`/notify-list/doc-location-list-dupliceringen, `renderBills`/bill-formuläret får samma AI-assist-anrop som Arkiv redan har
- `roadmap.md` — nya tickets B1–B10 under en ny Fas 26-sektion, samt markera Del A-punkterna klara när de landar

## Verifiering

- SEO-delen: `node scripts/indexing/update-sitemap.mjs` (redan byggd i Fas 25) plockar automatiskt upp de två nya sidorna och validerar canonical — ingen manuell sitemap-uppdatering.
- Nya/ändrade sidor: snabb visuell koll via Browser-preview (rendering, inga trasiga länkar) + `git diff` mot mall-strukturen på en befintlig sida för konsistens.
- Produkt-delen: köra appen lokalt (`run`-skillen/dev-server), gå igenom Bouppteckning-fliken (default-rader syns och går att redigera/ta bort), trigga ett betalningsfel i test-läge (visar inline-fel, ingen `alert()`), lägga till en räkning med foto (AI-kategorisering körs eller misslyckas tyst som Arkiv redan gör).
- `roadmap.md` uppdateras med resultat/status precis som tidigare Faser (mönster: ID, beskrivning, datum, Fas, källa, prioritet, kategori, status).
