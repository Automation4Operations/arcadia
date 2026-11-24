import type { Metadata } from "next";
import { searchGames, getAllCategories } from "@/lib/queries";
import AllGamesExplorer from "./AllGamesExplorer";
import AdBanner from "@/components/AdBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Games Directory — Play 500+ Free Browser Games",
  description:
    "Browse our full library of free online games. Filter by genre, played status, or sort by rating. Zero downloads, instant play on phone and PC.",
  alternates: {
    canonical: "https://arcadiagames.app/games",
  },
};

export default async function GamesPage() {
  const [games, categories] = await Promise.all([
    searchGames({ take: 500 }),
    getAllCategories(),
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          🎮 All Games Directory
        </h1>
        <p className="mt-2 text-sm text-mute">
          Explore all {games.length} free browser games available on Arcadia. Use the tabs to see games you have played vs new titles to discover.
        </p>
      </div>

      <AllGamesExplorer
        initialGames={games}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />

      <AdBanner format="auto" className="my-8" />
    </main>
  );
}
