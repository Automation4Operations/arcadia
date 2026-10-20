import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("q") || "";
  const q = raw.trim().replace(/[%_,()\\]/g, " ").slice(0, 40);
  if (q.length < 2) return NextResponse.json({ games: [] });

  const { data, error } = await getSupabase()
    .from("games")
    .select("slug,title,thumbnail_url")
    .eq("is_published", true)
    .ilike("title", `%${q}%`)
    .order("play_count", { ascending: false })
    .limit(6);

  if (error) return NextResponse.json({ games: [] });

  return NextResponse.json(
    {
      games: (data ?? []).map((g) => ({
        slug: g.slug as string,
        title: g.title as string,
        thumbnailUrl: g.thumbnail_url as string,
      })),
    },
    { headers: { "Cache-Control": "public, max-age=120" } },
  );
}
