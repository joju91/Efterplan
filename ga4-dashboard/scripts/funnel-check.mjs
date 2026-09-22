// One-off/reusable diagnostic: breaks down the onboarding funnel step-by-step
// using the onboarding_step custom event (fired in app.js obGoTo()) so we can
// see WHERE people drop off, not just start vs. finish counts.
// Run: PLAUSIBLE_API_KEY=... node scripts/funnel-check.mjs [period]
// period: Plausible period string, e.g. 7d, 30d, 90d (default 30d)

const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID || 'efterplan.se';
const period = process.argv[2] || process.env.PERIOD || '30d';

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

async function plausible(qs) {
  const apiKey = process.env.PLAUSIBLE_API_KEY;
  if (!apiKey) throw new Error('PLAUSIBLE_API_KEY missing');
  const url = `https://plausible.io/api/v1/stats/${qs}${qs.includes('?') ? '&' : '?'}site_id=${encodeURIComponent(PLAUSIBLE_SITE_ID)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || `Plausible ${r.status}`);
  return j;
}

async function eventCount(name) {
  const j = await plausible(`aggregate?period=${period}&metrics=events&filters=${encodeURIComponent(`event:name==${name}`)}`);
  return num(j.results?.events?.value);
}

(async () => {
  const lines = [];
  lines.push(`# Funnel-check — period=${period}`);
  lines.push('');

  const agg = await plausible(`aggregate?period=${period}&metrics=visits,visitors`);
  const visits = num(agg.results?.visits?.value);
  lines.push(`Sessions (visits): ${visits}`);
  lines.push('');

  const onboardingStart = await eventCount('onboarding_start');
  const planGenerated = await eventCount('plan_generated');
  const taskCompleted = await eventCount('task_completed');

  lines.push('## Toppnivå');
  lines.push(`- onboarding_start: ${onboardingStart} (${visits ? (100*onboardingStart/visits).toFixed(1) : '0.0'}% av sessions)`);
  lines.push(`- plan_generated: ${planGenerated} (${onboardingStart ? (100*planGenerated/onboardingStart).toFixed(1) : '0.0'}% av onboarding_start)`);
  lines.push(`- task_completed: ${taskCompleted}`);
  lines.push('');

  lines.push('## Sidor (pageviews per path)');
  try {
    const pages = await plausible(`breakdown?period=${period}&property=event:page&metrics=visitors,pageviews`);
    const rows = (pages.results || []).sort((a, b) => num(b.pageviews) - num(a.pageviews)).slice(0, 20);
    if (!rows.length) {
      lines.push('_Inga sidor hittades._');
    } else {
      rows.forEach(r => lines.push(`- ${r.page}: ${r.pageviews} pageviews / ${r.visitors} visitors`));
    }
  } catch (err) {
    lines.push(`_Breakdown misslyckades: ${err.message}_`);
  }
  lines.push('');

  lines.push('## Steg-för-steg (onboarding_step-event, props.step)');
  try {
    const breakdown = await plausible(`breakdown?period=${period}&property=event:props:step&metrics=events&filters=${encodeURIComponent('event:name==onboarding_step')}`);
    const rows = (breakdown.results || []).map(r => ({ step: r.step, events: num(r.events) }));
    if (!rows.length) {
      lines.push('_Inga onboarding_step-events i perioden._');
    } else {
      rows.sort((a, b) => String(a.step).localeCompare(String(b.step)));
      rows.forEach(r => lines.push(`- steg ${r.step}: ${r.events}`));
    }
  } catch (err) {
    lines.push(`_Breakdown misslyckades: ${err.message}_`);
  }
  lines.push('');

  console.log(lines.join('\n'));
})().catch(err => { console.error('FAIL:', err); process.exit(1); });
