import Link from "next/link";
import GameGrid from "@/components/GameGrid";
import { getPopularTags, searchGames } from "@/lib/queries";

type SP = { q?: string; category?: string; tag?: string | string[] };

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const category = sp.category;
  const selected = sp.tag ? (Array.isArray(sp.tag) ? sp.tag : [sp.tag]) : [];

  const [games, tags] = await Promise.all([searchGames({ q, category, tags: selected }), getPopularTags()]);

  // Toggle a tag while keeping the keyword and the other selected tags
  const hrefFor = (slug: string) => {
    const next = selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug];
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    next.forEach((t) => params.append("tag", t));
    return `/search?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-6">
      <ul className="flex flex-wrap gap-2" aria-label="Filter by tag">
        {tags.map((t) => {
          const on = selected.includes(t.slug);
          return (
            <li key={t.slug}>
              <Link
                href={hrefFor(t.slug)}
                aria-pressed={on}
                className={`rounded-full px-3 py-1 text-sm font-medium ring-1 transition ${
                  on ? "bg-arcade text-white ring-arcade" : "bg-panel text-mute ring-edge hover:text-fg"
                }`}
              >
                {t.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {games.length > 0 ? (
        <GameGrid
          title={q ? `Results for "${q}"` : "All games"}
          games={games}
          leadFeatured={false}
        />
      ) : (
        <p className="mt-16 text-center text-mute">
          No games match. Try a different keyword or remove a tag.
        </p>
      )}
    </div>
  );
}
