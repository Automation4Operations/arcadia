import type { Metadata } from "next";
import Link from "next/link";
import CategoryChips from "@/components/CategoryChips";
import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import {
  getNavCategories,
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
      images: [
        {
          url: `${SITE}/web-app-manifest-512x512.png`,
          width: 512,
          height: 512,
          alt: "Arcadia Games logo",
        },
      ],
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function HomePage() {
  const [categories, slides, trending, fresh, sections, total] = await Promise.all([
    getNavCategories(),
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
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {slides.length > 0 && <HeroSpotlight games={slides} />}

      <CategoryChips categories={categories} />

      <ContinuePlaying />

      {/* "Not sure what to play?" banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-arcade/25 via-panel to-sun/20 p-6 ring-1 ring-edge sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-black text-fg sm:text-3xl">
              Not sure what to play?
            </h2>
            <p className="mt-1 text-sm text-mute">
              Let us pick a game for you. One click, no download.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/random"
              rel="nofollow"
              className="inline-flex items-center gap-2 rounded-2xl bg-arcade px-5 py-3 text-sm font-extrabold text-ink shadow-lg transition-all hover:scale-105 hover:brightness-110 active:scale-95"
            >
              🎲 Surprise me
            </a>
            <a
              href="/api/random?mode=quick"
              rel="nofollow"
              className="inline-flex items-center gap-2 rounded-2xl bg-panel px-5 py-3 text-sm font-extrabold text-fg ring-1 ring-edge transition-all hover:scale-105 hover:ring-sun hover:text-sun active:scale-95"
            >
              ☕ Quick 5-minute game
            </a>
          </div>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            ⭐ Top Picks
          </h2>
          <GameGrid title="Top Picks" games={trending} />
        </section>
      )}

      {fresh.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            ✨ New Releases
          </h2>
          <GameGrid title="New Releases" games={fresh} />
        </section>
      )}

      {sections.map((section) => (
        <section key={section.category.slug} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {section.category.name}
            </h2>
            <Link
              href={`/category/${section.category.slug}`}
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              More {section.category.name} →
            </Link>
          </div>
          <GameGrid title={section.category.name} games={section.games} />
        </section>
      ))}
    </main>
  );
}
