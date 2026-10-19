import { getSupabase } from "@/lib/supabase";

export const revalidate = 3600;

const BASE = "https://arcadiagames.app";

export async function GET() {
  const db = getSupabase();
  const [{ data: games }, { data: cats }] = await Promise.all([
    db
      .from("games")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("play_count", { ascending: false })
      .range(0, 9999),
    db.from("categories").select("slug"),
  ]);

  const urls = [
    `<url><loc>${BASE}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${BASE}/about</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>`,
    ...(cats ?? []).map(
      (c) =>
        `<url><loc>${BASE}/category/${c.slug}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ),
    ...(games ?? []).map(
      (g) =>
        `<url><loc>${BASE}/game/${g.slug}</loc><lastmod>${new Date(g.updated_at).toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    ),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
