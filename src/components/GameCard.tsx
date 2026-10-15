"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCount } from "@/lib/format";

export type GameCardProps = {
  game: {
    slug: string;
    title: string;
    thumbnailUrl: string;
    playCount?: number;
    ratingAvg?: number;
    category?: { name: string } | null;
  };
  featured?: boolean;
  priority?: boolean;
};

export default function GameCard({ game, featured = false, priority = false }: GameCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardClasses =
    "group relative block overflow-hidden rounded-2xl bg-panel ring-1 ring-edge transition-all duration-300 hover:-translate-y-1.5 hover:z-20 hover:ring-2 hover:ring-sun hover:shadow-[0_14px_38px_rgba(204,255,0,0.22)] focus-visible:ring-2 focus-visible:ring-sun " +
    (featured ? "col-span-2 row-span-2" : "");

  return (
    <Link
      href={"/game/" + game.slug}
      prefetch={true}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cardClasses}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={
            featured
              ? "(min-width:1024px) 35vw, 100vw"
              : "(min-width:1280px) 18vw, (min-width:640px) 30vw, 50vw"
          }
          className={
            "object-cover transition duration-700 ease-out " +
            (hovered ? "scale-115 brightness-110 contrast-110" : "scale-100")
          }
        />

        {/* Top-left Hot / 3D Badge */}
        <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
          {featured ? (
            <span className="rounded-md bg-sun px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink shadow">
              🔥 TOP PICK
            </span>
          ) : (
            <span className="rounded-md bg-ink/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-arcade-soft backdrop-blur-md ring-1 ring-edge">
              {game.category?.name || "3D HD"}
            </span>
          )}
        </div>

        {/* Hover Live Preview Indicator */}
        {hovered && (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md bg-sun px-2 py-0.5 text-[10px] font-black uppercase text-ink shadow-md animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            INSTANT PLAY
          </span>
        )}

        {/* CrazyGames-style Bottom Info Overlay (Title + Category · Year · Plays · Rating) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3 pt-10 transition-all">
          <h3
            className={
              "truncate font-display font-extrabold text-white drop-shadow " +
              (featured ? "text-lg sm:text-2xl" : "text-sm")
            }
          >
            {game.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-fg/85">
            {game.category?.name && (
              <span className="text-arcade-soft">{game.category.name}</span>
            )}
            <span>•</span>
            <span className="rounded bg-white/15 px-1 py-0.2 text-[10px] text-white">2026</span>
            {game.playCount ? (
              <>
                <span>•</span>
                <span>🔥 {formatCount(game.playCount)}</span>
              </>
            ) : null}
            {game.ratingAvg ? (
              <>
                <span>•</span>
                <span className="text-sun">★ {game.ratingAvg.toFixed(1)}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
