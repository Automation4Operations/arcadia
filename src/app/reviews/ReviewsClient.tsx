"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readRecent } from "@/lib/recent";
import { getSeededGameStats, getSeededReviews } from "@/lib/seedStats";
import type { GameCardData } from "@/lib/queries";

type Props = {
  topGames: GameCardData[];
};

export default function ReviewsClient({ topGames }: Props) {
  const [activeTab, setActiveTab] = useState<"played" | "unplayed">("played");
  const [recentGames, setRecentGames] = useState<ReturnType<typeof readRecent>>([]);

  useEffect(() => {
    try {
      setRecentGames(readRecent());
    } catch {}
  }, []);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex rounded-2xl bg-panel/70 p-1.5 ring-1 ring-edge max-w-md mx-auto" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "played"}
          onClick={() => setActiveTab("played")}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === "played" ? "bg-arcade text-ink shadow-md" : "text-mute hover:text-fg"
          }`}
        >
          ✓ Games You Played ({recentGames.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "unplayed"}
          onClick={() => setActiveTab("unplayed")}
          className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
            activeTab === "unplayed" ? "bg-arcade text-ink shadow-md" : "text-mute hover:text-fg"
          }`}
        >
          ⭐ Community Reviews ({topGames.length})
        </button>
      </div>

      {/* Tab 1: Played Games */}
      {activeTab === "played" && (
        <section className="space-y-4">
          {recentGames.length === 0 ? (
            <div className="rounded-2xl bg-panel/50 p-12 text-center ring-1 ring-edge">
              <p className="text-3xl">🕹️</p>
              <h3 className="mt-3 font-display text-base font-bold text-fg">
                No games played yet on this device
              </h3>
              <p className="mt-1 text-xs text-mute">
                Jump into any game to leave a rating and share your review!
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-xl bg-arcade px-4 py-2 text-xs font-extrabold text-ink"
              >
                Explore Top Games
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentGames.map((game) => {
                const stats = getSeededGameStats(game.slug);
                return (
                  <div
                    key={game.slug}
                    className="flex flex-col justify-between rounded-2xl bg-panel/70 p-4 ring-1 ring-edge transition hover:ring-arcade/50"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={game.thumbnailUrl}
                          alt=""
                          className="h-12 w-16 rounded-xl object-cover ring-1 ring-edge shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-fg truncate text-sm">{game.title}</h4>
                          <p className="text-[10px] text-mute">Played recently</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-sun font-bold">★ {stats.ratingAvg} / 5.0</span>
                        <span className="text-mute">{stats.reviewCount} community reviews</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/game/${game.slug}`}
                        className="flex-1 rounded-xl bg-arcade py-2 text-center text-xs font-bold text-ink hover:brightness-110 transition"
                      >
                        Play Again
                      </Link>
                      <Link
                        href={`/game/${game.slug}#comments`}
                        className="rounded-xl bg-ink px-3 py-2 text-xs font-bold text-fg ring-1 ring-edge hover:ring-arcade transition"
                      >
                        Leave Review
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Community Reviews / Top Rated */}
      {activeTab === "unplayed" && (
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {topGames.map((game) => {
              const stats = getSeededGameStats(game.slug, game.playCount, game.ratingAvg);
              const reviews = getSeededReviews(game.slug, game.title, game.category.name);
              const sampleReview = reviews[0];

              return (
                <div
                  key={game.id}
                  className="rounded-2xl bg-panel/70 p-5 ring-1 ring-edge space-y-3 transition hover:ring-arcade/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={game.thumbnailUrl}
                        alt=""
                        className="h-11 w-14 rounded-xl object-cover ring-1 ring-edge shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-fg text-sm">{game.title}</h4>
                        <p className="text-[10px] text-mute">{game.category.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-sun">★ {stats.ratingAvg}</span>
                      <p className="text-[10px] text-mute">{stats.reviewCount} reviews</p>
                    </div>
                  </div>

                  {sampleReview && (
                    <div className="rounded-xl bg-ink/60 p-3 text-xs ring-1 ring-edge/60">
                      <div className="flex items-center justify-between text-[10px] text-mute mb-1">
                        <span className="font-bold text-fg">{sampleReview.name}</span>
                        <span className="text-sun">{"★".repeat(sampleReview.rating)}</span>
                      </div>
                      <p className="italic text-fg/80">&quot;{sampleReview.body}&quot;</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-mute">
                      ▶ {stats.plays.toLocaleString()} plays
                    </span>
                    <Link
                      href={`/game/${game.slug}`}
                      className="rounded-xl bg-arcade px-3.5 py-1.5 text-xs font-extrabold text-ink hover:brightness-110 transition"
                    >
                      Play &amp; Review →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
