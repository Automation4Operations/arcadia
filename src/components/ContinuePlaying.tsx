"use client";

import { useEffect, useState } from "react";
import GameCard from "./GameCard";
import { readRecent, type RecentGame } from "@/lib/recent";

/** Reads localStorage after mount, so the server HTML stays identical (no hydration mismatch). */
export default function ContinuePlaying() {
  const [recent, setRecent] = useState<RecentGame[]>([]);

  useEffect(() => setRecent(readRecent()), []);

  if (recent.length === 0) return null;

  return (
    <section aria-labelledby="continue-playing" className="mt-8">
      <h2 id="continue-playing" className="mb-4 font-display text-2xl font-bold text-fg">
        Continue playing
      </h2>
      <ul className="flex snap-x gap-4 overflow-x-auto no-scrollbar pb-2">
        {recent.map((g) => (
          <li key={g.slug} className="w-40 shrink-0 snap-start sm:w-48">
            <GameCard game={g} />
          </li>
        ))}
      </ul>
    </section>
  );
}
