"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { CategoryItem } from "@/lib/queries";
import { readRecent } from "@/lib/recent";
import VaultDrawer from "./VaultDrawer";

const RANDOM_TOP_SLUGS = [
  "warstrike-3d-tactical-royale",
  "super-car-driving-parking-3d",
  "chess-online-club-3d",
  "snaker-io-eat-and-grow",
  "fps-strike-multiplayer-3d",
  "burnout-city-night-drift-3d",
  "highway-moto-traffic-rider-3d",
  "draw-the-car-path-physics-puzzle",
  "99-nights-in-the-forest-survival",
  "steal-brainrots-multiplayer-3d",
];

function NavbarInner({ categories }: { categories: CategoryItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategory = pathname === "/search" ? params.get("category") : null;
  const [q, setQ] = useState(params.get("q") ?? "");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [xp, setXp] = useState(120);
  const [onlineCount, setOnlineCount] = useState(1480);

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  useEffect(() => {
    const updateStats = () => {
      const recentCount = readRecent().length;
      setXp(100 + recentCount * 75);
    };
    updateStats();
    setOnlineCount(1350 + Math.floor(Math.random() * 450));
    window.addEventListener("arcadia:recent-updated", updateStats);
    return () => window.removeEventListener("arcadia:recent-updated", updateStats);
  }, []);

  const level = Math.max(1, Math.floor(xp / 150));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    const next = new URLSearchParams();
    if (trimmed) next.set("q", trimmed);
    if (activeCategory) next.set("category", activeCategory);
    router.push("/search" + (next.toString() ? "?" + next.toString() : ""));
  }

  function playRandomHit() {
    const pick = RANDOM_TOP_SLUGS[Math.floor(Math.random() * RANDOM_TOP_SLUGS.length)];
    router.push("/game/" + pick);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-arcade to-sun font-display text-xl font-black text-ink shadow-md transition group-hover:rotate-6"
          >
            A
          </span>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-fg">
              ARCADIA
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Instant Browser Gaming
            </span>
          </div>
        </Link>

        <form onSubmit={onSubmit} role="search" className="relative mx-auto flex-1 max-w-xl">
          <label htmlFor="global-search" className="sr-only">
            Search games
          </label>
          <input
            id="global-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search BGMI style, Dr. Parking, Screw puzzle, Ludo, Chess, Snake..."
            className="w-full rounded-xl border border-edge bg-panel py-2.5 pl-10 pr-4 text-sm text-fg placeholder:text-mute focus:border-arcade focus:outline-none focus:ring-2 focus:ring-arcade/40"
          />
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-mute"
          >
            <path d="M8.5 3a5.5 5.5 0 104.38 8.82l3.65 3.65 1.06-1.06-3.65-3.65A5.5 5.5 0 008.5 3zm0 1.5a4 4 0 110 8 4 4 0 010-8z" />
          </svg>
        </form>

        {/* Gamer XP Level Pill (Stored in user device localStorage) */}
        <div
          title="Level up by playing games! Stored on your device."
          className="hidden md:flex items-center gap-2 rounded-xl border border-edge bg-panel px-3 py-1.5 text-xs font-extrabold text-fg"
        >
          <span className="rounded-md bg-sun px-1.5 py-0.5 text-[10px] font-black text-ink">
            LVL {level}
          </span>
          <span className="text-arcade-soft">{xp} XP</span>
        </div>

        {/* Surprise Me / Random Hit Button */}
        <button
          type="button"
          onClick={playRandomHit}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-arcade to-sun px-3.5 py-2 text-xs font-black text-ink shadow-md transition hover:scale-105 shrink-0"
        >
          <span aria-hidden>🎲</span>
          <span className="hidden sm:inline">Surprise Me</span>
        </button>

        <button
          type="button"
          onClick={() => setVaultOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-edge bg-panel px-3.5 py-2 text-xs font-bold text-fg transition hover:border-arcade hover:text-arcade-soft shrink-0"
        >
          <span aria-hidden>⚡</span>
          <span className="hidden sm:inline">My Vault</span>
        </button>
      </div>

      {categories.length > 0 && (
        <nav
          aria-label="Game categories"
          className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto px-4 pb-2.5 no-scrollbar"
        >
          <CategoryPill href="/" active={pathname === "/"} label="Lobby" icon="🏠" />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              href={"/search?category=" + c.slug}
              active={activeCategory === c.slug}
              label={c.name}
              icon={c.icon ?? undefined}
            />
          ))}
        </nav>
      )}

      <VaultDrawer open={vaultOpen} onClose={() => setVaultOpen(false)} />
    </header>
  );
}

export default function Navbar({ categories }: { categories: CategoryItem[] }) {
  return (
    <Suspense fallback={<div className="h-24 border-b border-edge bg-ink/90" />}>
      <NavbarInner categories={categories} />
    </Suspense>
  );
}

function CategoryPill({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon?: string;
}) {
  const pillClasses =
    "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition " +
    (active
      ? "bg-sun text-ink shadow-sm"
      : "bg-panel text-fg/85 hover:bg-edge hover:text-fg");

  return (
    <Link href={href} className={pillClasses}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      {label}
    </Link>
  );
}
