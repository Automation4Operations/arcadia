import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuideBySlug } from "@/lib/guidesData";

export const revalidate = 3600;

const SITE = "https://arcadiagames.app";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false } };

  const url = `${SITE}/guides/${guide.slug}`;
  return {
    title: { absolute: guide.seoTitle },
    description: guide.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Arcadia Games",
      title: guide.seoTitle,
      description: guide.metaDescription,
    },
  };
}

export default async function GuideDetailPage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const url = `${SITE}/guides/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.h1,
        description: guide.metaDescription,
        dateModified: guide.updatedAt,
        datePublished: guide.updatedAt,
        mainEntityOfPage: url,
        publisher: {
          "@type": "Organization",
          name: "Arcadia Games",
          url: SITE,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/guides` },
          { "@type": "ListItem", position: 3, name: guide.h1, item: url },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-mute">
        <Link href="/" className="hover:text-arcade">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <Link href="/guides" className="hover:text-arcade">Guides</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-fg">{guide.title}</span>
      </nav>

      <header className="rounded-3xl bg-panel/70 p-6 ring-1 ring-edge sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-arcade">
          Arcadia Games Guide · Updated {guide.updatedAt}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black text-fg sm:text-4xl">
          {guide.h1}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">{guide.intro}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={guide.categoryHref}
            className="rounded-xl bg-arcade px-4 py-2 text-xs font-extrabold text-ink transition hover:brightness-110"
          >
            {guide.categoryLabel} →
          </Link>
          <Link
            href="/games"
            className="rounded-xl bg-ink px-4 py-2 text-xs font-bold text-fg ring-1 ring-edge hover:ring-arcade"
          >
            All Browser Games
          </Link>
        </div>
      </header>

      {/* Comparison Table */}
      <section className="overflow-x-auto rounded-2xl bg-panel p-5 ring-1 ring-edge">
        <h2 className="font-display text-lg font-extrabold text-fg mb-3">
          Quick Comparison
        </h2>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-edge text-mute">
              <th className="py-2 pr-4 font-bold">Game</th>
              <th className="py-2 pr-4 font-bold">Genre</th>
              <th className="py-2 font-bold">Best For</th>
            </tr>
          </thead>
          <tbody>
            {guide.picks.map((pick) => (
              <tr key={pick.slug} className="border-b border-edge/50 last:border-0">
                <td className="py-2.5 pr-4 font-bold text-arcade">
                  <Link href={`/game/${pick.slug}`} className="hover:underline">
                    {pick.title}
                  </Link>
                </td>
                <td className="py-2.5 pr-4 text-mute">{pick.category}</td>
                <td className="py-2.5 text-fg/90">{pick.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Detailed Picks */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-black text-fg">Top Tested Picks</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {guide.picks.map((pick, idx) => (
            <article key={pick.slug} className="rounded-2xl bg-panel p-5 ring-1 ring-edge flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sun">
                  Pick #{idx + 1} · {pick.category}
                </span>
                <h3 className="mt-1 font-display text-lg font-extrabold text-fg">
                  {pick.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-mute">{pick.summary}</p>
              </div>
              <Link
                href={`/game/${pick.slug}`}
                className="mt-4 inline-flex w-fit items-center rounded-xl bg-arcade px-4 py-2 text-xs font-extrabold text-ink transition hover:brightness-110"
              >
                ▶ Play {pick.title}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="rounded-2xl bg-panel/60 p-6 ring-1 ring-edge">
        <h2 className="font-display text-xl font-extrabold text-fg mb-3">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-mute">
          {guide.tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-arcade">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Other Guides */}
      <section className="border-t border-edge pt-6">
        <h2 className="font-display text-lg font-extrabold text-fg mb-3">More Guides</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          {GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="rounded-xl bg-panel px-3.5 py-2 font-semibold text-mute ring-1 ring-edge hover:text-arcade hover:ring-arcade"
            >
              {g.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
