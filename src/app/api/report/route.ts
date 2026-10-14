import { NextResponse } from "next/server";
import { searchGames } from "@/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ games: [] });
  }
  try {
    const games = await searchGames({ q, take: 6 });
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] }, { status: 500 });
  }
}