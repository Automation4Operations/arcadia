"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DAILY_BONUS,
  DAILY_GOAL,
  TITLES,
  dayKey,
  levelInfo,
  liveStreak,
  loadProgress,
  titleFor,
  type Progress,
} from "@/lib/progress";
import { useAuth } from "@/context/AuthContext";

export default function ProfileView() {
  const [p, setP] = useState<Progress | null>(null);
  const { user, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    setP(loadProgress());
    const onUpdate = (e: Event) => {
      const custom = e as CustomEvent<Progress>;
      if (custom.detail) setP(custom.detail);
      else setP(loadProgress());
    };
    window.addEventListener("arcadia:progress-updated", onUpdate);
    return () => window.removeEventListener("arcadia:progress-updated", onUpdate);
  }, []);

  if (!p) {
    return <div className="mt-10 h-64 animate-pulse rounded-3xl bg-panel ring-1 ring-edge" />;
  }

  const { level, into, need } = levelInfo(p.xp);
  const title = titleFor(level);
  const pct = Math.round((into / need) * 100);
  const streak = liveStreak(p);
  const todayGames = p.today.day === dayKey() ? p.today.games.length : 0;
  const claimed = p.today.day === dayKey() && p.today.claimed;
  const challengePct = Math.min(100, Math.round((todayGames / DAILY_GOAL) * 100));

  return (
    <div className="space-y-6">
      {/* Account Cloud Sync Banner */}
      <section className="rounded-2xl border border-edge bg-panel/70 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 text-lg">
              ☁️
            </div>
            <div>
              <p className="text-xs font-bold text-fg">Cloud Progress Synced</p>
              <p className="text-[11px] text-mute">{user.email || "Google Account"} · Auto-saved across all laptops & devices</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-arcade/10 text-arcade ring-1 ring-arcade/30 text-lg">
              💾
            </div>
            <div>
              <p className="text-xs font-bold text-fg">Auto-saved on this device (Level {level})</p>
              <p className="text-[11px] text-mute">Playing on another laptop or system? Link your account to sync instantly.</p>
            </div>
          </div>
        )}

        <div>
          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-xl bg-ink px-3.5 py-2 text-xs font-bold text-mute ring-1 ring-edge hover:text-fg hover:ring-red-500/50 transition cursor-pointer"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center gap-2 rounded-xl bg-arcade px-4 py-2 text-xs font-extrabold text-ink shadow-md shadow-arcade/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <span>☁️</span>
              <span>Sync with Cloud</span>
            </button>
          )}
        </div>
      </section>

      {/* Level card */}
      <section className="relative overflow-hidden rounded-3xl bg-panel p-6 ring-1 ring-edge sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-arcade/20 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-3xl bg-ink ring-2 ring-arcade shadow-[0_0_30px] shadow-arcade/30">
            <span className="text-3xl leading-none">{title.icon}</span>
            <span className="mt-1 font-display text-xs font-black text-arcade">LVL {level}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-mute">Your rank</p>
            <h2 className="font-display text-3xl font-black text-fg">{title.title}</h2>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-ink ring-1 ring-edge">
              <div
                className="h-full rounded-full bg-gradient-to-r from-arcade to-sun transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-mute">
              <span className="font-bold text-fg">{into}</span> / {need} XP to level {level + 1} · Total{" "}
              {p.xp.toLocaleString("en-US")} XP
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Day streak", value: streak, icon: "🔥" },
          { label: "Best streak", value: p.bestStreak, icon: "🏅" },
          { label: "Games tried", value: p.uniqueGames.length, icon: "🎮" },
          { label: "Total plays", value: p.plays, icon: "▶" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-panel/80 p-4 text-center ring-1 ring-edge">
            <p className="text-2xl">{s.icon}</p>
            <p className="mt-1 font-display text-2xl font-black text-fg">{s.value}</p>
            <p className="text-[11px] font-semibold text-mute">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Daily challenge */}
      <section className="rounded-3xl bg-panel/80 p-6 ring-1 ring-edge">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-fg">🎯 Daily challenge</h3>
          <span
            className={
              "rounded-full px-3 py-1 text-xs font-extrabold ring-1 " +
              (claimed ? "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30" : "bg-sun/15 text-sun ring-sun/30")
            }
          >
            {claimed ? "✓ Completed" : `+${DAILY_BONUS} XP`}
          </span>
        </div>
        <p className="mt-1 text-sm text-mute">Play {DAILY_GOAL} different games today.</p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink ring-1 ring-edge">
          <div className="h-full rounded-full bg-sun transition-all" style={{ width: `${challengePct}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-mute">
          {Math.min(todayGames, DAILY_GOAL)} / {DAILY_GOAL} games played today
        </p>
        {!claimed && (
          <Link
            href="/"
            className="mt-4 inline-flex rounded-xl bg-arcade px-4 py-2 text-xs font-extrabold text-ink hover:brightness-110"
          >
            Find a game →
          </Link>
        )}
      </section>

      {/* Title ladder */}
      <section className="rounded-3xl bg-panel/80 p-6 ring-1 ring-edge">
        <h3 className="font-display text-lg font-bold text-fg">🏆 Ranks</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {TITLES.map((t) => {
            const reached = level >= t.level;
            return (
              <li
                key={t.title}
                className={
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm ring-1 " +
                  (reached ? "bg-arcade/10 text-fg ring-arcade/40" : "bg-ink/60 text-mute ring-edge")
                }
              >
                <span>
                  {t.icon} <span className="font-bold">{t.title}</span>
                </span>
                <span className="text-xs">{reached ? "✓ Unlocked" : `Level ${t.level}`}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-center text-xs text-mute">
        ⚡ Progress is automatically saved locally and synced to the cloud when signed in.
      </p>
    </div>
  );
}
