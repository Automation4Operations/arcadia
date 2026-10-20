/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabase } from "./supabase";

export type MoreGame = {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  playCount: number;
  likeCount: number;
  category: { name: string; slug: string };
};

const MORE_COLUMNS = "id,slug,title,thumbnail_url,play_count,like_count,category:categories(name,slug)";

function toMore(r: any): MoreGame {
  const cat = Array.isArray(r.category) ? r.category[0] : r.category;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    thumbnailUrl: r.thumbnail_url,
    playCount: r.play_count ?? 0,
    likeCount: r.like_count ?? 0,
    category: { name: cat?.name ?? "", slug: cat?.slug ?? "" },
  };
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Like + dislike numbers for one game */
export async function getGameVotes(slug: string): Promise<{ likeCount: number; dislikeCount: number }> {
  try {
    const { data } = await getSupabase()
      .from("games")
      .select("like_count,dislike_count")
      .eq("slug", slug)
      .maybeSingle();
    const r: any = data;
    return { likeCount: r?.like_count ?? 0, dislikeCount: r?.dislike_count ?? 0 };
  } catch {
    return { likeCount: 0, dislikeCount: 0 };
  }
}

/** Similar games: same category first (mixed order), then popular games to fill */
export async function getMoreLikeThis(
  game: { id: string; categoryId: string },
  take = 16,
): Promise<MoreGame[]> {
  const db = getSupabase();
  try {
    const { data: same } = await db
      .from("games")
      .select(MORE_COLUMNS)
      .eq("is_published", true)
      .eq("category_id", game.categoryId)
      .neq("id", game.id)
      .order("play_count", { ascending: false })
      .limit(40);

    let picks = shuffle((same ?? []).map(toMore)).slice(0, take);

    if (picks.length < take) {
      const { data: extra } = await db
        .from("games")
        .select(MORE_COLUMNS)
        .eq("is_published", true)
        .neq("category_id", game.categoryId)
        .order("play_count", { ascending: false })
        .limit(take - picks.length);
      picks = picks.concat((extra ?? []).map(toMore));
    }
    return picks;
  } catch {
    return [];
  }
}
