import Link from "next/link";
import type { MoreGame } from "@/lib/gamePage";
import { formatCount } from "@/lib/format";

export default function MoreLikeThis({ games }: { games: MoreGame[] }) {
  if (games.length === 0) return null;

  return (
    <aside aria-label="More like this" className="lg:sticky lg:top-24 lg:self-start">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-arcade shadow-[0_0_10px] shadow-arcade" />
        <h2 className="font-display text-lg font-bold text-fg">More like this</h2>
      </div>

      <div className="no-scrollbar grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-h-[calc(100vh-140px)] lg:grid-cols-1 lg:gap-1.5 lg:overflow-y-auto lg:pr-1">
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/game/${g.slug}`}
            className="group flex flex-col gap-2 rounded-xl p-1.5 ring-1 ring-transparent transition hover:bg-panel hover:ring-edge lg:flex-row lg:items-center lg:gap-3"
          >
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-panel ring-1 ring-edge lg:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.thumbnailUrl}
                alt={g.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-xl text-sun opacity-0 transition group-hover:opacity-100">
                ▶
              </span>
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold leading-snug text-fg group-hover:text-arcade">
                {g.title}
              </p>
              <p className="mt-0.5 text-[11px] text-mute">
                {g.category.name}
                {g.playCount > 0 ? ` · ${formatCount(g.playCount)} plays` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
