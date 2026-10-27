import type { Metadata } from "next";
import CategoryChips from "@/components/CategoryChips";
import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import {
  getAllCategories,
  getCategorySections,
  getHeroSlides,
  getNewReleases,
  getTrending,
} from "@/lib/queries";
import { getPublishedGameCount, roundedGameLabel } from "@/lib/stats";

   export const revalidate = 3600;

const SITE = "https://arcadiagames.app";

export async function generateMetadata(): Promise<Metadata> {
  const total = await getPublishedGameCount();
  const label = roundedGameLabel(total);

  const title = label
    ? `Arcadia Games – Play ${label} Free Online Games, No Download`
    : "Arcadia Games – Free Online Games, No Download";
  const description = `Play ${label || "hundreds of"} free online games instantly on Arcadia Games – shooters, racing, .io battles, puzzles & 2-player fun. No download, no sign-up, on phone or PC.`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: SITE },
    openGraph: {
      type: "website",
      url: SITE,
      siteName: "Arcadia Games",
      title,
      description,
      images: [{ url: `${SITE}/web-app-manifest-512x512.png`, width: 512, height: 512, alt: "Arcadia Games logo" }],
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function HomePage() {
  // Counts chosen so every row is full at 4 per row:
  // a "Top Pick" tile fills 4 spots, so 1 big + 12 small = 16 spots = 4 full rows.
  const [categories, slides, trending, fresh, sections, total] = await Promise.all([
    getAllCategories(),
    getHeroSlides(),
    getTrending(13),
    getNewReleases(12),
    getCategorySections(13, 9),
    getPublishedGameCount(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Arcadia Games",
        url: SITE,
        logo: `${SITE}/web-app-manifest-512x512.png`,
        email: "contact@arcadiagames.app",
      },
      {
        "@type": "WebSite",
        name: "Arcadia Games",
        alternateName: "ArcadiaGames.app",
        url: SITE,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Live stats strip */}
      {total > 0 && (
        <div className="fade-up mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl bg-panel/60 px-4 py-3 text-xs font-semibold text-mute ring-1 ring-edge sm:justify-between">
          <p className="font-display text-sm font-bold text-fg">
            <span className="pulse-dot mr-2 align-middle" aria-hidden />
            <span className="text-neon">{total.toLocaleString("en-US")}</span> free games. One click to play.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <li>⚡ Instant play</li>
            <li>📱 Phone &amp; PC</li>
            <li>🚫 No downloads</li>
            <li>🔓 No sign-up</li>
          </ul>
        </div>
      )}

      <div className="fade-up">
        <CategoryChips categories={categories} />
      </div>

            {/* Hero with motion layer */}
      <div className="hero-fx relative">
        <HeroSpotlight games={slides} />
        <div className="hero-fx-layer" aria-hidden>
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
          <span className="beam" />
          <span className="sparkles" />
        </div>
      </div>

      <ContinuePlaying />

      <div className="reveal">
        <GameGrid
          title="Trending in Lobby"
          icon="🔥"
          games={trending}
          href="/search"
          priorityFirst
          badge="hot"
        />
      </div>
      <div className="reveal">
        <GameGrid
          title="Fresh Releases"
          icon="✨"
          games={fresh}
          href="/search"
          leadFeatured={false}
          badge="new"
        />
      </div>
      {sections.map(({ category, games }) => (
        <div key={category.id} className="reveal">
          <GameGrid
            title={category.name}
            icon={category.icon}
            games={games}
            href={`/category/${category.slug}`}
          />
        </div>
      ))}
    </div>
  );
}
