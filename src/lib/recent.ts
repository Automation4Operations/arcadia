// Client-only helper: remembers the last games a visitor played (works for guests).
export type RecentGame = { slug: string; title: string; thumbnailUrl: string };

const KEY = "arcadia:recent";
const MAX = 12;

export function readRecent(): RecentGame[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function pushRecent(game: RecentGame) {
  try {
    const next = [game, ...readRecent().filter((g) => g.slug !== game.slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode) - ignore */
  }
}
