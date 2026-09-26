import { timingSafeEqual } from 'crypto';
import { checkRateLimit, getClientIp } from './_lib.js';

const SUPA_URL  = 'https://vjupkemzpnrahdsljenl.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdXBrZW16cG5yYWhkc2xqZW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5OTI4MDUsImV4cCI6MjA5MjU2ODgwNX0.GGc8xCc8vj4EO3nOdM8WTb0igP31L-31XlxgTafN5Bo';

function verifySecret(incoming) {
  const expected = process.env.ADS_AGENT_SECRET;
  if (!incoming || !expected) return false;
  try {
    const a = Buffer.from(String(incoming));
    const b = Buffer.from(String(expected));
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch { return false; }
}

async function supaUpsert(table, rows, onConflict) {
  const url = `${SUPA_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPA_ANON,
      'Authorization': `Bearer ${SUPA_ANON}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`${resp.status} ${text}`);
  }
  return rows.length;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  if (!verifySecret(req.headers['x-ads-agent-secret'])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('ads-telemetry', ip, 50);
  if (limited) return res.status(429).json({ error: 'Rate limited' });

  let body;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { type, data, date } = body;
  if (!type || !Array.isArray(data)) {
    return res.status(400).json({ error: 'Missing type or data array' });
  }

  try {
    if (type === 'keywords') {
      const rows = data.map(d => ({
        snapshot_date:  d.snapshot_date || date,
        campaign_name:  d.campaign_name || null,
        ad_group:       d.ad_group || null,
        keyword:        d.keyword || null,
        match_type:     d.match_type || null,
        impressions:    d.impressions || 0,
        clicks:         d.clicks || 0,
        cost_micros:    d.cost_micros || 0,
        conversions:    d.conversions || 0,
        avg_cpc_micros: d.avg_cpc_micros || 0,
        quality_score:  d.quality_score || null,
      }));
      const written = await supaUpsert('ads_performance', rows, 'snapshot_date,ad_group,keyword,match_type');
      return res.json({ ok: true, written });
    }

    if (type === 'search_terms') {
      const rows = data.map(d => ({
        snapshot_date:      d.snapshot_date || date,
        search_term:        d.search_term,
        ad_group:           d.ad_group || null,
        triggered_keyword:  d.triggered_keyword || null,
        impressions:        d.impressions || 0,
        clicks:             d.clicks || 0,
        cost_micros:        d.cost_micros || 0,
        conversions:        d.conversions || 0,
      }));
      const written = await supaUpsert('ads_search_terms', rows, 'snapshot_date,search_term,ad_group');
      return res.json({ ok: true, written });
    }

    return res.status(400).json({ error: `Unknown type: ${type}` });
  } catch (err) {
    console.error('[ads-telemetry] upsert error:', err.message);
    return res.status(500).json({ error: 'DB error' });
  }
}
