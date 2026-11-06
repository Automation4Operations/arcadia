import type { Metadata } from "next";
import Link from "next/link";
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
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {slides.length > 0 && <HeroSpotlight slides={slides} />}

      <CategoryChips categories={categories} />

      <ContinuePlaying />

      {trending.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-white">
              🔥 Trending Now
            </h2>
            <Link
              href="/games"
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              View all ({total}+) →
            </Link>
          </div>
          <GameGrid games={trending} />
        </section>
      )}

      {fresh.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">
            ✨ New Releases
          </h2>
          <GameGrid games={fresh} />
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
          <GameGrid games={section.games} />
        </section>
      )})
    </main>
  );
}
