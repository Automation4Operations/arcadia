import type { Metadata } from "next";
import { getTrending } from "@/lib/queries";
import ScoresClient from "./ScoresClient";
import AdBanner from "@/components/AdBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Arcade Scores & Leaderboard — Arcadia Games",
  description:
    "Track your personal gamer level, XP, and discover top-ranked games on Arcadia Games. No downloads required.",
  alternates: {
    canonical: "https://arcadiagames.app/scores",
  },
};

export default async function ScoresPage() {
  const trendingGames = await getTrending(25);

  return (
    <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          🏆 Scores &amp; Leaderboards
        </h1>
        <p className="mt-2 text-sm text-mute">
          See your player XP ranking and explore the most played and highest-rated titles in the community.
        </p>
      </div>

      <ScoresClient trendingGames={trendingGames} />

      <AdBanner format="auto" className="my-8" />
    </main>
  );
}
