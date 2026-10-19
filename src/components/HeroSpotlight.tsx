"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatCount } from "@/lib/format";
import type { GameCardData } from "@/lib/queries";

export default function HeroSpotlight({ games }: { games: GameCardData[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = games.length;
  if (count === 0) return null;

  const go = (i: number) => setIndex((i + count) % count);
  const game = games[index];

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured games"
      className="fade-up relative mt-6 overflow-hidden rounded-3xl border border-edge bg-panel"
    >
      {/* Blurred, glowing backdrop that cross-fades between games */}
      {games.map((g, i) => (
        <div
          key={g.id}
          aria-hidden
          className={
            "absolute inset-0 transition-opacity duration-1000 " +
            (i === index ? "opacity-100" : "opacity-0")
          }
        >
          <Image
            src={g.thumbnailUrl}
            alt=""
            fill
            sizes="100vw"
            className="scale-125 object-cover blur-2xl brightness-[0.45] saturate-150"
          />
        </div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent" />

      <div className="relative grid items-center gap-8 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
        {/* The "key" makes this text re-animate on every new slide */}
        <div key={game.id} className="hero-text space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-sun/15 px-3 py-1 text-xs font-black uppercase tracking-wider text-sun ring-1 ring-sun/40">
            <span>🔥 Featured #{index + 1}</span>
            {game.category.name ? (
              <>
                <span>•</span>
                <span>{game.category.name}</span>
              </>
            ) : null}
          </div>

          <h1 className="font-display text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            {game.title}
          </h1>

          <p className="line-clamp-3 max-w-xl text-sm text-fg/80 sm:text-base">{game.description}</p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/game/${game.slug}`}
              className="inline-flex items-center gap-2 rounded-2xl bg-sun px-7 py-3.5 font-display text-base font-black text-ink shadow-[0_0_35px_rgba(204,255,0,0.55)] transition hover:scale-105 active:scale-95"
            >
              ▶ Play Now
            </Link>
            {game.category.slug ? (
              <Link
                href={`/search?category=${game.category.slug}`}
                className="rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20"
              >
                More {game.category.name}
              </Link>
            ) : null}
            <span className="text-xs font-semibold text-fg/70">
              <span className="font-bold text-white">{formatCount(game.playCount)}</span> plays
              {game.ratingAvg ? ` · ★ ${game.ratingAvg.toFixed(1)}` : ""}
            </span>
          </div>
        </div>

        {/* Big artwork: all slides stacked, only the active one is visible */}
        <Link
          href={`/game/${game.slug}`}
          aria-label={`Play ${game.title}`}
          className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl ring-2 ring-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.65)]"
        >
          {games.map((g, i) => (
            <Image
              key={g.id}
              src={g.thumbnailUrl}
              alt={i === index ? g.title : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 45vw, 100vw"
              className={
                "object-cover transition-all duration-700 ease-out " +
                (i === index ? "scale-100 opacity-100 group-hover:scale-105" : "scale-110 opacity-0")
              }
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sun pl-1 text-3xl font-black text-ink shadow-[0_0_40px_rgba(204,255,0,0.7)]">
              ▶
            </span>
          </div>
        </Link>
      </div>

      {/* Controls: arrows + progress bars */}
      {count > 1 ? (
        <div className="relative flex items-center gap-3 px-6 pb-6 md:px-10">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous game"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white ring-1 ring-white/20 transition hover:bg-sun hover:text-ink"
          >
            ‹
          </button>

          <div className="flex flex-1 gap-2">
            {games.map((g, i) => (
              <button
                key={g.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${g.title}`}
                className="relative flex h-6 flex-1 items-center"
              >
                <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                  {i === index ? (
                    <span
                      key={index}
                      className="hero-progress absolute inset-y-0 left-0 rounded-full bg-sun"
                      style={{ animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() => go(index + 1)}
                    />
                  ) : (
                    <span
                      className={
                        "absolute inset-y-0 left-0 rounded-full bg-sun/60 " + (i < index ? "w-full" : "w-0")
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next game"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-bold text-white ring-1 ring-white/20 transition hover:bg-sun hover:text-ink"
          >
            ›
          </button>
        </div>
      ) : null}
    </section>
  );
}
