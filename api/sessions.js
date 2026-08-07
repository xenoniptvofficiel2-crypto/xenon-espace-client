/* ═══════════════════════════════════════════════════════════════
   XENON TV — API sessions multi-appareils (fonction Vercel)
   Proxy sécurisé vers Supabase : la clé service_role reste côté
   serveur, aucune clé Supabase n'est exposée dans le navigateur.

   Variables d'environnement à définir dans Vercel
   (Project → Settings → Environment Variables) :
     - SUPABASE_URL               ex: https://xxxx.supabase.co
     - SUPABASE_SERVICE_ROLE_KEY  (Supabase → Settings → API → service_role)
   ═══════════════════════════════════════════════════════════════ */

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const AUTH_BACKEND = process.env.SESSION_AUTH_BACKEND || 'https://accesxtv-backend.vercel.app';
const TABLE = 'device_sessions';

const LIST_COLUMNS = 'device_id,email,browser,os,device_type,page,first_seen,last_seen,revoked';

/* Cache mémoire best-effort des validations de token (5 min) */
const tokenCache = new Map();
const TOKEN_TTL = 5 * 60 * 1000;

/* Extrait l'email propriétaire du token depuis la réponse du backend
   d'authentification. On teste plusieurs emplacements possibles pour
   rester compatible avec la forme exacte de /api/subscription. */
function extractEmail(d) {
  if (!d || typeof d !== 'object') return '';
  var candidates = [
    d.email, d.user_email, d.account_email,
    d.user && d.user.email,
    Array.isArray(d.subscriptions) && d.subscriptions[0] && d.subscriptions[0].email
  ];
  for (var i = 0; i < candidates.length; i++) {
    var e = (candidates[i] || '').toString().toLowerCase().trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return e;
  }
  return '';
}

/* Valide le token de session auprès du backend d'authentification et
   renvoie l'IDENTITÉ liée au token (jamais l'email fourni par le client).
   Retour : { verdict, email }
     - verdict 'ok'      → token valide, `email` = propriétaire du token
     - verdict 'bad'     → token refusé
     - verdict 'unknown' → backend injoignable (on ne déconnecte pas)
   Sécurité : c'est cet `email`, et lui seul, qui sert à scoper toutes
   les opérations. L'email du corps de requête n'est jamais utilisé pour
   l'autorisation (sinon un abonné pourrait cibler le compte d'un autre). */
async function validateToken(token) {
  if (!token || token.length > 500) return { verdict: 'bad', email: '' };
  const hit = tokenCache.get(token);
  if (hit && hit.exp > Date.now()) return { verdict: hit.verdict, email: hit.email };
  let verdict = 'unknown', email = '';
  try {
    const r = await fetch(AUTH_BACKEND + '/api/subscription', {
      headers: { 'X-Session-Token': token },
      cache: 'no-store'
    });
    if (r.status === 401 || r.status === 403) verdict = 'bad';
    else if (r.ok) {
      const d = await r.json().catch(() => null);
      if (d && d.success) { verdict = 'ok'; email = extractEmail(d); }
      else verdict = 'bad';
    }
  } catch (e) { /* backend injoignable → unknown */ }
  if (verdict !== 'unknown') {
    if (tokenCache.size > 1000) tokenCache.clear();
    tokenCache.set(token, { verdict, email, exp: Date.now() + TOKEN_TTL });
  }
  return { verdict, email };
}

function sb(method, query, body, prefer) {
  const headers = {
    apikey: SERVICE_KEY,
    Authorization: 'Bearer ' + SERVICE_KEY,
    'Content-Type': 'application/json'
  };
  if (prefer) headers.Prefer = prefer;
  return fetch(SUPABASE_URL + '/rest/v1/' + TABLE + query, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
}

const clip = (v, n) => String(v == null ? '' : v).slice(0, n);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  if (!SUPABASE_URL || !SERVICE_KEY) {
    // Pas encore configuré : le front se désactive proprement
    res.status(501).json({ error: 'not_configured' });
    return;
  }

  const auth = await validateToken(req.headers['x-session-token'] || '');
  if (auth.verdict === 'bad') { res.status(401).json({ error: 'invalid_session' }); return; }
  if (auth.verdict === 'unknown') { res.status(503).json({ error: 'auth_unavailable' }); return; }

  // Identité = email lié au TOKEN (source de vérité), jamais l'email du corps.
  // Si le backend n'a pas fourni d'email vérifiable, on refuse plutôt que
  // de risquer un accès inter-comptes (fail closed).
  const email = auth.email;
  if (!email) { res.status(403).json({ error: 'identity_unavailable' }); return; }

  const b = (typeof req.body === 'object' && req.body) || {};
  const action = clip(b.action, 30);
  // device_id restreint à un charset sûr (défense en profondeur côté rendu)
  const deviceId = clip(b.device_id, 100).replace(/[^A-Za-z0-9_-]/g, '');

  try {
    if (action === 'register') {
      if (!deviceId) { res.status(400).json({ error: 'missing_device_id' }); return; }
      const r = await sb('POST', '?on_conflict=device_id', {
        device_id: deviceId,
        email,
        browser: clip(b.browser, 60),
        os: clip(b.os, 60),
        device_type: clip(b.device_type, 30),
        user_agent: clip(b.user_agent, 500),
        page: clip(b.page, 200),
        last_seen: new Date().toISOString(),
        revoked: false
      }, 'resolution=merge-duplicates');
      res.status(r.ok ? 200 : 502).json({ ok: r.ok });

    } else if (action === 'heartbeat') {
      if (!deviceId) { res.status(400).json({ error: 'missing_device_id' }); return; }
      const r = await sb('PATCH',
        '?device_id=eq.' + encodeURIComponent(deviceId) +
        '&email=eq.' + encodeURIComponent(email) + '&select=revoked',
        { last_seen: new Date().toISOString(), page: clip(b.page, 200) },
        'return=representation');
      const rows = r.ok ? await r.json().catch(() => []) : [];
      res.status(200).json({ ok: r.ok, revoked: !!(rows[0] && rows[0].revoked), known: rows.length > 0 });

    } else if (action === 'list') {
      const r = await sb('GET',
        '?email=eq.' + encodeURIComponent(email) +
        '&revoked=eq.false&order=last_seen.desc&select=' + LIST_COLUMNS);
      if (!r.ok) { res.status(502).json({ error: 'supabase_error' }); return; }
      res.status(200).json({ ok: true, devices: await r.json() });

    } else if (action === 'revoke') {
      if (!deviceId) { res.status(400).json({ error: 'missing_device_id' }); return; }
      // Scopé sur l'email : on ne peut révoquer que les appareils de son propre compte
      const r = await sb('PATCH',
        '?device_id=eq.' + encodeURIComponent(deviceId) +
        '&email=eq.' + encodeURIComponent(email),
        { revoked: true, last_seen: new Date().toISOString() });
      res.status(r.ok ? 200 : 502).json({ ok: r.ok });

    } else if (action === 'revoke_others') {
      if (!deviceId) { res.status(400).json({ error: 'missing_device_id' }); return; }
      const r = await sb('PATCH',
        '?email=eq.' + encodeURIComponent(email) +
        '&device_id=neq.' + encodeURIComponent(deviceId),
        { revoked: true });
      res.status(r.ok ? 200 : 502).json({ ok: r.ok });

    } else {
      res.status(400).json({ error: 'unknown_action' });
    }
  } catch (e) {
    res.status(502).json({ error: 'upstream_error' });
  }
};
