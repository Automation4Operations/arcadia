"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, Suspense } from "react";
import VaultDrawer from "./VaultDrawer";

export type CategoryItem = {
  id?: string | number;
  name: string;
  slug: string;
  icon?: string | null;
};

type NavbarProps = {
  categories?: CategoryItem[];
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { name: "Battle Royale & FPS", slug: "battle-royale", icon: "🪂" },
  { name: "Dr. Driving & Parking", slug: "driving", icon: "🚗" },
  { name: "Screw, Rope & Chess", slug: "puzzle", icon: "🔩" },
  { name: "Snake & .io Arena", slug: "io-games", icon: "🐍" },
  { name: "Ludo & 2-Player Online", slug: "ludo", icon: "🎲" },
  { name: "3D Simulators & GTA", slug: "simulators", icon: "🕹️" },
  { name: "Runners & Obby 3D", slug: "runners", icon: "🏃" },
  { name: "Fighting & Ragdoll", slug: "fighting", icon: "🥊" },
  { name: "War & Strategy", slug: "strategy", icon: "🧠" },
  { name: "Candy Match & Merge", slug: "match", icon: "🍬" },
  { name: "8-Ball Pool & Sports", slug: "sports", icon: "🎱" },
  { name: "Unity 3D WebGL", slug: "unity-3d", icon: "🎮" },
  { name: "Action Arcade", slug: "action", icon: "⚔️" },
];

function NavbarInner({ categories = [] }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCat = searchParams?.get("cat") || "";

  const [q, setQ] = useState("");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use database categories if available, otherwise fallback to clean default list
  const menuCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push("/search?q=" + encodeURIComponent(trimmed));
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Clean CrazyGames-Style Top Header (No cluttered category scrollbar) */}
      <header className="sticky top-0 z-40 w-full border-b border-edge/80 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
          
          {/* Left: Sidebar Toggle Button + Neon Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-panel px-3.5 py-2 text-xs font-extrabold text-fg ring-1 ring-edge transition-all duration-200 hover:bg-arcade hover:text-white hover:ring-arcade hover:scale-105 active:scale-95"
              aria-label="Open Categories Menu"
            >
              <span className="text-base leading-none transition-transform duration-200 group-hover:scale-110">
                ☰
              </span>
              <span className="hidden sm:inline">Categories</span>
            </button>

            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-arcade via-indigo-500 to-sun shadow-lg shadow-arcade/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-xl font-black text-white">⚡</span>
              </div>
              <div>
                <span className="font-display text-xl font-black tracking-wider text-fg transition group-hover:text-sun">
                  ARCADIA
                </span>
                <span className="block text-[10px] font-extrabold tracking-widest text-arcade-soft uppercase">
                  Next-Gen 3D Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative flex w-full items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search 1,500+ games (Battle Royale, Dr. Driving, Chess...)"
                className="w-full rounded-full bg-panel/90 py-2.5 pl-4 pr-14 text-xs font-semibold text-fg placeholder:text-mute ring-1 ring-edge transition-all focus:outline-none focus:ring-2 focus:ring-arcade"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-full bg-arcade px-3 py-1 text-[10px] font-extrabold text-white transition hover:bg-arcade-soft"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/search?q=3d"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-3.5 py-2 text-xs font-extrabold text-sun ring-1 ring-sun/40 transition-all duration-200 hover:scale-105 hover:ring-sun"
            >
              <span>🎲</span>
              <span>3D Picks</span>
            </Link>

            <button
              type="button"
              onClick={() => setVaultOpen(true)}
              className="group relative flex items-center gap-1.5 rounded-xl bg-panel px-3.5 py-2 text-xs font-extrabold text-fg ring-1 ring-edge transition-all duration-200 hover:bg-arcade hover:text-white hover:ring-arcade hover:scale-105 active:scale-95"
            >
              <span className="transition-transform duration-200 group-hover:rotate-12">⚡</span>
              <span>My Vault</span>
            </button>

            <Link
              href="/about"
              className="hidden sm:inline-flex items-center rounded-xl bg-panel px-3 py-2 text-xs font-bold text-mute ring-1 ring-edge transition-all hover:text-fg hover:ring-arcade/60"
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* CrazyGames-Style Animated Left Sidebar Menu Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Left Drawer Panel */}
          <aside className="relative z-10 flex h-full w-72 sm:w-80 flex-col border-r border-edge bg-panel p-5 text-fg shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎮</span>
                <h2 className="font-display text-base font-extrabold tracking-wide text-fg">
                  Browse Categories
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg bg-ink px-2.5 py-1 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge transition hover:scale-105"
              >
                ✕
              </button>
            </div>

            {/* Mobile Search Inside Drawer */}
            <form onSubmit={onSearch} className="mt-4 flex md:hidden gap-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search games..."
                className="flex-1 rounded-xl bg-ink px-3 py-2 text-xs text-fg ring-1 ring-edge"
              />
              <button
                type="submit"
                className="rounded-xl bg-arcade px-3 py-2 text-xs font-bold text-white"
              >
                Go
              </button>
            </form>

            {/* Primary Navigation Links */}
            <div className="mt-4 space-y-1.5 border-b border-edge pb-4">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all ${
                  !activeCat
                    ? "bg-arcade text-white shadow-md shadow-arcade/25"
                    : "bg-ink/60 text-fg hover:bg-ink hover:translate-x-1"
                }`}
              >
                <span className="text-base">🏠</span>
                <span>Home — All Games</span>
              </Link>

              <Link
                href="/search?q=3d"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-xl bg-ink/60 px-3.5 py-2.5 text-xs font-extrabold text-sun transition-all hover:bg-ink hover:translate-x-1"
              >
                <span className="text-base">🔥</span>
                <span>Trending 3D WebGL</span>
              </Link>
            </div>

            {/* Scrollable Category List */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-1.5 pr-1">
              <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-mute">
                Select Genre
              </p>
              {menuCategories.map((cat) => {
                const isSelected = activeCat === cat.slug;
                return (
                  <Link
                    key={cat.slug}
                    href={`/?cat=${encodeURIComponent(cat.slug)}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? "bg-arcade text-white ring-1 ring-arcade shadow-md shadow-arcade/25"
                        : "bg-ink/50 text-mute hover:bg-ink hover:text-fg hover:translate-x-1 hover:ring-1 hover:ring-arcade/50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base transition-transform group-hover:scale-110">
                        {cat.icon || "🕹️"}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="text-[10px] opacity-0 transition-opacity group-hover:opacity-100 text-arcade-soft">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer: About & DMCA */}
            <div className="mt-4 border-t border-edge pt-3 flex items-center justify-between text-[11px] text-mute">
              <Link
                href="/about"
                onClick={() => setSidebarOpen(false)}
                className="font-bold text-arcade-soft hover:underline"
              >
                🛡️ About Us & DMCA
              </Link>
              <span>arcadiagames.app</span>
            </div>
          </aside>
        </div>
      )}

      <VaultDrawer open={vaultOpen} onClose={() => setVaultOpen(false)} />
    </>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<div className="h-16 w-full border-b border-edge bg-ink" />}>
      <NavbarInner {...props} />
    </Suspense>
  );
}