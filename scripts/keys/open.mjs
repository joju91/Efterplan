#!/usr/bin/env node
// Efterplan — npm run keys:open -- <stripe|supabase|anthropic|google>
// Öppnar bara rätt dashboard-sida i webbläsaren, utan att starta rotationsflödet.
// Praktiskt när du bara vill titta, inte byta nyckel.

import { SERVICES } from './config.mjs';
import { openUrl } from './browser.mjs';

const serviceKey = process.argv[2];
if (!serviceKey || !SERVICES[serviceKey]) {
  console.log('Använd: npm run keys:open -- <tjänst>');
  console.log('Tjänster: ' + Object.keys(SERVICES).join(', '));
  process.exit(1);
}

const svc = SERVICES[serviceKey];
const opened = openUrl(svc.dashboardUrl);
console.log(opened
  ? `Öppnar ${svc.label}: ${svc.dashboardUrl}`
  : `Kunde inte öppna automatiskt — gå till: ${svc.dashboardUrl}`);
if (svc.warning) {
  console.log('');
  console.log(svc.warning);
}
