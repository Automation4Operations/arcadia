import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/format";
import type { GameCardData } from "@/lib/queries";

export default function RecommendedList({ title, games }: { title: string; games: GameCardData[] }) {
  if (games.length === 0) return null;
  return (
    <aside aria-label={title}>
      <h2 className="mb-3 font-display text-lg font-bold text-fg">{title}</h2>
      <ul className="space-y-2">
        {games.map((g) => (
          <li key={g.id}>
            <Link
              href={`/game/${g.slug}`}
              className="group flex items-center gap-3 rounded-xl p-1.5 hover:bg-panel focus-visible:ring-2 focus-visible:ring-sun"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-edge">
                <Image src={g.thumbnailUrl} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg group-hover:text-arcade-soft">{g.title}</p>
                <p className="text-xs text-mute">
                  {g.category.name} · {formatCount(g.playCount)} plays
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
