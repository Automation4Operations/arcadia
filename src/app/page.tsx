import Link from "next/link";
import CategoryChips from "@/components/CategoryChips";
import ContinuePlaying from "@/components/ContinuePlaying";
import GameGrid from "@/components/GameGrid";
import HeroSpotlight from "@/components/HeroSpotlight";
import { getFeaturedGames, getFreshGames, getHomePageSections, getCategories } from "@/lib/db";

export const revalidate = 60;

export default async function HomePage() {
  const [slides, trending, fresh, sections, categories] = await Promise.all([
    getFeaturedGames(5),
    getFeaturedGames(12),
    getFreshGames(12),
    getHomePageSections(4),
    getCategories(),
  ]);

  const moodPills = [
    { label: "⚡ 5-Minute Fun", href: "/category/arcade" },
    { label: "🔥 Adrenaline Rush", href: "/category/action" },
    { label: "🧠 Train Your Brain", href: "/category/puzzle" },
    { label: "🏆 Deep Progress", href: "/category/strategy" },
    { label: "👥 Multiplayer & .io", href: "/category/io" },
    { label: "🎮 Controller Ready", href: "/category/driving" },
  ];

  return (
    <div className="space-y-12 pb-16">
      <div className="space-y-4">
        <div className="fade-up">
          <CategoryChips categories={categories} />
        </div>

        {/* Quick Mood & Discovery Pills */}
        <div className="fade-up flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {moodPills.map((pill) => (
            <Link
              key={pill.label}
              href={pill.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-violet-500 hover:bg-violet-600/20 hover:text-white hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] whitespace-nowrap"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero with motion layer */}
      <div className="hero-fx relative">
        <HeroSpotlight games={slides} />
        <div className="hero-fx-layer" aria-hidden>
          <span className="orb orb-a" />
          <span className="orb orb-b" />
          <span className="orb orb-c" />
          <span className="beam" />
          <span className="sparkles" />
        </div>
      </div>

      <ContinuePlaying />

      <div className="reveal">
        <GameGrid
          title="Trending in Lobby"
          icon="🔥"
          games={trending}
          href="/search"
          priorityFirst
          badge="hot"
        />
      </div>

      <div className="reveal">
        <GameGrid
          title="Fresh Releases"
          icon="✨"
          games={fresh}
          href="/search"
          leadFeatured={false}
          badge="new"
        />
      </div>

      {sections.map(({ category, games }) => (
        <div key={category.id} className="reveal">
          <GameGrid
            title={category.name}
            icon={category.icon}
            games={games}
            href={`/category/${category.slug}`}
          />
        </div>
      ))}

      {/* Poki/CrazyGames-style SEO & Category Discovery Hub */}
      <section className="reveal mt-16 rounded-3xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl">
        <div className="max-w-5xl space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Play Free Online Games on Arcadia Games
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Welcome to <strong className="text-violet-400">Arcadia Games</strong>, your ultimate destination for instant-play browser games! Enjoy high-quality, unblocked 3D HTML5 games with zero downloads or installs needed. Whether you are on mobile, desktop, or tablet, jump into action-packed multiplayer arenas, mind-bending puzzles, and thrilling racing games directly in your browser.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-100">
              Top Trending HTML5 & 3D Browser Games
            </h3>
            <p className="text-sm leading-relaxed text-slate-300">
              Arcadia brings you the latest hits modeled after top platforms like Poki and CrazyGames. Save your game progress seamlessly in your browser with instant cloud sync, climb the global leaderboards, and discover curated gaming collections categorized by speed, difficulty, and control preferences.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-100">
              Explore Popular Game Categories
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Driving", slug: "driving", icon: "🏎️" },
                { name: "Shooting", slug: "shooting", icon: "🎯" },
                { name: "Multiplayer & .io", slug: "io", icon: "👥" },
                { name: "Stickman", slug: "stickman", icon: "🏃" },
                { name: "Puzzle", slug: "puzzle", icon: "🧩" },
                { name: "Arcade", slug: "arcade", icon: "🕹️" },
                { name: "Adventure", slug: "adventure", icon: "🗺️" },
                { name: "Simulation", slug: "simulation", icon: "🎮" },
                { name: "Sports", slug: "sports", icon: "⚽" },
                { name: "Strategy", slug: "strategy", icon: "♟️" },
                { name: "Clicker", slug: "clicker", icon: "👆" },
                { name: "Action", slug: "action", icon: "💥" },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-violet-500/50 hover:bg-slate-800/80 hover:text-white"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
