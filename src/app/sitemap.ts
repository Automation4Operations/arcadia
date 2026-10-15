import type { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://arcadiagames.app";
  const db = getSupabase();

  const [{ data: categories }, { data: games }] = await Promise.all([
    db.from("categories").select("slug"),
    db.from("games").select("slug, updated_at").eq("is_published", true).limit(2000),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c: { slug: string }) => ({
    url: `${baseUrl}/search?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const gameRoutes: MetadataRoute.Sitemap = (games ?? []).map(
    (g: { slug: string; updated_at?: string }) => ({
      url: `${baseUrl}/game/${g.slug}`,
      lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...gameRoutes];
}
