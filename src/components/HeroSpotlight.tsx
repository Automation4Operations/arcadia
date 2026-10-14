import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/format";

type HeroGame = {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  playCount: number;
  ratingAvg: number;
  category: { name: string; slug: string };
};

export default function HeroSpotlight({ game }: { game: HeroGame | null }) {
  if (!game) return null;

  return (
    <section className="relative mt-6 overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="grid items-center gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-md bg-sun/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-sun ring-1 ring-sun/30">
            <span>🔥 Featured Spotlight</span>
            <span>•</span>
            <span>{game.category.name}</span>
          </div>

          <h1 className="font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
            {game.title}
          </h1>

          <p className="line-clamp-2 max-w-xl text-sm text-mute sm:text-base">
            {game.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href={`/game/${game.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-sun px-6 py-3 font-display text-sm font-black text-ink shadow-[0_0_25px_rgba(204,255,0,0.4)] transition hover:scale-105"
            >
              ▶ Launch Game
            </Link>
            <div className="text-xs font-medium text-mute">
              <span className="font-bold text-fg">{formatCount(game.playCount)}</span> plays
              {game.ratingAvg ? ` · ★ ${game.ratingAvg.toFixed(1)} rating` : ""}
            </div>
          </div>
        </div>

        <Link
          href={`/game/${game.slug}`}
          className="group relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-edge"
        >
          <Image
            src={game.thumbnailUrl}
            alt={game.title}
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
    </section>
  );
}