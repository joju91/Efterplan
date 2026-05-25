# Efterplan — 2026-05-25

🔢 Sessions: GA4 SAKNAS — hoppa över DEL 1 (credentials ej konfigurerade i molnsandlådan, se T113)

🔧 Uptime: Efterplan.se svarar — sandbox-hälsocheck blockeras av Cloudflare (HTTP 403, ej driftstopp, se T106 ✔) | Sårbarheter: 1 moderate (qs DoS, T104 ☐) | Brutna länkar: ej kontrollerat
   - `om.html` saknas i sitemap.xml trots korrekt canonical + meta — sökmotorer crawlar inte Om-sidan (sitemap.xml)
   - ga4-dashboard/package.json: UTF-8 BOM kvarstår (T116 ☐) + 13 GA4 track()-anrop i Title Case (T117 ☐)

📣 SEO-innehållet indexeras men Om-sidan (om.html) är osynlig för sökmotorer — lägg till den i sitemap.xml denna vecka (5 min fix).

🎫 Nya tickets: T119 – om.html saknas i sitemap.xml

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till om.html i sitemap.xml (`<url>`-block med loc + lastmod + changefreq) | sitemap.xml | 🟠 |

---

## Roadmap-status
- Klara: 87
- Pågår: 8
- Ej startade: 10 (inkl. T119)

## Öppna tickets (☐)
| ID | Beskrivning |
|----|-------------|
| T103 | Uppgradera googleapis 144→171 i ga4-dashboard |
| T104 | `npm audit fix` — kvarvarande qs moderate-sårbarhet (GHSA-q8mj-m7cp-5q26) |
| T113 | GA4 service-account-credentials i Cowork-sandlådan |
| T116 | UTF-8 BOM i ga4-dashboard/package.json |
| T117 | 13 GA4 track()-anrop i Title Case → snake_case (app.js) |
| T119 | om.html saknas i sitemap.xml |

## Kodaudit-fynd
| Fynd | Detalj | Status |
|------|--------|--------|
| Missing meta description | share-modal.html, auth-modal.html (fragment — false positive, T100 x), ga4-dashboard/public/index.html (noindex satt, T105 ✔) | Inga nya |
| GA4 events | onboarding_start ✔, plan_generated ✔, task_completed ✔ (r1496) — 13 Title Case-events kvarstår (T117 ☐) | T117 ☐ |
| npm audit | 1 moderate (qs, ga4-dashboard) — `npm audit fix` löser (T104 ☐) | T104 ☐ |
| BOM i package.json | ga4-dashboard/package.json börjar med EF BB BF (T116 ☐) | T116 ☐ |
| om.html ej i sitemap | sitemap.xml: 32 URLs, om.html saknas (T119 ☐ NY) | **Ny** |
| Uptime | Cloudflare 403 i sandbox = ej driftstopp. UptimeRobot aktiv (T111 ✔) | OK |
