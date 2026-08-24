// Efterplan — konfiguration för scripts/keys/sync.mjs och scripts/keys/rotate.mjs.
// En rad per tjänst: var man roterar (dashboardUrl), vilka env-namn som ligger
// i Vercel (vars) och vilka som även är GitHub Actions-secrets (githubSecrets).
//
// Källor: .env.example (Vercel-variabler) + grep av secrets.* i
// .github/workflows/*.yml (GitHub-secrets som faktiskt används idag).

export const SERVICES = {
  stripe: {
    label: 'Stripe',
    dashboardUrl: 'https://dashboard.stripe.com/apikeys',
    vars: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'STRIPE_PRICE_ID'],
    // De tre variablerna ligger på tre olika sidor i Stripe, inte bara på
    // API keys-sidan (upptäckt 2026-08-23 — se SECRETS.md).
    varUrls: {
      STRIPE_SECRET_KEY: 'https://dashboard.stripe.com/apikeys',
      // Webhooks-listan — klicka in på rätt endpoint för att se "Signing secret".
      STRIPE_WEBHOOK_SECRET: 'https://dashboard.stripe.com/webhooks',
      // Produktkatalogen — Price ID visas på respektive produkts sida.
      STRIPE_PRICE_ID: 'https://dashboard.stripe.com/products',
    },
    githubSecrets: [],
    // Sparade som "Sensitive" i Vercel -> vercel env pull svarar alltid tomt.
    vercelSensitive: true,
  },
  supabase: {
    label: 'Supabase',
    projectRef: 'vjupkemzpnrahdsljenl',
    dashboardUrl:
      'https://supabase.com/dashboard/project/vjupkemzpnrahdsljenl/settings/api',
    vars: ['SUPABASE_URL', 'SUPABASE_SECRET_KEY'],
    githubSecrets: ['SUPABASE_SECRET_KEY'],
    vercelSensitive: true,
  },
  anthropic: {
    label: 'Anthropic',
    dashboardUrl: 'https://console.anthropic.com/settings/keys',
    vars: ['ANTHROPIC_API_KEY'],
    githubSecrets: [],
    vercelSensitive: true,
  },
  google: {
    label: 'Google (GA4 / Search Console service account)',
    dashboardUrl: 'https://console.cloud.google.com/iam-admin/serviceaccounts?project=intricate-tempo-496015-a0',
    vars: [],
    githubSecrets: ['GA4_SERVICE_ACCOUNT_JSON', 'GSC_SERVICE_ACCOUNT_JSON', 'GA4_PROPERTY_ID'],
    // Känt konto som redan är tillagt som Full-användare i Search Console
    // (tillagt manuellt av Owner, senast bekräftat 2026-08-24). Om ett nytt
    // konto med annan e-post någonsin skapas måste det läggas till i Search
    // Console på nytt — därför: ÅTERANVÄND alltid detta konto vid rotation.
    knownAccountEmail: 'ga4-reader@intricate-tempo-496015-a0.iam.gserviceaccount.com',
    warning:
      '⚠️  VIKTIGT: klicka INTE "CREATE SERVICE ACCOUNT" (skapar nytt konto med ny\n' +
      '   e-post → tappar Search Console-behörighet, se T239/T246 i roadmap.md).\n' +
      '   Klicka istället in på det BEFINTLIGA kontot "ga4-reader@..." i listan\n' +
      '   → fliken "KEYS" → "ADD KEY" → "Create new key" → JSON.\n' +
      '   Samma e-post hela tiden = Search Console-behörigheten består för alltid.',
  },
};
