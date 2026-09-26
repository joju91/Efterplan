/**
 * Efterplan Google Ads — autonom optimeringsagent
 * Körs av .github/workflows/google-ads-optimize.yml (måndag 08:00 UTC)
 * Kan även köras manuellt: node scripts/google-ads/optimize.mjs
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dir, '..', '..');
const REPORTS_DIR = join(REPO_ROOT, 'ads-reports');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://vjupkemzpnrahdsljenl.supabase.co',
  process.env.SUPABASE_SECRET_KEY
);
const PLAUSIBLE_KEY = process.env.PLAUSIBLE_API_KEY;
const REPORT_ONLY = process.argv.includes('--report-only');

async function main() {
  const today = new Date().toISOString().slice(0, 10);
  const d30 = new Date(Date.now() - 30 * 86400_000).toISOString().slice(0, 10);

  console.log(`[ads-optimize] ${today}${REPORT_ONLY ? ' (rapport-läge)' : ''}`);
  mkdirSync(REPORTS_DIR, { recursive: true });

  // 1. Prestandadata
  const { data: perfData, error: perfErr } = await supabase
    .from('ads_performance')
    .select('*')
    .gte('snapshot_date', d30)
    .order('snapshot_date', { ascending: false });

  if (perfErr) { console.error('[ads-optimize] perfData:', perfErr.message); process.exit(1); }

  if (!perfData?.length) {
    const msg = `# Google Ads — optimering ${today}\n\nIngen prestandadata i databasen. Google Ads Script behöver installeras och ha kört minst en gång.\n\nSe \`scripts/google-ads/README.md\` för installationsinstruktioner.\n`;
    const reportPath = join(REPORTS_DIR, `ads-optimization-${today}.md`);
    writeFileSync(reportPath, msg);
    console.log('[ads-optimize] Ingen data — rapport skapad med instruktioner.');
    process.exit(0);
  }

  // 2. Söktermer
  const { data: searchTerms } = await supabase
    .from('ads_search_terms')
    .select('*')
    .gte('snapshot_date', d30)
    .is('action_taken', null)
    .order('cost_micros', { ascending: false })
    .limit(100);

  // 3. Godkänt budget
  const { data: budgetRows } = await supabase
    .from('ads_budget')
    .select('*')
    .order('approved_at', { ascending: false })
    .limit(1);
  const budget = budgetRows?.[0] ?? { approved_monthly_budget_sek: 930, daily_budget_sek: 30 };

  // 4. Befintliga beslut (undvika duplikat)
  const { data: existingDecisions } = await supabase
    .from('ads_decisions')
    .select('decision_type, entity_name, status')
    .in('status', ['pending', 'applied'])
    .gte('created_at', d30);

  // 5. Plausible (utm_source=google)
  const plausible = await fetchPlausible();

  // 6. Aggregera
  const metrics = aggregate(perfData);

  let decisions = [];
  let summary = 'Rapport-läge — inga beslut genererade.';

  if (!REPORT_ONLY) {
    // 7. Analysera med Claude
    const result = await analyzeWithClaude(metrics, searchTerms, budget, plausible, existingDecisions, today);
    decisions = result.decisions ?? [];
    summary = result.summary ?? '';

    // 8. Spara beslut i Supabase
    if (decisions.length > 0) {
      const rows = decisions.map(d => ({
        decision_type: d.decision_type,
        entity_type: d.entity_type ?? null,
        entity_name: d.entity_name ?? null,
        action: d.action ?? {},
        reasoning: d.reasoning ?? '',
        status: d.status ?? 'pending',
      }));
      const { error: insErr } = await supabase.from('ads_decisions').insert(rows);
      if (insErr) console.error('[ads-optimize] insert decisions:', insErr.message);
    }
  }

  // 9. Skriv rapport
  const report = buildReport(today, metrics, plausible, budget, decisions, summary);
  const reportPath = join(REPORTS_DIR, `ads-optimization-${today}.md`);
  writeFileSync(reportPath, report);

  const auto = decisions.filter(d => d.status === 'pending').length;
  const approval = decisions.filter(d => d.status === 'requires_approval').length;
  console.log(`[ads-optimize] Klar. ${auto} autonoma beslut, ${approval} kräver godkännande.`);
  console.log(`[ads-optimize] Rapport: ads-reports/ads-optimization-${today}.md`);

  // Avsluta med felkod om det finns approval-items (GitHub Action öppnar då issue)
  if (approval > 0) process.exit(2);
}

async function fetchPlausible() {
  if (!PLAUSIBLE_KEY) return null;
  try {
    const base = 'https://plausible.io/api/v1/stats';
    const h = { Authorization: `Bearer ${PLAUSIBLE_KEY}` };
    const f = encodeURIComponent('visit:utm_source==google');
    const [agg, goals] = await Promise.all([
      fetch(`${base}/aggregate?site_id=efterplan.se&period=30d&filters=${f}&metrics=visitors,pageviews,events`, { headers: h }).then(r => r.json()),
      fetch(`${base}/breakdown?site_id=efterplan.se&period=30d&filters=${f}&property=event:name&metrics=events`, { headers: h }).then(r => r.json()),
    ]);
    return { aggregate: agg?.results ?? null, goals: goals?.results ?? [] };
  } catch (e) {
    console.error('[ads-optimize] Plausible error:', e.message);
    return null;
  }
}

function aggregate(rows) {
  const byKey = {};
  for (const r of rows) {
    const k = `${r.ad_group}|||${r.keyword}|||${r.match_type}`;
    if (!byKey[k]) byKey[k] = {
      ad_group: r.ad_group, keyword: r.keyword, match_type: r.match_type,
      impressions: 0, clicks: 0, cost_micros: 0, conversions: 0, conversion_value: 0,
      data_points: 0,
    };
    const e = byKey[k];
    e.impressions += r.impressions ?? 0;
    e.clicks += r.clicks ?? 0;
    e.cost_micros += r.cost_micros ?? 0;
    e.conversions += r.conversions ?? 0;
    e.conversion_value += r.conversion_value ?? 0;
    e.data_points++;
  }

  const keywords = Object.values(byKey).map(k => ({
    ...k,
    cost_sek: +(k.cost_micros / 1_000_000).toFixed(2),
    avg_cpc_sek: k.clicks > 0 ? +(k.cost_micros / k.clicks / 1_000_000).toFixed(2) : 0,
    ctr_pct: k.impressions > 0 ? +((k.clicks / k.impressions) * 100).toFixed(1) : 0,
    cpa_sek: k.conversions > 0 ? +(k.cost_micros / k.conversions / 1_000_000).toFixed(2) : null,
  })).sort((a, b) => b.cost_sek - a.cost_sek);

  const totals = keywords.reduce((acc, k) => ({
    impressions: acc.impressions + k.impressions,
    clicks: acc.clicks + k.clicks,
    cost_sek: +(acc.cost_sek + k.cost_sek).toFixed(2),
    conversions: +(acc.conversions + k.conversions).toFixed(2),
  }), { impressions: 0, clicks: 0, cost_sek: 0, conversions: 0 });

  return { keywords, totals };
}

// System-prompt cachas av Anthropic (>1024 tokens, static)
const SYSTEM_PROMPT = `Du är en expert på Google Ads-optimering för efterplan.se — en gratis svensk webbtjänst som hjälper anhöriga att hantera praktiska dödsboärenden. Gratis personlig checklista + dokument-paket för 49 kr (engångsbetalning).

Målgrupp: Svenska anhöriga strax efter ett dödsfall. Sökintention: transaktionsnära (mall, brev, guide).
Nuvarande kampanj: Search-only, Sverige/svenska, 2 annonsgrupper (Arvskifte, Säg upp abonnemang).

BUDGET-GRÄNS: Du får ALDRIG generera beslut som höjer dagsgränsen direkt. Formuera sådana som 'budget_proposal' med status 'requires_approval'.

AUTONOMA BESLUT (status: "pending") — dessa implementeras direkt av Google Ads Script:
- pause_keyword: ≥10 klick, 0 konverteringar, avg CPC >8 kr (minst 14 dagars data)
- add_negative: sökterm uppenbart irrelevant (tjänst, jobb, kurs, annan nisch), ≥1 klick
- add_keyword: söktermdata visar relevant term med ≥3 klick, <8 kr CPC, inte redan sökord
- enable_keyword: pausat sökord vars skäl för paus inte längre gäller

BESLUT SOM KRÄVER GODKÄNNANDE (status: "requires_approval"):
- budget_proposal: data stöder budgetökning (CPA <50 kr och ≥5 köp)
- new_campaign_proposal: ny annonsgrupp eller kampanj
- bid_strategy_change: byta budstrategi (t.ex. till Target CPA)

Var konservativ — hellre inga beslut än felaktiga. Minst 14 dagars data krävs för pause_keyword.

Svara ENBART med giltig JSON:
{
  "decisions": [
    {
      "decision_type": "pause_keyword|add_negative|add_keyword|enable_keyword|budget_proposal|new_campaign_proposal|bid_strategy_change",
      "entity_type": "keyword|campaign|ad_group|null",
      "entity_name": "text eller null",
      "action": {
        "ad_group": "...",
        "keyword_text": "...",
        "match_type": "PHRASE|EXACT|BROAD",
        "campaign_name": "..."
      },
      "reasoning": "Konkret motivering på svenska med siffrorna",
      "status": "pending|requires_approval"
    }
  ],
  "summary": "1-2 meningar på svenska — vad gjordes och varför"
}`;

async function analyzeWithClaude(metrics, searchTerms, budget, plausible, existing, today) {
  const existingStr = (existing ?? [])
    .map(d => `${d.decision_type}:${d.entity_name ?? '?'}`)
    .join(', ') || 'inga';

  const userMsg = `Datum: ${today}
Godkänd daglig budget: ${budget.daily_budget_sek} kr (${budget.approved_monthly_budget_sek} kr/mån)

SÖKORDSPRESTANDA (30 dagar, sorterat på kostnad):
${JSON.stringify(metrics.keywords, null, 2)}

TOTALT:
${JSON.stringify(metrics.totals, null, 2)}

SÖKTERMER UTAN ÅTGÄRD (topp 20 på kostnad):
${JSON.stringify((searchTerms ?? []).slice(0, 20), null, 2)}

PLAUSIBLE (utm_source=google, 30 dagar):
${JSON.stringify(plausible, null, 2)}

BEFINTLIGA BESLUT (undvik duplikat): ${existingStr}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    // System-prompten är statisk och stor nog för prompt caching (>1024 tokens)
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMsg }],
  });

  const text = response.content[0]?.text ?? '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found');
    return JSON.parse(match[0]);
  } catch (e) {
    console.error('[ads-optimize] Claude parse error:', e.message);
    console.error('Raw:', text.slice(0, 300));
    return { decisions: [], summary: 'Kunde inte parsa Claude-svar.' };
  }
}

function buildReport(date, metrics, plausible, budget, decisions, summary) {
  const auto = decisions.filter(d => d.status === 'pending');
  const approval = decisions.filter(d => d.status === 'requires_approval');

  let r = `# Google Ads — optimering ${date}\n\n`;
  r += `**Sammanfattning:** ${summary}\n\n`;

  r += `## Nyckeltal (senaste 30 dagar)\n\n`;
  r += `| Mätvärde | Värde |\n|---|---|\n`;
  r += `| Visningar | ${metrics.totals.impressions.toLocaleString('sv-SE')} |\n`;
  r += `| Klick | ${metrics.totals.clicks} |\n`;
  r += `| Kostnad | ${metrics.totals.cost_sek.toFixed(2)} kr |\n`;
  r += `| Konverteringar (Ads) | ${metrics.totals.conversions} |\n`;
  if (plausible?.goals?.length) {
    const plan = plausible.goals.find(g => g['event:name'] === 'plan_generated');
    const buy  = plausible.goals.find(g => g['event:name'] === 'premium_activated');
    if (plan) r += `| Personlig plan skapad (Plausible) | ${plan.events} |\n`;
    if (buy)  r += `| Köp 49 kr (Plausible) | ${buy.events} |\n`;
    if (buy && metrics.totals.cost_sek > 0 && buy.events > 0) {
      r += `| CPA (kostnad/köp) | ${(metrics.totals.cost_sek / buy.events).toFixed(0)} kr |\n`;
    }
  }
  r += `| Godkänd daglig budget | ${budget.daily_budget_sek} kr |\n\n`;

  r += `## Per sökord\n\n`;
  r += `| Sökord | Grupp | Klick | Kostnad | CPC | Konv. |\n|---|---|---|---|---|---|\n`;
  for (const k of metrics.keywords) {
    r += `| ${k.keyword} | ${k.ad_group} | ${k.clicks} | ${k.cost_sek} kr | ${k.avg_cpc_sek} kr | ${k.conversions} |\n`;
  }
  r += '\n';

  r += `## Autonoma beslut (${auto.length} st)\n\n`;
  if (auto.length === 0) {
    r += `_Inga autonoma beslut denna körning — data otillräcklig eller inga trösklar överskridna._\n\n`;
  } else {
    for (const d of auto) {
      r += `**${d.decision_type}** — \`${d.entity_name ?? ''}\`\n> ${d.reasoning}\n\n`;
    }
  }

  if (approval.length > 0) {
    r += `## ⚠️ Kräver ditt godkännande (${approval.length} st)\n\n`;
    for (const d of approval) {
      r += `**${d.decision_type}**\n> ${d.reasoning}\n\n`;
      r += `\`\`\`json\n${JSON.stringify(d.action, null, 2)}\n\`\`\`\n\n`;
    }
    r += `> Svara på detta GitHub Issue för att godkänna, eller kör \`/google-ads budget approve\`.\n\n`;
  }

  r += `---\n*Genererad ${date} av Google Ads-agenten. [ads-reports/](../ads-reports/)*\n`;
  return r;
}

main().catch(e => { console.error('[ads-optimize] Fatal:', e); process.exit(1); });
