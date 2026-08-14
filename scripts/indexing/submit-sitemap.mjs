// Notifierar Google om att sitemap.xml har ändrats, via Search Console API:s
// officiella sitemaps.submit-metod. Detta är INTE Googles Indexing API (som
// bara stödjer JobPosting/BroadcastEvent-sidor) — det är den enda automatiska,
// kostnadsfria mekanismen som faktiskt gäller för en vanlig HTML-sajt.
//
// Kräver en service-account-nyckel med Search Console-åtkomst till efterplan.se.
// Läser i första hand GSC_SERVICE_ACCOUNT_JSON, men faller tillbaka på
// GA4_SERVICE_ACCOUNT_JSON — per roadmap.md T213 är det samma service-account
// (redan Owner-godkänd i både GA4 och Search Console), så den befintliga
// GitHub-secreten funkar utan att något nytt behöver läggas till.
//
// Körs bara av workflown när update-sitemap.mjs faktiskt ändrat sitemap.xml.

import { google } from 'googleapis';

const SITE_URL = 'https://efterplan.se/';
const FEEDPATH = 'https://efterplan.se/sitemap.xml';

function buildAuth() {
  const json = process.env.GSC_SERVICE_ACCOUNT_JSON || process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!json) {
    throw new Error(
      'Saknar service-account-nyckel för Search Console. Sätt GSC_SERVICE_ACCOUNT_JSON eller ' +
        'GA4_SERVICE_ACCOUNT_JSON som GitHub-secret (samma service-account har redan Owner-åtkomst ' +
        'till efterplan.se i Search Console, se roadmap.md T213).'
    );
  }
  let creds;
  try {
    creds = JSON.parse(json);
  } catch {
    throw new Error('GSC_SERVICE_ACCOUNT_JSON är inte giltig JSON');
  }
  return new google.auth.GoogleAuth({
    credentials: { client_email: creds.client_email, private_key: creds.private_key },
    scopes: ['https://www.googleapis.com/auth/webmasters'],
  });
}

async function main() {
  const auth = buildAuth();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  await searchconsole.sitemaps.submit({ siteUrl: SITE_URL, feedpath: FEEDPATH });

  console.log(`Sitemap resubmitted till Google Search Console: ${FEEDPATH}`);
}

main().catch((err) => {
  console.error('Sitemap-submission misslyckades:', err?.message ?? err);
  process.exit(1);
});
