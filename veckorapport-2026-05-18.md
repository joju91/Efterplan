# Efterplan — 2026-05-18

## DEL 1 — GA4

GA4 SAKNAS — hoppa över DEL 1. (Credentials ej konfigurerade i molnsandlådan. Se T113 för setup.)

---

## DEL 2 — Kodaudit

### Missing meta description
- `share-modal.html` — känt false positive (T100 ✗): body-fragment, meta-tagg ogiltig här
- `auth-modal.html` — känt false positive (T100 ✗): body-fragment, meta-tagg ogiltig här
- `ga4-dashboard/public/index.html` — åtgärdat (T105 ✔): har `noindex, nofollow`

### TODOs / FIXMEs
Inga funna i .js/.html-filer.

### GA4-events
Core-events (`onboarding_start`, `plan_generated`, `task_completed`, `onboarding_step`) — korrekt snake_case (T101 ✔).

**Nytt fynd:** 12 `track()`-anrop kvarstår i Title Case — se T117.

### npm audit (ga4-dashboard)
`{'info': 0, 'low': 0, 'moderate': 0, 'high': 0, 'critical': 0, 'total': 0}` — inga sårbarheter.

### npm outdated (rot)
`@supabase/supabase-js` och `stripe` visas som MISSING — paket ej installerade lokalt (serverless-repo). Versioner uppdaterade i package.json (T108 ✔, T109 ✔).

**Nytt fynd:** `ga4-dashboard/package.json` har UTF-8 BOM — ogiltigt JSON per RFC 8259, Python-parser kraschar — se T116.

### Uptime
403 Forbidden från molnsandlådan (känd Cloudflare-blockering, T106 ✔). UptimeRobot (T111 ✔) hanterar produktionsövervakning.

---

## DEL 3 — Roadmap-status

| Status | Antal |
|--------|-------|
| ✔ Klara | 86 |
| ⧖ Pågår | 8 |
| ☐ Ej startade | 9 |

### Pågår (⧖)
- T015 Validate step order with 2–3 real relatives
- T016 Adjust order and text based on interviews
- T026 Share with 5 target users, collect feedback
- T032 Test full purchase flow
- T034 Set up Bokio or Fortnox
- T047 Analyze drop-off
- T079 Betald byrålisting
- T081 Analyze drop-off + prioritize top 3 issues

### Nästa öppna (☐)
- T001 Read the entire Manifest sheet and confirm scope
- T003 Register company / sole proprietorship + apply for F-tax
- T004 Open business bank account (Lunar / Swedbank / Revolut Business)

### Marknadsinsikt
**Premium-konvertering** är det kritiska flödet just nu (T032 ⧖ + T047 ⧖ drop-off-analys) — prioritera att slutföra end-to-end Stripe testmiljö-betalning (T108 ✔ men e2e kvarstår) och analysera var i onboarding-flödet användare faller av för att maximera betalviljan.

---

## DEL 4 — Nya auto-tickets

| ID | Task | P | Typ |
|----|------|---|-----|
| T116 | UTF-8 BOM i ga4-dashboard/package.json — ogiltigt JSON, Python-parser kraschar | 🟠 | Dev |
| T117 | 12 GA4-events i Title Case kvarstår i app.js (r79, r352, r868, r999, r1339, r1443, r1446, r2055, r2209, r2399, r2413, r2432, r2512) | 🟡 | Analytics |
| T118 | Roadmap-status synkad: T106 ☐ → ✔ (UptimeRobot klart per T111) | 🟡 | Dev |

---

## DEL 5 — GitHub Issues

- T116 — UTF-8 BOM i ga4-dashboard/package.json → https://github.com/joju91/Efterplan/issues/26
- T117 — 12 GA4-events kvar i Title Case → https://github.com/joju91/Efterplan/issues/27
- T118 — Roadmap-sync T106 ☐ → ✔ → https://github.com/joju91/Efterplan/issues/28

---

## Sammanfattning

🔢 Sessions: N/A (GA4 saknas) | Organisk: N/A

🔧 Uptime: 403 (Cloudflare/sandbox, UptimeRobot aktiv) | npm audit: 0 sårbarheter
   - `ga4-dashboard/package.json` har UTF-8 BOM — ogiltigt JSON (T116, app.js rad 1)
   - 12 GA4-events kvar i Title Case — inkonsistent GA4-data (T117, app.js rad 79, 352 m.fl.)

📣 Premium-konverteringen (T032/T047) är veckans viktigaste fokus — kör igenom Stripe testmiljö-betalningen end-to-end och stäng drop-off-analysen.

🎫 Nya tickets: T116 – BOM i ga4-dashboard/package.json (#26) | T117 – GA4 Title Case events (#27) | T118 – Roadmap sync (#28)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | Ta bort UTF-8 BOM från ga4-dashboard/package.json | ga4-dashboard/package.json | 🟠 |
| 2 | Byt 12 GA4 track()-anrop till snake_case | app.js | 🟡 |
| 3 | T106 markerad ✔ i roadmap (UptimeRobot redan klart) | roadmap.md | 🟡 |
