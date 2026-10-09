-- Run this whole file once in Supabase: SQL Editor -> New query -> paste -> Run.

-- ========== TABLES ==========
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  name       text not null,
  icon       text,
  sort_order int  not null default 0
);

create table public.tags (
  id   uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null
);

create table public.games (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  description   text not null,
  instructions  text,
  developer     text,
  thumbnail_url text not null,
  iframe_url    text not null,           -- e.g. https://games.yourdomain.com/<slug>/index.html
  width         int  not null default 960,
  height        int  not null default 540,
  play_count    int  not null default 0,
  like_count    int  not null default 0,
  rating_avg    real not null default 0,
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  category_id   uuid not null references public.categories(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index games_trending_idx on public.games (is_published, play_count desc);
create index games_category_idx on public.games (category_id, is_published);

create table public.game_tags (
  game_id uuid not null references public.games(id) on delete cascade,
  tag_id  uuid not null references public.tags(id)  on delete cascade,
  primary key (game_id, tag_id)
);
create index game_tags_tag_idx on public.game_tags (tag_id);

-- Supabase Auth owns the real users; "profiles" holds your extra fields.
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique,
  avatar_url text,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id    uuid not null references auth.users(id) on delete cascade,
  game_id    uuid not null references public.games(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create table public.play_history (
  user_id        uuid not null references auth.users(id) on delete cascade,
  game_id        uuid not null references public.games(id) on delete cascade,
  last_played_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create table public.reports (
  id         uuid primary key default gen_random_uuid(),
  game_id    uuid not null references public.games(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  reason     text not null check (reason in ('BROKEN','INAPPROPRIATE','COPYRIGHT','OTHER')),
  details    text check (char_length(details) <= 500),
  status     text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at timestamptz not null default now()
);

-- Create a profile row automatically when someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ========== SECURITY (Row Level Security) ==========
alter table public.categories   enable row level security;
alter table public.tags         enable row level security;
alter table public.games        enable row level security;
alter table public.game_tags    enable row level security;
alter table public.profiles     enable row level security;
alter table public.favorites    enable row level security;
alter table public.play_history enable row level security;
alter table public.reports      enable row level security;

-- Public catalog: anyone can read, nobody can write with the public key
create policy "read categories" on public.categories for select using (true);
create policy "read tags"       on public.tags       for select using (true);
create policy "read game_tags"  on public.game_tags  for select using (true);
create policy "read published games" on public.games for select using (is_published);

-- Anyone can submit a report, but cannot read reports
create policy "submit report" on public.reports for insert
  to anon, authenticated with check (status = 'open');

-- Logged-in users manage only their own data
create policy "own profile read"   on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "own favorites" on public.favorites    for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own history"   on public.play_history for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
