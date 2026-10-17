"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
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

const GENZ_CATEGORIES = [
  { name: "🔥 All Hits", href: "/" },
  { name: "🎯 Battle Royale", href: "/search?q=battle" },
  { name: "🏎️ 3D Driving", href: "/search?q=driving" },
  { name: "🧩 Screw & Logic", href: "/search?q=puzzle" },
  { name: "♟️ Chess & Board", href: "/search?q=chess" },
  { name: "🎲 Ludo Party", href: "/search?q=ludo" },
  { name: "🐍 Snake .io", href: "/search?q=snake" },
];

export default function Navbar({ categories = [] }: NavbarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push("/search?q=" + encodeURIComponent(trimmed));
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-edge/80 bg-ink/85 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-8">
          {/* Animated Neon Brand Logo */}
          <Link href="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-arcade via-indigo-500 to-sun shadow-lg shadow-arcade/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-xl font-black text-white">⚡</span>
            </div>
            <div>
              <span className="font-display text-xl font-black tracking-wider text-fg transition group-hover:text-sun">
                ARCADIA
              </span>
              <span className="block text-[10px] font-extrabold tracking-widest text-arcade-soft uppercase">
                Next-Gen 3D WebGL
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative flex w-full items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search 1,500+ 3D games, battle royale, chess..."
                className="w-full rounded-full bg-panel/90 py-2 pl-4 pr-10 text-xs font-semibold text-fg placeholder:text-mute ring-1 ring-edge transition-all focus:outline-none focus:ring-2 focus:ring-arcade"
              />
              <button
                type="submit"
                className="absolute right-2 rounded-full bg-arcade px-2.5 py-1 text-[10px] font-extrabold text-white transition hover:bg-arcade-soft"
              >
                GO
              </button>
            </div>
          </form>

          {/* Gen-Z Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/search?q=3d"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-3.5 py-2 text-xs font-extrabold text-sun ring-1 ring-sun/40 transition-all duration-200 hover:scale-105 hover:ring-sun"
            >
              <span>🎲</span>
              <span>Explore 3D</span>
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
              About & DMCA
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-panel text-fg ring-1 ring-edge"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Animated Category Pills Bar */}
        <div className="border-t border-edge/40 bg-panel/40">
          <nav className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto no-scrollbar px-4 py-2 sm:px-8">
            {GENZ_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="shrink-0 rounded-full bg-ink/80 px-3.5 py-1 text-[11px] font-extrabold text-mute ring-1 ring-edge transition-all duration-200 hover:bg-arcade hover:text-white hover:ring-arcade hover:scale-105 active:scale-95"
              >
                {cat.name}
              </Link>
            ))}
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/?cat=${encodeURIComponent(cat.slug)}`}
                className="shrink-0 rounded-full bg-ink/60 px-3 py-1 text-[11px] font-bold text-mute ring-1 ring-edge/60 transition-all duration-200 hover:bg-arcade hover:text-white hover:scale-105"
              >
                {cat.icon ? `${cat.icon} ` : ""}{cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-edge bg-panel/95 px-4 py-4 backdrop-blur-2xl">
            <form onSubmit={onSearch} className="mb-3 flex gap-2">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search games..."
                className="flex-1 rounded-xl bg-ink px-3 py-2 text-xs text-fg ring-1 ring-edge"
              />
              <button type="submit" className="rounded-xl bg-arcade px-4 py-2 text-xs font-bold text-white">
                Search
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {GENZ_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-ink p-2.5 text-center text-xs font-bold text-fg ring-1 ring-edge hover:bg-arcade hover:text-white"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl bg-ink p-2.5 text-center text-xs font-bold text-arcade-soft ring-1 ring-edge"
            >
              🛡️ About Us & DMCA Compliance
            </Link>
          </div>
        )}
      </header>

      <VaultDrawer open={vaultOpen} onClose={() => setVaultOpen(false)} />
    </>
  );
}