# Efterplan — 2026-11-16

🔢 Sessions: N/A — GA4 SAKNAS (connector ej ansluten i molnsandlåda, DEL 1 hoppades över)

🔧 Uptime: Ej mätbar från molnsandlåda (proxy 403 — ej en sitefel) | Sårbarheter: 0 (ga4-dashboard npm audit) | Paket: stripe Latest 23.1.0 (T275 ☐ täcker uppgraderingen)
   - `auth-modal.html` saknar `meta name="description"` — känt false positive (T100 ✔): filen är ett body-fragment som inlines i index.html, meta-tagg ogiltig där
   - `stripe` package.json `^22.1.1` (lock 22.6.2) vs Latest 23.1.0 — T275 ☐ täcker major-uppgraderingen

📊 Roadmap: ✔ 242 klara | ⧖ 13 pågår | ☐ 37 ej startade
   Pågår just nu: T015 validering med anhöriga, T016 order/text, T032 köpflöde, T034 Bokio/Fortnox, T047 drop-off, T060 push-notiser (branch ej mergad), T079 betald byrålisting, T081 drop-off prioritering
   Nästa öppna: T001 manifest, T003 bolagsregistrering, T004 bankkonto

📣 T275 (stripe 23.x) är den enda öppna tech-debt-uppgiften med extern risk (breaking changes i major-versionen) — åtgärda den här veckan innan stripe 22.x når end-of-support.

🎫 Nya tickets: Inga — alla DEL 2-fynd täcks av befintliga tickets (T100 ✔ false positive, T275 ☐ stripe 23.x).

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| – | Inga nya åtgärder denna vecka | – | – |
