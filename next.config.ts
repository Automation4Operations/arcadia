import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const config: NextConfig = {
  // Thumbnails are pre-sized WebP files served from Cloudflare R2's CDN, so no image optimizer is needed.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // After you set up your games domain, add this (replace the domain):
          // { key: "Content-Security-Policy", value: "frame-src https://games.yourdomain.com;" },
        ],
      },
    ];
  },
};

export default config;
