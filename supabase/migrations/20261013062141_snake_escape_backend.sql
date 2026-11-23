create table if not exists public.snake_players (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  coins            int  not null default 30 check (coins >= 0),
  current_level    int  not null default 1  check (current_level >= 1),
  total_clears     int  not null default 0,
  ad_day           date not null default current_date,
  ads_today        int  not null default 0,
  last_ad_at       timestamptz,
  skip_day         date not null default current_date,
  skips_today      int  not null default 0,
  level_started_for int,
  level_started_at  timestamptz,
  level_hints      int  not null default 0,
  level_erasers    int  not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.snake_clears (
  user_id       uuid not null references auth.users(id) on delete cascade,
  level         int  not null,
  coins_awarded int  not null default 0,
  perfect       boolean not null default false,
  cleared_at    timestamptz not null default now(),
  primary key (user_id, level)
);

alter table public.snake_players enable row level security;
alter table public.snake_clears  enable row level security;

drop policy if exists "read own snake player" on public.snake_players;
create policy "read own snake player" on public.snake_players for select to authenticated using (auth.uid() = user_id);
drop policy if exists "read own snake clears" on public.snake_clears;
create policy "read own snake clears" on public.snake_clears for select to authenticated using (auth.uid() = user_id);

revoke insert, update, delete, truncate on public.snake_players from anon, authenticated;
revoke insert, update, delete, truncate on public.snake_clears  from anon, authenticated;
revoke all on public.snake_players from anon;
revoke all on public.snake_clears  from anon;

create or replace function public.snake_state(p public.snake_players) returns jsonb
language sql immutable set search_path = public as $$
  select jsonb_build_object(
    'coins', p.coins,
    'current_level', p.current_level,
    'total_clears', p.total_clears,
    'ads_left',   greatest(0, 10 - case when p.ad_day   = current_date then p.ads_today   else 0 end),
    'skips_left', greatest(0, 3  - case when p.skip_day = current_date then p.skips_today else 0 end)
  );
$$;

create or replace function public.snake_get_player() returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  insert into public.snake_players(user_id) values (uid) on conflict (user_id) do nothing;
  select * into p from public.snake_players where user_id = uid;
  return public.snake_state(p);
end $$;

create or replace function public.snake_begin_level(p_level int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into p from public.snake_players where user_id = uid for update;
  if not found then raise exception 'not_signed_in'; end if;
  if p_level < 1 or p_level > p.current_level then raise exception 'bad_level'; end if;
  update public.snake_players
     set level_started_for = p_level, level_started_at = now(), level_hints = 0, level_erasers = 0, updated_at = now()
   where user_id = uid returning * into p;
  return public.snake_state(p);
end $$;

create or replace function public.snake_use_item(p_item text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players; cost int;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if p_item not in ('hint','eraser') then raise exception 'bad_item'; end if;
  select * into p from public.snake_players where user_id = uid for update;
  if not found then raise exception 'not_signed_in'; end if;
  if p.level_started_for is null then raise exception 'no_level'; end if;
  cost := case p_item when 'hint' then 15 else 40 end;
  if p_item = 'hint'   and p.level_hints   >= 3 then raise exception 'item_limit'; end if;
  if p_item = 'eraser' and p.level_erasers >= 2 then raise exception 'item_limit'; end if;
  if p.coins < cost then raise exception 'not_enough_coins'; end if;
  update public.snake_players set
      coins = coins - cost,
      level_hints   = level_hints   + case when p_item = 'hint'   then 1 else 0 end,
      level_erasers = level_erasers + case when p_item = 'eraser' then 1 else 0 end,
      updated_at = now()
   where user_id = uid returning * into p;
  return public.snake_state(p);
end $$;

create or replace function public.snake_complete_level(p_level int, p_perfect boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players; reward int := 0; min_secs numeric;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into p from public.snake_players where user_id = uid for update;
  if not found then raise exception 'not_signed_in'; end if;
  if p.level_started_for is distinct from p_level then raise exception 'not_started'; end if;
  min_secs := 3 + least(p_level, 60) * 0.2;
  if extract(epoch from (now() - p.level_started_at)) < min_secs then raise exception 'too_fast'; end if;
  if p_level = p.current_level then
    reward := 8 + least(p_level, 40) + case when coalesce(p_perfect,false) then 5 else 0 end;
    update public.snake_players
       set coins = least(coins + reward, 99999), current_level = current_level + 1,
           total_clears = total_clears + 1, level_started_for = null, updated_at = now()
     where user_id = uid returning * into p;
    insert into public.snake_clears(user_id, level, coins_awarded, perfect)
    values (uid, p_level, reward, coalesce(p_perfect,false)) on conflict do nothing;
  else
    update public.snake_players set level_started_for = null, updated_at = now() where user_id = uid returning * into p;
  end if;
  return public.snake_state(p) || jsonb_build_object('awarded', reward);
end $$;

create or replace function public.snake_skip_level(p_level int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into p from public.snake_players where user_id = uid for update;
  if not found then raise exception 'not_signed_in'; end if;
  if p_level is distinct from p.current_level then raise exception 'bad_level'; end if;
  if p.skip_day <> current_date then p.skip_day := current_date; p.skips_today := 0; end if;
  if p.skips_today >= 3 then raise exception 'skip_limit'; end if;
  if p.coins < 150 then raise exception 'not_enough_coins'; end if;
  update public.snake_players
     set coins = coins - 150, current_level = current_level + 1, skip_day = p.skip_day,
         skips_today = p.skips_today + 1, level_started_for = null, updated_at = now()
   where user_id = uid returning * into p;
  return public.snake_state(p);
end $$;

create or replace function public.snake_claim_ad() returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); p public.snake_players;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  select * into p from public.snake_players where user_id = uid for update;
  if not found then raise exception 'not_signed_in'; end if;
  if p.ad_day <> current_date then p.ad_day := current_date; p.ads_today := 0; end if;
  if p.ads_today >= 10 then raise exception 'ad_cap'; end if;
  if p.last_ad_at is not null and now() - p.last_ad_at < interval '45 seconds' then raise exception 'ad_cooldown'; end if;
  update public.snake_players
     set coins = least(coins + 25, 99999), ad_day = p.ad_day, ads_today = p.ads_today + 1,
         last_ad_at = now(), updated_at = now()
   where user_id = uid returning * into p;
  return public.snake_state(p);
end $$;

revoke all on function public.snake_state(public.snake_players)        from public, anon, authenticated;
revoke all on function public.snake_get_player()                       from public, anon;
revoke all on function public.snake_begin_level(int)                   from public, anon;
revoke all on function public.snake_use_item(text)                     from public, anon;
revoke all on function public.snake_complete_level(int, boolean)       from public, anon;
revoke all on function public.snake_skip_level(int)                    from public, anon;
revoke all on function public.snake_claim_ad()                         from public, anon;
grant execute on function public.snake_get_player()                    to authenticated;
grant execute on function public.snake_begin_level(int)                to authenticated;
grant execute on function public.snake_use_item(text)                  to authenticated;
grant execute on function public.snake_complete_level(int, boolean)    to authenticated;
grant execute on function public.snake_skip_level(int)                 to authenticated;
grant execute on function public.snake_claim_ad()                      to authenticated;;
