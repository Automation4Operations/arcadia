"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { readRecent, type RecentGame } from "@/lib/recent";
import type { CategoryItem, GameCardData } from "@/lib/queries";

const LIKES_KEY = "arcadia:likes";

export default function Navbar({ categories }: { categories: CategoryItem[] }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameCardData[]>([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [recent, setRecent] = useState<RecentGame[]>([]);
  const [likedSlugs, setLikedSlugs] = useState<string[]>([]);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Instant debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(data.games ?? []);
        setOpenSearch(true);
      } catch {
        setResults([]);
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setOpenSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openVault() {
    setRecent(readRecent());
    try {
      setLikedSlugs(JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]"));
    } catch {
      setLikedSlugs([]);
    }
    setVaultOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge bg-ink/90 backdrop-blur-md">
        {/* Top Row: Brand, Instant Search, Vault Button */}
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="group flex items-center gap-2.5 outline-none">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sun font-display text-lg font-black text-ink shadow-[0_0_20px_rgba(204,255,0,0.35)] transition group-hover:rotate-6">
              A
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight text-fg">
              ARCADIA
            </span>
          </Link>

          {/* Instant Search Box */}
          <div ref={searchBoxRef} className="relative flex-1 max-w-xl">
            <form action="/search" role="search">
              <div className="relative flex items-center">
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute left-3.5 h-4 w-4 fill-mute"
                  aria-hidden
                >
                  <path d="M8.5 3a5.5 5.5 0 014.38 8.82l3.65 3.65a.75.75 0 01-1.06 1.06l-3.65-3.65A5.5 5.5 0 118.5 3zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                <input
                  name="q"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => results.length > 0 && setOpenSearch(true)}
                  placeholder="Search games, tags, or genres..."
                  aria-label="Search games"
                  className="w-full rounded-xl border border-edge bg-panel py-2 pl-10 pr-4 text-sm text-fg placeholder:text-mute focus:border-arcade focus:outline-none focus:ring-1 focus:ring-arcade"
                />
              </div>
            </form>

            {/* Instant Search Results Dropdown */}
            {openSearch && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-edge bg-panel shadow-2xl">
                <ul className="divide-y divide-edge/60">
                  {results.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/game/${g.slug}`}
                        onClick={() => setOpenSearch(false)}
                        className="flex items-center gap-3 p-2.5 hover:bg-ink/60"
                      >
                        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-ink">
                          <Image src={g.thumbnailUrl} alt="" fill sizes="64px" className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-fg">{g.title}</p>
                          <p className="text-xs text-arcade-soft">{g.category.name}</p>
                        </div>
                        <span className="rounded-md bg-sun/15 px-2 py-0.5 text-xs font-bold text-sun">
                          Play
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpenSearch(false)}
                  className="block bg-ink/80 py-2 text-center text-xs font-semibold text-arcade-soft hover:underline"
                >
                  View all results for &ldquo;{query}&rdquo;
                </Link>
              </div>
            )}
          </div>

          {/* Right Actions: Surprise Game + My Vault Drawer */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-edge bg-panel px-3.5 py-2 text-xs font-semibold text-fg transition hover:border-arcade"
            >
              <span>All Genres</span>
            </Link>
            <button
              onClick={openVault}
              className="inline-flex items-center gap-2 rounded-xl bg-arcade/15 px-3.5 py-2 text-xs font-bold text-arcade-soft ring-1 ring-arcade/40 transition hover:bg-arcade hover:text-ink"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M10 17l-1.1-1C4.9 12.4 2.5 10.2 2.5 7.5c0-2.2 1.7-3.8 3.7-3.8 1.4 0 2.8.8 3.8 2 1-1.2 2.4-2 3.8-2 2 0 3.7 1.6 3.7 3.8 0 2.7-2.4 4.9-6.4 8.5L10 17z" />
              </svg>
              <span>My Vault</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Horizontal Category Pill Bar (Replaces Left Sidebar) */}
        <nav
          aria-label="Game categories"
          className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto border-t border-edge/50 px-4 py-2 no-scrollbar"
        >
          <Link
            href="/"
            className="shrink-0 rounded-lg bg-sun px-3 py-1 text-xs font-bold text-ink"
          >
            ⚡ Lobby
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/search?category=${cat.slug}`}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel/70 px-3 py-1 text-xs font-semibold text-mute transition hover:border-arcade hover:text-fg"
            >
              {cat.icon && <span aria-hidden>{cat.icon}</span>}
              <span>{cat.name}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Slide-out Player Vault Drawer */}
      {vaultOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/75 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-sm flex-col border-l border-edge bg-panel p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <h2 className="font-display text-lg font-bold text-fg">My Game Vault</h2>
              <button
                onClick={() => setVaultOpen(false)}
                className="rounded-lg p-1 text-mute hover:bg-ink hover:text-fg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-arcade-soft">
                  Saved Favorites ({likedSlugs.length})
                </h3>
                {likedSlugs.length === 0 ? (
                  <p className="mt-2 text-xs text-mute">
                    Click the Heart button under any game to pin it here.
                  </p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {likedSlugs.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={`/game/${slug}`}
                          onClick={() => setVaultOpen(false)}
                          className="inline-block rounded-lg border border-edge bg-ink px-3 py-1.5 text-xs font-semibold text-fg hover:border-sun"
                        >
                          {slug.replace(/-/g, " ")} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-sun">
                  Recently Played ({recent.length})
                </h3>
                {recent.length === 0 ? (
                  <p className="mt-2 text-xs text-mute">
                    Games you launch will appear here automatically.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {recent.map((g) => (
                      <li key={g.slug}>
                        <Link
                          href={`/game/${g.slug}`}
                          onClick={() => setVaultOpen(false)}
                          className="flex items-center gap-3 rounded-xl bg-ink/60 p-2 hover:ring-1 hover:ring-arcade"
                        >
                          <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-ink">
                            <Image src={g.thumbnailUrl} alt="" fill sizes="56px" className="object-cover" />
                          </div>
                          <span className="truncate text-sm font-semibold text-fg">{g.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}