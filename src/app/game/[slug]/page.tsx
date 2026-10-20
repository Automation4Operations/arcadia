import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GamePlayer from "@/components/GamePlayer";
import MoreLikeThis from "@/components/MoreLikeThis";
import GameComments from "@/components/GameComments";
import { getGameBySlug } from "@/lib/queries";
import { getGameVotes, getMoreLikeThis } from "@/lib/gamePage";
import { formatCount } from "@/lib/format";

export const revalidate = 3600;

const SITE = "https://arcadiagames.app";

type Params = { params: Promise<{ slug: string }> };

function shortText(text: string | null | undefined, max = 155) {
  const t = (text ?? "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: "Game not found", robots: { index: false } };

  const url = `${SITE}/game/${game.slug}`;
  const title = `${game.title} - Play Free Online`;
  const description =
    shortText(game.description) || `Play ${game.title} free online on Arcadia Games. No download needed.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Arcadia Games",
      title,
      description,
      images: [{ url: game.thumbnailUrl, width: 512, height: 384, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [game.thumbnailUrl],
    },
  };
}

export default async function GamePage({ params }: Params) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [votes, more] = await Promise.all([
    getGameVotes(game.slug),
    getMoreLikeThis({ id: game.id, categoryId: game.categoryId }, 16),
  ]);

  const url = `${SITE}/game/${game.slug}`;
  const categoryUrl = `/category/${game.category.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        name: game.title,
        description: shortText(game.description, 300),
        url,
        image: game.thumbnailUrl,
        genre: game.category.name,
        gamePlatform: ["Web browser", "Desktop", "Mobile"],
        applicationCategory: "Game",
        operatingSystem: "Any",
        ...(game.developer ? { author: { "@type": "Organization", name: game.developer } } : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: game.category.name, item: `${SITE}${categoryUrl}` },
          { "@type": "ListItem", position: 3, name: game.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-3 py-4 sm:px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8 lg:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="min-w-0">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-mute">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-arcade">Home</Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href={categoryUrl} className="hover:text-arcade">{game.category.name}</Link>
            </li>
            <li aria-hidden>›</li>
            <li className="truncate text-fg" aria-current="page">{game.title}</li>
          </ol>
        </nav>

        <GamePlayer
          game={{
            slug: game.slug,
            title: game.title,
            thumbnailUrl: game.thumbnailUrl,
            iframeUrl: game.iframeUrl,
            width: game.width,
            height: game.height,
            likeCount: votes.likeCount,
            dislikeCount: votes.dislikeCount,
          }}
        />

        {/* Title + stats */}
        <header className="mt-6">
          <h1 className="font-display text-2xl font-bold text-fg sm:text-4xl">{game.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href={categoryUrl}
              className="rounded-full bg-arcade/10 px-3 py-1 font-bold text-arcade ring-1 ring-arcade/40 hover:bg-arcade/20"
            >
              {game.category.name}
            </Link>
            {game.developer && (
              <span className="rounded-full bg-panel px-3 py-1 text-mute ring-1 ring-edge">
                by {game.developer}
              </span>
            )}
            {game.playCount > 0 && (
              <span className="rounded-full bg-panel px-3 py-1 text-mute ring-1 ring-edge">
                ▶ {formatCount(game.playCount)} plays
              </span>
            )}
            {votes.likeCount > 0 && (
              <span className="rounded-full bg-panel px-3 py-1 text-mute ring-1 ring-edge">
                👍 {formatCount(votes.likeCount)}
              </span>
            )}
          </div>
        </header>

        {/* About + How to play */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl bg-panel/70 p-5 ring-1 ring-edge">
            <h2 className="mb-2 font-display text-lg font-bold text-fg">About {game.title}</h2>
            <p className="text-sm leading-relaxed text-fg/85">{game.description}</p>
          </section>
          {game.instructions && (
            <section className="rounded-2xl bg-panel/70 p-5 ring-1 ring-edge">
              <h2 className="mb-2 font-display text-lg font-bold text-fg">How to play</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-fg/85">{game.instructions}</p>
            </section>
          )}
        </div>

        {/* Tags */}
        {game.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/search?tag=${tag.slug}`}
                  className="rounded-full bg-panel px-3 py-1 text-xs font-medium text-mute ring-1 ring-edge hover:text-fg hover:ring-arcade"
                >
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-sm text-mute">
          Love {game.category.name.toLowerCase()} games?{" "}
          <Link href={categoryUrl} className="font-semibold text-arcade hover:underline">
            Browse all {game.category.name} games →
          </Link>
        </p>

        {/* Comments, suggestions & issues */}
        <GameComments slug={game.slug} heading={`What players say about ${game.title}`} />
      </article>

      <MoreLikeThis games={more} />
    </div>
  );
}
