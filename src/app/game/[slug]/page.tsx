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
  return {
    title: `${game.title} - Play free online`,
    description: game.description.slice(0, 155),
    openGraph: { title: game.title, description: game.description.slice(0, 155), images: [game.thumbnailUrl] },
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

  return (
    <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article>
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
            <Link href={`/search?category=${game.category.slug}`} className="text-arcade-soft hover:underline">
              {game.category.name}
            </Link>
            {game.developer ? ` by ${game.developer}` : ""} · {formatCount(game.playCount)} plays
            {game.ratingAvg ? ` · ${game.ratingAvg.toFixed(1)} rating` : ""}
          </p>
        </header>

        <div className="mt-5 max-w-prose space-y-4 text-fg/90 leading-relaxed">
          <p>{game.description}</p>
          {game.instructions && (
            <section>
              <h2 className="mb-1 font-display text-lg font-bold text-fg">How to play</h2>
              <p>{game.instructions}</p>
            </section>
          )}
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
