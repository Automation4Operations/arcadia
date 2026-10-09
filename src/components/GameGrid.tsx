import Link from "next/link";
import GameCard from "./GameCard";
import type { GameCardData } from "@/lib/queries";

type Props = {
  title: string;
  games: GameCardData[];
  href?: string;          // "See all" destination
  icon?: string | null;
  /** Make the first game a double-size tile */
  leadFeatured?: boolean;
  priorityFirst?: boolean;
};

export default function GameGrid({ title, games, href, icon, leadFeatured = true, priorityFirst = false }: Props) {
  if (games.length === 0) return null;

  return (
    <section aria-labelledby={`grid-${title}`} className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 id={`grid-${title}`} className="font-display text-2xl font-bold text-fg">
          {icon ? <span className="mr-2" aria-hidden>{icon}</span> : null}
          {title}
        </h2>
        {href ? (
          <Link href={href} className="rounded-full px-3 py-1 text-sm font-medium text-arcade-soft hover:bg-panel focus-visible:ring-2 focus-visible:ring-sun">
            See all
          </Link>
        ) : null}
      </div>

      <div className="grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 xl:grid-cols-6">
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
