// One-off/reusable diagnostic: breaks down the onboarding funnel step-by-step
// using the onboarding_step_<n> events (fired via track() in app.js obGoTo())
// so we can see WHERE people drop off, not just start vs. finish counts.
// Run: GA4_PROPERTY_ID=... GA4_SERVICE_ACCOUNT_JSON=... node scripts/funnel-check.mjs [period]
// period: number of days followed by "d", e.g. 7d, 30d, 90d (default 30d)

import { google } from 'googleapis';
import 'dotenv/config';

const period = process.argv[2] || process.env.PERIOD || '30d';
const days = parseInt(period, 10) || 30;

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

function buildAuth() {
  const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
  const json = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (json) {
    const creds = JSON.parse(json);
    return new google.auth.GoogleAuth({ credentials: { client_email: creds.client_email, private_key: creds.private_key }, scopes });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new google.auth.GoogleAuth({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, scopes });
  }
  throw new Error('Missing GA4 credentials (set GA4_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS)');
}

async function report(requestBody) {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) throw new Error('GA4_PROPERTY_ID missing');
  const data = google.analyticsdata({ version: 'v1beta', auth: buildAuth() });
  const res = await data.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: { dateRanges: [{ startDate: `${days}daysAgo`, endDate: 'today' }], ...requestBody },
  });
  return res.data.rows || [];
}

(async () => {
  const lines = [];
  lines.push(`# Funnel-check — period=${days}d (GA4)`);
  lines.push('');

  // Realtid (senaste 30 min) — bekräftar direkt att spårningen når rätt
  // property, innan de vanliga rapporterna hunnit uppdateras (upp till ett dygn).
  try {
    const data = google.analyticsdata({ version: 'v1beta', auth: buildAuth() });
    const rt = await data.properties.runRealtimeReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      requestBody: { dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }] },
    });
    const rows = rt.data.rows || [];
    lines.push(`Realtid (30 min): ${rows.length ? rows.map(r => `${r.dimensionValues[0].value}=${r.metricValues[0].value}`).join(', ') : 'inga event'}`);
  } catch (err) {
    lines.push(`Realtid misslyckades: ${err.message}`);
  }

  const totals = await report({ metrics: [{ name: 'sessions' }] });
  const visits = num(totals[0]?.metricValues[0]?.value);
  lines.push(`Sessions: ${visits}`);
  lines.push('');

  const eventRows = await report({ dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }], limit: 200 });
  const events = Object.fromEntries(eventRows.map(r => [r.dimensionValues[0].value, num(r.metricValues[0].value)]));
  const onboardingStart = events.onboarding_start || 0;
  const planGenerated = events.plan_generated || 0;
  const taskCompleted = events.task_completed || 0;

  lines.push('## Toppnivå');
  lines.push(`- onboarding_start: ${onboardingStart} (${visits ? (100*onboardingStart/visits).toFixed(1) : '0.0'}% av sessions)`);
  lines.push(`- plan_generated: ${planGenerated} (${onboardingStart ? (100*planGenerated/onboardingStart).toFixed(1) : '0.0'}% av onboarding_start)`);
  lines.push(`- task_completed: ${taskCompleted}`);
  lines.push('');

  lines.push('## Sidor (pageviews per path)');
  try {
    const pages = await report({
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 20,
    });
    if (!pages.length) lines.push('_Inga sidor hittades._');
    else pages.forEach(r => lines.push(`- ${r.dimensionValues[0].value}: ${r.metricValues[0].value} pageviews`));
  } catch (err) {
    lines.push(`_Breakdown misslyckades: ${err.message}_`);
  }
  lines.push('');

  lines.push('## Steg-för-steg (onboarding_step_<n>-event)');
  const steps = Object.entries(events)
    .filter(([name]) => name.startsWith('onboarding_step_'))
    .map(([name, count]) => ({ step: name.slice('onboarding_step_'.length), count }))
    .sort((a, b) => String(a.step).localeCompare(String(b.step), 'sv', { numeric: true }));
  if (!steps.length) lines.push('_Inga onboarding_step-events i perioden._');
  else steps.forEach(s => lines.push(`- steg ${s.step}: ${s.count}`));
  lines.push('');

  console.log(lines.join('\n'));
})().catch(err => { console.error('FAIL:', err); process.exit(1); });
