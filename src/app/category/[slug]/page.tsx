import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryChips from "@/components/CategoryChips";
import GameGrid from "@/components/GameGrid";
import AdBanner from "@/components/AdBanner";
import { getAllCategories, searchGames } from "@/lib/queries";
import { CATEGORY_CONTENT } from "@/lib/categoryContent";

export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return [
    "shooting", "driving", "action", "stickman", "io", "puzzle",
    "arcade", "adventure", "simulation", "sports", "board", "clicker",
  ].map((slug) => ({ slug }));
}
type Params = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  return { categories, category };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await load(slug);
  if (!category) return {};
  const content = CATEGORY_CONTENT[slug];
  const title = `${category.name} Games - Play Free Online ${category.name} Games`;
  const description =
    content?.metaDescription ??
    `Play the best free ${category.name.toLowerCase()} games online at Arcadia Games. No downloads, no sign-up. Instant play on PC, mobile and tablet.`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: { title, description, url: `/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const { categories, category } = await load(slug);
  if (!category) notFound();

  const content = CATEGORY_CONTENT[slug];
  const games = await searchGames({ category: slug, take: 250 });
  const faqs = [
    {
      q: `Are all ${category.name.toLowerCase()} games on Arcadia Games free to play?`,
      a: `Yes, all ${games.length} ${category.name.toLowerCase()} games in this category are 100% free to play in your browser with no download or paid subscription required.`,
    },
    {
      q: `Can I play ${category.name.toLowerCase()} games on mobile or Chromebook?`,
      a: `Yes! Our HTML5 and WebGL ${category.name.toLowerCase()} games run directly in Chrome, Safari, and Edge on desktop, Chromebook, Android, and iPhone.`,
    },
    {
      q: `Do I need an account to save my progress?`,
      a: `No account is needed to start playing immediately. If you want Cloud Save for your XP and level across devices, you can sign in for free anytime.`,
    },
    {
      q: `What are the most popular ${category.name.toLowerCase()} games right now?`,
      a: games.slice(0, 3).length
        ? `Top picks include ${games.slice(0, 3).map((g) => g.title).join(", ")}.`
        : `Explore the full grid above to launch our top-rated ${category.name.toLowerCase()} titles.`,
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6">
      <CategoryChips categories={categories} active={slug} />
      <header className="fade-up mt-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          Play Free {category.name} Games Online
        </h1>
        <p className="mt-2 max-w-3xl text-mute">
          {content
            ? content.intro
            : `Play free ${category.name.toLowerCase()} games online at Arcadia Games.`}{" "}
          Choose from {games.length} free games with no downloads and no sign-up.
        </p>
      </header>
      <AdBanner format="auto" className="my-6" />
      <GameGrid title={`All ${category.name} Games`} games={games} leadFeatured={false} />
      {content && (
        <section className="mt-12 max-w-3xl rounded-2xl bg-panel p-6 ring-1 ring-edge">
          <h2 className="font-display text-xl font-extrabold text-fg">
            About {category.name} Games
          </h2>
          {content.about.map((text, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed text-mute">
              {text}
            </p>
          ))}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-edge pt-4 text-xs">
            <Link href="/games" className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-arcade ring-1 ring-edge hover:ring-arcade">All Online Games</Link>
            <Link href="/guides" className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-mute ring-1 ring-edge hover:text-fg">Gaming Guides</Link>
            <Link href="/collection/trending-now" className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-mute ring-1 ring-edge hover:text-fg">Trending Now</Link>
            <Link href="/collection/2-player" className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-mute ring-1 ring-edge hover:text-fg">2 Player Games</Link>
            <Link href="/collection/3d" className="rounded-lg bg-ink px-3 py-1.5 font-semibold text-mute ring-1 ring-edge hover:text-fg">3D WebGL Games</Link>
          </div>
        </section>
      )}
      <section className="mt-8 max-w-3xl rounded-2xl bg-panel p-6 ring-1 ring-edge">
        <h2 className="font-display text-xl font-extrabold text-fg mb-4">
          {category.name} Games FAQ
        </h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="rounded-xl bg-ink/70 p-4 ring-1 ring-edge">
              <summary className="cursor-pointer text-sm font-bold text-fg">{f.q}</summary>
              <p className="mt-2 text-xs leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
