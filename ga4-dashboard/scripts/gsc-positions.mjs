// Fetches Search Console positions 11-25 for efterplan.se
// and prints them sorted by clicks descending.
//
// Run from ga4-dashboard/:  node scripts/gsc-positions.mjs
//
// Uses same auth as weekly-report.mjs (GA4_SERVICE_ACCOUNT_JSON or
// GOOGLE_APPLICATION_CREDENTIALS). The service account must have been added
// as a user in Search Console for the property https://efterplan.se/.

import { google } from 'googleapis';
import 'dotenv/config';

const SITE = 'https://efterplan.se/';
const DAYS = 90;  // larger window → more stable position averages

function buildAuth() {
  const scopes = ['https://www.googleapis.com/auth/webmasters.readonly'];
  const json = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (json) {
    let creds;
    try { creds = JSON.parse(json); }
    catch { throw new Error('GA4_SERVICE_ACCOUNT_JSON is not valid JSON'); }
    return new google.auth.GoogleAuth({
      credentials: { client_email: creds.client_email, private_key: creds.private_key },
      scopes,
    });
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new google.auth.GoogleAuth({ keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, scopes });
  }
  throw new Error('Missing credentials: set GA4_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS');
}

const auth = buildAuth();
const sc = google.searchconsole({ version: 'v1', auth });

const endDate   = new Date().toISOString().slice(0, 10);
const startDate = new Date(Date.now() - DAYS * 86400000).toISOString().slice(0, 10);

const res = await sc.searchanalytics.query({
  siteUrl: SITE,
  requestBody: {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: 500,
  },
});

const rows = (res.data.rows || [])
  .filter(r => r.position >= 11 && r.position <= 25)
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 20);

if (!rows.length) {
  console.log('Inga sidor på position 11–25 hittades under perioden.');
  process.exit(0);
}

console.log(`\n═══ efterplan.se — Sidor på position 11–25 (${startDate} → ${endDate}) ═══\n`);
console.log('Pos'.padEnd(7) + 'Klick'.padEnd(8) + 'Vis'.padEnd(10) + 'CTR'.padEnd(8) + 'URL');
console.log('─'.repeat(70));

for (const r of rows) {
  const url  = r.keys[0].replace('https://efterplan.se/', '/');
  const pos  = r.position.toFixed(1).padEnd(7);
  const clk  = String(r.clicks).padEnd(8);
  const imp  = String(r.impressions).padEnd(10);
  const ctr  = (r.ctr * 100).toFixed(1).padEnd(7) + '%';
  console.log(`${pos}${clk}${imp}${ctr} ${url}`);
}

console.log('\n💡 Optimera dessa sidor:');
console.log('   1. Flytta upp keywordet till <title>, <h1> och första stycket');
console.log('   2. Gör sidan bättre än de 3 länkarna ovanför dig');
console.log('   3. Bygg 1–2 interna länkar från relaterade guider');
