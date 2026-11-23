-- Migration: Add progress JSONB to profiles and restore snake game RPC wrappers

-- 1. Add progress column to profiles
alter table public.profiles
  add column if not exists progress jsonb not null default '{
    "xp": 0,
    "plays": 0,
    "uniqueGames": [],
    "streak": 0,
    "bestStreak": 0,
    "lastDay": "",
    "today": { "day": "", "games": [], "claimed": false }
  }'::jsonb;

-- Grant authenticated users update permissions on progress column
grant update (progress) on public.profiles to authenticated;

-- Ensure policy allows updating own profile
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'own profile update'
  ) then
    create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
  end if;
end $$;

-- 2. Restore Snake Escape backward-compatibility RPC functions
-- Map snake_* calls to existing gp_* functions in public schema
create or replace function public.snake_get_player() returns jsonb
language sql security definer set search_path = public as $$
  select public.gp_get('snake');
$$;

create or replace function public.snake_begin_level(p_level int) returns jsonb
language sql security definer set search_path = public as $$
  select public.gp_begin('snake', p_level);
$$;

create or replace function public.snake_use_item(p_item text) returns jsonb
language sql security definer set search_path = public as $$
  select public.gp_use_item('snake', p_item);
$$;

create or replace function public.snake_complete_level(p_level int, p_perfect boolean default false) returns jsonb
language sql security definer set search_path = public as $$
  select public.gp_complete('snake', p_level, p_perfect);
$$;

create or replace function public.snake_skip_level(p_level int) returns jsonb
language sql security definer set search_path = public as $$
  select public.gp_skip('snake', p_level);
$$;

create or replace function public.snake_claim_ad() returns jsonb
language sql security definer set search_path = public as $$
  select public.wallet_claim_ad('snake');
$$;

-- Grant execute permissions to authenticated users
grant execute on function public.snake_get_player() to authenticated;
grant execute on function public.snake_begin_level(int) to authenticated;
grant execute on function public.snake_use_item(text) to authenticated;
grant execute on function public.snake_complete_level(int, boolean) to authenticated;
grant execute on function public.snake_skip_level(int) to authenticated;
grant execute on function public.snake_claim_ad() to authenticated;
