import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GamePlayer from "@/components/GamePlayer";
import RecommendedList from "@/components/RecommendedList";
import { getGameBySlug, getRecommended } from "@/lib/queries";
import { formatCount } from "@/lib/format";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  const title = `${game.title} - Play Free Online`;
  const description = `Play ${game.title} online for free on Arcadia Games. ${game.description}`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `/game/${game.slug}` },
    openGraph: {
      title: `${game.title} | Arcadia Games`,
      description,
      url: `/game/${game.slug}`,
      type: "website",
      images: [{ url: game.thumbnailUrl, width: 512, height: 384, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} | Arcadia Games`,
      description,
      images: [game.thumbnailUrl],
    },
  };
}

export default async function GamePage({ params }: Params) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const recommended = await getRecommended({
    id: game.id,
    categoryId: game.categoryId,
    tagIds: game.tags.map((t) => t.id),
  });

  // Structured data: tells Google this page is a free browser game
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    image: game.thumbnailUrl,
    url: `https://arcadiagames.app/game/${game.slug}`,
    genre: game.category.name,
    gamePlatform: ["Web browser", "PC", "Mobile"],
    applicationCategory: "Game",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article>
        <nav aria-label="Breadcrumb" className="mb-3 text-xs font-semibold text-mute">
          <Link href="/" className="hover:text-fg">Home</Link>
          <span className="mx-1.5">›</span>
          <Link href={`/category/${game.category.slug}`} className="hover:text-fg">
            {game.category.name} Games
          </Link>
          <span className="mx-1.5">›</span>
          <span className="text-fg">{game.title}</span>
        </nav>

        <GamePlayer
          game={{
            slug: game.slug,
            title: game.title,
            thumbnailUrl: game.thumbnailUrl,
            iframeUrl: game.iframeUrl,
            width: game.width,
            height: game.height,
          }}
        />

        <header className="mt-6">
          <h1 className="font-display text-3xl font-bold text-fg">{game.title}</h1>
          <p className="mt-1 text-sm text-mute">
            <Link href={`/category/${game.category.slug}`} className="text-arcade-soft hover:underline">
              {game.category.name}
            </Link>
            {game.developer ? ` by ${game.developer}` : ""}
            {game.playCount > 0 ? ` · ${formatCount(game.playCount)} plays` : ""}
            {game.ratingAvg ? ` · ${game.ratingAvg.toFixed(1)} rating` : ""}
          </p>
        </header>

        <div className="mt-5 max-w-prose space-y-4 leading-relaxed text-fg/90">
          <h2 className="font-display text-lg font-bold text-fg">About {game.title}</h2>
          <p>{game.description}</p>
          {game.instructions && (
            <section>
              <h2 className="mb-1 font-display text-lg font-bold text-fg">How to play {game.title}</h2>
              <p>{game.instructions}</p>
            </section>
          )}
          <p className="text-sm text-mute">
            {game.title} is free to play in your browser on Arcadia Games, with no download needed. Find more{" "}
            <Link href={`/category/${game.category.slug}`} className="text-arcade-soft hover:underline">
              {game.category.name.toLowerCase()} games
            </Link>{" "}
            or browse our full collection.
          </p>
        </div>

        {game.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/search?tag=${tag.slug}`}
                  className="rounded-full bg-panel px-3 py-1 text-xs font-medium text-mute ring-1 ring-edge hover:text-fg hover:ring-arcade"
                >
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      <RecommendedList title={`Because you played ${game.title}`} games={recommended} />
    </div>
  );
}
