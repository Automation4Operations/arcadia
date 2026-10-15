"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCount } from "@/lib/format";

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
  };
  featured?: boolean;
  priority?: boolean;
};

export default function GameCard({ game, featured = false, priority = false }: GameCardProps) {
  const [hovered, setHovered] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);

  // Trigger live gameplay preview after holding cursor on card for 400ms (just like CrazyGames/Poki)
  useEffect(() => {
    if (!hovered) {
      setShowLivePreview(false);
      setPreviewReady(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowLivePreview(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [hovered]);

  const cardClasses =
    "group relative block overflow-hidden rounded-2xl bg-panel ring-1 ring-edge transition-all duration-300 hover:-translate-y-1.5 hover:z-30 hover:ring-2 hover:ring-sun hover:shadow-[0_16px_42px_rgba(204,255,0,0.28)] focus-visible:ring-2 focus-visible:ring-sun " +
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
        {/* Base HD Cover Art with animated pan-and-zoom while hovering */}
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
            "object-cover transition-all duration-[1800ms] ease-out " +
            (hovered ? "scale-125 brightness-110 contrast-110" : "scale-100")
          }
        />

        {/* Real Live Gameplay Preview Mounted Inside Card on Cursor Hover */}
        {showLivePreview && game.iframeUrl && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden bg-black/40">
            <iframe
              src={game.iframeUrl}
              title={"Preview " + game.title}
              onLoad={() => setPreviewReady(true)}
              tabIndex={-1}
              aria-hidden="true"
              sandbox="allow-scripts allow-same-origin"
              allow="autoplay"
              className={
                "pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 transition-opacity duration-500 " +
                (previewReady ? "opacity-100" : "opacity-0")
              }
            />
          </div>
        )}

        {/* Top-left Genre / Top Pick Pill */}
        <div className="absolute left-2.5 top-2.5 z-20 flex items-center gap-1.5">
          {featured ? (
            <span className="rounded-md bg-sun px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink shadow-md">
              🔥 TOP PICK
            </span>
          ) : (
            <span className="rounded-md bg-ink/85 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-arcade-soft backdrop-blur-md ring-1 ring-edge">
              {game.category?.name || "3D HD"}
            </span>
          )}
        </div>

        {/* Top-right LIVE PREVIEW Badge on Hover */}
        {hovered && (
          <span className="absolute right-2.5 top-2.5 z-20 inline-flex items-center gap-1.5 rounded-md bg-ink/90 px-2 py-0.5 text-[10px] font-black uppercase text-sun ring-1 ring-sun/50 shadow-lg">
            <span className="h-2 w-2 animate-ping rounded-full bg-sun" />
            {previewReady ? "LIVE GAMEPLAY" : "PREVIEWING..."}
          </span>
        )}

        {/* Bottom Metadata + Gameplay Preview Bar */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/85 to-transparent p-3 pt-10">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                className={
                  "truncate font-display font-extrabold text-white drop-shadow " +
                  (featured ? "text-lg sm:text-2xl" : "text-sm")
                }
              >
                {game.title}
              </h3>

              {/* Show 1-line what-you-play preview when hovering */}
              {hovered && game.description && (
                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-fg/90">
                  {game.description}
                </p>
              )}

              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-fg/85">
                {game.category?.name && (
                  <span className="text-arcade-soft">{game.category.name}</span>
                )}
                <span>•</span>
                <span className="rounded bg-white/15 px-1 text-[10px] text-white">2026</span>
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

            {hovered && (
              <span className="shrink-0 rounded-lg bg-sun px-2.5 py-1 font-display text-[11px] font-black text-ink shadow-md">
                PLAY ▶
              </span>
            )}
          </div>
        </div>

        {/* CrazyGames-style Bottom Sweep Progress Bar on Hover */}
        {hovered && (
          <div className="absolute inset-x-0 bottom-0 z-30 h-1 bg-edge overflow-hidden">
            <div className="h-full w-full origin-left animate-[pulse_1s_ease-in-out_infinite] bg-gradient-to-r from-arcade via-sun to-arcade" />
          </div>
        )}
      </div>
    </Link>
  );
}
