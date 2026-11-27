import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guidesData";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Browser Gaming Guides & Curated Lists (2026) | Arcadia Games",
  description:
    "Explore tested browser game guides on Arcadia Games: best .io games, sort & brain puzzles, 3D WebGL hits, and games that work smoothly on Chromebook.",
  alternates: { canonical: "https://arcadiagames.app/guides" },
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-xs text-mute">
        <Link href="/" className="hover:text-arcade">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-fg">Guides</span>
      </nav>

      <header className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          Browser Gaming Guides &amp; Curated Picks
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-mute leading-relaxed">
          Hand-picked lists of free online HTML5 and 3D WebGL games tested on PC, Chromebook, and mobile — zero downloads, instant play.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group flex flex-col justify-between rounded-3xl bg-panel p-6 ring-1 ring-edge transition hover:-translate-y-1 hover:ring-arcade/70"
          >
            <div>
              <span className="inline-block rounded-full bg-arcade/15 px-3 py-1 text-[11px] font-bold text-arcade">
                Updated {guide.updatedAt}
              </span>
              <h2 className="mt-3 font-display text-xl font-extrabold text-fg group-hover:text-arcade">
                {guide.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-mute">
                {guide.intro}
              </p>
            </div>
            <span className="mt-4 inline-flex items-center text-xs font-bold text-arcade">
              Read guide ({guide.picks.length} tested picks) →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
