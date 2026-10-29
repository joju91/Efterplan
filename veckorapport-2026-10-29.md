# Efterplan — 2026-10-29

🔢 Sessions: — | Organisk: — | Onboarding: — | Plan: —
   GA4 SAKNAS — GA4_SERVICE_ACCOUNT_JSON ej tillgänglig i sandlåda (se T270 ☐)

🔧 Uptime: ej verifierbar (proxy blockerar utgående HTTPS i sandlåda) | Sårbarheter: 0 (ga4-dashboard ren) | Brutna länkar: —
   - `stripe` 22.6.2 → Latest 23.0.1 (major bump, T275 ☐ öppen sedan 2026-10-05)
   - `auth-modal.html` saknar `meta name="description"` — falskt positiv, body-fragment (T274 ✔)

📣 GA4 är konfigurerat men GA4_SERVICE_ACCOUNT_JSON saknas i Vercel → routiner kan inte läsa funneldata; lägg in secret:en (T270) för att kunna utvärdera pågående Ads-kampanj.

🎫 Nya tickets: inga

✅ Åtgärder att godkänna:
| # | Åtgärd | Fil | P |
|---|--------|-----|---|
| — | Inga nya åtgärder denna vecka | — | — |

---

## Detaljer

### DEL 1 — GA4
GA4 SAKNAS — hoppa över DEL 1. `$GOOGLE_APPLICATION_CREDENTIALS` ej satt i molnsandlåda. Se T270 ☐ för att lösa blockeringen.

### DEL 2 — Kodaudit

| Fynd | Status |
|------|--------|
| `auth-modal.html` saknar `meta name="description"` | Falskt positiv — body-fragment (T274 ✔, T100 ✔) |
| `stripe` Latest 23.0.1 vs nuvarande 22.6.2 | T275 ☐ (öppen sedan 2026-10-05) |
| `@supabase/supabase-js` MISSING | Förväntat — ej installerat i sandbox (T130 ✔) |
| ga4-dashboard sårbarheter | 0 — rent |
| TODO/FIXME i JS/HTML | Inga |
| `task_completed` event i app.js | ✔ Spåras (rad 2180) |

Uptime-kontroll: proxy blockerar utgående HTTPS (403 Forbidden) — sandalådbegränsning, inte ett sidfel.

### DEL 3 — Roadmap-status

| Klara | Pågår | Ej startade |
|-------|-------|-------------|
| 237 | 13 | 34 |

**Pågår (urval):**
- T015 Validera stegordning med 2–3 verkliga anhöriga
- T016 Justera ordning och text baserat på intervjuer
- T032 Testa fullt inköpsflöde
- T060 Push-notifikationer (branch `origin/codex/t060-checkpoints`, ej mergad till main)
- T079 Betald byrålisting
- T081 Analysera drop-off + prioritera topp-3

**Nästa öppna:**
- T001 Läs hela Manifest-bladet och bekräfta scope
- T003 Registrera företag/enskild firma + ansök F-skatt
- T004 Öppna företagskonto

**Marknadsinsikt:** Ads-kampanjen är live men GA4_SERVICE_ACCOUNT_JSON saknas i Vercel (T270 ☐) — funneldata kan inte läsas av rutiner, vilket gör det omöjligt att utvärdera kostnad/konvertering; prioritet: Owner lägger in secret:en i Vercel den här veckan.

### DEL 4 — Auto-tickets
Inga nya problem identifierade. Alla fynd har befintliga tickets:
- `stripe 23.0.1` → T275 ☐
- `auth-modal.html` meta → T274 ✔ (falskt positiv)
- ga4-dashboard 0 sårbarheter — rent

### DEL 5 — GitHub Issues
Inga nya issues att öppna.
