import type { Metadata } from "next";
import Link from "next/link";
import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import AdBanner from "@/components/AdBanner";
import {
  getCategorySections,
  getHeroSlides,
  getNewReleases,
  getTrending,
} from "@/lib/queries";
import { getPublishedGameCount, roundedGameLabel } from "@/lib/stats";
import { TRENDING_TAGS, TRENDING_QUOTES, RESTRUCTURED_CATEGORY_META } from "@/lib/seoData";

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
  const [slides, trending, fresh, sections, total] = await Promise.all([
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
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
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

      {/* Trending Tags Bar */}
      <section aria-label="Trending search tags" className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TRENDING_TAGS.map((tag) => (
          <Link
            key={tag.href}
            href={tag.href}
            prefetch={false}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-panel/80 px-3.5 py-1.5 text-xs font-bold text-fg ring-1 ring-edge transition hover:bg-arcade hover:text-ink hover:ring-arcade"
          >
            <span>{tag.label}</span>
            {tag.badge && (
              <span className="rounded-full bg-sun/20 px-1.5 text-[9px] font-black text-sun group-hover:bg-ink group-hover:text-sun">
                {tag.badge}
              </span>
            )}
          </Link>
        ))}
      </section>

      {slides.length > 0 && <HeroSpotlight games={slides} />}

      <ContinuePlaying />

      {/* Trending Quotes Strip */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-arcade/10 via-panel/80 to-sun/10 p-4 ring-1 ring-edge">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-arcade/20 text-xs text-arcade">
              💡
            </span>
            <span className="font-medium text-fg/90 italic">
              &quot;{TRENDING_QUOTES[0].quote}&quot;
            </span>
          </div>
          <Link
            href={TRENDING_QUOTES[0].href}
            className="font-bold text-arcade hover:underline"
          >
            {TRENDING_QUOTES[0].tag} →
          </Link>
        </div>
      </section>

      <hr className="section-divider" />

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
        <GameGrid
          title="Top Picks"
          subtitle="The most played and top rated titles right now"
          icon="⭐"
          games={trending}
          bento
        />
      )}

      {/* Google AdSense In-Feed Slot */}
      <AdBanner format="auto" className="my-8" />

      <hr className="section-divider" />

      {fresh.length > 0 && (
        <GameGrid
          title="New Releases"
          subtitle="Fresh games added this week across all genres"
          icon="✨"
          games={fresh}
          bento
        />
      )}

      {/* Category Hub Grid */}
      <section className="mt-12 rounded-3xl bg-panel/50 p-6 ring-1 ring-edge sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-fg sm:text-3xl">
              🎮 Browse by Category
            </h2>
            <p className="mt-1 text-xs text-mute">
              Find exactly what you want to play
            </p>
          </div>
          <Link
            href="/games"
            className="rounded-xl bg-arcade px-4 py-2 text-xs font-bold text-ink transition hover:brightness-110"
          >
            All Games Directory →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Object.entries(RESTRUCTURED_CATEGORY_META).map(([slug, meta]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="group flex flex-col items-center justify-center rounded-2xl bg-ink/70 p-4 text-center ring-1 ring-edge transition hover:-translate-y-1 hover:ring-arcade/70"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {meta.icon}
              </span>
              <span className="mt-2 text-xs font-bold text-fg capitalize group-hover:text-arcade">
                {slug}
              </span>
              <span className="mt-0.5 line-clamp-1 text-[10px] text-mute">
                {meta.tagline}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {sections.map((section) => (
        <GameGrid
          key={section.category.slug}
          title={section.category.name}
          games={section.games}
          href={`/category/${section.category.slug}`}
          moreLabel={`More ${section.category.name}`}
          bento
        />
      ))}
    </main>
  );
}
