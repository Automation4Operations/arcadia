import { getSupabase } from "./supabase";

/** Exact number of published games (live from the database). */
export async function getPublishedGameCount(): Promise<number> {
  try {
    const { count } = await getSupabase()
      .from("games")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true);
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Honest rounded label for Google text: 663 -> "650+". Returns "" if too small. */
export function roundedGameLabel(total: number): string {
  if (total < 50) return "";
  return `${Math.floor(total / 50) * 50}+`;
}
