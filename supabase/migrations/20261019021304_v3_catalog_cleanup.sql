-- columns
alter table public.games add column if not exists preview_url text;
alter table public.games add column if not exists is_original boolean not null default false;
alter table public.games add column if not exists hidden_reason text;

-- 1. decode HTML entities in titles and text
update public.games set
  title = replace(replace(replace(replace(replace(replace(replace(replace(replace(title,'&ndash;','–'),'&mdash;','—'),'&times;','×'),'&quot;','"'),'&#39;',''''),'&apos;',''''),'&lt;','<'),'&gt;','>'),'&amp;','&'),
  description = replace(replace(replace(replace(replace(replace(replace(replace(replace(coalesce(description,''),'&ndash;','–'),'&mdash;','—'),'&times;','×'),'&quot;','"'),'&#39;',''''),'&apos;',''''),'&lt;','<'),'&gt;','>'),'&amp;','&')
where title ~ '&[a-z#0-9]+;' or description ~ '&[a-z#0-9]+;';

-- 2. tags from title keywords + multiplayer (uses the OLD categories, so run before the remap)
with kw(slug, name, rx) as (values
  ('zombie','Zombie','zomb'), ('obby','Obby','obby'), ('stickman','Stickman','stickman'), ('brainrot','Brainrot','brainrot'),
  ('horror','Horror','(horror|scary|haunt|nightmare|spooky|granny)'), ('police','Police','(police|cop )'), ('drift','Drift','drift'),
  ('sniper','Sniper','sniper'), ('halloween','Halloween','halloween'), ('3d','3D','3d'), ('2d','2D','2d'), ('parking','Parking','parking'),
  ('sorting','Sorting','\ysort\y'), ('match-3','Match 3','(match 3|match-3)'), ('ragdoll','Ragdoll','ragdoll'), ('bike','Bike','(bike|motor|moto)'),
  ('truck','Truck','truck'), ('tank','Tank','\ytank\y'), ('snake','Snake','(snake|worm|slither)'), ('physics','Physics','physics'),
  ('racing','Racing','(racing|racer)'), ('football','Football','(football|soccer)'), ('survival','Survival','survival'), ('merge','Merge','merge'),
  ('tycoon','Tycoon','tycoon'), ('runner','Runner','(runner|\yrun\y)'), ('2-player','2 Player','(2-player|2 player)')
), ins as (
  insert into public.tags (slug, name) select slug, name from kw on conflict (slug) do nothing returning 1
)
insert into public.game_tags (game_id, tag_id)
select g.id, t.id from public.games g join kw on lower(g.title) ~ kw.rx join public.tags t on t.slug = kw.slug
on conflict do nothing;

insert into public.tags (slug, name) values ('multiplayer','Multiplayer') on conflict (slug) do nothing;
insert into public.game_tags (game_id, tag_id)
select g.id, (select id from public.tags where slug = 'multiplayer')
from public.games g join public.categories c on c.id = g.category_id
where c.slug = 'multiplayer' or lower(g.title) ~ '(online|multiplayer|pvp|2-player|2 player|duel|arena|party royale|battle royale|\.io)'
on conflict do nothing;

-- 3. categories: the CrazyGames-style list
insert into public.categories (slug, name, icon, sort_order) values
  ('arcade','Arcade',null,3), ('board','Board',null,4), ('card','Card',null,5), ('clicker','Clicker',null,6), ('trivia','Trivia',null,14), ('word','Word',null,15)
on conflict (slug) do nothing;
update public.categories set slug = 'simulation' where slug = 'simulator' and not exists (select 1 from public.categories where slug = 'simulation');
update public.categories c set name = v.name, sort_order = v.ord, icon = null
from (values ('action','Action',1),('adventure','Adventure',2),('arcade','Arcade',3),('board','Board',4),('card','Card',5),('clicker','Clicker',6),
             ('driving','Driving',7),('io','.io',8),('puzzle','Puzzle',9),('shooting','Shooting',10),('simulation','Simulation',11),
             ('sports','Sports',12),('strategy','Strategy',13),('trivia','Trivia',14),('word','Word',15)) as v(slug,name,ord)
where c.slug = v.slug;

-- 4. move every game into the new list
with t as (
  select g.id,
  case
    when lower(g.title) ~ '\y(chess|ludo|checkers|backgammon|domino|carrom|mahjong)\y' then 'board'
    when lower(g.title) ~ '\y(solitaire|freecell|poker|blackjack|rummy)\y' then 'card'
    when lower(g.title) ~ '\y(quiz|trivia)\y' then 'trivia'
    when lower(g.title) ~ '\y(word|crossword|hangman|wordle)\y' then 'word'
    when lower(g.title) ~ '(tycoon|\yidle\y|clicker|incremental)' then 'clicker'
    when lower(g.title) ~ '(football|soccer|basketball|\ygolf\y|tennis|\ypool\y|referee|cricket)' then 'sports'
    when lower(g.title) ~ '(puzzle|\ysort\y|match 3|bubble|jewel|candy)' then 'puzzle'
    when lower(g.title) ~ '(simulator|simulation)' then 'simulation'
    when c.slug in ('shooting','driving','io','adventure','strategy','sports','action','puzzle','simulation','arcade','board','card','clicker','trivia','word') then c.slug
    when c.slug = 'fighting' then 'action'
    when c.slug = 'simulator' then 'simulation'
    else case
      when lower(g.title) ~ '(strike|fps|shooter|sniper|pvp|warfare)' then 'shooting'
      when lower(g.title) ~ '(drift|racing|parking|truck|bike|\ycar\y|motor|driver)' then 'driving'
      when lower(g.title) ~ '(bakery|supermarket|brookhaven|checkout|plow|real life|eating)' then 'simulation'
      when lower(g.title) ~ '(match|pop|crush|maze|stack|merge|bucket|lineo|orbs|balance|magnet)' then 'puzzle'
      when lower(g.title) ~ '(rush|run|obby|escape|jump|journey|survivor|parkour|flip|chop|dublix|egg)' then 'adventure'
      else 'arcade' end
  end as target
  from public.games g join public.categories c on c.id = g.category_id
)
update public.games g set category_id = (select id from public.categories where slug = t.target) from t where g.id = t.id;

delete from public.categories where slug in ('casual','3d','multiplayer','fighting','simulator')
  and not exists (select 1 from public.games g where g.category_id = categories.id);

-- 5. honest source names instead of a made-up studio
update public.games set developer = 'GameMonetize' where iframe_url like 'https://html5.gamemonetize.co/%';
update public.games set developer = 'OnlineGames.io' where iframe_url like 'https://cloud.onlinegames.io/%';

-- 6. your two original games
insert into public.games (slug, title, description, instructions, developer, thumbnail_url, iframe_url, width, height, category_id, play_count, rating_avg, is_featured, is_published, is_original)
select 'snake-escape', 'Snake Escape', 'Slide the snakes off the board without crashing into each other. Every level is bigger and trickier.',
       'Tap a snake to send it out the way its head points. If another snake is in the way, you crash. Clear every snake to win. Sign in to save your level and coins.',
       'Arcadia', '/thumbs/snake-escape.svg', '/games/snake-escape/index.html', 600, 800, c.id, 0, 0, true, true, true
from public.categories c where c.slug = 'puzzle'
on conflict (slug) do update set is_original = true, is_published = true, is_featured = true, iframe_url = excluded.iframe_url, thumbnail_url = excluded.thumbnail_url, developer = 'Arcadia';
insert into public.games (slug, title, description, instructions, developer, thumbnail_url, iframe_url, width, height, category_id, play_count, rating_avg, is_featured, is_published, is_original)
select 'tap-target', 'Tap Target', 'Tap the targets before they vanish, chain combos and never touch a bomb. Every level is faster and trickier.',
       'Tap glowing targets to score. Gold targets are worth 3. Avoid bombs, because later bombs hide in plain sight. Sign in to save your level and coins.',
       'Arcadia', '/thumbs/tap-target.svg', '/games/tap-target/index.html', 600, 800, c.id, 0, 0, true, true, true
from public.categories c where c.slug = 'arcade'
on conflict (slug) do update set is_original = true, is_published = true, is_featured = true, iframe_url = excluded.iframe_url, thumbnail_url = excluded.thumbnail_url, developer = 'Arcadia';

-- 7. hide (not delete) games that use well-known franchise names, and duplicates
update public.games set is_published = false, hidden_reason = 'franchise or trademark in title'
where is_published and not is_original
  and lower(title) ~ '(call of duty|\ygta\y|resident evil|half life|\yhalo\y|gears of war|doom eternal|minecraft|counter strike|terminator|double dragon|f\.e\.a\.r|need for drift|ridge racer|brookhaven|roblox|stumble boys|dr\. ?parking|dr\. ?driving)';
with d as (select id, row_number() over (partition by iframe_url order by play_count desc, created_at asc, id) rn from public.games where is_published)
update public.games g set is_published = false, hidden_reason = 'duplicate embed' from d where g.id = d.id and d.rn > 1;
with d as (select id, row_number() over (partition by regexp_replace(lower(title), '[^a-z0-9]', '', 'g') order by play_count desc, created_at asc, id) rn from public.games where is_published)
update public.games g set is_published = false, hidden_reason = 'duplicate title' from d where g.id = d.id and d.rn > 1;

-- 8. close the two open functions the website no longer needs
revoke execute on function public.import_games_batch(jsonb) from public, anon, authenticated;
revoke execute on function public.increment_play_count(text) from public, anon, authenticated;

-- 9. keep "Updated" honest from now on
create or replace function public.touch_games_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists games_touch_updated_at on public.games;
create trigger games_touch_updated_at before update on public.games for each row
  when (old.* is distinct from new.*) execute function public.touch_games_updated_at();
revoke execute on function public.touch_games_updated_at() from public, anon, authenticated;;
