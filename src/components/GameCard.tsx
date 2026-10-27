"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
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
  badge?: "hot" | "new";
};

// Starting values for the 3D tilt + spotlight effect
const TILT_STYLE = {
  "--rx": "0deg",
  "--ry": "0deg",
  "--lift": "0px",
  "--mx": "50%",
  "--my": "50%",
  transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--lift))",
  transition: "transform 200ms ease-out, box-shadow 300ms ease",
} as CSSProperties;

const SPOTLIGHT_STYLE: CSSProperties = {
  background: "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,0.22), transparent 55%)",
};

export default function GameCard({ game, featured = false, priority = false, badge }: GameCardProps) {
  const strength = featured ? 4 : 10;

  // Tilt the card toward the mouse
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * strength).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * strength).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--lift", "-6px");
  };

  // Put the card back flat when the mouse leaves
  const onLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
  };

  const meta = (
    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-semibold text-mute">
      {game.category?.name ? <span className="text-arcade-soft">{game.category.name}</span> : null}
      {game.playCount ? <span>🔥 {formatCount(game.playCount)}</span> : null}
      {game.ratingAvg ? <span className="text-sun">★ {game.ratingAvg.toFixed(1)}</span> : null}
    </div>
  );

  // Shared hover effects: badge, light sweep, spotlight and play button
  const effects = (
    <>
      {badge ? (
        <span
          className={
            "absolute left-3 top-3 z-20 rounded-md px-2 py-0.5 text-[11px] font-black uppercase tracking-wider shadow-lg " +
            (badge === "hot"
              ? "animate-pulse bg-gradient-to-r from-orange-500 to-pink-500 text-white"
              : "bg-arcade text-ink")
          }
        >
          {badge === "hot" ? "🔥 Hot" : "✨ New"}
        </span>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={SPOTLIGHT_STYLE}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 z-10 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span
          className={
            "flex scale-75 items-center justify-center rounded-full bg-sun pl-1 font-black text-ink shadow-[0_0_30px_rgba(204,255,0,0.65)] transition-transform duration-300 group-hover:scale-100 " +
            (featured ? "h-20 w-20 text-3xl" : "h-14 w-14 text-xl")
          }
        >
          ▶
        </span>
      </div>
    </>
  );

  const baseClasses =
    "group relative block overflow-hidden rounded-2xl bg-panel ring-1 ring-edge hover:z-30 hover:ring-2 hover:ring-sun hover:shadow-[0_18px_45px_rgba(204,255,0,0.22)] focus-visible:ring-2 focus-visible:ring-sun";

  // Big "Top Pick" tile: artwork fills the tile, text over a dark fade
  if (featured) {
    return (
      <Link
        href={"/game/" + game.slug}
           prefetch={false}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        style={TILT_STYLE}
        className={baseClasses + " col-span-2 row-span-2"}
      >
        <div className="relative h-full min-h-[280px] w-full overflow-hidden bg-ink">
          <Image
            src={game.thumbnailUrl}
            alt={game.title}
            fill
            priority={priority}
            sizes="(min-width:1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
          />
          {effects}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-20">
            <span className="rounded-md bg-sun px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-ink">
              🏆 Top Pick
            </span>
            <h3 className="mt-2 font-display text-2xl font-extrabold text-white drop-shadow sm:text-3xl">
              {game.title}
            </h3>
            {game.description ? (
              <p className="mt-1 line-clamp-2 max-w-xl text-sm text-fg/85">{game.description}</p>
            ) : null}
            {meta}
          </div>
        </div>
      </Link>
    );
  }

  // Normal card: full artwork on top, info underneath
  return (
    <Link
      href={"/game/" + game.slug}
      prefetch={false}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={TILT_STYLE}
      className={baseClasses}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
        />
        {effects}
      </div>
      <div className="px-3 pb-3 pt-2.5">
        <h3 className="truncate font-display text-[15px] font-extrabold text-fg transition-colors group-hover:text-sun">
          {game.title}
        </h3>
        {meta}
      </div>
    </Link>
  );
}
