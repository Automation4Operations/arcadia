import type { Metadata } from "next";
import { getTrending } from "@/lib/queries";
import ReviewsClient from "./ReviewsClient";
import AdBanner from "@/components/AdBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Player Reviews & Ratings — Arcadia Games",
  description:
    "Read genuine gamer reviews and see player ratings for top HTML5 and 3D browser games. Rate what you played and share your feedback.",
  alternates: {
    canonical: "https://arcadiagames.app/reviews",
  },
};

export default async function ReviewsPage() {
  const topGames = await getTrending(20);

  return (
    <main className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6">
      <div className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          ⭐ Player Reviews &amp; Ratings
        </h1>
        <p className="mt-2 text-sm text-mute">
          See what players are saying about the latest games, browse reviews on games you have played, or discover new favorites.
        </p>
      </div>

      <ReviewsClient topGames={topGames} />

      <AdBanner format="auto" className="my-8" />
    </main>
  );
}
