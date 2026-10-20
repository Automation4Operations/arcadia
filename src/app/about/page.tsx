import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us & DMCA Compliance | Arcadia Games",
  description:
    "Learn about Arcadia Games (arcadiagames.app), our authorized HTML5 and 3D WebGL game catalog, and DMCA copyright compliance.",
  alternates: { canonical: "https://arcadiagames.app/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-fg">
      <div className="rounded-3xl bg-panel p-8 ring-1 ring-edge shadow-2xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-arcade/15 px-3.5 py-1 text-xs font-extrabold text-arcade ring-1 ring-arcade/30">
          ⚡ Official Portal Information
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-fg">
          About Arcadia Games
        </h1>

        <p className="text-sm text-mute leading-relaxed">
          Welcome to <strong className="text-fg">Arcadia Games (arcadiagames.app)</strong> — a next-generation HTML5 and
          3D WebGL browser gaming platform. We curate instant-play action, battle royale, precision driving, physics
          puzzles, and multiplayer board games that run smoothly across desktop and mobile devices with zero downloads
          required.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <h3 className="font-display text-sm font-bold text-sun">🚀 Instant Play</h3>
            <p className="mt-1 text-xs text-mute">
              Zero installations. Launch 3D WebGL & HTML5 games directly in your browser.
            </p>
          </div>
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <h3 className="font-display text-sm font-bold text-arcade">🛡️ Verified Feeds</h3>
            <p className="mt-1 text-xs text-mute">
              Games are provided through the official GameMonetize publisher network.
            </p>
          </div>
          <div className="rounded-2xl bg-ink p-4 ring-1 ring-edge">
            <h3 className="font-display text-sm font-bold text-emerald-400">📱 Cross-Device</h3>
            <p className="mt-1 text-xs text-mute">
              Optimized for desktop keyboard/mouse and mobile touch controls.
            </p>
          </div>
        </div>

        <hr className="border-edge" />

        <div className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-fg">
            📜 Intellectual Property & DMCA Takedown Notice
          </h2>
          <p className="text-sm text-mute leading-relaxed">
            All games published on Arcadia Games are embedded via an authorized distribution feed (GameMonetize.com) and
            remain the copyrighted property of their respective creators and studios.
          </p>
          <p className="text-sm text-mute leading-relaxed">
            Arcadia Games respects the intellectual property rights of others and complies with the Digital Millennium
            Copyright Act (DMCA). If you are a copyright owner or authorized agent and believe any content on our
            platform infringes upon your copyrights, please send a notice containing the game URL and proof of ownership
            to our official compliance desk:
          </p>
          <div className="inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 ring-1 ring-arcade/50">
            <span className="text-lg">📧</span>
            <a href="mailto:contact@arcadiagames.app" className="font-mono text-sm font-bold text-sun hover:underline">
              contact@arcadiagames.app
            </a>
          </div>
          <p className="text-xs text-mute">Valid removal requests are processed and removed within 24–48 hours.</p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-arcade px-5 py-2.5 text-xs font-extrabold text-ink transition hover:brightness-110"
          >
            ← Back to Games
          </Link>
        </div>
      </div>
    </main>
  );
}
