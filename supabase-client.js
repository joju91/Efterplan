// Efterplan — Supabase client (T051/T052/T053)
// Loads @supabase/supabase-js v2 UMD bundle from CDN, exposes a tiny API on
// window.efterplanAuth. Silently no-ops if SUPABASE_CONFIG is empty, so the
// static site keeps working offline for signed-out users.

const SUPABASE_CONFIG = {
  url: "https://vjupkemzpnrahdsljenl.supabase.co",
  anonKey: "sb_publishable_8eZKlNPSB5gH0gDYO8pb0Q__5w2kYs3"
};

(function () {
  'use strict';

  const STATE_KEYS = [
    'efterplan_state',
    'efterplan_tasks',
    'efterplan_notes',
    'efterplan_bills',
    'efterplan_notify_list',
  ];
  const LOCAL_UPDATED_AT = 'efterplan_updated_at';
  const CDN_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';

  let client = null;
  let initPromise = null;
  let currentUser = null;
  let syncTimer = null;

  function isConfigured() {
    return !!(SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey);
  }

  function loadCdn() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement('script');
      s.src = CDN_URL;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Supabase CDN failed to load'));
      document.head.appendChild(s);
    });
  }

  function initSupabase() {
    if (!isConfigured()) return Promise.resolve(null);
    if (initPromise) return initPromise;
    initPromise = loadCdn().then(() => {
      client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      client.auth.onAuthStateChange(handleAuthChange);
      return client.auth.getUser().then(({ data }) => {
        currentUser = data && data.user ? data.user : null;
        fireAuthChanged();
        if (currentUser) hydrateFromRemoteIfNewer();
      }).then(() => client);
    });
    return initPromise;
  }

  function fireAuthChanged() {
    window.dispatchEvent(new CustomEvent('efterplan:auth-changed', {
      detail: { user: currentUser },
    }));
  }

  async function handleAuthChange(event, session) {
    currentUser = session && session.user ? session.user : null;
    if (event === 'SIGNED_IN') {
      await hydrateFromRemoteIfNewer();
    }
    // SIGNED_OUT: do NOT touch localStorage (keeps offline data intact).
    fireAuthChanged();
  }

  function readLocalSnapshot() {
    const snap = {};
    for (const k of STATE_KEYS) {
      const raw = localStorage.getItem(k);
      if (raw != null) snap[k] = raw;
    }
    return snap;
  }

  function writeLocalSnapshot(snap) {
    if (!snap || typeof snap !== 'object') return;
    for (const k of STATE_KEYS) {
      if (k in snap && snap[k] != null) {
        localStorage.setItem(k, snap[k]);
      }
    }
  }

  async function hydrateFromRemoteIfNewer() {
    if (!client || !currentUser) return;
    const remote = await loadPlan();
    if (!remote || !remote.state_json) return;
    const remoteAt = remote.updated_at ? new Date(remote.updated_at).getTime() : 0;
    const localAtRaw = localStorage.getItem(LOCAL_UPDATED_AT);
    const localAt = localAtRaw ? new Date(localAtRaw).getTime() : 0;
    if (remoteAt <= localAt) return;
    try {
      const parsed = JSON.parse(remote.state_json);
      writeLocalSnapshot(parsed);
      localStorage.setItem(LOCAL_UPDATED_AT, remote.updated_at || new Date().toISOString());
      window.dispatchEvent(new CustomEvent('efterplan:remote-hydrated', { detail: parsed }));
    } catch (_) { /* ignore malformed remote JSON */ }
  }

  async function signInWithMagicLink(email) {
    await initSupabase();
    if (!client) throw new Error('Supabase är inte konfigurerad');
    return client.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/' },
    });
  }

  async function signOut() {
    if (!client) return;
    await client.auth.signOut();
    currentUser = null;
    fireAuthChanged();
  }

  async function getCurrentUser() {
    await initSupabase();
    if (!client) return null;
    if (currentUser) return currentUser;
    const { data } = await client.auth.getUser();
    currentUser = data && data.user ? data.user : null;
    return currentUser;
  }

  async function savePlan(stateJson) {
    await initSupabase();
    if (!client || !currentUser) return null;
    const payload = typeof stateJson === 'string' ? stateJson : JSON.stringify(stateJson);
    const { data, error } = await client
      .from('plans')
      .upsert({ user_id: currentUser.id, state_json: payload }, { onConflict: 'user_id' })
      .select('id, updated_at')
      .single();
    if (error) { console.warn('[efterplan] savePlan', error); return null; }
    if (data && data.updated_at) {
      localStorage.setItem(LOCAL_UPDATED_AT, data.updated_at);
    }
    await syncTaskCompletions(data && data.id, stateJson);
    return data;
  }

  async function syncTaskCompletions(planId, stateJson) {
    if (!client || !planId) return;
    let tasksMap = {};
    try {
      const source = typeof stateJson === 'string' ? JSON.parse(stateJson) : stateJson;
      const raw = source && source.efterplan_tasks;
      tasksMap = raw ? JSON.parse(raw) : {};
    } catch (_) { return; }
    const completed = Object.keys(tasksMap).filter(k => {
      const v = tasksMap[k];
      return v === true || (v && typeof v === 'object' && v.done === true);
    });
    const { data: existing } = await client
      .from('task_completions')
      .select('task_id')
      .eq('plan_id', planId);
    const existingIds = new Set((existing || []).map(r => r.task_id));
    const toInsert = completed
      .filter(id => !existingIds.has(id))
      .map(task_id => ({ plan_id: planId, task_id }));
    const toDelete = [...existingIds].filter(id => !completed.includes(id));
    if (toInsert.length) {
      await client.from('task_completions').insert(toInsert);
    }
    if (toDelete.length) {
      await client.from('task_completions')
        .delete()
        .eq('plan_id', planId)
        .in('task_id', toDelete);
    }
  }

  async function loadPlan() {
    await initSupabase();
    if (!client || !currentUser) return null;
    const { data, error } = await client
      .from('plans')
      .select('id, state_json, updated_at')
      .eq('user_id', currentUser.id)
      .maybeSingle();
    if (error) { console.warn('[efterplan] loadPlan', error); return null; }
    return data;
  }

  async function createShareToken(kind) {
    await initSupabase();
    if (!client || !currentUser) throw new Error('Inte inloggad');
    const k = kind === 'edit' ? 'edit' : 'read';
    const plan = await loadPlan();
    const pid = plan && plan.id;
    if (!pid) throw new Error('Ingen plan att dela');
    // Reactivate an existing token of this kind if present, so users don't
    // accumulate dead tokens when they toggle sharing on/off.
    const { data: existing } = await client
      .from('share_tokens')
      .select('token, active')
      .eq('plan_id', pid)
      .eq('kind', k)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing) {
      if (!existing.active) {
        await client.from('share_tokens').update({ active: true }).eq('token', existing.token);
      }
      return existing.token;
    }
    const { data, error } = await client
      .from('share_tokens')
      .insert({ plan_id: pid, kind: k })
      .select('token')
      .single();
    if (error) throw error;
    return data.token;
  }

  async function revokeShareToken(token) {
    await initSupabase();
    if (!client) return;
    await client.from('share_tokens').update({ active: false }).eq('token', token);
  }

  async function getActiveShareTokens() {
    await initSupabase();
    const out = { read: null, edit: null };
    if (!client || !currentUser) return out;
    const plan = await loadPlan();
    if (!plan) return out;
    const { data } = await client
      .from('share_tokens')
      .select('token, kind')
      .eq('plan_id', plan.id)
      .eq('active', true);
    (data || []).forEach(r => {
      if (r.kind === 'read' || r.kind === 'edit') out[r.kind] = r.token;
    });
    return out;
  }

  async function getSharedPlan(token) {
    await initSupabase();
    if (!client) return null;
    const { data, error } = await client.rpc('get_shared_plan', { token_in: token });
    if (error) { console.warn('[efterplan] getSharedPlan', error); return null; }
    if (!data) return null;
    // RPC returns { state_json, kind, plan_id }. state_json is a JSON-encoded
    // object whose values may themselves be JSON strings (e.g. efterplan_tasks).
    return {
      state_json: data.state_json || null,
      kind: data.kind || 'read',
      plan_id: data.plan_id || null,
    };
  }

  async function toggleSharedTask(token, taskId, done) {
    await initSupabase();
    if (!client) throw new Error('Supabase inte konfigurerad');
    const { data, error } = await client.rpc('toggle_shared_task', {
      token_in: token,
      task_id_in: taskId,
      done_in: !!done,
    });
    if (error) throw error;
    return data;
  }

  function syncToSupabase() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      syncTimer = null;
      if (!client || !currentUser) return;
      const snap = readLocalSnapshot();
      await savePlan(snap);
    }, 2000);
  }

  function detectSharedFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share');
    if (!token) return;
    initSupabase().then(() => getSharedPlan(token)).then(data => {
      if (!data || !data.state_json) return;
      const payload = {
        state: data.state_json,
        kind: data.kind || 'read',
        token: token,
        plan_id: data.plan_id || null,
      };
      window.__efterplanShared = payload;
      // Legacy alias (pre-edit-mode consumers).
      window.__efterplanSharedState = data.state_json;
      window.dispatchEvent(new CustomEvent('efterplan:shared-loaded', { detail: payload }));
    }).catch(() => { /* swallow */ });
  }

  // Public API
  window.efterplanAuth = {
    initSupabase,
    signInWithMagicLink,
    signOut,
    getCurrentUser,
    savePlan,
    loadPlan,
    createShareToken,
    revokeShareToken,
    getActiveShareTokens,
    getSharedPlan,
    toggleSharedTask,
    syncToSupabase,
    isConfigured,
  };

  window.addEventListener('efterplan:state-changed', syncToSupabase);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initSupabase(); detectSharedFromUrl(); });
  } else {
    initSupabase(); detectSharedFromUrl();
  }
})();
