import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const REASONS = ["BROKEN", "INAPPROPRIATE", "COPYRIGHT", "OTHER"] as const;
type Reason = (typeof REASONS)[number];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const reason = body?.reason as Reason;
  const details = typeof body?.details === "string" ? body.details.trim().slice(0, 500) : null;

  if (!slug || !REASONS.includes(reason)) {
    return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  }

  const db = getSupabase();
  const { data: game } = await db.from("games").select("id").eq("slug", slug).maybeSingle();
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  // No .select() here: the public key is allowed to insert reports but not to read them back.
  const { error } = await db.from("reports").insert({ game_id: game.id, reason, details: details || null });
  if (error) return NextResponse.json({ error: "Could not save report" }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}
