import { getStripe, getSupabaseAdmin, readRawBody, normalizeEmail } from './_lib.js';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('method_not_allowed');
  }

  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return res.status(400).send('missing_signature_or_secret');

  let event;
  try {
    const stripe = getStripe();
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error('[stripe-webhook] signature failed', err.message);
    return res.status(400).send(`invalid_signature: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      if (s.payment_status !== 'paid') {
        return res.status(200).json({ received: true, skipped: 'unpaid' });
      }
      const email =
        normalizeEmail(s.customer_details?.email) ||
        normalizeEmail(s.customer_email);

      const supa = getSupabaseAdmin();
      const row = {
        stripe_session_id: s.id,
        stripe_customer_id: typeof s.customer === 'string' ? s.customer : null,
        stripe_payment_intent: typeof s.payment_intent === 'string' ? s.payment_intent : null,
        email,
        user_id: s.client_reference_id || null,
        amount_total: s.amount_total ?? null,
        currency: s.currency || null,
        livemode: !!event.livemode,
        raw: s,
      };

      const { error } = await supa
        .from('purchases')
        .upsert(row, { onConflict: 'stripe_session_id' });

      if (error) {
        console.error('[stripe-webhook] supabase insert failed', error);
        return res.status(500).send('db_error');
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[stripe-webhook] handler', err);
    return res.status(500).send('handler_error');
  }
}
