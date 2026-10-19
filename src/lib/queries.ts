import { getSupabase } from "./supabase";

export type GameCardData = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  iframeUrl?: string;
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
  "id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,is_featured,category:categories(name,slug)";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCard(r: any): GameCardData {
  const cat = Array.isArray(r.category) ? r.category[0] : r.category;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    thumbnailUrl: r.thumbnail_url,
    iframeUrl: r.iframe_url ?? "",
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
    .from("games").select("id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,category:categories(name,slug)").ilike("iframe_url", "%gamemonetize%")
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
    iframeUrl: r.iframe_url as string,
    playCount: r.play_count as number,
    ratingAvg: r.rating_avg as number,
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

export async function getTrending(take = 15): Promise<GameCardData[]> {
  const rows = check(
    await getSupabase()
      .from("games").select(CARD_COLUMNS)
      .eq("is_published", true)
      .order("play_count", { ascending: false })
      .limit(take),
  );
  return rows.map(toCard);
}

export async function getNewReleases(take = 12): Promise<GameCardData[]> {
  const rows = check(
    await getSupabase()
      .from("games").select(CARD_COLUMNS)
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(take),
  );
  return rows.map(toCard);
}

export async function getCategorySections(categoryCount = 13, perCategory = 11) {
  const db = getSupabase();
  const categories = await getAllCategories();
  return Promise.all(
    categories.slice(0, categoryCount).map(async (category) => {
      const rows = check(
        await db
          .from("games").select(CARD_COLUMNS)
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
    .from("games").select("*, category:categories(id,slug,name), tags:game_tags(tag:tags(id,slug,name))").ilike("iframe_url", "%gamemonetize%")
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
  take = 12,
): Promise<GameCardData[]> {
  const db = getSupabase();
  const sameCategory = check(
    await db
      .from("games").select(CARD_COLUMNS)
      .eq("is_published", true)
      .eq("category_id", game.categoryId)
      .neq("id", game.id)
      .order("play_count", { ascending: false })
      .limit(take),
  ).map(toCard);
  return sameCategory;
}

export async function searchGames({
  q,
  category,
  tags = [],
  take = 250,
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

  const keyword = q?.trim().replace(/[%_,()\\]/g, " ");
  if (keyword) query = query.ilike("title", "%" + keyword + "%");

  const rows = check(await query.order("play_count", { ascending: false }).limit(take));
  return rows.map(toCard);
}

export async function getPopularTags(take = 24) {
  const rows = check(await getSupabase().from("tags").select("slug,name").order("name").limit(take));
  return rows as { slug: string; name: string }[];
}
