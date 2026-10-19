import { getSupabase } from "./supabase";

export type GameSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  thumbnailUrl: string;
  iframeUrl: string;
  categoryName: string;
  categorySlug: string;
  playCount: number;
  ratingAvg: number;
};

export type GameDetail = GameSummary & {
  instructions: string | null;
  width: number;
  height: number;
  tags: { id: string; slug: string; name: string }[];
};

export type CategoryItem = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
};

function mapSummary(row: any): GameSummary {
  const cat = Array.isArray(row.category) ? row.category[0] : row.category;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? null,
    thumbnailUrl: row.thumbnail_url,
    iframeUrl: row.iframe_url,
    categoryName: cat?.name ?? "Arcade",
    categorySlug: cat?.slug ?? "action",
    playCount: Number(row.play_count ?? 0),
    ratingAvg: Number(row.rating_avg ?? 0),
  };
}

export async function getAllCategories(): Promise<CategoryItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("categories")
    .select("id,slug,name,icon")
    .order("name", { ascending: true });
  return (data ?? []) as CategoryItem[];
}

export async function getActiveGamesPage(
  page = 1,
  pageSize = 60,
  categorySlug?: string
): Promise<{ games: GameSummary[]; total: number }> {
  const supabase = getSupabase();
  if (!supabase) return { games: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();
    if (!cat) return { games: [], total: 0 };
    categoryId = (cat as { id: string }).id;
  }

  let q = supabase
    .from("games")
    .select("id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,category:categories(name,slug)", { count: "exact" })
    .eq("is_active", true)
    .ilike("iframe_url", "%gamemonetize%")
    .order("is_featured", { ascending: false })
    .order("play_count", { ascending: false })
    .range(from, to);

  if (categoryId) q = q.eq("category_id", categoryId);

  const { data, count } = await q;
  return {
    games: (data ?? []).map(mapSummary),
    total: count ?? 0,
  };
}

export async function searchActiveGames(query: string, limit = 60): Promise<GameSummary[]> {
  const supabase = getSupabase();
  const cleaned = query.trim();
  if (!supabase || !cleaned) return [];

  const { data } = await supabase
    .from("games")
    .select("id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,category:categories(name,slug)")
    .eq("is_active", true)
    .ilike("iframe_url", "%gamemonetize%")
    .or("title.ilike.%" + cleaned + "%,description.ilike.%" + cleaned + "%")
    .order("play_count", { ascending: false })
    .limit(limit);

  return (data ?? []).map(mapSummary);
}

export async function getGameBySlug(slug: string): Promise<GameDetail | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("games")
    .select("*, category:categories(id,slug,name), tags:game_tags(tag:tags(id,slug,name))")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return null;
  const row: any = data;
  const base = mapSummary(row);
  const rawTags = Array.isArray(row.tags) ? row.tags : [];
  const tags = rawTags.map((t: any) => t?.tag).filter(Boolean);

  return {
    ...base,
    instructions: row.instructions ?? null,
    width: Number(row.width ?? 1280),
    height: Number(row.height ?? 720),
    tags,
  };
}

export async function getRecommendedGames(excludeId: string, categorySlug: string, limit = 12): Promise<GameSummary[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("games")
    .select("id,slug,title,description,thumbnail_url,iframe_url,play_count,rating_avg,category:categories(name,slug)")
    .eq("is_active", true)
    .ilike("iframe_url", "%gamemonetize%")
    .neq("id", excludeId)
    .order("play_count", { ascending: false })
    .limit(limit);

  return (data ?? []).map(mapSummary);
}

export async function getAllActiveGameSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from("games")
    .select("slug,updated_at")
    .eq("is_active", true)
    .ilike("iframe_url", "%gamemonetize%")
    .limit(5000);
  return (data ?? []) as { slug: string; updated_at: string }[];
}
