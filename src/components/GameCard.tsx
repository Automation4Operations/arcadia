import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/format";

export type GameCardProps = {
  game: {
    slug: string;
    title: string;
    thumbnailUrl: string;
    playCount?: number;
    ratingAvg?: number;
    category?: { name: string } | null;
  };
  featured?: boolean;
  priority?: boolean;
};

export default function GameCard({ game, featured = false, priority = false }: GameCardProps) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className={`group relative block overflow-hidden rounded-xl bg-panel ring-1 ring-edge transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-arcade hover:shadow-[0_8px_30px_rgba(0,229,255,0.18)] focus-visible:ring-2 focus-visible:ring-sun ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink">
        <Image
          src={game.thumbnailUrl}
          alt={game.title}
          fill
          priority={priority}
          sizes={
            featured
              ? "(min-width:1024px) 35vw, 100vw"
              : "(min-width:1280px) 18vw, (min-width:640px) 30vw, 50vw"
          }
          className="object-cover transition duration-500 ease-out group-hover:scale-110"
        />

        {/* Top-left Category Chip */}
        {game.category?.name && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-arcade-soft backdrop-blur-md ring-1 ring-edge">
            {game.category.name}
          </span>
        )}

        {/* Top-right Rating Pill */}
        {game.ratingAvg ? (
          <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-ink/80 px-2 py-0.5 text-xs font-bold text-sun backdrop-blur-md ring-1 ring-edge">
            ★ {game.ratingAvg.toFixed(1)}
          </span>
        ) : null}

        {/* Bottom Glass Gradient Info Bar */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-3 pt-8">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h3
                className={`truncate font-display font-bold text-fg ${
                  featured ? "text-lg sm:text-xl" : "text-sm"
                }`}
              >
                {game.title}
              </h3>
              {game.playCount ? (
                <p className="text-[11px] font-medium text-mute">
                  {formatCount(game.playCount)} plays
                </p>
              ) : null}
            </div>

            <span className="shrink-0 rounded-lg bg-sun px-2.5 py-1 font-display text-xs font-extrabold text-ink opacity-0 shadow-md transition duration-200 group-hover:opacity-100">
              PLAY
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}