import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://arcadiagames.app";
  const db = getSupabase();

  const [{ data: categories }, { data: games }] = await Promise.all([
    db.from("categories").select("slug"),
    db.from("games").select("slug, updated_at").eq("is_published", true).limit(2000),
  ]);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage and Search
  xml += `  <url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
  xml += `  <url><loc>${baseUrl}/search</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;

  // Category pages
  for (const c of categories ?? []) {
    xml += `  <url><loc>${baseUrl}/search?category=${c.slug}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>\n`;
  }

  // Individual game pages
  for (const g of games ?? []) {
    xml += `  <url><loc>${baseUrl}/game/${g.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}