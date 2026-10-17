"use client";

import Link from "next/link";
import { useState } from "react";

const CATEGORIES = [
  { name: "🔥 Trending", slug: "trending" },
  { name: "🏎️ 3D & Racing", slug: "3d-racing" },
  { name: "🎯 Battle Royale", slug: "battle-royale" },
  { name: "🧩 Puzzles & Logic", slug: "puzzles" },
  { name: "♟️ Chess & Board", slug: "board" },
  { name: "🐍 .io Arenas", slug: "io-games" },
];

export default function AdvancedHeader({ onOpenVault }: { onOpenVault: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-edge/60 bg-panel/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Logo Section with Neon Glow */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-arcade to-sun shadow-lg shadow-arcade/20 transition-transform group-hover:scale-105">
            <span className="text-xl font-black text-ink">⚡</span>
          </div>
          <div>
            <span className="font-display text-xl font-black tracking-wider text-fg transition group-hover:text-arcade">
              ARCADIA
            </span>
            <span className="block text-[10px] font-bold tracking-widest text-arcade-soft uppercase">
              Next-Gen 3D Portal
            </span>
          </div>
        </Link>

        {/* Desktop Animated Category Pills */}
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-ink/60 p-1.5 ring-1 ring-edge shadow-inner">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/search?cat=${cat.slug}`}
              className="rounded-full px-3.5 py-1.5 text-xs font-bold text-mute transition-all duration-200 hover:bg-arcade hover:text-ink hover:shadow-md hover:scale-105 active:scale-95"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons: Vault & About Us */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenVault}
            className="relative group flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-extrabold text-fg ring-1 ring-edge transition-all hover:bg-arcade hover:text-ink hover:ring-arcade hover:scale-105 shadow-sm"
          >
            <span className="transition-transform group-hover:rotate-12">⚡</span>
            <span>My Vault</span>
          </button>

          <Link
            href="/about"
            className="hidden sm:inline-flex items-center rounded-xl bg-panel px-3.5 py-2 text-xs font-bold text-mute ring-1 ring-edge transition-all hover:text-fg hover:border-arcade"
          >
            About Us
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-ink text-fg ring-1 ring-edge"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-edge bg-panel/95 px-4 py-4 backdrop-blur-2xl animate-in slide-in-from-top duration-200">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-mute mb-2">Explore Categories</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/search?cat=${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl bg-ink p-2.5 text-xs font-bold text-fg ring-1 ring-edge text-center hover:bg-arcade hover:text-ink transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-edge pt-3">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-mute hover:text-fg"
            >
              📖 About Us & DMCA
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}