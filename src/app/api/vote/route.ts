import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

const SALT = process.env.VOTE_SALT ?? "";

function voterKey(req: Request): string {
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  return createHash("sha256").update(ip + SALT).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim().slice(0, 200) : "";
    const v = Number(body?.vote);
    const vote = v === 1 ? 1 : v === -1 ? -1 : 0;

    if (!slug || vote === 0) {
      return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
    }

    const db = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      { auth: { persistSession: false } },
    );

    const { data, error } = await db.rpc("vote_game_v3", {
      p_slug: slug,
      p_voter: voterKey(req),
      p_vote: vote,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "Vote failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: data });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
