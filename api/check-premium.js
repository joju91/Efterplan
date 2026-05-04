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

    const { count, error, status, statusText } = await query;
    if (error) {
      console.error('[check-premium]', error);
      return res.status(500).json({
        ok: false, error: 'db_error',
        detail: error.message || '(empty)',
        code: error.code || null,
        hint: error.hint || null,
        status, statusText,
        keyKind: (process.env.SUPABASE_SECRET_KEY || '').slice(0, 14),
        urlSet: !!process.env.SUPABASE_URL,
      });
    }
    return res.status(200).json({ ok: true, premium: (count || 0) > 0, count });
  } catch (err) {
    console.error('[check-premium]', err);
    return res.status(500).json({ ok: false, error: 'lookup_failed', detail: err.message, stack: (err.stack || '').slice(0, 200) });
  }
}
