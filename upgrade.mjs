import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const files = {
  "tailwind.config.ts": `import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090B10",
        panel: "#121621",
        edge: "#22293A",
        fg: "#F3F6FC",
        mute: "#8A94A8",
        arcade: {
          DEFAULT: "#00E5FF",
          soft: "#66F0FF",
        },
        sun: "#CCFF00",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
`,

  "src/lib/queries.ts": `import { getSupabase } from "./supabase";

export type GameCardData = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  playCount: number;
  ratingAvg: number;
  isFeatured?: boolean;
  category: { name: string; slug: string };
};

export type CategoryItem = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
};

const CARD_COLUMNS =
  "id,slug,title,thumbnail_url,play_count,rating_avg,is_featured,category:categories(name,slug)";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCard(r: any): GameCardData {
  const cat = Array.isArray(r.category) ? r.category[0] : r.category;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    thumbnailUrl: r.thumbnail_url,
    playCount: r.play_count,
    ratingAvg: r.rating_avg,
    isFeatured: Boolean(r.is_featured),
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export async function getAllCategories(): Promise<CategoryItem[]> {
  const rows = check(
    await getSupabase().from("categories").select("id,slug,name,icon").order("sort_order"),
  );
  return rows as CategoryItem[];
}

export async function getFeaturedHero() {
  const res = await getSupabase()
    .from("games")
    .select("id,slug,title,description,thumbnail_url,play_count,rating_avg,category:categories(name,slug)")
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("play_count", { ascending: false })
    .limit(1)
    .maybeSingle();

  const r: any = check(res);
  if (!r) return null;
  const cat = Array.isArray(r.category) ? r.category[0] : r.category;
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    description: r.description as string,
    thumbnailUrl: r.thumbnail_url as string,
    playCount: r.play_count as number,
    ratingAvg: r.rating_avg as number,
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

export async function getTrending(take = 12): Promise<GameCardData[]> {
  const rows = check(
    await getSupabase()
      .from("games")
      .select(CARD_COLUMNS)
      .eq("is_published", true)
      .order("play_count", { ascending: false })
      .limit(take),
  );
  return rows.map(toCard);
}

export async function getNewReleases(take = 8): Promise<GameCardData[]> {
  const rows = check(
    await getSupabase()
      .from("games")
      .select(CARD_COLUMNS)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(take),
  );
  return rows.map(toCard);
}

export async function getCategorySections(categoryCount = 5, perCategory = 7) {
  const db = getSupabase();
  const categories = await getAllCategories();
  return Promise.all(
    categories.slice(0, categoryCount).map(async (category) => {
      const rows = check(
        await db
          .from("games")
          .select(CARD_COLUMNS)
          .eq("is_published", true)
          .eq("category_id", category.id)
          .order("play_count", { ascending: false })
          .limit(perCategory),
      );
      return { category, games: rows.map(toCard) };
    }),
  );
}

export async function getGameBySlug(slug: string) {
  const res = await getSupabase()
    .from("games")
    .select("*, category:categories(id,slug,name), tags:game_tags(tag:tags(id,slug,name))")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  const r: any = check(res);
  if (!r) return null;
  const category = Array.isArray(r.category) ? r.category[0] : r.category;
  const tags = (r.tags ?? []).map((t: any) => (Array.isArray(t.tag) ? t.tag[0] : t.tag)).filter(Boolean);
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    description: r.description as string,
    instructions: (r.instructions as string | null) ?? null,
    developer: (r.developer as string | null) ?? null,
    thumbnailUrl: r.thumbnail_url as string,
    iframeUrl: r.iframe_url as string,
    width: r.width as number,
    height: r.height as number,
    playCount: r.play_count as number,
    ratingAvg: r.rating_avg as number,
    categoryId: r.category_id as string,
    category: category as { id: string; slug: string; name: string },
    tags: tags as { id: string; slug: string; name: string }[],
  };
}

export async function getRecommended(
  game: { id: string; categoryId: string; tagIds: string[] },
  take = 10,
): Promise<GameCardData[]> {
  const db = getSupabase();

  const sameCategory = check(
    await db
      .from("games")
      .select(CARD_COLUMNS)
      .eq("is_published", true)
      .eq("category_id", game.categoryId)
      .neq("id", game.id)
      .order("play_count", { ascending: false })
      .limit(take),
  ).map(toCard);

  let sharedTag: GameCardData[] = [];
  if (game.tagIds.length > 0) {
    const links = check(
      await db.from("game_tags").select("game_id").in("tag_id", game.tagIds).neq("game_id", game.id).limit(60),
    );
    const ids = [...new Set(links.map((l: any) => l.game_id as string))];
    if (ids.length > 0) {
      sharedTag = check(
        await db
          .from("games")
          .select(CARD_COLUMNS)
          .eq("is_published", true)
          .in("id", ids)
          .order("play_count", { ascending: false })
          .limit(take),
      ).map(toCard);
    }
  }

  const merged = new Map<string, GameCardData>();
  [...sameCategory, ...sharedTag].forEach((g) => merged.set(g.id, g));
  return [...merged.values()].sort((a, b) => b.playCount - a.playCount).slice(0, take);
}

export async function searchGames({
  q,
  category,
  tags = [],
  take = 48,
}: {
  q?: string;
  category?: string;
  tags?: string[];
  take?: number;
}): Promise<GameCardData[]> {
  const db = getSupabase();

  let allowedIds: string[] | null = null;
  if (tags.length > 0) {
    const tagRows = check(await db.from("tags").select("id,slug").in("slug", tags));
    if (tagRows.length < tags.length) return [];
    for (const t of tagRows as any[]) {
      const links = check(await db.from("game_tags").select("game_id").eq("tag_id", t.id));
      const ids = new Set(links.map((l: any) => l.game_id as string));
      allowedIds = allowedIds ? allowedIds.filter((id) => ids.has(id)) : [...ids];
    }
    if (!allowedIds || allowedIds.length === 0) return [];
  }

  let query = db.from("games").select(CARD_COLUMNS).eq("is_published", true);

  if (category) {
    const cat = check(await db.from("categories").select("id").eq("slug", category).maybeSingle()) as any;
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  }
  if (allowedIds) query = query.in("id", allowedIds);

  const keyword = q?.trim().replace(/[%_,()\\\\]/g, " ");
  if (keyword) query = query.ilike("title", "%" + keyword + "%");

  const rows = check(await query.order("play_count", { ascending: false }).limit(take));
  return rows.map(toCard);
}

export async function getPopularTags(take = 24) {
  const rows = check(await getSupabase().from("tags").select("slug,name").order("name").limit(take));
  return rows as { slug: string; name: string }[];
}
`,

  "src/app/api/search/route.ts": `import { NextResponse } from "next/server";
import { searchGames } from "@/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ games: [] });
  }
  try {
    const games = await searchGames({ q, take: 6 });
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] }, { status: 500 });
  }
}
`,

  "src/app/api/play/route.ts": `import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const db = getSupabase();
  await db.rpc("increment_play_count", { game_slug: slug });

  return NextResponse.json({ ok: true });
}
`,

  "src/components/Navbar.tsx": `"use client";

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

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/search?q=" + encodeURIComponent(trimmed));
        const data = await res.json();
        setResults(data.games ?? []);
        setOpenSearch(true);
      } catch {
        setResults([]);
      }
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

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
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="group flex items-center gap-2.5 outline-none">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sun font-display text-lg font-black text-ink shadow-[0_0_20px_rgba(204,255,0,0.35)] transition group-hover:rotate-6">
              A
            </span>
            <span className="font-display text-2xl font-extrabold tracking-tight text-fg">
              ARCADIA
            </span>
          </Link>

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

            {openSearch && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-edge bg-panel shadow-2xl">
                <ul className="divide-y divide-edge/60">
                  {results.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={"/game/" + g.slug}
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
                  href={"/search?q=" + encodeURIComponent(query)}
                  onClick={() => setOpenSearch(false)}
                  className="block bg-ink/80 py-2 text-center text-xs font-semibold text-arcade-soft hover:underline"
                >
                  View all results
                </Link>
              </div>
            )}
          </div>

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

        <nav
          aria-label="Game categories"
          className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-x-auto border-t border-edge/50 px-4 py-2"
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
              href={"/search?category=" + cat.slug}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-edge bg-panel/70 px-3 py-1 text-xs font-semibold text-mute transition hover:border-arcade hover:text-fg"
            >
              {cat.icon && <span aria-hidden>{cat.icon}</span>}
              <span>{cat.name}</span>
            </Link>
          ))}
        </nav>
      </header>

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
                    Click the Save button under any game to pin it here.
                  </p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {likedSlugs.map((slug) => (
                      <li key={slug}>
                        <Link
                          href={"/game/" + slug}
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
                          href={"/game/" + g.slug}
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
`,

  "src/components/GameCard.tsx": `import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/format";

export type GameCardProps = {
  game: {
    slug: string;
    title: string;
    thumbnailUrl: string;
    playCount?: number;
    ratingAvg?: number;
    category?: { name: string } | null;
  };
  featured?: boolean;
  priority?: boolean;
};

export default function GameCard({ game, featured = false, priority = false }: GameCardProps) {
  const cardClasses =
    "group relative block overflow-hidden rounded-xl bg-panel ring-1 ring-edge transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-arcade hover:shadow-[0_8px_30px_rgba(0,229,255,0.18)] focus-visible:ring-2 focus-visible:ring-sun " +
    (featured ? "col-span-2 row-span-2" : "");

  return (
    <Link href={"/game/" + game.slug} className={cardClasses}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes={
            featured
              ? "(min-width:1024px) 35vw, 100vw"
              : "(min-width:1280px) 18vw, (min-width:640px) 30vw, 50vw"
          }
          className="object-cover transition duration-500 ease-out group-hover:scale-110"
        />

        {game.category?.name && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-arcade-soft backdrop-blur-md ring-1 ring-edge">
            {game.category.name}
          </span>
        )}

        {game.ratingAvg ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-ink/80 px-2 py-0.5 text-xs font-bold text-sun backdrop-blur-md ring-1 ring-edge">
            ★ {game.ratingAvg.toFixed(1)}
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-3 pt-8">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={
                  "truncate font-display font-bold text-fg " +
                  (featured ? "text-lg sm:text-xl" : "text-sm")
                }
              >
                {game.title}
              </h3>
              {game.playCount ? (
                <p className="text-[11px] font-medium text-mute">
                  {formatCount(game.playCount)} plays
                </p>
              ) : null}
            </div>

            <span className="shrink-0 rounded-lg bg-sun px-2.5 py-1 font-display text-xs font-extrabold text-ink opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
              PLAY
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
`,

  "src/components/HeroSpotlight.tsx": `import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/format";

type HeroGame = {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  playCount: number;
  ratingAvg: number;
  category: { name: string; slug: string };
};

export default function HeroSpotlight({ game }: { game: HeroGame | null }) {
  if (!game) return null;

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="grid items-center gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-sun/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-sun ring-1 ring-sun/30">
            <span>🔥 Featured Spotlight</span>
            <span>•</span>
            <span>{game.category.name}</span>
          </div>

          <h1 className="font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
            {game.title}
          </h1>

          <p className="line-clamp-2 max-w-xl text-sm text-mute sm:text-base">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href={"/game/" + game.slug}
              className="inline-flex items-center gap-2 rounded-xl bg-sun px-6 py-3 font-display text-sm font-black text-ink shadow-[0_0_25px_rgba(204,255,0,0.4)] transition hover:scale-105"
            >
              ▶ Launch Game
            </Link>
            <div className="text-xs font-medium text-mute">
              <span className="font-bold text-fg">{formatCount(game.playCount)}</span> plays
              {game.ratingAvg ? " · ★ " + game.ratingAvg.toFixed(1) + " rating" : ""}
            </div>
          </div>
        </div>

        <Link
          href={"/game/" + game.slug}
          className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-edge"
        >
          <Image
            src={game.thumbnailUrl}
            alt={game.title}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
    </section>
  );
}
`,

  "src/components/GamePlayer.tsx": `"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pushRecent } from "@/lib/recent";

type Props = {
  game: {
    slug: string;
    title: string;
    thumbnailUrl: string;
    iframeUrl: string;
    width: number;
    height: number;
  };
};

const REASONS = [
  { value: "BROKEN", label: "Game doesn't load or is broken" },
  { value: "INAPPROPRIATE", label: "Inappropriate content" },
  { value: "COPYRIGHT", label: "Copyright issue" },
  { value: "OTHER", label: "Something else" },
] as const;

const LIKES_KEY = "arcadia:likes";

export default function GamePlayer({ game }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cinemaDim, setCinemaDim] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const ratio = game.width / game.height;

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  useEffect(() => {
    try {
      const likes: string[] = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
      setLiked(likes.includes(game.slug));
    } catch {}
  }, [game.slug]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function start() {
    setStarted(true);
    pushRecent({ slug: game.slug, title: game.title, thumbnailUrl: game.thumbnailUrl });
    fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: game.slug }),
    }).catch(() => {});
  }

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    try {
      const likes: string[] = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
      const updated = next ? [...new Set([...likes, game.slug])] : likes.filter((s) => s !== game.slug);
      localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    } catch {}
    flash(next ? "Saved to My Vault" : "Removed from My Vault");
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen();
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: game.title, url });
      else {
        await navigator.clipboard.writeText(url);
        flash("Game link copied!");
      }
    } catch {}
  }

  async function submitReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: game.slug,
        reason: data.get("reason"),
        details: data.get("details"),
      }),
    });
    setReportOpen(false);
    flash(res.ok ? "Report sent. Thank you!" : "Couldn't send report. Try again.");
  }

  return (
    <div className="relative">
      {cinemaDim && (
        <div
          onClick={() => setCinemaDim(false)}
          className="fixed inset-0 z-30 bg-black/85 backdrop-blur-sm transition-opacity"
          aria-hidden
        />
      )}

      <div className={cinemaDim ? "relative z-40" : ""}>
        <div
          ref={frameRef}
          className={
            "relative mx-auto overflow-hidden bg-black " +
            (isFullscreen ? "h-screen w-screen" : "rounded-2xl ring-1 ring-edge shadow-2xl")
          }
          style={
            isFullscreen
              ? undefined
              : {
                  aspectRatio: game.width + " / " + game.height,
                  width: "min(100%, calc((100dvh - 14rem) * " + ratio + "))",
                }
          }
        >
          {started ? (
            <iframe
              src={game.iframeUrl}
              title={game.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="fullscreen; autoplay; gamepad; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
              referrerPolicy="no-referrer"
              allowFullScreen
            />
          ) : (
            <button
              onClick={start}
              className="group absolute inset-0 flex flex-col items-center justify-center focus-visible:outline-none"
              aria-label={"Play " + game.title}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[2px] transition duration-300 group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="relative flex flex-col items-center gap-3">
                <span className="flex items-center gap-2.5 rounded-xl bg-sun px-8 py-3.5 font-display text-lg font-black text-ink shadow-[0_0_30px_rgba(204,255,0,0.5)] transition group-hover:scale-105">
                  <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
                    <path d="M6 4l11 6-11 6V4z" />
                  </svg>
                  LAUNCH GAME
                </span>
                <span className="rounded-md bg-ink/80 px-3 py-1 text-xs font-semibold text-fg backdrop-blur">
                  Instant Browser Play · No Downloads
                </span>
              </div>
            </button>
          )}
        </div>

        <div className="mx-auto mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-edge bg-panel px-3 py-2">
          <ActionButton onClick={toggleLike} pressed={liked} label={liked ? "In Vault" : "Save"}>
            <path d="M10 17l-1.1-1C4.9 12.4 2.5 10.2 2.5 7.5c0-2.2 1.7-3.8 3.7-3.8 1.4 0 2.8.8 3.8 2 1-1.2 2.4-2 3.8-2 2 0 3.7 1.6 3.7 3.8 0 2.7-2.4 4.9-6.4 8.5L10 17z" />
          </ActionButton>

          <ActionButton
            onClick={() => setCinemaDim((d) => !d)}
            pressed={cinemaDim}
            label={cinemaDim ? "Lights On" : "Lights Off"}
          >
            <path d="M10 2a6 6 0 00-3.8 10.6V15a1 1 0 001 1h5.6a1 1 0 001-1v-2.4A6 6 0 0010 2zm-2 15h4v1H8v-1z" />
          </ActionButton>

          <ActionButton onClick={share} label="Share">
            <>
              <circle cx="15" cy="4.5" r="2.2" />
              <circle cx="5" cy="10" r="2.2" />
              <circle cx="15" cy="15.5" r="2.2" />
              <path
                d="M6.8 9l6.4-3.6M6.8 11l6.4 3.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </>
          </ActionButton>

          <span className="flex-1" />

          <ActionButton onClick={() => setReportOpen(true)} label="Report" subtle>
            <path d="M4 3h1.5v14H4V3zm2.5 1h9l-2 3.5 2 3.5h-9V4z" />
          </ActionButton>

          <ActionButton
            onClick={toggleFullscreen}
            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm12 0h2v5h-5v-2h3v-3z" />
          </ActionButton>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-sun px-4 py-2 text-sm font-bold text-ink shadow-xl"
        >
          {toast}
        </div>
      )}

      {reportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <form
            onSubmit={submitReport}
            className="w-full max-w-md space-y-4 rounded-2xl bg-panel p-6 ring-1 ring-edge"
          >
            <h2 id="report-title" className="font-display text-xl font-bold text-fg">
              Report {game.title}
            </h2>
            <fieldset className="space-y-2">
              <legend className="sr-only">Reason</legend>
              {REASONS.map((r, i) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-fg">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    defaultChecked={i === 0}
                    className="accent-arcade"
                  />
                  {r.label}
                </label>
              ))}
            </fieldset>
            <textarea
              name="details"
              maxLength={500}
              rows={3}
              placeholder="Add details (optional)"
              className="w-full rounded-lg border border-edge bg-ink p-3 text-sm text-fg placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-mute hover:text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sun px-4 py-2 text-sm font-bold text-ink"
              >
                Send report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  pressed,
  subtle,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  subtle?: boolean;
}) {
  const btnClass =
    "inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-sun " +
    (pressed
      ? "bg-sun text-ink"
      : subtle
        ? "text-mute hover:bg-ink hover:text-fg"
        : "bg-ink text-fg ring-1 ring-edge hover:ring-arcade");

  return (
    <button onClick={onClick} aria-pressed={pressed} className={btnClass}>
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
        {children}
      </svg>
      {label}
    </button>
  );
}
`,

  "src/components/RecommendedList.tsx": `import GameCard from "./GameCard";
import type { GameCardData } from "@/lib/queries";

export default function RecommendedList({
  title,
  games,
}: {
  title: string;
  games: GameCardData[];
}) {
  if (games.length === 0) return null;
  return (
    <aside aria-label={title}>
      <h2 className="mb-3 font-display text-lg font-bold text-fg">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </aside>
  );
}
`,

  "src/app/layout.tsx": `import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getAllCategories } from "@/lib/queries";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Arcadia — Instant Web Game Portal", template: "%s | Arcadia" },
  description: "Play curated HTML5 and WebGL games directly in your browser. Zero installs.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories().catch(() => []);

  return (
    <html lang="en" className={display.variable + " " + body.variable}>
      <body className="min-h-screen bg-ink font-body text-fg antialiased flex flex-col">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-edge bg-panel/50 py-8 text-center text-xs text-mute">
          <div className="mx-auto max-w-[1600px] px-4">
            <p className="font-display font-bold text-fg">ARCADIA PORTAL</p>
            <p className="mt-1">
              All games are property of their respective creators and embedded via authorized distribution.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
`,

  "src/app/page.tsx": `import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import {
  getCategorySections,
  getFeaturedHero,
  getNewReleases,
  getTrending,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hero, trending, fresh, sections] = await Promise.all([
    getFeaturedHero(),
    getTrending(),
    getNewReleases(),
    getCategorySections(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <HeroSpotlight game={hero} />
      <ContinuePlaying />
      <GameGrid title="Trending in Lobby" icon="🔥" games={trending} href="/search" priorityFirst />
      <GameGrid
        title="Fresh Releases"
        icon="✨"
        games={fresh}
        href="/search"
        leadFeatured={false}
      />
      {sections.map(({ category, games }) => (
        <GameGrid
          key={category.id}
          title={category.name}
          icon={category.icon}
          games={games}
          href={"/search?category=" + category.slug}
        />
      ))}
    </div>
  );
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Updated:", relPath);
}

fs.unlinkSync(path.join(process.cwd(), "upgrade.mjs"));
console.log("\nAll 11 files updated! Pushing to GitHub...");
execSync('git add . && git commit -m "Auto-upgrade Arcadia UI and live play counter" && git push', {
  stdio: "inherit",
});