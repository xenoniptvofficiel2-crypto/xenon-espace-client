# xenon-espace-client

Espace abonné XENON TV — site statique déployé sur Vercel.
Backend associé : [`accesxtv-backend`](https://github.com/xenoniptvofficiel2-crypto/accesxtv-backend).

## Suivi de session multi-appareils

La session est **persistante** (elle survit à la fermeture du navigateur) et
**suivie sur tous les appareils**. Chaque appareil connecté à l'espace abonné
est enregistré avec son navigateur, son OS, sa dernière activité et la page
visitée. La page **« Mes appareils connectés »** (`/xenontv-appareils`,
accessible depuis le dashboard) permet de :

- voir tous les appareils connectés au compte (en ligne / hors ligne, temps réel) ;
- voir la dernière activité et la page visitée de chaque appareil ;
- **déconnecter à distance** un appareil (ou tous les autres d'un coup) —
  l'appareil révoqué est déconnecté automatiquement en moins d'une minute.

### Architecture & sécurité

Toute la logique sensible vit **dans le backend** (`accesxtv-backend`), jamais
dans le navigateur :

- Le client (`session-tracker.js`) appelle uniquement
  `https://accesxtv-backend.vercel.app/api/sessions`.
- **Aucune clé Supabase côté navigateur.** Le backend accède à Supabase avec sa
  clé `service_role` (variable d'environnement).
- **L'identité (email) est extraite du token de session signé** (HMAC
  `COOKIE_SECRET`), jamais du corps de la requête. Un abonné ne peut donc agir
  que sur **son propre** compte (pas d'accès inter-comptes).
- Le endpoint applique la même **allowlist d'Origin** que les autres endpoints
  du backend et bloque toute requête sans `Origin`.
- Le `device_id` est restreint à `[A-Za-z0-9_-]` et unique **par compte**
  (`UNIQUE(email, device_id)`), et la page « Appareils » ne l'injecte jamais
  dans du code (attribut `data-*` + `addEventListener`) — pas de XSS possible.

### Mise en service

Côté **backend** (`accesxtv-backend`) — voir son README/CLAUDE.md :

1. **Supabase → SQL Editor** : exécuter `device_sessions.sql` (crée la table,
   verrouillée par RLS).
2. Les variables `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` et `COOKIE_SECRET` sont
   **déjà utilisées** par le backend — rien à ajouter.
3. Ajouter le domaine de production de l'espace abonné à `ALLOWED_ORIGINS` dans
   `api/sessions.js` s'il n'y figure pas encore, puis redéployer.

Côté **front** (ce repo) : rien à configurer. Tant que la table n'existe pas,
le tracker se désactive proprement et la page Appareils affiche un message.

### Fonctionnement

- `session-tracker.js` est inclus sur toutes les pages. Il synchronise la session
  entre `sessionStorage` et `localStorage`, enregistre l'appareil (identifiant
  unique stocké en local) et envoie un battement de cœur (`last_seen`) toutes
  les 60 secondes.
- La révocation à distance passe par la colonne `revoked` : au battement de cœur
  suivant, l'appareil révoqué efface sa session locale et retourne à l'accueil.
- Aucune donnée sensible n'est stockée (ni token, ni mot de passe) — uniquement
  email, navigateur, OS, type d'appareil et horodatages.
