import { getSupabaseAdmin, normalizeEmail } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const email = normalizeEmail(req.query.email);
  const userId = (req.query.user_id || '').toString().slice(0, 64);

  if (!email && !userId) {
    return res.status(400).json({ ok: false, error: 'missing_email_or_user_id' });
  }

  try {
    const supa = getSupabaseAdmin();
    let query = supa.from('purchases').select('id', { count: 'exact', head: true });
    if (email && userId) {
      query = query.or(`email.eq.${email},user_id.eq.${userId}`);
    } else if (email) {
      query = query.eq('email', email);
    } else {
      query = query.eq('user_id', userId);
    }

    const { count, error } = await query;
    if (error) {
      console.error('[check-premium]', error);
      return res.status(500).json({ ok: false, error: 'db_error' });
    }
    return res.status(200).json({ ok: true, premium: (count || 0) > 0 });
  } catch (err) {
    console.error('[check-premium]', err);
    return res.status(500).json({ ok: false, error: 'lookup_failed' });
  }
}
