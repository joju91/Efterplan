// Weekly report generator — runs locally OR in GitHub Actions.
// Reads GA4, checks uptime, summarizes git activity, runs npm audit,
// counts roadmap status, writes veckorapport-YYYY-MM-DD.md at repo root.
//
// Run from ga4-dashboard/:  node scripts/weekly-report.mjs

import { google } from 'googleapis';
import { execSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import 'dotenv/config';

const REPO_ROOT = path.resolve(process.cwd(), '..');
const today     = new Date().toISOString().slice(0, 10);
const outFile   = path.join(REPO_ROOT, `veckorapport-${today}.md`);
const propertyId = process.env.GA4_PROPERTY_ID;

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };

function buildAuth() {
  const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
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
    return new google.auth.GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes,
    });
  }
  throw new Error('Missing GA4 credentials (set GA4_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS)');
}

async function ga4(propertyId, body) {
  const auth = buildAuth();
  const ad = google.analyticsdata({ version: 'v1beta', auth });
  const r = await ad.properties.runReport({ property: `properties/${propertyId}`, requestBody: body });
  return r.data;
}

async function fetchKpis() {
  if (!propertyId) return { error: 'GA4_PROPERTY_ID missing' };
  const range = [{ startDate: '7daysAgo', endDate: 'today' }];
  try {
    const tot = await ga4(propertyId, {
      dateRanges: range,
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'engagementRate' }],
    });
    const ch = await ga4(propertyId, {
      dateRanges: range,
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    });
    const ev = await ga4(propertyId, {
      dateRanges: range,
      metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'eventName' }],
      dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: {
        values: ['onboarding_start', 'plan_generated', 'task_completed']
      } } },
    });
    return {
      sessions:   num(tot.rows?.[0]?.metricValues?.[0]?.value),
      users:      num(tot.rows?.[0]?.metricValues?.[1]?.value),
      engagement: num(tot.rows?.[0]?.metricValues?.[2]?.value),
      channels:   (ch.rows || []).map(r => ({ name: r.dimensionValues[0].value, sessions: num(r.metricValues[0].value) })),
      events:     Object.fromEntries((ev.rows || []).map(r => [r.dimensionValues[0].value, num(r.metricValues[0].value)])),
    };
  } catch (err) {
    return { error: err.message };
  }
}

async function checkUptime() {
  const pages = ['/', '/sambo-arv.html', '/efterlevandepension.html', '/dodsbo-bostadsratt.html', '/vad-gora-nar-nagon-dor.html'];
  const out = [];
  for (const p of pages) {
    const t0 = Date.now();
    try {
      const r = await fetch(`https://www.efterplan.se${p}`, { redirect: 'follow' });
      out.push({ path: p, code: r.status, time: ((Date.now() - t0) / 1000).toFixed(2) + 's' });
    } catch (e) {
      out.push({ path: p, code: 'ERR', time: '-' });
    }
  }
  return out;
}

function gitActivity() {
  let commits = [];
  let files = [];
  try {
    commits = execSync(`git -C "${REPO_ROOT}" log --since="7 days ago" --pretty=format:"%h %s"`, { encoding: 'utf8' })
      .split('\n').filter(Boolean);
    files = [...new Set(execSync(`git -C "${REPO_ROOT}" log --since="7 days ago" --name-only --pretty=format:`, { encoding: 'utf8' })
      .split('\n').filter(Boolean))];
  } catch (_) {}
  return { commits, files };
}

