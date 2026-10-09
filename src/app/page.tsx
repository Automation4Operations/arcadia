import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import { getCategorySections, getTrending } from "@/lib/queries";

export const dynamic = "force-dynamic"; // always read fresh data from Supabase

export default async function HomePage() {
  const [trending, sections] = await Promise.all([getTrending(), getCategorySections()]);

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-16">
      <ContinuePlaying />
      <GameGrid title="Trending now" games={trending} href="/search" priorityFirst />
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
