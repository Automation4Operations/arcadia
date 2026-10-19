import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import { getCategorySections, getHeroSlides, getNewReleases, getTrending } from "@/lib/queries";

export const revalidate = 3600;

export default async function HomePage() {
  const [slides, trending, fresh, sections] = await Promise.all([
    getHeroSlides(),
    getTrending(),
    getNewReleases(),
    getCategorySections(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-16">
      <HeroSpotlight games={slides} />
      <ContinuePlaying />
      <GameGrid title="Trending in Lobby" icon="🔥" games={trending} href="/search" priorityFirst />
      <GameGrid title="Fresh Releases" icon="✨" games={fresh} href="/search" leadFeatured={false} />
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
