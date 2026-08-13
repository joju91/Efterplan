// T178 — Deadline-mejl, insamlingsdelen. Sparar bara samtycket i Supabase.
// Skickar INGA mejl i denna omgång — det kräver ett separat val av
// e-postleverantör + cron-jobb, se roadmap.md T136/T178.
import { getSupabaseAdmin, normalizeEmail, getClientIp, checkRateLimit } from './_lib.js';

const VALID_TYPES = new Set(['bouppteckning', 'inlamning', 'dodsboanmalan']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('subscribe-reminder', ip, 10);
  if (limited) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const email = normalizeEmail(body.email);
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'invalid_email' });
    }

    const deathDate = typeof body.deathDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.deathDate)
      ? body.deathDate
      : null;

    const types = Array.isArray(body.types)
      ? body.types.filter(t => VALID_TYPES.has(t))
      : [];
    if (types.length === 0) {
      return res.status(400).json({ error: 'no_valid_types' });
    }

    const supa = getSupabaseAdmin();
    const { error } = await supa.from('reminder_optins').insert({
      email,
      death_date: deathDate,
      optin_types: types,
    });
    if (error) {
      console.error('[subscribe-reminder]', error);
      return res.status(500).json({ error: 'db_error' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe-reminder]', err);
    return res.status(500).json({ error: 'subscribe_failed' });
  }
}
