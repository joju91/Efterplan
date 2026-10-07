import { getSupabaseAdmin, normalizeEmail, getClientIp, checkRateLimit, stripeIsLiveMode } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('check-premium', ip, 100);
  if (limited) return res.status(429).json({ ok: false, error: 'rate_limited' });

  const authorization = req.headers.authorization || '';
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  if (!match) return res.status(401).json({ ok: false, error: 'unauthorized' });

  try {
    const supa = getSupabaseAdmin();
    const { data: authData, error: authError } = await supa.auth.getUser(match[1]);
    const user = authData?.user;
    if (authError || !user?.id) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const email = normalizeEmail(user.email);
    const livemode = stripeIsLiveMode();
    if (livemode === null) return res.status(503).json({ ok: false, error: 'billing_unavailable' });
    let query = supa.from('purchases').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).eq('livemode', livemode);
    let { count, error } = await query;
    if (error) return res.status(500).json({ ok: false, error: 'lookup_failed' });

    // Keep support for legacy purchases that were recorded by verified email only.
    if (!(count > 0) && email) {
      ({ count, error } = await supa.from('purchases')
        .select('id', { count: 'exact', head: true })
        .eq('email', email)
        .eq('livemode', livemode));
      if (error) return res.status(500).json({ ok: false, error: 'lookup_failed' });
    }

    return res.status(200).json({ ok: true, premium: (count || 0) > 0, email });
  } catch {
    return res.status(500).json({ ok: false, error: 'lookup_failed' });
  }
}
