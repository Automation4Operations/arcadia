"use client";

import { useState, useMemo, useEffect } from "react";
import GameCard from "@/components/GameCard";
import type { GameCardData } from "@/lib/queries";
import { readRecent } from "@/lib/recent";

type Props = {
  initialGames: GameCardData[];
  categories: { slug: string; name: string }[];
};

type FilterTab = "all" | "played" | "unplayed";
type SortOption = "popular" | "rating" | "title" | "newest";

export default function AllGamesExplorer({ initialGames, categories }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [playedSlugs, setPlayedSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const recent = readRecent();
      setPlayedSlugs(new Set(recent.map((g) => g.slug)));
    } catch {}
  }, []);

  const filteredGames = useMemo(() => {
    return initialGames.filter((g) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = g.title.toLowerCase().includes(q);
        const matchesCat = g.category.name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat) return false;
      }
      // Category filter
      if (selectedCat !== "all" && g.category.slug !== selectedCat) {
        return false;
      }
      // Played / Unplayed tab
      const isPlayed = playedSlugs.has(g.slug);
      if (activeTab === "played" && !isPlayed) return false;
      if (activeTab === "unplayed" && isPlayed) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.playCount - a.playCount;
      if (sortBy === "rating") return b.ratingAvg - a.ratingAvg;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [initialGames, searchQuery, selectedCat, activeTab, sortBy, playedSlugs]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 rounded-2xl bg-panel/70 p-4 ring-1 ring-edge sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs: All / Played / Not Played */}
        <div className="flex rounded-xl bg-ink p-1 ring-1 ring-edge" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "all" ? "bg-arcade text-ink" : "text-mute hover:text-fg"
            }`}
          >
            All ({initialGames.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "played"}
            onClick={() => setActiveTab("played")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "played" ? "bg-arcade text-ink" : "text-mute hover:text-fg"
            }`}
          >
            ✓ Played ({playedSlugs.size})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "unplayed"}
            onClick={() => setActiveTab("unplayed")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeTab === "unplayed" ? "bg-arcade text-ink" : "text-mute hover:text-fg"
            }`}
          >
            ✨ New to You ({Math.max(0, initialGames.length - playedSlugs.size)})
          </button>
        </div>

        {/* Search input & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter games..."
            className="rounded-xl bg-ink px-3 py-1.5 text-xs text-fg ring-1 ring-edge placeholder:text-mute focus:outline-none focus:ring-1 focus:ring-arcade w-44"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label="Sort games"
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-fg ring-1 ring-edge focus:outline-none focus:ring-1 focus:ring-arcade"
          >
            <option value="popular">🔥 Most Played</option>
            <option value="rating">★ Highest Rated</option>
            <option value="title">🔤 Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedCat("all")}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 transition cursor-pointer ${
            selectedCat === "all"
              ? "bg-arcade text-ink ring-arcade"
              : "bg-panel text-mute ring-edge hover:text-fg"
          }`}
        >
          All Genres
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setSelectedCat(c.slug)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ring-1 transition cursor-pointer ${
              selectedCat === c.slug
                ? "bg-arcade text-ink ring-arcade"
                : "bg-panel text-mute ring-edge hover:text-fg"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Games Count */}
      <div className="flex items-center justify-between text-xs text-mute">
        <span>Showing {filteredGames.length} games</span>
        {selectedCat !== "all" && (
          <button
            type="button"
            onClick={() => setSelectedCat("all")}
            className="text-arcade hover:underline cursor-pointer"
          >
            Reset genre filter
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredGames.length === 0 ? (
        <div className="rounded-2xl bg-panel/50 p-12 text-center ring-1 ring-edge">
          <p className="text-3xl">🎮</p>
          <p className="mt-2 text-base font-bold text-fg">No games found</p>
          <p className="mt-1 text-xs text-mute">Try clearing filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredGames.map((game, i) => (
            <GameCard key={game.id} game={game} priority={i < 8} />
          ))}
        </div>
      )}
    </div>
  );
}
