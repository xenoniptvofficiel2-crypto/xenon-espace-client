/* ═══════════════════════════════════════════════════════════════
   XENON TV — Suivi de session multi-appareils
   Inclure sur chaque page :  <script src="/session-tracker.js"></script>
   (avant les autres scripts de la page)

   Aucune clé Supabase ici : tous les appels passent par la fonction
   serverless /api/sessions (voir api/sessions.js), qui valide le
   token de session et utilise la clé service_role côté serveur.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var API = '/api/sessions';
  var HEARTBEAT_MS = 60 * 1000; // maj "dernière activité" toutes les 60 s

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

  /* ── Appel de l'API sessions ──
     Résout {status, data} ; ne rejette jamais (status 0 = réseau). */
  function api(action, extra) {
    var payload = Object.assign({
      action: action,
      email: getEmail().toLowerCase(),
      device_id: getDeviceId()
    }, extra || {});
    return fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': getToken()
      },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        return { status: r.status, data: d };
      });
    }, function () { return { status: 0, data: null }; });
  }

  /* Déconnexion locale (efface la session de cet appareil) */
  function clearLocal() {
    KEYS.forEach(function (k) {
      try { sessionStorage.removeItem(k); } catch (e) {}
      try { localStorage.removeItem(k); } catch (e) {}
    });
  }

  /* Déconnexion complète : marque cet appareil révoqué + efface localement */
  function logout(redirect) {
    var done = function () {
      clearLocal();
      window.location.href = (redirect === undefined) ? 'index.html' : redirect;
    };
    if (!getEmail()) { done(); return; }
    api('revoke').then(done, done);
  }

  /* Battement de cœur : maj last_seen + détecte une révocation faite
     depuis un autre appareil → déconnexion à distance */
  var disabled = false;
  var timer = null;

  function handleResult(res) {
    if (!res) return;
    if (res.status === 501) {           // API pas encore configurée (env vars Vercel)
      disabled = true;
      clearInterval(timer);
    } else if (res.status === 401) {    // token de session invalide/expiré
      clearInterval(timer);
      clearLocal();
      window.location.href = 'index.html';
    } else if (res.status === 200 && res.data && res.data.revoked === true) {
      clearInterval(timer);             // révoqué depuis un autre appareil
      clearLocal();
      window.location.href = 'index.html';
    }
    // 503 / 0 : backend momentanément injoignable → on ne déconnecte pas
  }

  function heartbeat() {
    if (disabled || !getEmail()) return;
    api('heartbeat', { page: window.location.pathname }).then(function (res) {
      // Appareil inconnu (ligne purgée ?) → on le ré-enregistre
      if (res.status === 200 && res.data && res.data.known === false) {
        var d = detect();
        api('register', {
          browser: d.browser, os: d.os, device_type: d.type,
          user_agent: d.ua, page: window.location.pathname
        });
        return;
      }
      handleResult(res);
    });
  }

  /* ── Démarrage ── */
  function start() {
    if (!getEmail() || !getToken()) return;
    var d = detect();
    api('register', {
      browser: d.browser, os: d.os, device_type: d.type,
      user_agent: d.ua, page: window.location.pathname
    }).then(function (res) {
      handleResult(res);
      if (!disabled && res.status !== 401) {
        clearInterval(timer);
        timer = setInterval(heartbeat, HEARTBEAT_MS);
      }
    });
  }

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') heartbeat();
  });

  /* API publique utilisée par les pages */
  window.XenonSession = {
    heartbeatMs: HEARTBEAT_MS,
    getEmail: getEmail,
    getToken: getToken,
    getDeviceId: getDeviceId,
    detect: detect,
    api: api,
    logout: logout,
    clearLocal: clearLocal
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
