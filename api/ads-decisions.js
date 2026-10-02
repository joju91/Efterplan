import { timingSafeEqual } from 'crypto';
import { checkRateLimit, getClientIp, supabaseRest, supabaseServerHeaders } from './_lib.js';

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

// ads_*-tabellerna är stängda för anon (migration ads_revoke_anon,
// 2026-09-27), så vi går via servernyckeln. Åtkomst styrs av ADS_AGENT_SECRET.
const supaUrl = supabaseRest;
const supaHeaders = () => supabaseServerHeaders({ Prefer: 'return=representation' });

export default async function handler(req, res) {
  if (!verifySecret(req.headers['x-ads-agent-secret'])) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('ads-decisions', ip, 100);
  if (limited) return res.status(429).json({ error: 'Rate limited' });

  if (req.method === 'GET') {
    const params = new URLSearchParams({
      select: 'id,decision_type,entity_type,entity_name,action,reasoning',
      status: 'eq.pending',
      order: 'created_at.asc',
      limit: '50',
    });
    const resp = await fetch(`${supaUrl('ads_decisions')}?${params}`, {
      headers: supaHeaders(),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error('[ads-decisions] GET failed:', resp.status, body);
      return res.status(500).json({ error: 'DB error' });
    }
    const data = await resp.json();
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
      const params = new URLSearchParams({ id: `in.(${applied.join(',')})` });
      await fetch(`${supaUrl('ads_decisions')}?${params}`, {
        method: 'PATCH',
        headers: supaHeaders(),
        body: JSON.stringify({ status: 'applied', applied_at: now }),
      });
    }
    if (skipped.length > 0) {
      const params = new URLSearchParams({ id: `in.(${skipped.join(',')})` });
      await fetch(`${supaUrl('ads_decisions')}?${params}`, {
        method: 'PATCH',
        headers: supaHeaders(),
        body: JSON.stringify({ status: 'skipped' }),
      });
    }
    return res.json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end();
}
