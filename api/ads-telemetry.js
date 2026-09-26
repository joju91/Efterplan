import { timingSafeEqual } from 'crypto';
import { getSupabaseAdmin, checkRateLimit, getClientIp } from './_lib.js';

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

  const supa = getSupabaseAdmin();

  if (type === 'keywords') {
    const rows = data.map(d => ({
      snapshot_date: d.snapshot_date || date,
      campaign_name: d.campaign_name || null,
      ad_group: d.ad_group || null,
      keyword: d.keyword || null,
      match_type: d.match_type || null,
      impressions: d.impressions || 0,
      clicks: d.clicks || 0,
      cost_micros: d.cost_micros || 0,
      conversions: d.conversions || 0,
      conversion_value: d.conversion_value || 0,
      avg_cpc_micros: d.avg_cpc_micros || 0,
      quality_score: d.quality_score || null,
    }));

    const { error, count } = await supa
      .from('ads_performance')
      .upsert(rows, { onConflict: 'snapshot_date,ad_group,keyword,match_type', count: 'exact' });

    if (error) {
      console.error('[ads-telemetry] keyword upsert:', error.message);
      return res.status(500).json({ error: 'DB error' });
    }
    return res.json({ ok: true, written: count });
  }

  if (type === 'search_terms') {
    const rows = data.map(d => ({
      snapshot_date: d.snapshot_date || date,
      search_term: d.search_term,
      ad_group: d.ad_group || null,
      triggered_keyword: d.triggered_keyword || null,
      impressions: d.impressions || 0,
      clicks: d.clicks || 0,
      cost_micros: d.cost_micros || 0,
      conversions: d.conversions || 0,
    }));

    const { error, count } = await supa
      .from('ads_search_terms')
      .upsert(rows, { onConflict: 'snapshot_date,search_term,ad_group', count: 'exact' });

    if (error) {
      console.error('[ads-telemetry] search_terms upsert:', error.message);
      return res.status(500).json({ error: 'DB error' });
    }
    return res.json({ ok: true, written: count });
  }

  return res.status(400).json({ error: `Unknown type: ${type}` });
}
