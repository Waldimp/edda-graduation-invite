-- Invitación de graduación — convive con el invite de Kenya y piano en el
-- MISMO proyecto de Supabase (plan gratuito). Se usa el schema "invite", que
-- ya está expuesto en la API, así que no hay que tocar "Exposed schemas".
--
-- 1. SQL Editor → pegar esto → Run

create schema if not exists invite;

create table if not exists invite.gradu_rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  attending text not null check (attending in ('si', 'no')),
  dish text check (dish in ('plato_1', 'plato_2', 'plato_3')),
  created_at timestamptz not null default now(),
  -- Quien viene elige plato; quien no viene no lo elige.
  constraint gradu_rsvps_dish_matches_attending check (
    (attending = 'si' and dish is not null) or (attending = 'no' and dish is null)
  )
);

create index if not exists gradu_rsvps_created_at_idx on invite.gradu_rsvps (created_at desc);

alter table invite.gradu_rsvps enable row level security;

drop policy if exists "public can insert gradu rsvps" on invite.gradu_rsvps;
create policy "public can insert gradu rsvps"
  on invite.gradu_rsvps
  for insert
  to anon, authenticated
  with check (true);

grant usage on schema invite to anon, authenticated, service_role;
grant insert on table invite.gradu_rsvps to anon, authenticated;
grant all on table invite.gradu_rsvps to service_role;
