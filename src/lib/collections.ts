/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabase } from "./supabase";
import type { GameCardData } from "./queries";

export type Collection = {
  slug: string;
  name: string;
  icon: string;
  seoName: string;
  intro: string;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "trending-now",
    name: "Trending Now",
    icon: "🔥",
    seoName: "Trending Games",
    intro:
      "The hottest games everyone is playing right now. Updated daily based on play counts and player ratings — jump in before the lobbies fill up.",
  },
  {
    slug: "latest-games",
    name: "Latest Games",
    icon: "✨",
    seoName: "Latest Games",
    intro:
      "Fresh games added this week. Be among the first to try brand-new titles across every genre — racing, shooting, puzzle, .io, and more.",
  },
  {
    slug: "live-multiplayer",
    name: "Live Multiplayer",
    icon: "🌐",
    seoName: "Live Multiplayer Games",
    intro:
      "Real players, real matches, right now. Jump into live .io arenas, battle royales and team games with zero download — just click and play.",
  },
  {
    slug: "unblocked-hits",
    name: "Unblocked Hits",
    icon: "🚫",
    seoName: "Unblocked Games",
    intro:
      "Top-rated unblocked games that work at school or work. No Flash, no installs — 100% browser-based fun that runs anywhere.",
  },
  {
    slug: "sort-puzzle",
    name: "Sort Puzzles",
    icon: "🧪",
    seoName: "Sort Puzzle Games",
    intro:
      "Calm, satisfying puzzles where you sort colors, fish, cakes, cars and liquids into the right place. Each level takes a minute or two, so they are perfect for a short break. All sort games play free in your browser on phone or PC, with no download.",
  },
  {
    slug: "3d",
    name: "3D Games",
    icon: "🧊",
    seoName: "3D Games",
    intro:
      "Jump into fully three-dimensional worlds right in your browser. This collection covers first-person shooters, open-world driving, parkour runners and physics sandboxes, all built with WebGL, so they start instantly on PC and most modern phones with no download.",
  },
  {
    slug: "2-player",
    name: "2 Player",
    icon: "👥",
    seoName: "2 Player Games",
    intro:
      "Grab a friend and share one keyboard or one phone. These 2 player games let you duel, race and team up on the same device, from stickman fights to table tug-of-war. Most also include a single-player mode against the computer.",
  },
  {
    slug: "multiplayer",
    name: "Multiplayer",
    icon: "🌍",
    seoName: "Multiplayer Games",
    intro:
      "Play against real people from around the world. Battle royales, team shooters, .io arenas and online races: pick a game, enter a name and jump into a live match. No account or download required.",
  },
  {
    slug: "zombie",
    name: "Zombie",
    icon: "🧟",
    seoName: "Zombie Games",
    intro:
      "Survive the undead! Shoot, build defenses and escape endless hordes in this zombie collection, from fast arcade shooters and tower defense to tense 3D survival games.",
  },
];

export function getCollection(slug: string): Collection | null {
  return COLLECTIONS.find((c) => c.slug === slug) ?? null;
}

const COLUMNS =
  "id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,is_featured,category:categories(name,slug)";

function toCard(r: any): GameCardData {
  const cat = Array.isArray(r.category) ? r.category[0] : r.category;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    thumbnailUrl: r.thumbnail_url,
    iframeUrl: r.iframe_url ?? "",
    playCount: r.play_count ?? 0,
    ratingAvg: r.rating_avg ?? 0,
    isFeatured: Boolean(r.is_featured),
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

/** All published games in a collection, most played first — with fallbacks for new collections */
export async function getCollectionGames(tagSlug: string): Promise<GameCardData[]> {
  const db = getSupabase();
  try {
    // Try tag-based query first
    const { data: tag } = await db.from("tags").select("id").eq("slug", tagSlug).maybeSingle();

    if (tag) {
      const { data: links } = await db.from("game_tags").select("game_id").eq("tag_id", (tag as any).id);
      const ids = (links ?? []).map((l: any) => l.game_id);
      if (ids.length > 0) {
        const { data: rows } = await db
          .from("games")
          .select(COLUMNS)
          .eq("is_published", true)
          .in("id", ids)
          .order("play_count", { ascending: false })
          .limit(200);
        if ((rows ?? []).length > 0) return (rows ?? []).map(toCard);
      }
    }

    // Fallback queries for new collections without DB tags
    if (tagSlug === "trending-now") {
      const { data: rows } = await db
        .from("games")
        .select(COLUMNS)
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("play_count", { ascending: false })
        .limit(100);
      return (rows ?? []).map(toCard);
    }

    if (tagSlug === "latest-games") {
      const { data: rows } = await db
        .from("games")
        .select(COLUMNS)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(100);
      return (rows ?? []).map(toCard);
    }

    if (tagSlug === "live-multiplayer") {
      // Try category slug "io" then "multiplayer"
      const { data: cats } = await db.from("categories").select("id").in("slug", ["io", "multiplayer"]);
      const catIds = (cats ?? []).map((c: any) => c.id);
      if (catIds.length > 0) {
        const { data: rows } = await db
          .from("games")
          .select(COLUMNS)
          .eq("is_published", true)
          .in("category_id", catIds)
          .order("play_count", { ascending: false })
          .limit(100);
        return (rows ?? []).map(toCard);
      }
    }

    if (tagSlug === "unblocked-hits") {
      const { data: rows } = await db
        .from("games")
        .select(COLUMNS)
        .eq("is_published", true)
        .order("play_count", { ascending: false })
        .limit(100);
      return (rows ?? []).map(toCard);
    }

    return [];
  } catch {
    return [];
  }
}
