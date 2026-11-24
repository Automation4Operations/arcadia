"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, levelInfo, titleFor } from "@/lib/progress";
import { useAuth } from "@/context/AuthContext";
import { getSeededGameStats } from "@/lib/seedStats";
import type { GameCardData } from "@/lib/queries";

type Props = {
  trendingGames: GameCardData[];
};

export default function ScoresClient({ trendingGames }: Props) {
  const { user } = useAuth();
  const [stats, setStats] = useState({ xp: 0, level: 1, title: "Rookie", need: 100, into: 0 });

  useEffect(() => {
    const update = () => {
      const p = loadProgress();
      const info = levelInfo(p.xp);
      const titleObj = titleFor(info.level);
      setStats({
        xp: p.xp,
        level: info.level,
        title: titleObj.title,
        need: info.need,
        into: info.into,
      });
    };
    update();
    window.addEventListener("arcadia:progress-updated", update);
    return () => window.removeEventListener("arcadia:progress-updated", update);
  }, []);

  return (
    <div className="space-y-8">
      {/* Player Card */}
      <section className="rounded-3xl bg-gradient-to-r from-arcade/20 via-panel to-sun/15 p-6 ring-1 ring-edge sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-panel text-2xl font-black text-arcade ring-2 ring-arcade/60 shadow-lg">
              L{stats.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold text-fg">
                  {user ? (user.email ? user.email.split("@")[0] : "Player") : "Guest Player"}
                </h2>
                <span className="rounded-full bg-sun/20 px-2.5 py-0.5 text-[10px] font-black text-sun">
                  {stats.title}
                </span>
              </div>
              <p className="text-xs text-mute mt-1">
                {stats.xp} Total XP · {Math.max(0, stats.need - stats.into)} XP to Level {stats.level + 1}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profile"
              className="rounded-xl bg-panel px-4 py-2.5 text-xs font-bold text-fg ring-1 ring-edge hover:ring-arcade transition"
            >
              Full Profile
            </Link>
            {!user && (
              <Link
                href="/signup"
                className="rounded-xl bg-arcade px-4 py-2.5 text-xs font-extrabold text-ink hover:brightness-110 transition shadow-md shadow-arcade/20"
              >
                ☁️ Cloud Sync
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Community Leaderboard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-fg">🏆 Community Leaderboards</h2>
            <p className="text-xs text-mute">Top rated &amp; most played browser games on Arcadia</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-panel/70 ring-1 ring-edge">
          <div className="grid grid-cols-[50px_1fr_90px_90px] border-b border-edge/60 bg-ink/50 px-4 py-3 text-[11px] font-extrabold uppercase text-mute">
            <span>Rank</span>
            <span>Game Title</span>
            <span className="text-right">Rating</span>
            <span className="text-right">Plays</span>
          </div>

          <div className="divide-y divide-edge/40">
            {trendingGames.map((game, idx) => {
              const seed = getSeededGameStats(game.slug, game.playCount, game.ratingAvg);
              const rank = idx + 1;
              const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;

              return (
                <Link
                  key={game.id}
                  href={`/game/${game.slug}`}
                  className="grid grid-cols-[50px_1fr_90px_90px] items-center px-4 py-3 text-xs transition hover:bg-ink/60"
                >
                  <span className="font-display font-extrabold text-mute">
                    {medal || `#${rank}`}
                  </span>
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={game.thumbnailUrl}
                      alt=""
                      className="h-8 w-11 rounded-lg object-cover ring-1 ring-edge shrink-0"
                    />
                    <div className="min-w-0 truncate">
                      <p className="truncate font-bold text-fg hover:text-arcade">{game.title}</p>
                      <p className="text-[10px] text-mute truncate">{game.category.name}</p>
                    </div>
                  </div>
                  <span className="text-right font-bold text-sun">
                    ★ {seed.ratingAvg}
                  </span>
                  <span className="text-right font-semibold text-fg/80">
                    {seed.plays.toLocaleString()}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
