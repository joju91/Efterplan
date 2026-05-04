import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY missing');
  return new Stripe(key, { apiVersion: '2024-11-20.acacia' });
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  // Stöder både nya sb_secret_* och äldre service_role JWT.
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SECRET_KEY missing');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export function originFromReq(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function normalizeEmail(e) {
  return (e || '').trim().toLowerCase();
}
