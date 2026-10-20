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

/** All published games in a collection, most played first */
export async function getCollectionGames(tagSlug: string): Promise<GameCardData[]> {
  const db = getSupabase();
  try {
    const { data: tag } = await db.from("tags").select("id").eq("slug", tagSlug).maybeSingle();
    if (!tag) return [];

    const { data: links } = await db.from("game_tags").select("game_id").eq("tag_id", (tag as any).id);
    const ids = (links ?? []).map((l: any) => l.game_id);
    if (ids.length === 0) return [];

    const { data: rows } = await db
      .from("games")
      .select(COLUMNS)
      .eq("is_published", true)
      .in("id", ids)
      .order("play_count", { ascending: false })
      .limit(200);

    return (rows ?? []).map(toCard);
  } catch {
    return [];
  }
}
