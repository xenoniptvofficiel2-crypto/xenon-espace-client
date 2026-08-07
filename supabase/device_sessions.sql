-- ═══════════════════════════════════════════════════════════════
-- XENON TV — Table de suivi des sessions multi-appareils
-- À exécuter dans Supabase → SQL Editor (une seule fois)
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.device_sessions (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null,
  email       text not null,
  browser     text,
  os          text,
  device_type text,
  user_agent  text,
  page        text,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  revoked     boolean not null default false,
  -- Un device_id est unique PAR COMPTE (pas globalement) : ainsi un
  -- enregistrement ne peut jamais réécrire la ligne d'un autre compte.
  unique (email, device_id)
);

create index if not exists device_sessions_email_idx
  on public.device_sessions (email, last_seen desc);

-- ── Row Level Security : table FERMÉE au public ──
-- RLS activé sans aucune policy : les clés publiques (anon) ne peuvent
-- ni lire ni écrire. Seule la fonction serveur /api/sessions (Vercel),
-- qui utilise la clé service_role (laquelle contourne RLS), accède à
-- la table — après avoir validé le token de session de l'abonné.
alter table public.device_sessions enable row level security;

-- Nettoyage d'anciennes policies si une version précédente les avait créées
drop policy if exists "anon select sessions" on public.device_sessions;
drop policy if exists "anon insert sessions" on public.device_sessions;
drop policy if exists "anon update sessions" on public.device_sessions;

-- ── Nettoyage automatique (optionnel) ──
-- Supprime les sessions inactives depuis plus de 90 jours.
-- Nécessite l'extension pg_cron (Dashboard → Database → Extensions) :
-- select cron.schedule('purge-old-device-sessions', '0 4 * * *',
--   $$delete from public.device_sessions where last_seen < now() - interval '90 days'$$);
