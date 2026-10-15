import Link from "next/link";
import GameCard from "./GameCard";
import type { GameCardData } from "@/lib/queries";

type Props = {
  title: string;
  games: GameCardData[];
  href?: string;
  icon?: string | null;
  leadFeatured?: boolean;
  priorityFirst?: boolean;
};

export default function GameGrid({
  title,
  games,
  href,
  icon,
  leadFeatured = true,
  priorityFirst = false,
}: Props) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby={"grid-" + title} className="mt-10">
      <div className="mb-4 flex items-center justify-between border-b border-edge/60 pb-2.5">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel text-lg ring-1 ring-edge" aria-hidden>
              {icon}
            </span>
          ) : null}
          <h2 id={"grid-" + title} className="font-display text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
            {title}
          </h2>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-xl bg-panel px-3.5 py-1.5 text-xs font-bold text-arcade-soft ring-1 ring-edge transition hover:border-arcade hover:bg-arcade hover:text-ink"
          >
            <span>Explore All</span>
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>

      <div className="grid grid-flow-dense grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {games.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            featured={leadFeatured && i === 0}
            priority={priorityFirst && i < 4}
          />
        ))}
      </div>
    </section>
  );
}
