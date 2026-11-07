"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCount } from "@/lib/format";
import { readRecent } from "@/lib/recent";

type BadgeType = "hot" | "new" | "top";

export type GameCardProps = {
  game: {
    slug: string;
    title: string;
    description?: string;
    thumbnailUrl: string;
    iframeUrl?: string;
    playCount?: number;
    ratingAvg?: number;
    category?: { name: string } | null;
    badge?: BadgeType;
    is3d?: boolean;
  };
  featured?: boolean;
  priority?: boolean;
  badge?: BadgeType;
};

const BADGE_STYLE: Record<BadgeType, string> = {
  hot: "bg-gradient-to-r from-orange-500 to-red-500",
  new: "bg-gradient-to-r from-cyan-500 to-blue-500",
  top: "bg-gradient-to-r from-amber-400 to-orange-500",
};

const BADGE_LABEL: Record<BadgeType, string> = {
  hot: "🔥 Hot",
  new: "✨ New",
  top: "⭐ Top Pick",
};

export default function GameCard({ game, featured = false, priority = false, badge }: GameCardProps) {
  const [played, setPlayed] = useState(false);
  const shownBadge = game.badge ?? badge;

  // Real data: has this device played this game before?
  useEffect(() => {
    try {
      setPlayed(readRecent().some((g) => g.slug === game.slug));
    } catch {}
  }, [game.slug]);

  return (
    <Link
      href={`/game/${game.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-panel ring-1 ring-edge transition-all duration-300 hover:-translate-y-1 hover:ring-arcade/70 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] ${
        featured ? "md:flex-row md:items-stretch" : ""
      }`}
    >
      {/* Thumbnail */}
      <div
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-ink ${
          featured ? "md:aspect-[16/9] md:w-80" : ""
        }`}
      >
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes={featured ? "(max-width: 768px) 100vw, 320px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark fade on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Play button on hover */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-arcade text-lg text-ink shadow-lg transition-transform duration-300 group-hover:scale-100">
            ▶
          </span>
        </span>

        {/* Badges (top-left) */}
        <div className="absolute left-2 top-2 flex gap-1">
          {shownBadge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md ${BADGE_STYLE[shownBadge]}`}
            >
              {BADGE_LABEL[shownBadge]}
            </span>
          )}
          {game.is3d && (
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-black text-sky-300 ring-1 ring-sky-400/40 backdrop-blur-sm">
              3D
            </span>
          )}
        </div>

        {played && (
          <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-400/40 backdrop-blur-sm">
            ✓ Played
          </span>
        )}
      </div>

      {/* Text */}
      <div className={`flex flex-1 flex-col gap-1.5 p-3 ${featured ? "md:justify-center md:p-5" : ""}`}>
        <h3 className="line-clamp-1 font-display text-sm font-bold text-fg transition-colors group-hover:text-arcade sm:text-base">
          {game.title}
        </h3>
        {featured && game.description && (
          <p className="line-clamp-2 text-xs text-mute">{game.description}</p>
        )}
        <div className="mt-auto flex items-center gap-2 text-[11px] text-mute">
          {game.category?.name && (
            <span className="rounded-full bg-ink px-2 py-0.5 font-semibold ring-1 ring-edge">
              {game.category.name}
            </span>
          )}
          {typeof game.playCount === "number" && game.playCount > 0 && (
            <span>{formatCount(game.playCount)} plays</span>
          )}
        </div>
      </div>
    </Link>
  );
}
