"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, type CSSProperties, MouseEvent } from "react";
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
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`arcadia_progress_${game.slug}`) || 
                    localStorage.getItem(`progress_${game.slug}`) || 
                    localStorage.getItem(game.slug);
      if (saved) setHasSaved(true);
    } catch (e) {}
  }, [game.slug]);

  const strength = featured ? 4 : 10;

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

  const onLeave = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
  };

  const meta = (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      {game.category?.name && (
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50">
          {game.category.name}
        </span>
      )}
      {typeof game.ratingAvg === "number" && (
        <span className="flex items-center gap-1 font-semibold text-amber-400">
          ★ {game.ratingAvg.toFixed(1)}
        </span>
      )}
      {typeof game.playCount === "number" && (
        <span className="text-slate-500">• {formatCount(game.playCount)} plays</span>
      )}
    </div>
  );

  return (
    <Link
      href={`/game/${game.slug}`}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={TILT_STYLE}
      className={`card-3d-wrapper group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:z-20 hover:border-violet-500/50 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.3)] ${
        featured ? "md:flex-row md:items-center md:gap-6 md:p-5" : ""
      }`}
    >
      <div className="card-3d-inner relative w-full overflow-hidden rounded-xl bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10"
          style={SPOTLIGHT_STYLE}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-20" />
        
        <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5">
          {badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md ${
                badge === "hot"
                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500"
              }`}
            >
              {badge}
            </span>
          )}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-violet-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE PREVIEW
          </span>
        </div>

        {hasSaved && (
          <span className="absolute top-2 right-2 z-30 bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-sm animate-pulse flex items-center gap-1">
            ⚡ SAVED
          </span>
        )}

        <div className={`relative aspect-[16/10] w-full ${featured ? "md:aspect-[16/9] md:w-80" : ""}`}>
          <Image
            src={game.thumbnailUrl}
            alt={game.title}
            fill
            priority={priority}
            sizes={featured ? "(max-width: 768px) 100vw, 320px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      <div className={`mt-3 flex flex-1 flex-col justify-between ${featured ? "md:mt-0" : ""}`}>
        <div>
          <h3 className="font-bold text-slate-100 group-hover:text-violet-400 transition-colors text-base line-clamp-1">
            {game.title}
          </h3>
          {game.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">
              {game.description}
            </p>
          )}
        </div>
        <div className="mt-3">{meta}</div>
      </div>
    </Link>
  );
}
