import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GameCard from "@/components/GameCard";
import { COLLECTIONS, getCollection, getCollectionGames } from "@/lib/collections";

export const revalidate = 3600;

const SITE = "https://arcadiagames.app";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) return { title: "Collection not found", robots: { index: false } };

  const games = await getCollectionGames(col.slug);
  const url = `${SITE}/collection/${col.slug}`;
  const title = `Free ${col.seoName} Online – ${games.length} Games, No Download`;
  const description = `Play ${games.length} free ${col.seoName.toLowerCase()} instantly on Arcadia Games. ${col.intro.split(". ")[0]}.`;

  return {
    title,
    description: description.length > 160 ? description.slice(0, 157) + "…" : description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "Arcadia Games",
      title,
      description,
      images: games[0] ? [{ url: games[0].thumbnailUrl, alt: col.seoName }] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const col = getCollection(slug);
  if (!col) notFound();

  const games = await getCollectionGames(col.slug);
  const url = `${SITE}/collection/${col.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `Free ${col.seoName} Online`,
        url,
        description: col.intro,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: games.length,
          itemListElement: games.slice(0, 30).map((g, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE}/game/${g.slug}`,
            name: g.title,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: col.seoName, item: url },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-mute">
        <Link href="/" className="hover:text-arcade">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-fg">{col.seoName}</span>
      </nav>

      <header className="rounded-3xl bg-panel/80 p-6 ring-1 ring-edge sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl" aria-hidden>{col.icon}</span>
          <h1 className="font-display text-3xl font-black tracking-tight text-fg sm:text-4xl">
            {col.seoName}
          </h1>
          <span className="rounded-full bg-sun/15 px-3 py-1 text-xs font-extrabold text-sun ring-1 ring-sun/30">
            {games.length} free games
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute">{col.intro}</p>
      </header>

      {games.length === 0 ? (
        <p className="mt-10 text-center text-sm text-mute">No games in this collection yet. Check back soon!</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      )}

      <section className="mt-12">
        <h2 className="mb-3 font-display text-lg font-bold text-fg">More collections</h2>
        <div className="flex flex-wrap gap-2">
          {COLLECTIONS.filter((c) => c.slug !== col.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/collection/${c.slug}`}
              className="rounded-full bg-panel px-4 py-2 text-sm font-bold text-fg ring-1 ring-edge transition hover:ring-arcade"
            >
              {c.icon} {c.seoName}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
