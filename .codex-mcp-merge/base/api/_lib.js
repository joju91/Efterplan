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

// T162: klientens IP för rate-limiting. Vercel sätter x-forwarded-for;
// första adressen i listan är den faktiska klienten (resten är proxy-hopp).
export function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// T162: enkelt per-nyckel dagligt tak, backat av Supabase (samma projekt/secret
// som redan finns, se T163) istället för att kräva en ny Upstash/KV-integration.
// Fail-open: om rate-limit-kontrollen själv failar (nätverk, Supabase pausat)
// släpper vi igenom anropet — en trög/nere rate-limiter ska inte slå ut hela
// funktionen för alla användare.
export async function checkRateLimit(bucket, ip, limit) {
  try {
    const supa = getSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);
    const key = `${bucket}:${ip}:${today}`;
    const { data, error } = await supa.rpc('rate_limit_increment', { key_in: key });
    if (error) {
      console.error('[rate-limit]', bucket, error);
      return { limited: false };
    }
    return { limited: typeof data === 'number' && data > limit, count: data };
  } catch (err) {
    console.error('[rate-limit]', bucket, err);
    return { limited: false };
  }
}
