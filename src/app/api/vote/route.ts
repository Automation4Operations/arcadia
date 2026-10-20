import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Turns any value into -1, 0 or +1 (blocks cheating with big numbers)
function toStep(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(-1, Math.min(1, Math.trunc(n)));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim().slice(0, 200) : "";
    const like = toStep(body?.like);
    const dislike = toStep(body?.dislike);

    if (!slug || (like === 0 && dislike === 0)) {
      return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
    }

    const { error } = await getSupabase().rpc("vote_game", {
      p_slug: slug,
      p_like: like,
      p_dislike: dislike,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "Vote failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
