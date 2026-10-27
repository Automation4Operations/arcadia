import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/search"],
      },
    ],
    sitemap: [
      "https://arcadiagames.app/sitemap.xml",
      "https://arcadiagames.app/collections-sitemap.xml",
    ],
    host: "https://arcadiagames.app",
  };
}
