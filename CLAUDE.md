# CLAUDE.md — xenon-espace-client

> Fichier de référence chargé automatiquement par Claude Code au démarrage de
> chaque session. Il décrit les pages, le flux d'authentification, la sécurité
> et le déploiement du **frontend statique** de l'espace abonné **XENON TV**.
> L'API associée est le repo **`accesxtv-backend`**.
>
> Reconstruit à partir d'un audit intégral du code (aucun `CLAUDE.md`
> n'existait auparavant). **Le code fait foi ; ce document doit suivre.**

---

## 1. Architecture

Site **100 % statique** (HTML/CSS/JS inline, aucun build, aucune dépendance
npm). Chaque page est un fichier `.html` autonome. Toute la logique métier
sensible vit dans le backend ; le front ne fait qu'appeler l'API.

- **Backend appelé :** `https://accesxtv-backend.vercel.app`
- **Domaines de production :** `espace-abonne-xenontv.fr` (+ `www`),
  `xenon-tv.cc` (+ `www`), `xenon-espace-client.vercel.app`.
- **Hébergement :** Vercel (`vercel.json` : `cleanUrls`, rewrite `/demande`).

### Session côté client (`sessionStorage`)
Après un login OTP réussi, `index.html` stocke :
- `xenon_user_email` — l'email du client.
- `xenon_session_token` — le token signé HMAC émis par le backend.

Chaque page protégée vérifie leur présence au chargement et redirige vers
`index.html` sinon. Le token est envoyé au backend via l'en-tête
`X-Session-Token`.

---

## 2. Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil + **login OTP** (envoi code, saisie 6 chiffres, redirection dashboard). Aperçu catalogue TMDB. |
| `xenontv-dashboard.html` | Tableau de bord : statut d'abonnement + navigation. |
| `xenontv-identifiants-v2.html` | Récupération des identifiants IPTV (URL, username, password, M3U) via `/api/proxy`. Les **domaines d'affichage** (URL Android/iOS + M3U, base Samsung/LG, alternatives « Réparer ») sont chargés depuis `/api/domains` (tirage serveur), avec repli en dur. |
| `xenontv-abonnement.html` | Détail de l'abonnement via `/api/subscription`. |
| `xenontv-demande.html` | Formulaire ajout/signalement (recherche TMDB) → `/api/demande`. |
| `xenontv-nouveautes.html` | Catalogue nouveautés (TMDB + VOD via `/api/tmdb` et `/api/vod`). |
| `xenontv-programme.html` | Guide TV (EPG) via `/api/epg`. |
| `xenontv-bug.html` | Signalement de bug (appelle `/api/proxy`). |
| `robots.txt` | `User-agent: * / Disallow: /` (non-indexation). |
| `vercel.json` | `cleanUrls`, `trailingSlash:false`, rewrite `/demande` → `xenontv-demande.html`. |

> Navigation en **URLs propres** (`cleanUrls`) : on lie `xenontv-dashboard`
> (sans `.html`).

---

## 3. Flux d'authentification (OTP)

1. `index.html` → `sendCode()` : `GET /api/sendcode?email=…`. Le backend vérifie
   que l'email correspond à un client (Gmail), envoie un code à 6 chiffres par
   email (Resend) et renvoie un `codeToken` **signé** (le code n'est pas stocké
   côté serveur — OTP *stateless*).
2. `verifyCode()` : `GET /api/sendcode?email=…&code=…&codeToken=…`. Si valide,
   le backend renvoie `{ token, email }`.
3. Le token + l'email sont mis en `sessionStorage`, puis redirection vers
   `xenontv-dashboard`.
4. Les pages protégées envoient `X-Session-Token: <token>` à chaque appel. Un
   `401` → `sessionStorage.clear()` + retour à `index.html`.

---

## 4. Sécurité (rappel — règles complètes dans `accesxtv-backend/CLAUDE.md` §2)

Points qui concernent **directement le front** :

- **Aucun secret dans le front.** `TMDB_TOKEN` est vidé (`index.html:1474`,
  `dashboard` `TK=""`) : la clé TMDB vit côté serveur derrière `/api/tmdb`.
- **Échappement anti-XSS** obligatoire pour toute donnée dynamique injectée en
  `innerHTML`. Utiliser un helper d'échappement (`escHtml`/`esc`) :
  - ✅ fait pour username/password (`identifiants-v2.html:646,658`), titres TMDB
    (`demande.html:791`).
  - ⚠️ **écart connu :** `programme.html` injecte les titres/desc EPG (source
    externe xmltvfr.fr) sans échappement via `hl()` (`programme.html:457`) ;
    `abonnement.html:328,352` injecte `sub.username` brut. À corriger.
- **Non-indexation (`noindex`) :** `robots.txt` fait `Disallow: /` mais **aucune
  page n'a de `<meta name="robots" content="noindex">`**. ⚠️ Un `Disallow`
  n'empêche pas l'indexation d'une page liée ailleurs → ajouter le meta
  `noindex` (ou l'en-tête `X-Robots-Tag`) sur **toutes** les pages.
- Le token de session transite en en-tête `X-Session-Token` (à privilégier sur
  le repli `?token=` accepté par le backend).

---

## 5. Déploiement (Vercel)

- **Statique** : aucun build. `git push` sur le repo connecté à Vercel →
  redéploiement automatique (**à confirmer** que l'intégration Git est active).
- **Domaines** : configurés dans Vercel (voir liste §1). Le backend n'autorise
  (CORS) que ces origines — **toute nouvelle origine doit être ajoutée à la
  whitelist `ALLOWED_ORIGINS` dans chaque endpoint backend concerné.**
- **`robots.txt`** sert la non-indexation ; ne pas le retirer.

---

## 6. Conventions

- **Langue :** interface et messages en français.
- **Pas de framework, pas de build** : HTML/CSS/JS inline, cohérent d'une page à
  l'autre (thème sombre, rouge `#dc1e3c`).
- **Toujours échapper** les données affichées provenant de l'API ou de sources
  externes (TMDB, EPG, Xtream).
- **Modifier ce fichier** dès qu'une page, un flux ou un appel API change.
