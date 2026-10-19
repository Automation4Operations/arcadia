import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryChips from "@/components/CategoryChips";
import GameGrid from "@/components/GameGrid";
import { getAllCategories, searchGames } from "@/lib/queries";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  return { categories, category };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await load(slug);
  if (!category) return {};
  const title = `${category.name} Games - Play Free Online ${category.name} Games`;
  const description = `Play the best free ${category.name.toLowerCase()} games online at Arcadia Games. No downloads, no sign-up. Instant play on PC, mobile and tablet.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description, url: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const { categories, category } = await load(slug);
  if (!category) notFound();

  const games = await searchGames({ category: slug, take: 250 });

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <CategoryChips categories={categories} active={slug} />
      <header className="fade-up mt-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          {category.name} Games
        </h1>
        <p className="mt-2 max-w-3xl text-mute">
          Play {games.length} free {category.name.toLowerCase()} games online at Arcadia Games. Every game
          runs instantly in your browser on PC, phone and tablet, with no downloads and no sign-up.
        </p>
      </header>
      <GameGrid title={`All ${category.name} Games`} games={games} leadFeatured={false} />
    </div>
  );
}
