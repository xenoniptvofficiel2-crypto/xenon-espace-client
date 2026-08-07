-- ═══════════════════════════════════════════════════════════════
-- XENON TV — Table de suivi des sessions multi-appareils
-- À exécuter dans Supabase → SQL Editor (une seule fois)
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.device_sessions (
  id          uuid primary key default gen_random_uuid(),
  device_id   text not null unique,
  email       text not null,
  browser     text,
  os          text,
  device_type text,
  user_agent  text,
  page        text,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  revoked     boolean not null default false
);

create index if not exists device_sessions_email_idx
  on public.device_sessions (email, last_seen desc);

-- ── Row Level Security ──
-- NOTE : le site n'utilise pas Supabase Auth (login OTP maison via le
-- backend Vercel), donc les policies autorisent la clé anon.
-- Ces données ne sont pas sensibles (pas de token, pas de mot de passe),
-- mais pour verrouiller davantage, déplacez ces appels derrière votre
-- backend accesxtv-backend (service_role) plus tard.
alter table public.device_sessions enable row level security;

drop policy if exists "anon select sessions" on public.device_sessions;
create policy "anon select sessions"
  on public.device_sessions for select
  to anon using (true);

drop policy if exists "anon insert sessions" on public.device_sessions;
create policy "anon insert sessions"
  on public.device_sessions for insert
  to anon with check (true);

drop policy if exists "anon update sessions" on public.device_sessions;
create policy "anon update sessions"
  on public.device_sessions for update
  to anon using (true) with check (true);

-- (Pas de policy DELETE : on révoque au lieu de supprimer.)

-- ── Nettoyage automatique (optionnel) ──
-- Supprime les sessions inactives depuis plus de 90 jours.
-- Nécessite l'extension pg_cron (Dashboard → Database → Extensions) :
-- select cron.schedule('purge-old-device-sessions', '0 4 * * *',
--   $$delete from public.device_sessions where last_seen < now() - interval '90 days'$$);
