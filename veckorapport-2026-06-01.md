# Efterplan — 2026-06-01

## 🔢 Nyckeltal (7 dagar — GA4)

GA4 SAKNAS — credentials ej tillgängliga i molnsandlådan (ingen GA4-connector ansluten).

---

## 🔧 Teknisk audit

| Kontroll | Resultat |
|----------|----------|
| Uptime | 403 (Cloudflare blockerar sandbox-IP — förra veckans GitHub Actions visade 200 OK) |
| ga4-dashboard vulns | 0 critical · 0 high · 0 moderate · 0 low |
| TODOs/FIXMEs | 0 |
| Saknade meta descriptions | share-modal.html, auth-modal.html (T100: false positives, body-fragment), ga4-dashboard/public/index.html (har noindex — OK) |

**Kodfynd:**
- `app.js:698` — Engelska ord i svensk text: `"den deceased hade ett efterlevandeskydd"` → ska vara `"den avlidne hade"` (T127)
- `share-modal.html` — 183 rader orphan-fil kvar i repot trots att delningsfunktionen skrotades i T124 (commit 59ddcde, 2026-05-30) (T129)

---

## 🗺️ Roadmap-status

| Status | Antal | Δ vs 2026-05-25 |
|--------|-------|----------------|
| ✔ Klara | 97 | +4 |
| ⧖ Pågår | 8 | −1 |
| ☐ Ej startade | 7 | −6 |

**Pågår:**
- T015 — Validate step order with 2–3 real relatives
- T016 — Adjust order and text based on interviews
- T032 — Test full purchase flow
- T034 — Set up Bokio or Fortnox
- T047 — Analyze drop‑off
- T079 — Betald byrålisting
- T081 — Analyze drop‑off + prioritize top 3 issues
- T123 — De-inlining (index.html har 38 inline styles kvar)

**Nästa öppna:**
- T001 — Read the entire Manifest sheet and confirm scope
- T003 — Register company / sole proprietorship + apply for F‑tax
- T004 — Open business bank account

---

## 📣 Marknadsinsikt

Med 97 avklarade tasks, 4-stegs onboarding och 7 nya livsrelevanta uppgifter tillagda (barnpension, värdepapper, äktenskapsförord m.fl.) är innehållsdjupet nu tillräckligt för organisk söktrafik — prioritera T128 (sitemap lastmod) så Google snabbt crawlar om de uppdaterade sidorna och rankar det nya innehållet.

---

## 🎫 Nya tickets

| ID | Titel | Prioritet | GitHub |
|----|-------|-----------|--------|
| T127 | Engelska "deceased" i barnpension_ansokan (app.js:698) | 🟠 | [#33](https://github.com/joju91/Efterplan/issues/33) |
| T128 | Sitemap lastmod stale (sitemap.xml) | 🟠 | [#34](https://github.com/joju91/Efterplan/issues/34) |
| T129 | share-modal.html överblivet spöke | 🟡 | [#35](https://github.com/joju91/Efterplan/issues/35) |

---

## ✅ Åtgärder att godkänna

| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Byt `"den deceased hade"` → `"den avlidne hade"` | app.js:698 | 🟠 |
| 2 | Uppdatera `<lastmod>` per git-datum för alla sidor | sitemap.xml | 🟠 |
| 3 | Ta bort orphan-filen | share-modal.html | 🟡 |
