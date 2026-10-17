export type RecentGame = {
  slug: string;
  title: string;
  thumbnailUrl: string;
  playedAt?: number;
};

const KEY = "arcadia:recent";
const MAX = 16;

export function readRecent(): RecentGame[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecent(item: Omit<RecentGame, "playedAt">) {
  if (typeof window === "undefined") return;
  try {
    const current = readRecent().filter((x) => x.slug !== item.slug);
    const updated: RecentGame[] = [{ ...item, playedAt: Date.now() }, ...current].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("arcadia:recent-updated"));
  } catch {}
}

export function clearRecent() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("arcadia:recent-updated"));
  } catch {}
}
