import Link from "next/link";

type Chip = { slug: string; name: string };

export default function CategoryChips({ categories, active }: { categories: Chip[]; active?: string }) {
  if (categories.length === 0) return null;

  const base =
    "shrink-0 rounded-full px-4 py-2 text-sm font-bold ring-1 transition-all duration-200 hover:-translate-y-0.5";

  return (
    <nav
      aria-label="Game categories"
      className="sticky top-[61px] z-30 -mx-4 mt-2 border-b border-edge/60 bg-ink/80 px-4 py-3 backdrop-blur-xl"
    >
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <Link
          href="/"
          className={
            base +
            " " +
            (!active
              ? "bg-sun text-ink ring-sun shadow-[0_0_20px_rgba(204,255,0,0.4)]"
              : "bg-panel text-fg ring-edge hover:ring-sun")
          }
        >
          🏠 All
        </Link>
        {categories.map((c) => {
          const on = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={
                base +
                " " +
                (on
                  ? "bg-arcade text-ink ring-arcade shadow-[0_0_20px_rgba(0,229,255,0.45)]"
                  : "bg-panel text-fg ring-edge hover:bg-arcade/15 hover:ring-arcade")
              }
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
