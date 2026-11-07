import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Quick Break = short, casual categories
const QUICK_CATEGORIES = ["puzzle", "arcade", "clicker"];

// /api/random            -> random game from the 60 most-played
// /api/random?mode=quick -> random Puzzle / Arcade / Clicker game (top 40)
export async function GET(req: Request) {
  const db = getSupabase();
  const quick = new URL(req.url).searchParams.get("mode") === "quick";

  let categoryIds: string[] = [];
  if (quick) {
    const { data: cats } = await db
      .from("categories")
      .select("id")
      .in("slug", QUICK_CATEGORIES);
    categoryIds = (cats ?? []).map((c) => c.id as string);
  }

  let query = db.from("games").select("slug").eq("is_published", true);
  if (categoryIds.length > 0) query = query.in("category_id", categoryIds);

  const { data, error } = await query
    .order("play_count", { ascending: false })
    .limit(categoryIds.length > 0 ? 40 : 60);

  const list = error ? [] : data ?? [];
  if (list.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const pick = list[Math.floor(Math.random() * list.length)].slug as string;
  const res = NextResponse.redirect(new URL(`/game/${pick}`, req.url));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
