# Efterplan — Veckorapport 2026-09-14

🔢 **GA4 SAKNAS** — hoppa över DEL 1 (Google-credentials ej tillgängliga i molnsandlådan)

---

## DEL 2 — Kodaudit

🔧 **Uptime:** ej mätbar (utgående HTTPS mot efterplan.se blockeras av molnsandlådans proxy)
   **Sårbarheter:** 0 (ga4-dashboard: `{'info':0,'low':0,'moderate':0,'high':0,'critical':0,'total':0}`)
   **Paketer:** @supabase/supabase-js + stripe ej installerade i sandlådan (inga lokala node_modules)

**Kodfynd:**
- `auth-modal.html` saknar `<meta name="description">`, `lang="sv"`, `viewport` — **false positive** (redan noterat i T100/T212: filen är ett body-fragment som inlines i `index.html`, inte en fristående sida; inga nya åtgärder krävs)
- **101 inline `onclick=`-attribut** + **6 inbäddade `<script>`-block** i ~20 HTML-filer kräver `'unsafe-inline'` i CSP:n (T256-begränsning) — ny ticket T260

**Senaste commits (sedan 2026-09-07):**
- `f9830fa` — PR #96: T244+T255+T256+T257 (säkerhetsheaders, CSP, sårbarhetsfix, Lighthouse-lucka) — alla ✔
- `fead482` — PR #95: Ads launch-prep (ADS-LAUNCH-A.md, trycktestade landningssidor)

---

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 190 |
| ⧖ Pågår | 11 |
| ☐ Ej startade | 47 |

**Pågår (urval):**
- T015/T016: User research (anhörigintervjuer)
- T032: Testa hela köpflödet
- T060: Push notifications — finns bara på branch `codex/t060-checkpoints`, ej mergad till `main`
- T079: Betald byrålisting — affärsmodell kräver Owner-beslut
- T081: Drop-off-analys

**Öppna Owner-blockers:**
- T246 🔴: GSC 403 — lägg till service-account i Search Console (instruktioner i ticket)
- T254 🟠: Google Ads launch — Alt A (Plausible+UTM) beslutad, Owner kör dashboard-stegen i `ADS-LAUNCH-A.md`
- T252 🟡: Aktivera Plausible custom goals — steg 1 i `ADS-LAUNCH-A.md`

**Nästa öppna (kodarbete):**
- T001: Läs hela Manifest-arket och bekräfta scope
- T003: Registrera bolag/enskild firma + F-skattsedel
- T248: Emoji → SVG-ikoner (systemiskt beslut + byte)

📣 **Insikt:** Google Ads-kampanjen (75 kr/dag, annonsgrupp 1+3) är byggd och redo men blockeras av att Plausible-goals (T252) och UTM-taggar i annonserna inte är satta — ett Owner-kvällspass på 30 minuter i Plausible + Google Ads-dashboarden låser upp mätdata och gör kampanjstart möjlig.

---

## DEL 4 — Nya tickets

| ID | Titel | Issue | Prio |
|----|-------|-------|------|
| T258 | `vad-gora-nar-nagon-dor.html` saknas i Lighthouse CI (prio 0.9 i sitemap) | [#97](https://github.com/joju91/Efterplan/issues/97) | 🟠 |
| T259 | `gratis-checklista-abonnemang.html` saknas i Lighthouse CI (Google Ads landningssida) | [#98](https://github.com/joju91/Efterplan/issues/98) | 🟠 |
| T260 | 101 inline `onclick=`-attribut blockerar CSP-förstärkning (`unsafe-inline`-beroende) | [#99](https://github.com/joju91/Efterplan/issues/99) | 🟡 |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Lägg till `vad-gora-nar-nagon-dor.html` i Lighthouse CI URL-lista | `.github/workflows/weekly-health.yml` | 🟠 |
| 2 | Lägg till `gratis-checklista-abonnemang.html` i Lighthouse CI URL-lista | `.github/workflows/weekly-health.yml` | 🟠 |
| 3 | Inventering + flytta inline onclick→addEventListener (pilot: index.html) | `index.html` + `app.js` | 🟡 |

---

## Checklista

- [x] DEL 1 — GA4: Saknas (credentials ej tillgängliga)
- [x] DEL 2 — Kodaudit: Körd (0 sårbarheter, 0 TODOs, 1 false positive)
- [ ] Uptime: Ej mätbar (proxy blockerar efterplan.se)
- [x] DEL 3 — Roadmap: 190 ✔ / 11 ⧖ / 47 ☐
- [x] DEL 4 — Tickets: T258, T259, T260 skapade
- [x] DEL 5 — GitHub Issues: #97, #98, #99 öppnade
- [x] DEL 6 — Commit + push

---

*Genererad automatiskt 2026-09-14 av Claude Code veckorapport-rutin.*