function npmAudit() {
  try {
    const out = execSync('npm audit --json', { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    const j = JSON.parse(out);
    const v = j.metadata?.vulnerabilities || {};
    return `${v.critical||0} critical · ${v.high||0} high · ${v.moderate||0} moderate · ${v.low||0} low`;
  } catch (e) {
    // npm audit exits non-zero when vulns exist; still parse stdout if present
    if (e.stdout) {
      try {
        const j = JSON.parse(e.stdout.toString());
        const v = j.metadata?.vulnerabilities || {};
        return `${v.critical||0} critical · ${v.high||0} high · ${v.moderate||0} moderate · ${v.low||0} low`;
      } catch {}
    }
    return 'okänt';
  }
}

function roadmapStatus() {
  const p = path.join(REPO_ROOT, 'roadmap.md');
  if (!existsSync(p)) return { done: 0, progress: 0, todo: 0 };
  const txt = readFileSync(p, 'utf8');
  return {
    done:     (txt.match(/✔/g) || []).length,
    progress: (txt.match(/⧖/g) || []).length,
    todo:     (txt.match(/☐/g) || []).length,
  };
}

function buildMarkdown({ kpis, uptime, git, audit, roadmap }) {
  const md = [];
  md.push(`# Efterplan Veckorapport — ${today}`);
  md.push('');
  md.push('> Genererad automatiskt av GitHub Actions (`.github/workflows/weekly-report.yml`).');
  md.push('');
  md.push('---');
  md.push('');
  md.push('## 🔢 Nyckeltal (7 dagar — GA4)');
  md.push('');
  if (kpis.error) {
    md.push('```');
    md.push(`GA4-anrop misslyckades: ${kpis.error}`);
    md.push('```');
  } else {
    md.push('| Mått | Värde |');
    md.push('|------|-------|');
    md.push(`| Sessions | **${kpis.sessions}** |`);
    md.push(`| Users | ${kpis.users} |`);
    md.push(`| Engagement rate | ${(kpis.engagement * 100).toFixed(1)}% |`);
    const organic = kpis.channels.find(c => c.name === 'Organic Search')?.sessions || 0;
    const orgPct = kpis.sessions ? (100 * organic / kpis.sessions).toFixed(1) : '0.0';
    md.push(`| Organisk andel | ${organic} (${orgPct}%) |`);
    const onb = kpis.events.onboarding_start || 0;
    const plan = kpis.events.plan_generated || 0;
    const task = kpis.events.task_completed || 0;
    md.push(`| onboarding_start | ${onb} (${kpis.sessions ? (100*onb/kpis.sessions).toFixed(1) : '0.0'}% av sessions) |`);
    md.push(`| plan_generated | ${plan} (${onb ? (100*plan/onb).toFixed(1) : '0.0'}% av onboarding_start) |`);
    md.push(`| task_completed | ${task} |`);
    md.push('');
    md.push('**Kanaler:**');
    md.push('');
    kpis.channels.sort((a,b)=>b.sessions-a.sessions).forEach(c => md.push(`- ${c.name}: ${c.sessions}`));
  }
  md.push('');
  md.push('## 🟢 Uptime');
  md.push('');
  md.push('| Path | Status | Tid |');
  md.push('|------|--------|-----|');
  uptime.forEach(u => md.push(`| \`${u.path}\` | ${u.code} | ${u.time} |`));
  md.push('');
  md.push('## 📊 Git-aktivitet');
  md.push('');
  md.push(`- **${git.commits.length}** commits, **${git.files.length}** filer ändrade`);
  md.push('');
  md.push('### Commits');
  md.push('');
  git.commits.forEach(c => md.push(`- \`${c}\``));
  md.push('');
  md.push('## 🔧 Teknisk audit');
  md.push('');
  md.push(`- **npm audit (ga4-dashboard):** ${audit}`);
  md.push(`- **Live-sajt:** ${uptime[0]?.code} på ${uptime[0]?.time}`);
  md.push('');
  md.push('## 🗺️ Roadmap-status');
  md.push('');
  md.push('| Status | Antal |');
  md.push('|--------|-------|');
  md.push(`| ✔ Klara | ${roadmap.done} |`);
  md.push(`| ⧖ Pågår | ${roadmap.progress} |`);
  md.push(`| ☐ Ej startade | ${roadmap.todo} |`);
  md.push('');
  return md.join('\n') + '\n';
}

(async () => {
  const [kpis, uptime] = await Promise.all([fetchKpis(), checkUptime()]);
  const git = gitActivity();
  const audit = npmAudit();
  const roadmap = roadmapStatus();
  const md = buildMarkdown({ kpis, uptime, git, audit, roadmap });
  writeFileSync(outFile, md, 'utf8');
  console.log(`Veckorapport skriven: ${outFile}`);
})().catch(err => { console.error('FAIL:', err); process.exit(1); });
