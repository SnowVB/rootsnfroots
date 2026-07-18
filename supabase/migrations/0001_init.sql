-- Core schema for Tree of Support.
-- Mirrors the data model in CLAUDE.md section 4. Branch limit (5) and other
-- product rules (CLAUDE.md D3) are enforced in the app layer, not here.

create extension if not exists "pgcrypto";

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Profiles extend auth.users with the product-specific fields from the User model.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled')),
  language text not null default 'ru' check (language in ('ru', 'en')),
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are self-readable"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are self-updatable"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trees
create table public.trees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Моё дерево',
  horizon text check (horizon in ('6m', '1y', '3y')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trees enable row level security;

create policy "trees are owned by their user"
  on public.trees for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger trees_set_updated_at
  before update on public.trees
  for each row execute function public.set_updated_at();

create index trees_user_id_idx on public.trees (user_id);

-- Roots
create table public.roots (
  id uuid primary key default gen_random_uuid(),
  tree_id uuid not null references public.trees (id) on delete cascade,
  text text not null,
  slot_id text,
  x numeric,
  y numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trunk items
create table public.trunk_items (
  id uuid primary key default gen_random_uuid(),
  tree_id uuid not null references public.trees (id) on delete cascade,
  text text not null,
  x numeric,
  y numeric,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Branches
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  tree_id uuid not null references public.trees (id) on delete cascade,
  text text not null,
  slot_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fruits
create table public.fruits (
  id uuid primary key default gen_random_uuid(),
  tree_id uuid not null references public.trees (id) on delete cascade,
  branch_id uuid references public.branches (id) on delete set null,
  text text not null,
  x numeric not null,
  y numeric not null,
  harvested boolean not null default false,
  harvested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS, updated_at triggers, and an index on tree_id — identical shape for
-- all four tree-child tables, so generate them instead of repeating 4x.
do $$
declare
  t text;
begin
  foreach t in array array['roots', 'trunk_items', 'branches', 'fruits']
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format($f$
      create policy "%1$s are owned via their tree"
        on public.%1$s for all
        using (exists (
          select 1 from public.trees
          where trees.id = %1$s.tree_id and trees.user_id = auth.uid()
        ))
        with check (exists (
          select 1 from public.trees
          where trees.id = %1$s.tree_id and trees.user_id = auth.uid()
        ))
    $f$, t);

    execute format(
      'create trigger %1$s_set_updated_at before update on public.%1$s for each row execute function public.set_updated_at()',
      t
    );

    execute format('create index %1$s_tree_id_idx on public.%1$s (tree_id)', t);
  end loop;
end $$;
