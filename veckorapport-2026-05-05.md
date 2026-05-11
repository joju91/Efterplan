# Efterplan Veckorapport — 2026-05-05 (Måndag)

> **Automatisk rapport** — genererad av schemalagt Cowork-jobb.  
> Inga ändringar har gjorts. Godkänn varje åtgärd nedan innan körning.

---

## 🔢 Nyckeltal (7 dagar)

| Mått | Värde | Not |
|------|-------|-----|
| Sessions | N/A | GA4-credentials saknas i sandlådan |
| Organisk andel | N/A | — |
| onboarding_start rate | N/A | — |
| plan_generated rate | N/A | — |

> **GA4-status:** Service account-nyckeln (`~/.config/efterplan/ga4-service-account.json`) finns inte i molnsandlådan och `efterplan.se` är inte på nätverks-allowlistan — live-hämtning blockerad. Uptime och Lighthouse kunde inte köras av samma skäl. Se åtgärd #5 nedan.

---

## 📊 Git-aktivitet denna vecka (proxy för arbete utfört)

52 filer ändrades de senaste 7 dagarna. Highlights:

- **Kritisk fix:** Redirect-loop bruten (`a1ceb47`) — blockerade Googles indexering
- **Hero-redesign:** Ny warm sand + soft sage-palett (token-override i `style-tokens.css`)  
- **30 SEO-sidor uppdaterade** — hero-copy, FAQ, structured data, begravningsbyrå-jämförelse  
- **3 GSC-URL:er i kö** (`sambo-arv.html`, `efterlevandepension.html`, `dodsbo-bostadsratt.html`) — blockerades av daglig quota 3 maj, väntar på manuell indexering

---

## 🔧 Teknisk audit

**Uptime:** Kan ej mätas från sandbox (Cloudflare-blockad) — T106 (UptimeRobot) fortfarande öppen  
**Performance / Accessibility / SEO:** Lighthouse ej tillgänglig i sandlådan  
**Säkerhet:** 4 moderate npm-sårbarheter i `ga4-dashboard` (T103 + T104 ☐ sedan 2026-04-29)  
**Brutna länkar:** Kan ej crawlas (nätverksblockad)

### Kodfynd

| Fil | Rad | Typ | Not |
|-----|-----|-----|-----|
| `app.js` | 1367 | `console.error` | `'Bill scan error'` — normalt felhanteringsblock, ej kritiskt |
| `supabase-client.js` | 145, 193, 256 | `console.warn` | Graceful Supabase-felhantering — acceptabelt |
| `sitemap.xml` | alla 32 URLs | Inaktuell `lastmod` | Senaste datum `2026-04-22` men **30 HTML-filer** ändrades denna vecka (T107 ☐) |
| `ga4-dashboard/public/index.html` | 8 | Saknar `noindex` | Dashboard exponerad utan `robots`-direktiv (T105 ☐) |

### GA4-events i koden ✔
Alla nyckel-events är korrekt implementerade:
- `app.js:73` — `onboarding_start`
- `app.js:285` — `plan_generated`
- `app.js:1413` — `task_completed`

---

## 📣 Marknadsföring

**Veckans läge:** 30 SEO-sidor uppdaterades och en kritisk redirect-loop fixades — det är den viktigaste trafikåtgärden på länge. Google kan nu crawla och indexera sidorna korrekt. Effekten syns troligen om 1–3 veckor i GSC.

**Prioritering denna vecka:** Slutför manuell GSC-indexering för de 3 kvarvarande URL:erna (`sambo-arv`, `efterlevandepension`, `dodsbo-bostadsratt`) — det är snabbaste vägen till index. Parallellt bör T107 (sitemap `lastmod`) åtgärdas så att Googlebot prioriterar de uppdaterade sidorna rätt.

**SEO-möjlighet:** Sitemap visar `lastmod 2026-04-22` för alla 32 sidor, men 30 av dem ändrades denna vecka. Uppdaterade `lastmod`-värden signalerar till Googlebot att prioritera ny crawlning — direkt ROI på den veckoinsats som redan lagts.

---

## 📋 Roadmap-status

| Klara ✔ | Pågår ⧖ | Ej startade ☐ |
|:-------:|:-------:|:-------------:|
| 79 | 8 | 12 |

### Pågår just nu
- T015 Validate step order with 2–3 real relatives
- T016 Adjust order and text based on interviews
- T026 Share with 5 target users, collect feedback
- T032 Test full purchase flow
- T034 Set up Bokio or Fortnox
- T047 Analyze drop-off (väntar på ~100 organiska sessioner)
- T079 Betald byrålisting (affärsmodell beslutas av Owner)
- T081 Analyze drop-off + prioritize top 3 issues (väntar på sessioner)

### Öppna tickets att stänga
- **T105** 🟠 — `noindex` på ga4-dashboard (1 rad)
- **T106** 🟠 — UptimeRobot-monitor (manuell setup)
- **T103** 🟡 — `googleapis` upgrade i ga4-dashboard
- **T104** 🟡 — `npm audit fix` i ga4-dashboard (4 moderate vulns)
- **T107** 🟡 — Sitemap `lastmod` uppdatering

---

## ✅ Föreslagna åtgärder (godkänn innan körning)

| # | Åtgärd | Fil | Prioritet |
|---|--------|-----|-----------|
| 1 | Uppdatera `<lastmod>` i `sitemap.xml` för alla 30 sidor ändrade denna vecka till `2026-05-04` | `sitemap.xml` | 🟠 P1 |
| 2 | Lägg till `<meta name="robots" content="noindex, nofollow">` i `<head>` rad 8 | `ga4-dashboard/public/index.html` | 🟠 P1 |
| 3 | Kör manuell GSC-indexering av de 3 kvarvarande URL:erna (se `.claude/pending-gsc-indexing-2026-05-04.md`) | GSC (manuell) | 🟠 P1 |
| 4 | Kör `npm audit fix` i ga4-dashboard (4 moderate vulns, T103 + T104) | `ga4-dashboard/` | 🟡 P2 |
| 5 | Lägg till `efterplan.se` på nätverks-allowlistan i Cowork (Settings → Capabilities) så att uptime, Lighthouse och GA4 kan köras i framtida rapporter | Cowork-inställningar | 🟡 P2 |

```
[ ] Godkänn åtgärd 1 — sitemap lastmod
[ ] Godkänn åtgärd 2 — noindex ga4-dashboard
[ ] Godkänn åtgärd 3 — GSC-indexering (manuell)
[ ] Godkänn åtgärd 4 — npm audit fix
[ ] Godkänn åtgärd 5 — allowlista efterplan.se i Cowork
```

---

*Rapport genererad: 2026-05-05 (auto) | Nästa körning: måndag 2026-05-11*
