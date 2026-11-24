import { supabase } from "./supabaseClient";

export type Progress = {
  xp: number;
  plays: number;
  uniqueGames: string[];
  streak: number;
  bestStreak: number;
  lastDay: string;
  today: { day: string; games: string[]; claimed: boolean };
  gameStates?: Record<string, { updatedAt: number; data: any }>;
};

const KEY = "arcadia:progress:v1";
const GUEST_MAX_SAVED_GAMES = 5;
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

export function emptyProgress(): Progress {
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
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    return { ...emptyProgress(), ...parsed };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
    window.dispatchEvent(new CustomEvent("arcadia:progress-updated", { detail: p }));
  } catch {}

  // Asynchronously sync to Cloud if signed in
  saveToCloud(p).catch(() => {});
}

async function saveToCloud(p: Progress) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ progress: p, updated_at: new Date().toISOString() }).eq("id", user.id);
  } catch {}
}

export function mergeProgress(local: Progress, remote: Partial<Progress> | null | undefined): Progress {
  if (!remote) return local;
  const uniqueSet = new Set([...(local.uniqueGames || []), ...(remote.uniqueGames || [])]);
  const uniqueGames = Array.from(uniqueSet).slice(-1000);

  const localXp = typeof local.xp === "number" ? local.xp : 0;
  const remoteXp = typeof remote.xp === "number" ? remote.xp : 0;

  const todayStr = dayKey();
  let today = local.today?.day === todayStr ? local.today : { day: todayStr, games: [], claimed: false };
  if (remote.today?.day === todayStr) {
    const combinedGames = Array.from(new Set([...today.games, ...(remote.today.games || [])]));
    today = {
      day: todayStr,
      games: combinedGames,
      claimed: today.claimed || Boolean(remote.today.claimed),
    };
  }

  // Merge individual game state saves
  const mergedGameStates: Record<string, { updatedAt: number; data: any }> = {
    ...(local.gameStates || {}),
  };
  if (remote.gameStates) {
    for (const [slug, remoteState] of Object.entries(remote.gameStates)) {
      const localState = mergedGameStates[slug];
      if (!localState || (remoteState?.updatedAt || 0) > (localState.updatedAt || 0)) {
        mergedGameStates[slug] = remoteState;
      }
    }
  }

  return {
    xp: Math.max(localXp, remoteXp),
    plays: Math.max(local.plays || 0, remote.plays || 0),
    uniqueGames,
    streak: Math.max(local.streak || 0, remote.streak || 0),
    bestStreak: Math.max(local.bestStreak || 0, remote.bestStreak || 0),
    lastDay: localXp >= remoteXp ? (local.lastDay || remote.lastDay || "") : (remote.lastDay || local.lastDay || ""),
    today,
    gameStates: mergedGameStates,
  };
}

/** Save individual game progress state (levels, coins, settings) */
export async function saveGameState(slug: string, stateData: any) {
  if (typeof window === "undefined" || !slug) return;
  const p = loadProgress();
  if (!p.gameStates) p.gameStates = {};

  p.gameStates[slug] = {
    updatedAt: Date.now(),
    data: stateData,
  };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Guest: silently restrict local cache to latest 5 games to avoid filling browser memory
      const entries = Object.entries(p.gameStates).sort(
        (a, b) => (b[1]?.updatedAt || 0) - (a[1]?.updatedAt || 0)
      );
      if (entries.length > GUEST_MAX_SAVED_GAMES) {
        p.gameStates = Object.fromEntries(entries.slice(0, GUEST_MAX_SAVED_GAMES));
      }
      localStorage.setItem(KEY, JSON.stringify(p));
      window.dispatchEvent(new CustomEvent("arcadia:progress-updated", { detail: p }));
      return;
    }

    // Logged in: save and upload to Supabase cloud
    saveProgress(p);
  } catch {
    localStorage.setItem(KEY, JSON.stringify(p));
  }
}

/** Get saved state for a specific game */
export function getGameState(slug: string): any | null {
  const p = loadProgress();
  return p.gameStates?.[slug]?.data ?? null;
}

/** Syncs local and remote progress. Loads from Supabase and merges without losing any XP. */
export async function syncCloudProgress(userId?: string): Promise<Progress> {
  const currentLocal = loadProgress();
  if (typeof window === "undefined") return currentLocal;

  try {
    let targetUid = userId;
    if (!targetUid) {
      const { data: { user } } = await supabase.auth.getUser();
      targetUid = user?.id;
    }
    if (!targetUid) return currentLocal;

    const { data } = await supabase
      .from("profiles")
      .select("progress")
      .eq("id", targetUid)
      .maybeSingle();

    const merged = mergeProgress(currentLocal, data?.progress);
    localStorage.setItem(KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent("arcadia:progress-updated", { detail: merged }));

    // If Snake Escape state was synced from cloud, restore its specific local key on this new device
    const snakeState = merged.gameStates?.["snake-escape"]?.data || merged.gameStates?.["snake"]?.data;
    if (snakeState) {
      try {
        localStorage.setItem("se_state", JSON.stringify(snakeState));
      } catch {}
    }

    // Send merged data back to ensure cloud is up to date with any guest play
    await supabase.from("profiles").update({ progress: merged, updated_at: new Date().toISOString() }).eq("id", targetUid);
    return merged;
  } catch {
    return currentLocal;
  }
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
  saveProgress(p);
  return gained;
}
