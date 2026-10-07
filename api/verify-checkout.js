import { getStripe, getSupabaseAdmin, normalizeEmail, getClientIp, checkRateLimit } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const ip = getClientIp(req);
  const { limited } = await checkRateLimit('verify-checkout', ip, 20);
  if (limited) return res.status(429).json({ ok: false, error: 'rate_limited' });

  const sessionId = (req.query.session_id || '').toString();
  if (!sessionId.startsWith('cs_')) {
    return res.status(400).json({ ok: false, error: 'bad_session_id' });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== 'payment' || session.metadata?.source !== 'efterplan_paywall') {
      return res.status(400).json({ ok: false, error: 'session_not_eligible' });
    }
    if (session.payment_status !== 'paid') {
      return res.status(200).json({ ok: false, status: session.payment_status });
    }

    const email =
      normalizeEmail(session.customer_details?.email) ||
      normalizeEmail(session.customer_email);

    // Best-effort: ensure a row exists even if the webhook hasn't fired yet.
    try {
      const supa = getSupabaseAdmin();
      await supa.from('purchases').upsert(
        {
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
          stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
          email,
          user_id: session.client_reference_id || null,
          amount_total: session.amount_total ?? null,
          currency: session.currency || null,
          livemode: !!session.livemode,
        },
        { onConflict: 'stripe_session_id' }
      );
    } catch (e) {
      console.warn('[verify-checkout] supabase upsert skipped', e?.message);
    }

    return res.status(200).json({
      ok: true,
      email,
      status: 'paid',
      amount_total: session.amount_total ?? null, // Ã¶re â€” klienten skickar /100 till Google Ads
      currency: session.currency || null,
    });
  } catch (err) {
    // Stripe throws StripeInvalidRequestError ("No such checkout.session") for
    // unknown IDs â€” that's a bad-input error, not a server fault.
    if (err?.type === 'StripeInvalidRequestError' || err?.statusCode === 404) {
      return res.status(400).json({ ok: false, error: 'session_not_found' });
    }
    console.error('[verify-checkout]', err);
    return res.status(500).json({ ok: false, error: 'verify_failed' });
  }
}

