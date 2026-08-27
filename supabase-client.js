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
  let documentsSyncTimer = null;
  const uploadedDocIds = new Set(); // T147: undvik att ladda upp samma foto flera gånger per session

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
        if (currentUser) {
          hydrateFromRemoteIfNewer();
          hydrateDocumentsFromRemote();
        }
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
      await hydrateDocumentsFromRemote();
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

  function syncToSupabase() {
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(async () => {
      syncTimer = null;
      if (!client || !currentUser) return;
      const snap = readLocalSnapshot();
      await savePlan(snap);
    }, 2000);
  }

  // ── T147: Arkiv-dokument-synk (Storage + documents-tabell) ──────
  // localStorage (state.documents, med base64-foton) förblir source-of-truth
  // för icke-inloggade/offline, exakt som planen redan fungerar. Inloggade
  // användare får dessutom en synk hit: fotot laddas upp som binär blob till
  // Storage-bucketen 'documents', bara metadata + sökväg går i Postgres.
  function dataUrlToBlob(dataUrl) {
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = /data:([^;]+);base64/.exec(header || '');
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  async function uploadDocumentPhoto(clientId, dataUrl) {
    const path = `${currentUser.id}/${clientId}.jpg`;
    const blob = dataUrlToBlob(dataUrl);
    const { error } = await client.storage.from('documents')
      .upload(path, blob, { upsert: true, contentType: blob.type || 'image/jpeg' });
    if (error) { console.warn('[efterplan] uploadDocumentPhoto', error); return null; }
    return path;
  }

  function syncDocumentsToSupabase(documents) {
    if (documentsSyncTimer) clearTimeout(documentsSyncTimer);
    documentsSyncTimer = setTimeout(async () => {
      documentsSyncTimer = null;
      if (!client || !currentUser || !Array.isArray(documents)) return;
      for (const doc of documents) {
        if (!doc || !doc.id) continue;
        let storagePath = doc._storagePath || null;
        // Bara ladda upp binärdatan en gång per session/foto — base64:an ändras
        // aldrig efter att dokumentet skapats, bara metadata (namn, flagga) gör.
        if (doc.photo && typeof doc.photo === 'string' && doc.photo.startsWith('data:') && !uploadedDocIds.has(doc.id)) {
          const uploaded = await uploadDocumentPhoto(doc.id, doc.photo);
          if (uploaded) { storagePath = uploaded; uploadedDocIds.add(doc.id); }
        }
        const { error } = await client.from('documents').upsert({
          user_id: currentUser.id,
          client_id: doc.id,
          name: doc.name || '',
          category: doc.category || 'Övrigt',
          doc_date: doc.date || null,
          flag: doc.flag || null,
          image_hash: doc.imageHash || null,
          storage_path: storagePath,
        }, { onConflict: 'user_id,client_id' });
        if (error) console.warn('[efterplan] syncDocumentsToSupabase', error);
      }
    }, 2000);
  }

  // T147: explicit borttagning (inte en diff mot hela listan — en diff hade
  // kunnat råka radera dokument som bara ännu inte hunnit hydreras ner på en
  // ny enhet, om en synk triggas innan hydrateDocumentsFromRemote() är klar).
  // deleteDocument() i app.js skickar det här eventet direkt vid borttagning.
  async function deleteRemoteDocument(clientId) {
    if (!client || !currentUser || !clientId) return;
    const { data: row } = await client
      .from('documents')
      .select('storage_path')
      .eq('user_id', currentUser.id)
      .eq('client_id', clientId)
      .maybeSingle();
    if (row && row.storage_path) {
      const { error: rmErr } = await client.storage.from('documents').remove([row.storage_path]);
      if (rmErr) console.warn('[efterplan] deleteRemoteDocument storage', rmErr);
    }
    const { error: delErr } = await client.from('documents')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('client_id', clientId);
    if (delErr) console.warn('[efterplan] deleteRemoteDocument', delErr);
    uploadedDocIds.delete(clientId);
  }

  async function hydrateDocumentsFromRemote() {
    if (!client || !currentUser) return;
    const { data, error } = await client
      .from('documents')
      .select('client_id, name, category, doc_date, flag, image_hash, storage_path')
      .eq('user_id', currentUser.id);
    if (error) { console.warn('[efterplan] hydrateDocumentsFromRemote', error); return; }
    if (!data || !data.length) return;

    let local = [];
    try { local = JSON.parse(localStorage.getItem('efterplan_documents') || '[]') || []; } catch (_) { local = []; }
    const localIds = new Set(local.map(d => d.id));
    const missing = data.filter(row => !localIds.has(row.client_id));
    if (!missing.length) return;

    const added = [];
    for (const row of missing) {
      let photo = null;
      if (row.storage_path) {
        const { data: signed } = await client.storage.from('documents')
          .createSignedUrl(row.storage_path, 60 * 60 * 24); // 24h — tillräckligt för en session, förnyas vid nästa inloggning
        photo = signed ? signed.signedUrl : null;
      }
      added.push({
        id: row.client_id,
        name: row.name || '',
        category: row.category || 'Övrigt',
        date: row.doc_date || '',
        flag: row.flag || null,
        photo,
        imageHash: row.image_hash || null,
        _storagePath: row.storage_path || null, // undviker onödig re-upload av redan synkade foton
      });
    }
    if (!added.length) return;
    localStorage.setItem('efterplan_documents', JSON.stringify([...local, ...added]));
    window.dispatchEvent(new CustomEvent('efterplan:documents-hydrated', { detail: added }));
  }

  // ── T177: zero-knowledge delning ────────────────
  // Servern lagrar bara krypterad text (AES-GCM). Nyckeln finns aldrig i en
  // request till Supabase — den stannar i URL-fragmentet (#k=...), som
  // webbläsare aldrig skickar över nätverket. Se supabase/schema.sql.
  function bufToBase64url(buf) {
    let bin = '';
    new Uint8Array(buf).forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function base64urlToBuf(str) {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  }

  async function createSharedLink(plainObj) {
    await initSupabase();
    if (!client) throw new Error('Supabase är inte konfigurerad');
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = new TextEncoder().encode(JSON.stringify(plainObj));
    const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
    const rawKey = await crypto.subtle.exportKey('raw', key);

    const { data, error } = await client.rpc('create_shared_plan', {
      ciphertext_in: bufToBase64url(cipherBuf),
      iv_in: bufToBase64url(iv.buffer),
    });
    if (error) throw error;

    const keyStr = bufToBase64url(rawKey);
    return `${window.location.origin}/?shared=${data}#k=${keyStr}`;
  }

  async function resolveSharedLink(id, keyStr) {
    await initSupabase();
    if (!client) throw new Error('Supabase är inte konfigurerad');
    const { data, error } = await client.rpc('get_shared_plan_v2', { id_in: id });
    if (error || !data) throw (error || new Error('Länken hittades inte'));

    const rawKey = base64urlToBuf(keyStr);
    const key = await crypto.subtle.importKey('raw', rawKey, { name: 'AES-GCM' }, false, ['decrypt']);
    const iv = new Uint8Array(base64urlToBuf(data.iv));
    const cipherBuf = base64urlToBuf(data.ciphertext);
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipherBuf);
    return JSON.parse(new TextDecoder().decode(plainBuf));
  }

  // ── T178: samtycke till deadline-påminnelser (insamling, inget utskick än) ──
  async function subscribeReminder(email, deathDate, types) {
    const r = await fetch('/api/subscribe-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, deathDate, types }),
    });
    if (!r.ok) throw new Error('subscribe_failed');
    return r.json();
  }

  // Public API
  window.efterplanAuth = {
    initSupabase,
    signInWithMagicLink,
    signOut,
    getCurrentUser,
    savePlan,
    loadPlan,
    syncToSupabase,
    isConfigured,
    createSharedLink,
    resolveSharedLink,
    subscribeReminder,
    syncDocumentsToSupabase,
    deleteRemoteDocument,
  };

  window.addEventListener('efterplan:state-changed', syncToSupabase);
  // T147: egen event, inte state-changed — dokumentfoton ska INTE gå genom
  // plans.state_json (för stora/oeffektivt), de synkas separat mot Storage.
  window.addEventListener('efterplan:documents-changed', (e) => syncDocumentsToSupabase(e.detail));
  window.addEventListener('efterplan:document-deleted', (e) => deleteRemoteDocument(e.detail));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initSupabase(); });
  } else {
    initSupabase();
  }
})();
