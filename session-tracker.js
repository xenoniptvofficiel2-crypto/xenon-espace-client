/* ═══════════════════════════════════════════════════════════════
   XENON TV — Suivi de session multi-appareils (Supabase)
   Inclure sur chaque page :  <script src="/session-tracker.js"></script>
   (avant les autres scripts de la page)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── CONFIGURATION SUPABASE ──────────────────────────────────
     Dashboard Supabase → Settings → API :
       - Project URL  → SUPABASE_URL
       - anon public  → SUPABASE_ANON_KEY
     Puis exécuter supabase/device_sessions.sql dans le SQL Editor. */
  var SUPABASE_URL = 'https://VOTRE-PROJET.supabase.co';
  var SUPABASE_ANON_KEY = 'VOTRE_CLE_ANON';
  /* ───────────────────────────────────────────────────────────── */

  var TABLE = 'device_sessions';
  var HEARTBEAT_MS = 60 * 1000;        // maj "dernière activité" toutes les 60 s
  var CONFIGURED = SUPABASE_URL.indexOf('VOTRE-PROJET') === -1 &&
                   SUPABASE_ANON_KEY !== 'VOTRE_CLE_ANON';

  /* ── Persistance : synchronise sessionStorage (utilisé par les pages)
     et localStorage (survit à la fermeture du navigateur).
     Résultat : la session reste active sur l'appareil tant qu'on
     ne se déconnecte pas. */
  var KEYS = ['xenon_session_token', 'xenon_user_email'];
  KEYS.forEach(function (k) {
    try {
      var s = sessionStorage.getItem(k), l = localStorage.getItem(k);
      if (s && !l) localStorage.setItem(k, s);
      else if (l && !s) sessionStorage.setItem(k, l);
    } catch (e) {}
  });

  function getEmail() {
    return sessionStorage.getItem('xenon_user_email') || localStorage.getItem('xenon_user_email') || '';
  }
  function getToken() {
    return sessionStorage.getItem('xenon_session_token') || localStorage.getItem('xenon_session_token') || '';
  }

  /* ── Identifiant persistant de CET appareil ── */
  function getDeviceId() {
    var id = null;
    try { id = localStorage.getItem('xenon_device_id'); } catch (e) {}
    if (!id) {
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
         : 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      try { localStorage.setItem('xenon_device_id', id); } catch (e) {}
    }
    return id;
  }

  /* ── Détection appareil / navigateur / OS ── */
  function detect() {
    var ua = navigator.userAgent || '';
    var browser =
      /SamsungBrowser/i.test(ua) ? 'Samsung Internet' :
      /Edg\//i.test(ua)          ? 'Edge' :
      /OPR\/|Opera/i.test(ua)    ? 'Opera' :
      /Firefox/i.test(ua)        ? 'Firefox' :
      /Chrome|CriOS/i.test(ua)   ? 'Chrome' :
      /Safari/i.test(ua)         ? 'Safari' : 'Navigateur';
    var os =
      /Windows/i.test(ua)              ? 'Windows' :
      /iPhone|iPad|iPod/i.test(ua)     ? 'iOS' :
      /Android/i.test(ua)              ? 'Android' :
      /Mac OS X|Macintosh/i.test(ua)   ? 'macOS' :
      /CrOS/i.test(ua)                 ? 'ChromeOS' :
      /Linux/i.test(ua)                ? 'Linux' : 'Inconnu';
    var type =
      /SmartTV|SMART-TV|BRAVIA|GoogleTV|AppleTV|HbbTV|NetCast|Tizen.*TV|Web0S/i.test(ua) ? 'TV' :
      /iPad|Tablet|PlayBook/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))   ? 'Tablette' :
      /Mobi|iPhone|Android/i.test(ua)  ? 'Mobile' : 'Ordinateur';
    return { browser: browser, os: os, type: type, ua: ua.slice(0, 500) };
  }

  /* ── Appels REST Supabase ── */
  function sb(method, query, body, prefer) {
    var headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
      'Content-Type': 'application/json'
    };
    if (prefer) headers['Prefer'] = prefer;
    return fetch(SUPABASE_URL + '/rest/v1/' + TABLE + query, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined
    });
  }

  /* Déconnexion locale (efface la session de cet appareil) */
  function clearLocal() {
    KEYS.forEach(function (k) {
      try { sessionStorage.removeItem(k); } catch (e) {}
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  /* Déconnexion complète : marque la session révoquée côté Supabase + efface localement */
  function logout(redirect) {
    var done = function () {
      clearLocal();
      window.location.href = (redirect === undefined) ? 'index.html' : redirect;
    };
    if (!CONFIGURED) { done(); return; }
    sb('PATCH', '?device_id=eq.' + encodeURIComponent(getDeviceId()),
       { revoked: true, last_seen: new Date().toISOString() })
      .then(done, done);
  }

  /* Enregistre / met à jour cet appareil pour l'email connecté */
  function upsert() {
    var d = detect();
    return sb('POST', '?on_conflict=device_id', {
      device_id: getDeviceId(),
      email: getEmail().toLowerCase(),
      browser: d.browser,
      os: d.os,
      device_type: d.type,
      user_agent: d.ua,
      page: window.location.pathname,
      last_seen: new Date().toISOString(),
      revoked: false
    }, 'resolution=merge-duplicates');
  }

  /* Battement de cœur : maj last_seen + vérifie si la session a été
     révoquée depuis un autre appareil → déconnexion à distance */
  function heartbeat() {
    if (!getEmail()) return;
    sb('PATCH', '?device_id=eq.' + encodeURIComponent(getDeviceId()) + '&select=revoked',
       { last_seen: new Date().toISOString(), page: window.location.pathname },
       'return=representation')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (rows && rows[0] && rows[0].revoked === true) {
          clearLocal();
          window.location.href = 'index.html';
        }
      })
      .catch(function () {});
  }

  /* ── Démarrage ── */
  var timer = null;
  function start() {
    if (!CONFIGURED || !getEmail()) return;
    // Si cet appareil a été révoqué à distance, on le déconnecte avant tout
    sb('GET', '?device_id=eq.' + encodeURIComponent(getDeviceId()) + '&select=revoked')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        if (rows && rows[0] && rows[0].revoked === true && getToken()) {
          // Session révoquée depuis un autre appareil → logout local
          clearLocal();
          window.location.href = 'index.html';
          return;
        }
        upsert().catch(function () {});
        clearInterval(timer);
        timer = setInterval(heartbeat, HEARTBEAT_MS);
      })
      .catch(function () {});
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && CONFIGURED && getEmail()) heartbeat();
  });

  /* API publique utilisée par les pages */
  window.XenonSession = {
    configured: CONFIGURED,
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_ANON_KEY,
    table: TABLE,
    heartbeatMs: HEARTBEAT_MS,
    getEmail: getEmail,
    getToken: getToken,
    getDeviceId: getDeviceId,
    detect: detect,
    logout: logout,
    clearLocal: clearLocal,
    sb: sb
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
