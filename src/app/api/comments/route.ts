import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MESSAGES: Record<string, string> = {
  ok: "Thanks! Your message was sent and will appear after review.",
  too_short: "Please write at least 3 characters.",
  too_long: "Please keep it under 500 characters.",
  no_links: "Links are not allowed in messages.",
  unknown_game: "This game could not be found.",
  slow_down: "You're sending messages too fast. Please wait a few minutes.",
};

// Turns the visitor's internet address into a one-way scrambled code
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode("arcadia-comments:" + ip);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// GET /api/comments?slug=game-slug  -> approved comments for one game
// GET /api/comments                 -> approved whole-site feedback
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")?.trim().slice(0, 200) || null;

  let query = getSupabase()
    .from("comments")
    .select("id,kind,name,body,created_at")
    .eq("status", "approved")
    .neq("kind", "issue")
    .order("created_at", { ascending: false })
    .limit(30);

  query = slug ? query.eq("game_slug", slug) : query.is("game_slug", null);

  const { data, error } = await query;
  if (error) return NextResponse.json({ comments: [] });

  return NextResponse.json(
    { comments: data ?? [] },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}

// POST /api/comments  { slug, kind, name, body }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    const { data, error } = await getSupabase().rpc("submit_comment", {
      p_slug: typeof body?.slug === "string" ? body.slug.slice(0, 200) : null,
      p_kind: typeof body?.kind === "string" ? body.kind : "comment",
      p_name: typeof body?.name === "string" ? body.name.slice(0, 40) : "",
      p_body: typeof body?.body === "string" ? body.body.slice(0, 600) : "",
      p_ip_hash: await hashIp(ip),
    });

    if (error) {
      return NextResponse.json(
        { ok: false, message: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    const code = String(data ?? "");
    return NextResponse.json(
      { ok: code === "ok", message: MESSAGES[code] ?? "Something went wrong. Please try again." },
      { status: code === "ok" ? 200 : 400 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "Something went wrong. Please try again." },
      { status: 400 },
    );
  }
}
