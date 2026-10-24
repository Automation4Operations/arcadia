import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryChips from "@/components/CategoryChips";
import GameGrid from "@/components/GameGrid";
import { getAllCategories, searchGames } from "@/lib/queries";
import { CATEGORY_CONTENT } from "@/lib/categoryContent";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return [
    "shooting", "driving", "action", "stickman", "io", "puzzle",
    "arcade", "adventure", "simulation", "sports", "board", "clicker",
  ].map((slug) => ({ slug }));
}
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
  const content = CATEGORY_CONTENT[slug];
  const title = `${category.name} Games - Play Free Online ${category.name} Games`;
  const description =
    content?.metaDescription ??
    `Play the best free ${category.name.toLowerCase()} games online at Arcadia Games. No downloads, no sign-up. Instant play on PC, mobile and tablet.`;
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

  const content = CATEGORY_CONTENT[slug];
  const games = await searchGames({ category: slug, take: 250 });

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <CategoryChips categories={categories} active={slug} />
      <header className="fade-up mt-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          {category.name} Games
        </h1>
        <p className="mt-2 max-w-3xl text-mute">
          {content
            ? content.intro
            : `Play free ${category.name.toLowerCase()} games online at Arcadia Games.`}{" "}
          Choose from {games.length} free games with no downloads and no sign-up.
        </p>
      </header>
      <GameGrid title={`All ${category.name} Games`} games={games} leadFeatured={false} />
      {content && (
        <section className="mt-12 max-w-3xl rounded-2xl bg-panel p-6 ring-1 ring-edge">
          <h2 className="font-display text-xl font-extrabold text-fg">
            About {category.name} Games
          </h2>
          {content.about.map((text, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-mute">
              {text}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
