# Efterplan — 2026-11-09

🔢 Sessions: GA4 SAKNAS — GA4-credentials finns inte i molnsandlådan (ingen connector ansluten). Hoppar över DEL 1.

🔧 Uptime: Ej mätbar från molnsandlåda (proxy 403 blockerar utgående HTTPS till efterplan.se — känd sandbox-begränsning, inte ett driftproblem)
   Sårbarheter: 0 (ga4-dashboard npm audit ren) | TODO/FIXME: 0 | Broken links: ej körd (lychee saknas i sandlåda)
   Outdated: `stripe` ^22.1.1 → latest 23.1.0 (major, T275 ☐) | `@supabase/supabase-js` 2.118.0 → **2.119.0** (patch, nytt → T312)
   - `@supabase/supabase-js` 2.118.0 → 2.119.0 patch tillgänglig inom `^2.105.4`-intervallet. Kör `npm update @supabase/supabase-js` och committa uppdaterad `package-lock.json`. Fil: `package-lock.json`.
   - `auth-modal.html` saknar meta description — känd false positive (body-fragment, inlinas i index.html, T100/T212 ✔).

📣 Prioritet denna vecka: **T307** (Anthropic-krediter slut 🔴 — AI-kategorisering och AI-förklaring i Arkiv nere) + **T309** (Google Ads-nyckel 🟠 — deadline 4 nov passerad, nu 5 dagar försenad, risk för störd kampanjhantering). Båda är Owner-beslut; åtgärda innan veckan är slut.

Roadmap: 239 klara ✔ | 13 pågår ⧖ | 37 ej startade ☐

🎫 Nya tickets: T312 – supabase 2.119.0 patch (https://github.com/joju91/Efterplan/issues/174)

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| 1 | `npm update @supabase/supabase-js` (2.118.0 → 2.119.0) + committa lock | `package-lock.json` | 🟡 |
