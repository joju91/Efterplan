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
  if (!verifySecret(req.headers['x-ads-agent-secret'])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('ads-decisions', ip, 100);
  if (limited) return res.status(429).json({ error: 'Rate limited' });

  const supa = getSupabaseAdmin();

  if (req.method === 'GET') {
    // Returnera autonomt implementerbara beslut (ej requires_approval)
    const { data, error } = await supa
      .from('ads_decisions')
      .select('id, decision_type, entity_type, entity_name, action, reasoning')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('[ads-decisions] select:', error.message);
      return res.status(500).json({ error: 'DB error', detail: error.message, code: error.code });
    }
    return res.json({ decisions: data || [] });
  }

  if (req.method === 'POST') {
    let body;
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString());
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }

    const { applied = [], skipped = [] } = body;
    const now = new Date().toISOString();

    if (applied.length > 0) {
      await supa
        .from('ads_decisions')
        .update({ status: 'applied', applied_at: now })
        .in('id', applied);
    }
    if (skipped.length > 0) {
      await supa
        .from('ads_decisions')
        .update({ status: 'skipped' })
        .in('id', skipped);
    }
    return res.json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
