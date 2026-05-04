import { getStripe, originFromReq, normalizeEmail } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId) return res.status(500).json({ error: 'price_not_configured' });

    const stripe = getStripe();
    const origin = originFromReq(req);
    const email = normalizeEmail(body.email);
    const userId = typeof body.userId === 'string' ? body.userId.slice(0, 64) : null;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/?premium=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?premium=cancelled`,
      customer_creation: 'always',
      customer_email: email || undefined,
      client_reference_id: userId || undefined,
      allow_promotion_codes: true,
      locale: 'sv',
      metadata: {
        source: 'efterplan_paywall',
        user_id: userId || '',
      },
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (err) {
    console.error('[create-checkout]', err);
    return res.status(500).json({ error: 'checkout_failed', message: err.message });
  }
}
