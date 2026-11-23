-- ===== 1. new columns =====
alter table public.games add column if not exists preview_url text;
alter table public.games add column if not exists is_original boolean not null default false;
create index if not exists games_original_idx on public.games (is_original) where is_original;

-- ===== 2. multiplayer / 2-player tags (computed from OLD categories + titles, before categories change) =====
insert into public.tags (slug, name) values ('multiplayer','Multiplayer'), ('2-player','2 Player') on conflict (slug) do nothing;

insert into public.game_tags (game_id, tag_id)
select g.id, t.id
from public.games g
join public.categories c on c.id = g.category_id
cross join (select id from public.tags where slug = 'multiplayer') t
where c.slug = 'multiplayer' or c.slug = 'io'
   or g.title ~* '(multiplayer|online|pvp|duel|vs friend|\.io|royale|2-player|2 player|squad)'
on conflict do nothing;

insert into public.game_tags (game_id, tag_id)
select g.id, t.id
from public.games g
cross join (select id from public.tags where slug = '2-player') t
where g.title ~* '(2-player|2 player|vs friend|duel)'
on conflict do nothing;

-- ===== 3. CrazyGames-style category list =====
update public.categories set slug = 'simulation', name = 'Simulation'
 where slug = 'simulator' and not exists (select 1 from public.categories where slug = 'simulation');

insert into public.categories (slug, name, icon, sort_order) values
 ('action','Action',null,1), ('adventure','Adventure',null,2), ('arcade','Arcade',null,3), ('board','Board',null,4),
 ('card','Card',null,5), ('clicker','Clicker',null,6), ('driving','Driving',null,7), ('io','.io',null,8),
 ('puzzle','Puzzle',null,9), ('shooting','Shooting',null,10), ('simulation','Simulation',null,11), ('sports','Sports',null,12),
 ('strategy','Strategy',null,13), ('trivia','Trivia',null,14), ('word','Word',null,15)
on conflict (slug) do update set name = excluded.name, icon = null, sort_order = excluded.sort_order;

