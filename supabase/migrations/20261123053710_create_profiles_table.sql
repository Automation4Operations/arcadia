-- Migration: create profiles table
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text unique,
  avatar_url text,
  role       text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add updated_at column if missing
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Function and trigger to auto-create profile on signup
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Secure function permissions
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- RLS policies
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'own profile read'
  ) then
    create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'own profile update'
  ) then
    create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
  end if;
end $$;
