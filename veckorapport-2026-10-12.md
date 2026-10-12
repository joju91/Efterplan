# Efterplan — 2026-10-12

🔢 Sessions: GA4 SAKNAS — hoppar över DEL 1 (credentials ej tillgängliga i molnsandlådan)

🔧 Uptime: Ej verifierbar direkt (agent-proxy 403 på utgående HTTPS — sandboxbegränsning, ej sitefel) | Sårbarheter: 1 critical (ga4-dashboard) | Beroenden: @supabase/supabase-js + stripe MISSING i root (vanligt vid färsk checkout utan `npm install`)
   - `ga4-dashboard`: **CRITICAL** proxy-addr GHSA-jqcg-44mw-7w3h — IP spoofing via IPv4-mapped IPv6 trust subnet (range >=1.1.0 <2.0.8, fix available). Åtgärd: `cd ga4-dashboard && npm audit fix`. Fil: `ga4-dashboard/package-lock.json`.
   - `auth-modal.html`: saknar `<meta name="description">` — redan spårad som T274 (☐).

📣 Stripe 23.0 (T275 ☐) och proxy-addr critical är de viktigaste öppna tech-ticketsen — åtgärda dem i samma sprint för att hålla beroenderna säkra och aktuella.

🎫 Nya tickets: T276 – proxy-addr critical i ga4-dashboard (#143 https://github.com/joju91/Efterplan/issues/143)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | `cd ga4-dashboard && npm audit fix` (fixar proxy-addr GHSA-jqcg-44mw-7w3h, ändrar bara lockfile) | `ga4-dashboard/package-lock.json` | 🔴 |

---

## Roadmap-status

- Klara: 218
- Pågår: 12
- Ej startade: 33

### Pågående (⧖)
- T015 — Validate step order with 2–3 real relatives
- T016 — Adjust order and text based on interviews
- T032 — Test full purchase flow
- T034 — Set up Bokio or Fortnox
- T047 — Analyze drop-off
- T060 — Push notifications (7/30/90 days)
- T079 — Betald byrålisting
- T081 — Analyze drop-off + prioritize top 3 issues
- T271 — Traffic-sprint (väntar på Owner)

### Nästa öppna (☐)
- T001 — Read the entire Manifest sheet and confirm scope
- T003 — Register company / sole proprietorship + apply for F-tax
- T274 — auth-modal.html saknar meta description (SEO)

---

## Kodfynd

| Fynd | Fil | Åtgärd |
|------|-----|--------|
| CRITICAL: proxy-addr IP spoofing (GHSA-jqcg-44mw-7w3h) | ga4-dashboard/package-lock.json | `npm audit fix` i ga4-dashboard/ |
| Saknad meta description | auth-modal.html | T274 (☐), redan ticketad |

Inga TODOs/FIXMEs hittades i JS/HTML-filer.
