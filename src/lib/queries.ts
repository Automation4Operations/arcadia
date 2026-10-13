import { getSupabase } from "./supabase";

export type GameCardData = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  playCount: number;
  ratingAvg: number;
  category: { name: string; slug: string };
};

const CARD_COLUMNS = "id,slug,title,thumbnail_url,play_count,rating_avg,category:categories(name,slug)";

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
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) {
    const e = res.error as { message?: string; code?: string; details?: string; hint?: string };
    throw new Error(
      `Supabase error | message=${e.message || "(empty)"} | code=${e.code ?? ""} | details=${e.details ?? ""} | hint=${e.hint ?? ""}`,
    );
  }
  return res.data as T;
}

export async function getTrending(take = 13): Promise<GameCardData[]> {
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

export async function getCategorySections(categoryCount = 4, perCategory = 7) {
  const db = getSupabase();
  const categories = check(
    await db.from("categories").select("id,slug,name,icon").order("sort_order").limit(categoryCount),
  );
  return Promise.all(
    categories.map(async (category: any) => {
      const rows = check(
        await db
          .from("games")
          .select(CARD_COLUMNS)
          .eq("is_published", true)
          .eq("category_id", category.id)
          .order("play_count", { ascending: false })
          .limit(perCategory),
      );
      return { category: category as { id: string; slug: string; name: string; icon: string | null }, games: rows.map(toCard) };
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

/** "Because you played X": same category or any shared tag, most played first. */
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

/** Keyword on title, optional category, and AND-filtering across selected tag slugs. */
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

  // Resolve tag filters to a set of game ids (a game must have ALL selected tags)
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

  const keyword = q?.trim().replace(/[%_,()\\]/g, " ");
  if (keyword) query = query.ilike("title", `%${keyword}%`);

  const rows = check(await query.order("play_count", { ascending: false }).limit(take));
  return rows.map(toCard);
}

export async function getPopularTags(take = 24) {
  const rows = check(await getSupabase().from("tags").select("slug,name").order("name").limit(take));
  return rows as { slug: string; name: string }[];
}
