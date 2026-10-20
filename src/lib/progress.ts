export type Progress = {
  xp: number;
  plays: number;
  uniqueGames: string[];
  streak: number;
  bestStreak: number;
  lastDay: string;
  today: { day: string; games: string[]; claimed: boolean };
};

const KEY = "arcadia:progress:v1";
export const DAILY_GOAL = 3;
export const DAILY_BONUS = 50;

/** Local date like "2026-10-20" (uses the player's own timezone) */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

function empty(): Progress {
  return {
    xp: 0,
    plays: 0,
    uniqueGames: [],
    streak: 0,
    bestStreak: 0,
    lastDay: "",
    today: { day: "", games: [], claimed: false },
  };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

/** Level math: level 1 -> 2 needs 100 XP, level 2 -> 3 needs 200 XP, and so on */
export function levelInfo(xp: number): { level: number; into: number; need: number } {
  let level = 1;
  let need = 100;
  let rest = Math.max(0, Math.floor(xp));
  while (rest >= need) {
    rest -= need;
    level += 1;
    need = level * 100;
  }
  return { level, into: rest, need };
}

export const TITLES: { level: number; title: string; icon: string }[] = [
  { level: 1, title: "Rookie", icon: "🐣" },
  { level: 3, title: "Player", icon: "🎮" },
  { level: 5, title: "Gamer", icon: "🕹️" },
  { level: 10, title: "Pro", icon: "⚡" },
  { level: 15, title: "Elite", icon: "💎" },
  { level: 20, title: "Legend", icon: "🏆" },
  { level: 30, title: "Arcadia Master", icon: "👑" },
];

export function titleFor(level: number) {
  let t = TITLES[0];
  for (const x of TITLES) if (level >= x.level) t = x;
  return t;
}

/** Streak shown to the player (0 if they missed a day) */
export function liveStreak(p: Progress): number {
  return p.lastDay === dayKey() || p.lastDay === yesterdayKey() ? p.streak : 0;
}

/** Call when a player starts a game. Returns the XP gained. */
export function recordPlay(slug: string): number {
  if (typeof window === "undefined" || !slug) return 0;
  const p = loadProgress();
  const today = dayKey();
  let gained = 0;

  // Daily streak
  if (p.lastDay !== today) {
    p.streak = p.lastDay === yesterdayKey() ? p.streak + 1 : 1;
    p.bestStreak = Math.max(p.bestStreak, p.streak);
    p.lastDay = today;
  }

  // New day = new daily challenge
  if (p.today.day !== today) p.today = { day: today, games: [], claimed: false };

  // XP only once per game per day (no farming by reloading)
  if (!p.today.games.includes(slug)) {
    p.today.games.push(slug);
    gained += 10;
    if (!p.uniqueGames.includes(slug)) {
      p.uniqueGames.push(slug);
      if (p.uniqueGames.length > 1000) p.uniqueGames = p.uniqueGames.slice(-1000);
      gained += 15;
    }
  }

  // Daily challenge bonus
  if (!p.today.claimed && p.today.games.length >= DAILY_GOAL) {
    p.today.claimed = true;
    gained += DAILY_BONUS;
  }

  p.plays += 1;
  p.xp += gained;
  save(p);
  return gained;
}
