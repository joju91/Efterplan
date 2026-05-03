# Vad du behöver göra själv

Allt jag kunde göra autonomt är klart (se commit). Det här kräver dig — inloggad i GA4, GSC, eller på annat sätt manuellt.

## 1. Filtrera bort din egen IP i GA4 (5 min)

1. https://analytics.google.com → välj efterplan-property (531365335)
2. Admin (kugghjulet) → Data Streams → välj webbflödet
3. Configure tag settings → Show all → Define internal traffic
4. Create rule:
   - Rule name: `Jonas IP`
   - Match type: `IP address equals`
   - Value: din IP (kolla på https://whatismyipaddress.com/)
5. Spara
6. Admin → Data Settings → Data Filters → Create Filter
   - Filter name: `Internal Traffic`
   - Filter operation: `Exclude`
   - Parameter name: `traffic_type`
   - Parameter value: `internal`
   - Filter state: **Active** (inte Testing)
7. Spara

Om du växlar mellan flera nätverk (kontor, hemma, mobilt): lägg till en regel per IP, eller använd en GA4 opt-out browser extension när du surfar på din egen sajt.

## 2. Verifiera Search Console (10 min)

1. https://search.google.com/search-console
2. Välj efterplan.se property
3. **Pages** → kontrollera "Indexed" antal vs "Not indexed"
   - Notera: hur många av sajtens 33 sidor är indexerade?
   - För "Not indexed": klicka på varje anledning (Discovered – not currently indexed, Crawled – not currently indexed) och se vilka URL:er som drabbas
4. **Performance** → senaste 28 dagar → exportera till CSV
   - Skicka mig listan så analyserar jag CTR vs position per sida
5. **Sitemaps** → bekräfta att `https://efterplan.se/sitemap.xml` är inskickad och status = Success

## 3. Manuell indexering av prioriterade sidor (10 min × 4 dagar)

GSC tillåter ~10 manuella indexeringsförfrågningar per dag. Prioritera så här (10 om dagen, ta 4 dagar):

**Dag 1 — hubsidor (mest värde):**
- /
- /vad-gora-nar-nagon-dor.html
- /checklista-dodsbo.html
- /bouppteckning-guide.html
- /arvskifte-guide.html
- /tomma-dodsbo.html
- /salja-dodsbo.html
- /dodsbo-skulder.html
- /vad-kostar-en-begravning.html
- /testamente-guide.html

**Dag 2 — sidor med säsongsrelevant trafik:**
- /dodsfallsintyg.html
- /bankkonto-dodsfall.html
- /fullmakt-dodsbo.html
- /efterlevandepension.html
- /arvsskatt.html
- /sambo-arv.html
- /sarkullbarn.html
- /laglott.html
- /bouppteckning-tidslinje.html
- /dodsbo-deklaration.html

**Dag 3 — orphan/under-länkade sidor (de jag precis fyllde på med interna länkar):**
- /dodsannons.html
- /digital-dodsbo.html
- /boutredningsman.html
- /dodsbo-auktion.html
- /dodsbo-bil.html
- /dodsbo-fastighet.html
- /saga-upp-hyresratt-dodsbo.html
- /begravning-utomlands.html
- /begravningsbyra.html
- /dodsbo-bostadsratt.html

**Dag 4 — resterande:**
- /dodsbo-checklista-7-dagar.html
- /gravsten.html
- /vad-kostar-en-begravning.html (om ej dag 1)
- /om.html

Steg per URL: GSC → URL Inspection → klistra in URL → "Request Indexing".

## 4. Pusha kodändringarna till produktion

Jag har committat lokalt men inte pushat. När du är redo:

```bash
git push origin main
```

Vercel deployar automatiskt. Vänta 1–2 min och verifiera på https://efterplan.se att:
- Du kan klicka direkt på den runda checkboxen vid en task → den markeras klar utan att kortet expanderas
- Inga konsolfel

## 5. Community-distribution (parallellt, från denna vecka)

Innehållet finns redan kartlagt i `Aktuella Flashback-trådar (2026) för efterplan.se.md`. Använd anthropic-skills:community-distributor om du vill ha hjälp att skriva inläggen — den kommer ge dig texter att godkänna före publicering.

Mål: 2–3 hjälpsamma svar/inlägg per vecka, inte spammigt. Länka till relevant SEO-sida (inte bara startsidan).

## 6. Mätpunkter att kolla på efter 30 dagar

Be mig köra `/ga4` igen om en månad. Vi jämför:

| Mått | Idag | Mål 30d | Mål 90d |
|---|---|---|---|
| Sessioner | 113 | 200 | 500 |
| Organic Search-andel | 7% | 20% | 40% |
| Indexerade sidor | ? | ≥30 | alla |
| onboarding_start rate | 14% | 20% | 25% |
| plan_generated → task_completed | 8% | 25% | 40% |
| USA-sessioner | 20 | <5 | <5 |

## Vad jag inte gjorde (och varför)

- **Lighthouse-mätning** — kräver att sajten är live och svarar konsekvent. Kör själv eller säg till så kör jag mot produktion senare.
- **Bygga om hero/CTA** — jag har inte sett konkret data på onboarding-bouncen ännu (bara funnel-talen). Bättre att vänta på 30-dagars datan med ren GA4.
- **Skriva nya SEO-sidor** — du har redan 33. Optimera först, bygg sen där det finns hål.
- **Ändra färger/visuell design** — utanför skopet av det som GA4 visade.
