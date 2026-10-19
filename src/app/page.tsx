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

export const revalidate = 3600;

export default async function HomePage() {
  // Counts chosen so every row is full at 4 per row:
  // a "Top Pick" tile fills 4 spots, so 1 big + 12 small = 16 spots = 4 full rows.
  const [categories, slides, trending, fresh, sections] = await Promise.all([
    getAllCategories(),
    getHeroSlides(),
    getTrending(13),
    getNewReleases(12),
    getCategorySections(13, 9),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <CategoryChips categories={categories} />
      <HeroSpotlight games={slides} />
      <ContinuePlaying />
      <GameGrid
        title="Trending in Lobby"
        icon="🔥"
        games={trending}
        href="/search"
        priorityFirst
        badge="hot"
      />
      <GameGrid
        title="Fresh Releases"
        icon="✨"
        games={fresh}
        href="/search"
        leadFeatured={false}
        badge="new"
      />
      {sections.map(({ category, games }) => (
        <GameGrid
          key={category.id}
          title={category.name}
          icon={category.icon}
          games={games}
          href={`/search?category=${category.slug}`}
        />
      ))}
    </div>
  );
}
