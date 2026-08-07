# xenon-espace-client

Espace abonné XENON TV — site statique déployé sur Vercel.

## Suivi de session multi-appareils (Supabase)

La session est désormais **persistante** (elle survit à la fermeture du navigateur)
et **suivie sur tous les appareils** : chaque appareil connecté à l'espace abonné
est enregistré dans Supabase avec son navigateur, son OS, sa dernière activité et
la page visitée. La page **« Mes appareils connectés »** (`/xenontv-appareils`,
accessible depuis le dashboard) permet de :

- voir tous les appareils connectés au compte (en ligne / hors ligne, temps réel) ;
- voir la dernière activité et la page visitée de chaque appareil ;
- **déconnecter à distance** un appareil (ou tous les autres d'un coup) —
  l'appareil révoqué est déconnecté automatiquement en moins d'une minute.

### Mise en service (3 étapes)

1. **Supabase → SQL Editor** : exécuter le fichier
   [`supabase/device_sessions.sql`](supabase/device_sessions.sql)
   (crée la table `device_sessions`, verrouillée par RLS).
2. **Vercel → Project Settings → Environment Variables** : ajouter
   - `SUPABASE_URL` — la `Project URL` (Supabase → Settings → API) ;
   - `SUPABASE_SERVICE_ROLE_KEY` — la clé `service_role` (même page).
3. Redéployer le projet Vercel. **Aucune clé n'est à mettre dans le code.**

Tant que la configuration n'est pas faite, le site fonctionne normalement :
le tracker se désactive tout seul et la page Appareils affiche les instructions.

### Architecture & sécurité

- **Aucune clé Supabase côté navigateur.** Le client (`session-tracker.js`)
  appelle uniquement la fonction serverless [`api/sessions.js`](api/sessions.js)
  du même déploiement Vercel.
- Cette fonction **valide le token de session** (`X-Session-Token`) auprès du
  backend d'authentification existant (`accesxtv-backend`) avant toute
  opération, puis accède à Supabase avec la clé `service_role` (variable
  d'environnement, jamais dans le code).
- La table est **fermée au public** : RLS activé sans policy — la clé `anon`
  ne peut ni lire ni écrire. Impossible de lister les emails ou de révoquer
  les appareils d'autrui depuis l'extérieur ; toutes les requêtes sont
  scopées à l'email du compte authentifié.
- `session-tracker.js` est inclus sur toutes les pages. Il synchronise la session
  entre `sessionStorage` et `localStorage`, enregistre l'appareil (identifiant
  unique stocké en local) et envoie un battement de cœur (`last_seen`) toutes
  les 60 secondes.
- La révocation à distance passe par la colonne `revoked` : au battement de cœur
  suivant, l'appareil révoqué efface sa session locale et retourne à l'accueil.
- Aucune donnée sensible n'est stockée dans Supabase (ni token, ni mot de passe) —
  uniquement email, navigateur, OS, type d'appareil et horodatages.
