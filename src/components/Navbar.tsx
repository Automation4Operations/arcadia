"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, FormEvent, Suspense } from "react";
import VaultDrawer from "./VaultDrawer";
import ArcadiaLogo from "./ArcadiaLogo";

export type CategoryItem = {
  id?: string | number;
  name: string;
  slug: string;
  icon?: string | null;
};

type NavbarProps = {
  categories?: CategoryItem[];
};

const COLLECTIONS = [
  { slug: "3d", name: "3D Games", icon: "🧊" },
  { slug: "2-player", name: "2 Player", icon: "👥" },
  { slug: "multiplayer", name: "Multiplayer", icon: "🌍" },
  { slug: "zombie", name: "Zombie", icon: "🧟" },
];

function NavbarInner({ categories = [] }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
    const activeTag = pathname.startsWith("/collection/") ? pathname.split("/")[2] || "" : "";
  const activeCat = pathname.startsWith("/category/") ? pathname.split("/")[2] || "" : "";

  const [q, setQ] = useState("");
  const [vaultOpen, setVaultOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Esc closes the sidebar, and the page behind it stops scrolling
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push("/search?q=" + encodeURIComponent(trimmed));
      setSidebarOpen(false);
    }
  };

  const close = () => setSidebarOpen(false);

  const itemClass = (active: boolean) =>
    "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all " +
    (active
      ? "bg-arcade text-ink ring-1 ring-arcade"
      : "bg-ink/50 text-mute hover:bg-ink hover:text-fg hover:ring-1 hover:ring-arcade/50");

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-edge/80 bg-ink/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          {/* Left: Category menu button + brand logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="group flex items-center gap-2 rounded-xl bg-panel px-3.5 py-2 text-xs font-extrabold text-fg ring-1 ring-edge transition-all duration-200 hover:bg-arcade hover:text-ink hover:ring-arcade hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Open categories menu"
            >
              <span className="text-base leading-none">☰</span>
              <span className="hidden sm:inline">Categories</span>
            </button>

            <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Arcadia Games home">
              <ArcadiaLogo className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <span className="font-display text-lg sm:text-xl font-black tracking-wider text-neon">
                  ARCADIA
                </span>
                <span className="block text-[9px] font-extrabold tracking-widest text-arcade uppercase">
                  Free Online Games
                </span>
              </div>
            </Link>
          </div>

          {/* Center: search bar */}
          <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md mx-4" role="search">
            <div className="relative flex w-full items-center">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search games: shooting, racing, puzzle, .io..."
                aria-label="Search games"
                className="w-full rounded-full bg-panel/90 py-2 pl-4 pr-14 text-xs font-semibold text-fg placeholder:text-mute ring-1 ring-edge transition-all focus:outline-none focus:ring-2 focus:ring-arcade"
              />
              <button
                type="submit"
                className="absolute right-1.5 rounded-full bg-arcade px-3 py-1 text-[10px] font-extrabold text-ink transition hover:brightness-110 cursor-pointer"
              >
                GO
              </button>
            </div>
          </form>

          {/* Right: quick action buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/search?tag=3d"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-3 py-2 text-xs font-extrabold text-sun ring-1 ring-sun/40 transition-all hover:scale-105 hover:ring-sun"
            >
              <span>🧊</span>
              <span>Explore 3D</span>
            </Link>

            <button
              type="button"
              onClick={() => setVaultOpen(true)}
              className="group flex items-center gap-1.5 rounded-xl bg-panel px-3 py-2 text-xs font-extrabold text-fg ring-1 ring-edge transition-all hover:bg-arcade hover:text-ink hover:ring-arcade cursor-pointer"
            >
              <span>⚡</span>
              <span>My Vault</span>
            </button>

            <Link
              href="/about"
              className="hidden sm:inline-flex items-center rounded-xl bg-panel px-3 py-2 text-xs font-bold text-mute ring-1 ring-edge transition-all hover:text-fg hover:ring-arcade/60"
            >
              About & DMCA
            </Link>
          </div>
        </div>
      </header>

      {/* Slide-out category drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={close} />
          <aside className="relative z-10 flex h-full w-72 sm:w-80 flex-col border-r border-edge bg-panel p-5 text-fg shadow-2xl">
            <div className="flex items-center justify-between border-b border-edge pb-4">
              <div className="flex items-center gap-2.5">
                <ArcadiaLogo className="h-7 w-7" />
                <h2 className="font-display text-base font-extrabold text-fg">Browse Games</h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="rounded-lg bg-ink px-2.5 py-1 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mobile search */}
            <form onSubmit={onSearch} className="mt-4 flex md:hidden gap-2" role="search">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search games..."
                aria-label="Search games"
                className="flex-1 rounded-xl bg-ink px-3 py-2 text-xs text-fg ring-1 ring-edge"
              />
              <button type="submit" className="rounded-xl bg-arcade px-3 py-2 text-xs font-bold text-ink">
                Go
              </button>
            </form>

            <div className="no-scrollbar mt-4 flex-1 space-y-5 overflow-y-auto pr-1">
              {/* Home */}
              <Link href="/" onClick={close} className={itemClass(pathname === "/")}>
                <span className="flex items-center gap-2.5">
                  <span className="text-base">🏠</span>
                  <span>All Games (Home)</span>
                </span>
              </Link>

              {/* Collections */}
              <div className="space-y-1.5">
                <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-sun">
                  Collections
                </p>
                {COLLECTIONS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/search?tag=${c.slug}`}
                    onClick={close}
                    className={itemClass(activeTag === c.slug)}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="text-[10px] text-arcade opacity-0 group-hover:opacity-100">→</span>
                  </Link>
                ))}
              </div>

              {/* Categories */}
              <div className="space-y-1.5">
                <p className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-mute">
                  Categories
                </p>
                {categories.length === 0 && (
                  <p className="px-2 text-xs text-mute">Categories could not load. Please refresh the page.</p>
                )}
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${encodeURIComponent(cat.slug)}`}
                    onClick={close}
                    className={itemClass(activeCat === cat.slug)}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{cat.icon || "🎮"}</span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="text-[10px] text-arcade opacity-0 group-hover:opacity-100">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 border-t border-edge pt-3 flex items-center justify-between text-[11px] text-mute">
              <Link href="/about" onClick={close} className="font-bold text-arcade hover:underline">
                🛡️ About & DMCA
              </Link>
                            <Link href="/feedback" onClick={close} className="font-bold text-sun hover:underline">💬 Feedback</Link>
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
    <Suspense fallback={<div className="h-14 w-full border-b border-edge bg-ink" />}>
      <NavbarInner {...props} />
    </Suspense>
  );
}