-- ===== 4. clean titles / descriptions (HTML entities, double spaces) and real developer name =====
update public.games set
  title = trim(regexp_replace(replace(replace(replace(replace(replace(replace(title,'&amp;','&'),'&ndash;','–'),'&mdash;','—'),'&times;','×'),'&#39;',''''),'&quot;','"'), '\s+', ' ', 'g')),
  description = replace(replace(replace(replace(replace(replace(description,'&amp;','&'),'&ndash;','–'),'&mdash;','—'),'&times;','×'),'&#39;',''''),'&quot;','"'),
  instructions = case when instructions is null then null else replace(replace(replace(replace(replace(replace(instructions,'&amp;','&'),'&ndash;','–'),'&mdash;','—'),'&times;','×'),'&#39;',''''),'&quot;','"') end
where title ~ '&[a-z#0-9]+;|\s{2,}' or description ~ '&[a-z#0-9]+;' or instructions ~ '&[a-z#0-9]+;';

update public.games set developer = 'GameMonetize'
 where developer ilike 'Arcadia%' and iframe_url like 'https://html5.gamemonetize.co/%';

-- ===== 5. move every game into the new categories =====
with src as (
  select g.id, g.slug, lower(g.title) as t, c.slug as old
  from public.games g join public.categories c on c.id = g.category_id
), pick as (
  select id,
    case
      when slug in ('wall-rush-3d-88185','scary-granny-horror-maze-escape-83675','deadshift-halloween-night-88390','taiga-expedition-87943') then 'adventure'
      when slug = 'forest-fortune-86014' then 'arcade'
      when t ~ '(^|[^a-z])(chess|ludo|checkers|backgammon|domino|mahjong|carrom)([^a-z]|$)' then 'board'
      when t ~ '(solitaire|freecell|poker|blackjack|rummy)' then 'card'
      when t ~ '(^|[^a-z])(word|crossword|hangman|wordle)([^a-z]|$)' then 'word'
      when t ~ '(quiz|trivia)' then 'trivia'
      when t ~ '(tycoon|clicker)' or t ~ '(^|[^a-z])idle([^a-z]|$)' then 'clicker'
      when t ~ '\.io' or old = 'io' then 'io'
      when t ~ '(football|soccer|(^|[^a-z])pool([^a-z]|$)|referee|basketball|tennis|golf|free kick|pinball)' then 'sports'
      when t ~ '(puzzle|(^|[^a-z])sort([^a-z]|$)|match|merge|bubble|crush|(^|[^a-z])jam([^a-z]|$)|maze|packing|stack|jewel|candy|galaxy pop)' then 'puzzle'
      when t !~ 'obby' and t ~ '(^|[^a-z])(car|cars|truck|bus|taxi|drift|racing|racer|race|parking|motorcycle|motorbike|bike|rider|jeep|offroad|highway|traffic|quad|ramp|stunt|forklift|driver|driving|nitro|rally)([^a-z]|$)' then 'driving'
      when t ~ '(simulator|simulation|supermarket|bakery|brookhaven|checkout|plow|farm|builder|surgeon|hospital|mowing|cutting|vendor|market|fishing|eating|mother|family)' then 'simulation'
      when old in ('3d','casual','multiplayer') and t ~ '(fps|shooter|sniper|pvp|strike|blaster|(^|[^a-z])aim([^a-z]|$)|(^|[^a-z])gun([^a-z]|$))' then 'shooting'
      when old in ('3d','casual','multiplayer') and t ~ '(rush|(^|[^a-z])run([^a-z]|$)|runner|obby|escape|journey|jump|flip|survivor|parkour|chop|hero|rampage)' then 'adventure'
      when old = 'shooting' then 'shooting'
      when old in ('action','fighting') then 'action'
      when old = 'adventure' then 'adventure'
      when old = 'strategy' then 'strategy'
      when old = 'sports' then 'sports'
      when old = 'simulator' or old = 'simulation' then 'simulation'
      when old = 'puzzle' then 'puzzle'
      else 'arcade'
    end as newslug
  from src
)
update public.games g set category_id = c.id
from pick p join public.categories c on c.slug = p.newslug
where g.id = p.id and g.category_id is distinct from c.id;

-- drop the old categories that are now empty (3d, casual, multiplayer, fighting ...)
delete from public.categories c
 where c.slug not in ('action','adventure','arcade','board','card','clicker','driving','io','puzzle','shooting','simulation','sports','strategy','trivia','word')
   and not exists (select 1 from public.games g where g.category_id = c.id);

-- ===== 6. hide games that use other companies' trademarks in their names, and duplicates =====
update public.games set is_published = false
 where slug in (
   'call-of-duty-modern-warfare-4-beat-em-up-87465','gta-vi-beat-em-up-87204','resident-evil-2-beat-em-up-87167',
   'resident-evil-4-2-5d-fps-86751','half-life-2-platformer-87166','halo-platformer-87161','gears-of-war-platformer-86612',
   'doom-eternal-platformer-86610','minecraft-times-counter-strike-2-5d-fps-86977','f-e-a-r-silent-facility-87591',
   'terminator-robot-uprising-86994','double-dragon-broken-district-87570','final-fight-harbor-justice-87590',
   'stickman-gta-city-og3d','stickman-gta-city-pro','gun-thief-auto-85751','destroy-minecraft-87258',
   'brookhaven-real-life-85413','dublix-3d-obby-world');

with ranked as (
  select id, row_number() over (partition by iframe_url order by is_published desc, play_count desc, created_at, slug) as rn
  from public.games where is_published
)
update public.games g set is_published = false from ranked r where g.id = r.id and r.rn > 1;

-- ===== 7. our own games come back, marked as Originals =====
insert into public.games (slug, title, description, instructions, developer, thumbnail_url, iframe_url, width, height, category_id, play_count, rating_avg, like_count, is_featured, is_published, is_original)
select 'snake-escape', 'Snake Escape',
       'Tap the snakes to slide them off the board. Clear the path, avoid crashes, and take on levels that get trickier every time.',
       'Tap a snake to send it out the way its head points. If another snake is in the way, you crash. Clear every snake to win. Sign in to save your level and coins.',
       'Arcadia', '/thumbs/snake-escape.svg', '/games/snake-escape/index.html', 600, 800,
       (select id from public.categories where slug = 'puzzle'), 0, 0, 0, true, true, true
on conflict (slug) do update set title = excluded.title, description = excluded.description, instructions = excluded.instructions,
  developer = excluded.developer, thumbnail_url = excluded.thumbnail_url, iframe_url = excluded.iframe_url, width = excluded.width, height = excluded.height,
  category_id = excluded.category_id, is_featured = true, is_published = true, is_original = true;

insert into public.games (slug, title, description, instructions, developer, thumbnail_url, iframe_url, width, height, category_id, play_count, rating_avg, like_count, is_featured, is_published, is_original)
select 'tap-target', 'Tap Target',
       'Tap the glowing targets before they vanish. Chain hits for combos, grab the gold ones, and never touch a bomb.',
       'Tap targets to score. Gold targets are worth 3. Reach the goal before time runs out. Bombs end the level, and later levels hide them.',
       'Arcadia', '/thumbs/tap-target.svg', '/games/tap-target/index.html', 800, 600,
       (select id from public.categories where slug = 'arcade'), 0, 0, 0, false, true, true
on conflict (slug) do update set title = excluded.title, description = excluded.description, instructions = excluded.instructions,
  developer = excluded.developer, thumbnail_url = excluded.thumbnail_url, iframe_url = excluded.iframe_url, width = excluded.width, height = excluded.height,
  category_id = excluded.category_id, is_published = true, is_original = true;

-- ===== 8. lock the open import function again =====
do $$
begin
  if to_regprocedure('public.import_games_batch(jsonb)') is not null then
    revoke execute on function public.import_games_batch(jsonb) from public, anon, authenticated;
  end if;
end $$;;
