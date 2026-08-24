# Efterplan — nycklar och secrets

Verktyg för att slippa logga in på 4–5 dashboards varje gång: [scripts/keys/](scripts/keys/).
Även tillgängligt som `/keys` i Claude Code.

> **Arbetssätt:** Det här är den fasta vägen för nyckelhantering i det här
> repot, inte ett engångsverktyg. Claude ska köra `npm run keys:sync` (eller
> `/keys`) själv när ett jobb behöver kolla eller uppdatera secrets — utan att
> fråga Jonas om lov först. Det enda som kräver Jonas är själva rotate-klicket
> i en extern dashboard (Stripe/Supabase/Anthropic/Google), eftersom ingen
> leverantör tillåter det via API. Se `.claude/skills/keys/SKILL.md`.

```bash
npm run keys                   # svensk meny — välj med siffror, enklast
npm run keys:sync              # hämtar allt som går att hämta automatiskt, till .env.local
npm run keys:rotate -- stripe  # guidad rotation — öppnar rätt sida automatiskt, sen bara klistra in
npm run keys:open -- stripe    # öppnar bara dashboard-sidan, utan rotationsflödet
```

`keys:rotate` och `keys:open` öppnar rätt dashboard-sida i webbläsaren automatiskt
(`start`/`open`/`xdg-open` beroende på OS) — inget att leta upp eller klicka i länkar,
bara klistra in den nya nyckeln när fönstret väntar på den.

`keys:sync` hämtar det som faktiskt går att hämta från Vercel och dubbelkollar
Supabase-nyckeln direkt mot Supabase. Inga hemliga värden skrivs ut i terminalen.

**Viktigt att veta:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`,
`SUPABASE_SECRET_KEY` och `ANTHROPIC_API_KEY` är sparade som **"Sensitive"** i Vercel.
Det är en Vercel-inställning som gör att värdet aldrig går att läsa ut igen efter att
det skapats — inte ens via CLI. `keys:sync` kan därför inte hämta dessa; den lämnar
dem orörda om du redan har ett värde lokalt (för att inte nolla en nyss roterad
nyckel), annars visar den att de saknas och pekar på `keys:rotate`. `SUPABASE_URL`
har samma flagga men går ändå att få via Supabase CLI:t separat.

`keys:rotate -- <tjänst>` visar en direktlänk till rätt dashboard-sida, tar emot den
nya nyckeln du klistrar in och sprider den till Vercel + GitHub Actions + `.env.local`
i ett svep. Det enda kvarvarande manuella steget är att klicka "skapa ny nyckel" i
själva dashboarden — ingen leverantör tillåter det via API, av säkerhetsskäl.

| Tjänst | Variabler | Hämtas automatiskt? | Rotation |
|---|---|---|---|
| **Vercel** | (håller alla appens env-variabler) | Delvis — bara icke-Sensitive variabler | Sker indirekt: rotera i respektive tjänst nedan, `keys:rotate` skriver till Vercel |
| **Stripe** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` | Nej — Sensitive i Vercel, Stripe exponerar heller inte nyckelvärden via API | dashboard.stripe.com/apikeys — manuellt klick, sen `keys:rotate -- stripe` |
| **Supabase** | `SUPABASE_URL`, `SUPABASE_SECRET_KEY` | Ja, direkt från Supabase CLI (`supabase projects api-keys`) | Project Settings → API — manuellt klick, sen `keys:rotate -- supabase` |
| **Anthropic** | `ANTHROPIC_API_KEY` | Nej — Sensitive i Vercel, Anthropic exponerar inte nyckelvärden via API | console.anthropic.com/settings/keys — manuellt klick, sen `keys:rotate -- anthropic` |
| **Google (GA4/GSC)** | `GA4_SERVICE_ACCOUNT_JSON`, `GSC_SERVICE_ACCOUNT_JSON`, `GA4_PROPERTY_ID` | Nej — ligger bara som GitHub Actions-secrets, ingen `gcloud` CLI installerad | console.cloud.google.com → IAM → Service Accounts — manuellt, sen `keys:rotate -- google` |

> **⚠️ Google-rotation — vanligaste felkällan (se T239/T246 i roadmap.md):**
> Klicka **aldrig** "Create service account" när du roterar Google-nyckeln.
> Klicka in på det **befintliga** kontot `efterplan@efterplan.iam.gserviceaccount.com`
> (projekt `efterplan` — verifierat direkt ur secret-innehållet 2026-08-24,
> se kommentar i `scripts/keys/config.mjs`) → fliken **Keys** → **Add key**
> → **Create new key** → JSON. Ett nytt konto får en ny e-postadress, och
> Search Console-behörigheten (som är knuten till just den e-postadressen)
> måste då läggas till manuellt igen på **rätt egendom** — Search Console
> skiljer på domän-egendomen (`sc-domain:efterplan.se`) och URL-prefix-
> egendomen (`https://efterplan.se/`) som separata behörighetslistor;
> koden i `gsc-positions.mjs`/`weekly-report.mjs` frågar specifikt mot
> URL-prefix-egendomen, så lägg till kontot där:
> https://search.google.com/search-console/users?resource_id=https://efterplan.se/
> Samma e-post + rätt egendom = det här problemet uppstår aldrig igen.
> `npm run keys:rotate -- google` och `npm run keys:open -- google` skriver
> nu ut den här varningen automatiskt.

## Engångssetup

- `vercel` och `gh` är redan inloggade i den här miljön.
- Kör `npx supabase login` en gång (öppnar webbläsaren) för att Supabase-delen ska fungera.

## Var koden faktiskt läser nycklarna

- Produktionens serverless-funktioner (`api/_lib.js` m.fl.): Vercel → Project Settings → Environment Variables.
- GitHub Actions-workflows (`.github/workflows/*.yml`): repo → Settings → Secrets → Actions.

Se [.env.example](.env.example) för vad varje variabel används till.
