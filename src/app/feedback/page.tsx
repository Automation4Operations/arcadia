import type { Metadata } from "next";
import Link from "next/link";
import GameComments from "@/components/GameComments";

export const metadata: Metadata = {
  title: "Feedback & Suggestions",
  description:
    "Tell the Arcadia Games team what you think. Suggest new games and features, report problems, or just say hi.",
  alternates: { canonical: "https://arcadiagames.app/feedback" },
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-mute">
        <Link href="/" className="hover:text-arcade">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-fg">Feedback</span>
      </nav>

      <header className="rounded-3xl bg-panel p-6 ring-1 ring-edge sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-sun/15 px-3 py-1 text-xs font-extrabold text-sun ring-1 ring-sun/30">
          💬 We read every message
        </p>
        <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
          Help us make Arcadia better
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">
          Got an idea for a new game or feature? Something not working? Tell us! Pick a type below and send your
          message. Comments and suggestions appear on this page after a quick review, and issue reports stay private
          for our team.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <p className="font-display text-sm font-bold text-arcade">💬 Comment</p>
            <p className="mt-1 text-xs text-mute">Tell us what you love (or don&apos;t) about the site.</p>
          </div>
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <p className="font-display text-sm font-bold text-sun">💡 Suggestion</p>
            <p className="mt-1 text-xs text-mute">Request a game type, category or new feature.</p>
          </div>
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <p className="font-display text-sm font-bold text-red-400">🐞 Issue</p>
            <p className="mt-1 text-xs text-mute">Report bugs or broken pages. Only our team sees these.</p>
          </div>
        </div>

        <p className="mt-5 text-xs text-mute">
          Problem with one specific game? Use the comment box on that game&apos;s page so we know which one.
        </p>
      </header>

      <GameComments slug={null} heading="Community feedback" />
    </div>
  );
}
