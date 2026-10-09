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
  /** Double-size tile, used for the lead game in a grid. */
  featured?: boolean;
  priority?: boolean;
};

export default function GameCard({ game, featured = false, priority = false }: GameCardProps) {
  return (
    <Link
      href={`/game/${game.slug}`}
      className={`group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-sun ${
        featured ? "col-span-2 row-span-2" : ""
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-panel ring-1 ring-edge transition group-hover:ring-arcade group-focus-visible:ring-arcade">
        <Image
          src={game.thumbnailUrl}
          alt=""
          fill
          priority={priority}
          sizes={featured ? "(min-width:1024px) 33vw, 100vw" : "(min-width:1280px) 16vw, (min-width:640px) 25vw, 50vw"}
          className="object-cover transition duration-300 ease-out group-hover:scale-[1.06]"
        />
        {/* Hover layer: dims the art and shows the play action */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="rounded-full bg-sun px-5 py-2 font-display text-sm font-bold text-ink shadow-lg">
            Play now
          </span>
        </div>
      </div>

      <div className="mt-2 px-1">
        <h3
          className={`truncate font-display font-semibold text-fg ${featured ? "text-lg" : "text-sm"}`}
          title={game.title}
        >
          {game.title}
        </h3>
        <p className="mt-0.5 flex items-center gap-2 text-xs text-mute">
          {game.ratingAvg ? (
            <span className="inline-flex items-center gap-1">
              <svg viewBox="0 0 20 20" className="h-3 w-3 fill-sun" aria-hidden>
                <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
              </svg>
              {game.ratingAvg.toFixed(1)}
            </span>
          ) : null}
          {game.playCount ? <span>{formatCount(game.playCount)} plays</span> : null}
        </p>
      </div>
    </Link>
  );
}
