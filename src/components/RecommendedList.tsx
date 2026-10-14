import GameCard from "./GameCard";
import type { GameCardData } from "@/lib/queries";

export default function RecommendedList({
  title,
  games,
}: {
  title: string;
  games: GameCardData[];
}) {
  if (games.length === 0) return null;
  return (
    <aside aria-label={title}>
      <h2 className="mb-3 font-display text-lg font-bold text-fg">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {games.map((g) => (
          <GameCard key={g.id} game={g} />
        ))}
      </div>
    </aside>
  );
}