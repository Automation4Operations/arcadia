-- Optional sample data so the site shows something. Replace URLs with your real R2 URLs.
insert into public.categories (slug, name, icon, sort_order) values
  ('action', 'Action', '⚔️', 1),
  ('puzzle', 'Puzzle', '🧩', 2),
  ('driving', 'Driving', '🏎️', 3),
  ('io', '.io Games', '🌐', 4),
  ('casual', 'Casual', '🎈', 5);

insert into public.tags (slug, name) values
  ('2-player', '2 Player'), ('multiplayer', 'Multiplayer'), ('relaxing', 'Relaxing'), ('3d', '3D');

insert into public.games (slug, title, description, instructions, developer, thumbnail_url, iframe_url, category_id, play_count, rating_avg, is_featured)
select 'sample-game', 'Sample Game', 'A placeholder game. Replace this row with a real one.', 'Use arrow keys or tap to play.', 'You',
       'https://example.com/thumbs/sample-game.webp', 'https://example.com/sample-game/index.html',
       c.id, 1200, 4.5, true
from public.categories c where c.slug = 'casual';
