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
   (crée la table `device_sessions` + policies).
2. **Supabase → Settings → API** : copier la `Project URL` et la clé `anon public`.
3. Les coller en haut de [`session-tracker.js`](session-tracker.js)
   (variables `SUPABASE_URL` et `SUPABASE_ANON_KEY`), puis pousser sur GitHub —
   Vercel redéploie automatiquement.

Tant que la configuration n'est pas faite, le site fonctionne normalement :
le tracker se désactive tout seul et la page Appareils affiche les instructions.

### Fonctionnement

- `session-tracker.js` est inclus sur toutes les pages. Il synchronise la session
  entre `sessionStorage` et `localStorage`, enregistre l'appareil (identifiant
  unique stocké en local) et envoie un battement de cœur (`last_seen`) toutes
  les 60 secondes.
- La révocation à distance passe par la colonne `revoked` : au battement de cœur
  suivant, l'appareil révoqué efface sa session locale et retourne à l'accueil.
- Aucune donnée sensible n'est stockée dans Supabase (ni token, ni mot de passe) —
  uniquement email, navigateur, OS, type d'appareil et horodatages.
