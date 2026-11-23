create table if not exists public.game_config (
  game_key   text primary key,
  config     jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.game_config enable row level security;
drop policy if exists "public read game_config" on public.game_config;
create policy "public read game_config" on public.game_config for select to anon, authenticated using (true);
revoke insert, update, delete, truncate on public.game_config from anon, authenticated;

insert into public.game_config (game_key, config) values
 ('wallet', '{"start_coins":20,"ad_reward":10,"ads_per_day":6,"ad_cooldown_s":60,"max_coins":99999}'),
 ('snake',  '{"reward_base":3,"reward_step":4,"reward_cap":12,"perfect_bonus":2,"skip_cost":250,"skips_per_day":2,"min_secs_base":3,"min_secs_per_level":0.25,"min_secs_cap":25,"items":{"hint":{"cost":20,"limit":3},"eraser":{"cost":60,"limit":2}}}'),
 ('tap',    '{"reward_base":3,"reward_step":4,"reward_cap":12,"perfect_bonus":2,"skip_cost":250,"skips_per_day":2,"min_secs_base":6,"min_secs_per_level":0.3,"min_secs_cap":25,"items":{"revive":{"cost":30,"limit":2},"time":{"cost":15,"limit":2}}}')
on conflict (game_key) do update set config = excluded.config, updated_at = now();

create table if not exists public.wallets (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  coins      int  not null default 0 check (coins >= 0),
  ad_day     date not null default current_date,
  ads_today  int  not null default 0,
  last_ad_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.game_progress (
  user_id           uuid not null references auth.users(id) on delete cascade,
  game_key          text not null,
  current_level     int  not null default 1 check (current_level >= 1),
  total_clears      int  not null default 0,
  skip_day          date not null default current_date,
  skips_today       int  not null default 0,
  level_started_for int,
  level_started_at  timestamptz,
  level_items       jsonb not null default '{}'::jsonb,
  updated_at        timestamptz not null default now(),
  primary key (user_id, game_key)
);
create table if not exists public.game_clears (
  user_id       uuid not null references auth.users(id) on delete cascade,
  game_key      text not null,
  level         int  not null,
  coins_awarded int  not null default 0,
  perfect       boolean not null default false,
  cleared_at    timestamptz not null default now(),
  primary key (user_id, game_key, level)
);
create index if not exists game_progress_rank_idx on public.game_progress (game_key, current_level desc);

alter table public.wallets       enable row level security;
alter table public.game_progress enable row level security;
alter table public.game_clears   enable row level security;
drop policy if exists "read own wallet"   on public.wallets;
drop policy if exists "read own progress" on public.game_progress;
drop policy if exists "read own clears"   on public.game_clears;
create policy "read own wallet"   on public.wallets       for select to authenticated using (auth.uid() = user_id);
create policy "read own progress" on public.game_progress for select to authenticated using (auth.uid() = user_id);
create policy "read own clears"   on public.game_clears   for select to authenticated using (auth.uid() = user_id);
revoke insert, update, delete, truncate on public.wallets, public.game_progress, public.game_clears from anon, authenticated;
revoke all on public.wallets, public.game_progress, public.game_clears from anon;

do $$
begin
  if to_regclass('public.snake_players') is not null then
    insert into public.wallets (user_id, coins, ad_day, ads_today, last_ad_at)
      select user_id, least(coins, 200), ad_day, ads_today, last_ad_at from public.snake_players
      on conflict (user_id) do nothing;
    insert into public.game_progress (user_id, game_key, current_level, total_clears)
      select user_id, 'snake', current_level, total_clears from public.snake_players
      on conflict (user_id, game_key) do nothing;
    insert into public.game_clears (user_id, game_key, level, coins_awarded, perfect, cleared_at)
      select user_id, 'snake', level, coins_awarded, perfect, cleared_at from public.snake_clears
      on conflict do nothing;
  end if;
end $$;
drop function if exists public.snake_get_player();
drop function if exists public.snake_begin_level(int);
drop function if exists public.snake_use_item(text);
drop function if exists public.snake_complete_level(int, boolean);
drop function if exists public.snake_skip_level(int);
drop function if exists public.snake_claim_ad();
drop function if exists public.snake_state(public.snake_players);
drop table if exists public.snake_clears;
drop table if exists public.snake_players;

create or replace function public.gp_cfg(p_game text) returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce((select config from public.game_config where game_key = p_game), '{}'::jsonb)
$$;

create or replace function public.gp_ensure(p_game text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  if p_game is null or p_game = 'wallet' or not exists (select 1 from public.game_config where game_key = p_game) then
    raise exception 'bad_game';
  end if;
  insert into public.wallets (user_id, coins)
    values (uid, coalesce((public.gp_cfg('wallet')->>'start_coins')::int, 20)) on conflict (user_id) do nothing;
  insert into public.game_progress (user_id, game_key) values (uid, p_game) on conflict (user_id, game_key) do nothing;
end $$;

create or replace function public.gp_state(w public.wallets, g public.game_progress) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare wc jsonb := public.gp_cfg('wallet'); gc jsonb := public.gp_cfg(g.game_key);
begin
  return jsonb_build_object(
    'coins', w.coins,
    'current_level', g.current_level,
    'total_clears', g.total_clears,
    'ads_left',   greatest(0, coalesce((wc->>'ads_per_day')::int, 6)  - case when w.ad_day   = current_date then w.ads_today   else 0 end),
    'skips_left', greatest(0, coalesce((gc->>'skips_per_day')::int, 2) - case when g.skip_day = current_date then g.skips_today else 0 end)
  );
end $$;

create or replace function public.gp_get(p_game text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress;
begin
  perform public.gp_ensure(p_game);
  select * into w from public.wallets where user_id = uid;
  select * into g from public.game_progress where user_id = uid and game_key = p_game;
  return public.gp_state(w, g);
end $$;

create or replace function public.gp_begin(p_game text, p_level int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress;
begin
  perform public.gp_ensure(p_game);
  select * into g from public.game_progress where user_id = uid and game_key = p_game for update;
  if p_level < 1 or p_level > g.current_level then raise exception 'bad_level'; end if;
  update public.game_progress set level_started_for = p_level, level_started_at = now(), level_items = '{}'::jsonb, updated_at = now()
    where user_id = uid and game_key = p_game returning * into g;
  select * into w from public.wallets where user_id = uid;
  return public.gp_state(w, g);
end $$;

create or replace function public.gp_use_item(p_game text, p_item text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress; it jsonb; cost int; lim int; used int;
begin
  perform public.gp_ensure(p_game);
  it := public.gp_cfg(p_game)->'items'->p_item;
  if it is null then raise exception 'bad_item'; end if;
  cost := (it->>'cost')::int; lim := (it->>'limit')::int;
  select * into w from public.wallets where user_id = uid for update;
  select * into g from public.game_progress where user_id = uid and game_key = p_game for update;
  if g.level_started_for is null then raise exception 'no_level'; end if;
  used := coalesce((g.level_items->>p_item)::int, 0);
  if used >= lim then raise exception 'item_limit'; end if;
  if w.coins < cost then raise exception 'not_enough_coins'; end if;
  update public.wallets set coins = coins - cost, updated_at = now() where user_id = uid returning * into w;
  update public.game_progress set level_items = jsonb_set(level_items, array[p_item], to_jsonb(used + 1)), updated_at = now()
    where user_id = uid and game_key = p_game returning * into g;
  return public.gp_state(w, g);
end $$;

create or replace function public.gp_complete(p_game text, p_level int, p_perfect boolean default false) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress; c jsonb; reward int := 0; min_secs numeric; mx int;
begin
  perform public.gp_ensure(p_game);
  c := public.gp_cfg(p_game); mx := coalesce((public.gp_cfg('wallet')->>'max_coins')::int, 99999);
  select * into w from public.wallets where user_id = uid for update;
  select * into g from public.game_progress where user_id = uid and game_key = p_game for update;
  if g.level_started_for is distinct from p_level then raise exception 'not_started'; end if;
  min_secs := least(coalesce((c->>'min_secs_base')::numeric, 3) + p_level * coalesce((c->>'min_secs_per_level')::numeric, 0.25),
                    coalesce((c->>'min_secs_cap')::numeric, 25));
  if extract(epoch from (now() - g.level_started_at)) < min_secs then raise exception 'too_fast'; end if;
  if p_level = g.current_level then
    reward := coalesce((c->>'reward_base')::int, 3)
            + least(p_level / greatest(coalesce((c->>'reward_step')::int, 4), 1), coalesce((c->>'reward_cap')::int, 12))
            + case when coalesce(p_perfect, false) then coalesce((c->>'perfect_bonus')::int, 2) else 0 end;
    update public.wallets set coins = least(coins + reward, mx), updated_at = now() where user_id = uid returning * into w;
    update public.game_progress set current_level = current_level + 1, total_clears = total_clears + 1,
           level_started_for = null, updated_at = now() where user_id = uid and game_key = p_game returning * into g;
    insert into public.game_clears (user_id, game_key, level, coins_awarded, perfect)
      values (uid, p_game, p_level, reward, coalesce(p_perfect, false)) on conflict do nothing;
  else
    update public.game_progress set level_started_for = null, updated_at = now() where user_id = uid and game_key = p_game returning * into g;
  end if;
  return public.gp_state(w, g) || jsonb_build_object('awarded', reward);
end $$;

create or replace function public.gp_skip(p_game text, p_level int) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress; c jsonb; cost int; per_day int;
begin
  perform public.gp_ensure(p_game);
  c := public.gp_cfg(p_game); cost := coalesce((c->>'skip_cost')::int, 250); per_day := coalesce((c->>'skips_per_day')::int, 2);
  select * into w from public.wallets where user_id = uid for update;
  select * into g from public.game_progress where user_id = uid and game_key = p_game for update;
  if p_level is distinct from g.current_level then raise exception 'bad_level'; end if;
  if g.skip_day <> current_date then g.skip_day := current_date; g.skips_today := 0; end if;
  if g.skips_today >= per_day then raise exception 'skip_limit'; end if;
  if w.coins < cost then raise exception 'not_enough_coins'; end if;
  update public.wallets set coins = coins - cost, updated_at = now() where user_id = uid returning * into w;
  update public.game_progress set current_level = current_level + 1, skip_day = g.skip_day, skips_today = g.skips_today + 1,
         level_started_for = null, updated_at = now() where user_id = uid and game_key = p_game returning * into g;
  return public.gp_state(w, g);
end $$;

create or replace function public.wallet_claim_ad(p_game text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; g public.game_progress; c jsonb; per_day int; reward int; cd int; mx int;
begin
  perform public.gp_ensure(p_game);
  c := public.gp_cfg('wallet');
  per_day := coalesce((c->>'ads_per_day')::int, 6); reward := coalesce((c->>'ad_reward')::int, 10);
  cd := coalesce((c->>'ad_cooldown_s')::int, 60); mx := coalesce((c->>'max_coins')::int, 99999);
  select * into w from public.wallets where user_id = uid for update;
  if w.ad_day <> current_date then w.ad_day := current_date; w.ads_today := 0; end if;
  if w.ads_today >= per_day then raise exception 'ad_cap'; end if;
  if w.last_ad_at is not null and now() - w.last_ad_at < make_interval(secs => cd) then raise exception 'ad_cooldown'; end if;
  update public.wallets set coins = least(coins + reward, mx), ad_day = w.ad_day, ads_today = w.ads_today + 1,
         last_ad_at = now(), updated_at = now() where user_id = uid returning * into w;
  select * into g from public.game_progress where user_id = uid and game_key = p_game;
  return public.gp_state(w, g);
end $$;

create or replace function public.wallet_overview() returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); w public.wallets; res jsonb;
begin
  if uid is null then raise exception 'not_signed_in'; end if;
  insert into public.wallets (user_id, coins)
    values (uid, coalesce((public.gp_cfg('wallet')->>'start_coins')::int, 20)) on conflict (user_id) do nothing;
  select * into w from public.wallets where user_id = uid;
  select jsonb_build_object('coins', w.coins,
    'games', coalesce((select jsonb_object_agg(game_key, jsonb_build_object('level', current_level, 'clears', total_clears))
                       from public.game_progress where user_id = uid), '{}'::jsonb)) into res;
  return res;
end $$;

create or replace function public.game_leaderboard(p_game text, p_limit int default 20)
returns table (rank bigint, player text, level int, clears int)
language sql stable security definer set search_path = public as $$
  select row_number() over (order by gp.current_level desc, gp.total_clears desc, gp.updated_at asc) as rank,
         coalesce(pr.username, 'Player ' || upper(substr(md5(gp.user_id::text), 1, 4))) as player,
         gp.current_level, gp.total_clears
  from public.game_progress gp left join public.profiles pr on pr.id = gp.user_id
  where gp.game_key = p_game and gp.total_clears > 0
  order by gp.current_level desc, gp.total_clears desc, gp.updated_at asc
  limit least(greatest(p_limit, 1), 100)
$$;

revoke update on public.profiles from authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;
alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format check (username is null or username ~ '^[A-Za-z0-9_]{3,20}$');

create or replace function public.favorites_like_count() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then update public.games set like_count = like_count + 1 where id = new.game_id;
  elsif tg_op = 'DELETE' then update public.games set like_count = greatest(like_count - 1, 0) where id = old.game_id; end if;
  return null;
end $$;
drop trigger if exists favorites_like_count_trg on public.favorites;
create trigger favorites_like_count_trg after insert or delete on public.favorites
  for each row execute function public.favorites_like_count();

create or replace function public.game_record_play(p_slug text) returns void
language plpgsql security definer set search_path = public as $$
declare gid uuid; uid uuid := auth.uid(); recent boolean := false;
begin
  select id into gid from public.games where slug = p_slug and is_published;
  if gid is null then return; end if;
  if uid is not null then
    select exists (select 1 from public.play_history where user_id = uid and game_id = gid and last_played_at > now() - interval '5 minutes') into recent;
    insert into public.play_history (user_id, game_id, last_played_at) values (uid, gid, now())
      on conflict (user_id, game_id) do update set last_played_at = now();
    if recent then return; end if;
  end if;
  update public.games set play_count = play_count + 1 where id = gid;
end $$;

revoke all on function public.gp_cfg(text), public.gp_ensure(text), public.gp_state(public.wallets, public.game_progress),
                       public.favorites_like_count() from public, anon, authenticated;
revoke all on function public.gp_get(text), public.gp_begin(text, int), public.gp_use_item(text, text),
                       public.gp_complete(text, int, boolean), public.gp_skip(text, int),
                       public.wallet_claim_ad(text), public.wallet_overview() from public, anon;
grant execute on function public.gp_get(text), public.gp_begin(text, int), public.gp_use_item(text, text),
                          public.gp_complete(text, int, boolean), public.gp_skip(text, int),
                          public.wallet_claim_ad(text), public.wallet_overview() to authenticated;
revoke all on function public.game_leaderboard(text, int), public.game_record_play(text) from public;
grant execute on function public.game_leaderboard(text, int), public.game_record_play(text) to anon, authenticated;;
