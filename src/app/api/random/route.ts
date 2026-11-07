import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Picks one game at random from the 60 most-played published games
export async function GET(req: Request) {
  const { data, error } = await getSupabase()
    .from("games")
    .select("slug")
    .eq("is_published", true)
    .order("play_count", { ascending: false })
    .limit(60);

  const list = error ? [] : data ?? [];
  if (list.length === 0) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const pick = list[Math.floor(Math.random() * list.length)].slug as string;
  const res = NextResponse.redirect(new URL(`/game/${pick}`, req.url));
  res.headers.set("Cache-Control", "no-store");
  return res;
}
