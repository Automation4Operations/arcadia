import { COLLECTIONS } from "@/lib/collections";

export const dynamic = "force-static";

const SITE = "https://arcadiagames.app";

export function GET() {
  const now = new Date().toISOString();
  const paths = [...COLLECTIONS.map((c) => `/collection/${c.slug}`), "/feedback"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (p) =>
      `  <url><loc>${SITE}${p}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
