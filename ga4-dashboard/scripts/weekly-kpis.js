// Run from ga4-dashboard/: node scripts/weekly-kpis.js
// Prints the KPIs the Cowork weekly report can't fetch from its sandbox.
require('dotenv').config();
const { google } = require('googleapis');

const propertyId = process.env.GA4_PROPERTY_ID;
if (!propertyId) { console.error('GA4_PROPERTY_ID missing'); process.exit(1); }

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const ad = google.analyticsdata({ version: 'v1beta', auth });

const DAYS = 7;
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

async function run(body) {
  const r = await ad.properties.runReport({ property: `properties/${propertyId}`, requestBody: body });
  return r.data;
}

(async () => {
  const range = [{ startDate: `${DAYS}daysAgo`, endDate: 'today' }];

  // Total sessions
  const tot = await run({
    dateRanges: range,
    metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagementRate' }],
  });
  const sessions   = num(tot.rows?.[0]?.metricValues?.[0]?.value);
  const users      = num(tot.rows?.[0]?.metricValues?.[1]?.value);
  const engagement = num(tot.rows?.[0]?.metricValues?.[2]?.value);

  // Organic share
  const ch = await run({
    dateRanges: range,
    metrics: [{ name: 'sessions' }],
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
  });
  const channels = (ch.rows || []).map(r => ({
    channel: r.dimensionValues[0].value,
    sessions: num(r.metricValues[0].value),
  }));
  const organic = channels.find(c => c.channel === 'Organic Search')?.sessions || 0;

  // Event counts (onboarding_start, plan_generated, task_completed)
  const ev = await run({
    dateRanges: range,
    metrics: [{ name: 'eventCount' }],
    dimensions: [{ name: 'eventName' }],
    dimensionFilter: {
      filter: { fieldName: 'eventName', inListFilter: {
        values: ['onboarding_start', 'plan_generated', 'task_completed']
      } }
    },
  });
  const events = Object.fromEntries(
    (ev.rows || []).map(r => [r.dimensionValues[0].value, num(r.metricValues[0].value)])
  );

  const onb  = events.onboarding_start || 0;
  const plan = events.plan_generated   || 0;
  const task = events.task_completed   || 0;

  const pct = (n, d) => d ? `${(100 * n / d).toFixed(1)}%` : '0.0%';

  console.log('═══ Efterplan — KPIs senaste 7 dagar ═══');
  console.log(`Property:           ${propertyId}`);
  console.log(`Sessions:           ${sessions}`);
  console.log(`Users:              ${users}`);
  console.log(`Engagement rate:    ${(engagement * 100).toFixed(1)}%`);
  console.log('');
  console.log(`Organic Search:     ${organic}  (${pct(organic, sessions)} av sessions)`);
  console.log('Kanal-fördelning:');
  channels.sort((a, b) => b.sessions - a.sessions).forEach(c =>
    console.log(`  ${c.channel.padEnd(20)} ${c.sessions}`)
  );
  console.log('');
  console.log('Events:');
  console.log(`  onboarding_start    ${onb}   (${pct(onb, sessions)} av sessions)`);
  console.log(`  plan_generated      ${plan}  (${pct(plan, onb)} av onboarding_start)`);
  console.log(`  task_completed      ${task}`);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
