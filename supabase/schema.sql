-- YAUXAÉ — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.dresses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  designer text not null,
  collection text,
  description text not null default '',
  image_url text not null,
  votes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  dress_id uuid not null references public.dresses (id) on delete cascade,
  voter_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (dress_id, voter_fingerprint)
);

create index if not exists votes_dress_id_idx on public.votes (dress_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.dresses enable row level security;
alter table public.votes enable row level security;

-- Anyone (anon key) can read dresses and vote counts.
create policy "Public read access on dresses"
  on public.dresses for select
  using (true);

-- Votes are written only through the cast_vote() function (security definer
-- below), never through direct inserts from the client — this keeps the
-- (dress_id, voter_fingerprint) uniqueness + vote-count increment atomic.
create policy "Public read access on votes"
  on public.votes for select
  using (true);

-- ---------------------------------------------------------------------------
-- Atomic vote RPC
-- ---------------------------------------------------------------------------
-- Inserts a vote row (idempotent per voter/dress via the unique constraint)
-- and increments the dress's vote counter in a single transaction.

create or replace function public.cast_vote(
  p_dress_id uuid,
  p_voter_fingerprint text
)
returns table (new_votes integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.votes (dress_id, voter_fingerprint)
  values (p_dress_id, p_voter_fingerprint)
  on conflict (dress_id, voter_fingerprint) do nothing;

  if found then
    update public.dresses
      set votes = votes + 1
      where id = p_dress_id;
  end if;

  return query select d.votes as new_votes from public.dresses d where d.id = p_dress_id;
end;
$$;

grant execute on function public.cast_vote(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Seed data (sample gallery — replace image_url with your own assets)
-- ---------------------------------------------------------------------------

insert into public.dresses (slug, name, designer, collection, description, image_url, votes)
values
  ('noir-velours', 'Noir Velours', 'Maison Reyne', 'Autumn Rite', 'A floor-length burgundy velvet gown with a sculpted bodice and a train that pools like ink.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop', 128),
  ('golden-fauve', 'Golden Fauve', 'Ateliér Vasse', 'Wild Court', 'Hand-beaded leopard motif bodice over a bias-cut silk skirt in aged gold.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop', 214),
  ('crimson-cathedral', 'Crimson Cathedral', 'House of Solene', 'Vespers', 'Structured burgundy taffeta with cathedral sleeves and a corseted waist.', 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?q=80&w=1200&auto=format&fit=crop', 97),
  ('feline-mirage', 'Feline Mirage', 'Ateliér Vasse', 'Wild Court', 'A slinky leopard-print slip dress finished with a hand-frayed silk hem.', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1200&auto=format&fit=crop', 176),
  ('bordeaux-nocturne', 'Bordeaux Nocturne', 'Maison Reyne', 'Autumn Rite', 'Off-shoulder burgundy satin with a thigh-high slit and matte gold hardware.', 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop', 152),
  ('gilded-panther', 'Gilded Panther', 'House of Solene', 'Vespers', 'Leopard jacquard bustier gown with a gold-lacquered cage skirt.', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', 63)
on conflict (slug) do nothing;
