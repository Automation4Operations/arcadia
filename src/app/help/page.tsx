import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export const metadata: Metadata = {
  title: "Help & FAQ — Arcadia Games",
  description:
    "Got questions or issues playing on Arcadia Games? Check our controls guide, troubleshooting steps, and answers to common questions.",
  alternates: {
    canonical: "https://arcadiagames.app/help",
  },
};

const FAQS = [
  {
    q: "Do I need to download or install anything to play?",
    a: "No! All games on Arcadia Games run directly in your web browser (HTML5 & WebGL). There are zero installs, zero plugins, and zero downloads required.",
  },
  {
    q: "Are the games on Arcadia completely free?",
    a: "Yes, 100% of the games are free to play with no hidden paywalls or subscription fees.",
  },
  {
    q: "How does Cloud Save work?",
    a: "When you sign up or log in, your game progress, XP, and player levels are automatically saved to your cloud profile so you can continue playing seamlessly across your phone, tablet, and PC.",
  },
  {
    q: "Why won't a game load?",
    a: "Most loading issues are caused by aggressive ad blockers or outdated browser caches. Try: 1) Disabling strict tracker blocking for arcadiagames.app, 2) Hard-refreshing the page (Ctrl + Shift + R or Cmd + Shift + R), or 3) Trying Chrome, Edge, or Safari.",
  },
  {
    q: "Can I play these games at school or work (unblocked)?",
    a: "Yes! Check our Unblocked Hits collection (/collection/unblocked-hits) for lightweight, high-performance browser games that work smoothly across most school and office networks.",
  },
  {
    q: "How do I report a bug, broken game, or copyright issue?",
    a: "You can click the 'Report' button on any game page, use our Feedback form (/feedback), or email us directly at contact@arcadiagames.app.",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          ❓ Help &amp; Support Center
        </h1>
        <p className="mt-2 text-sm text-mute">
          Everything you need to know about playing on Arcadia Games, fixing common issues, and saving your progress.
        </p>
      </div>

      {/* Controls Guide */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-fg">🎮 Game Controls Guide</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-panel/70 p-5 ring-1 ring-edge">
            <h3 className="font-display text-base font-bold text-arcade">🖥️ Desktop &amp; Laptop</h3>
            <ul className="mt-3 space-y-2 text-xs text-fg/80">
              <li><strong className="text-fg">W A S D / Arrow Keys:</strong> Move character or vehicle</li>
              <li><strong className="text-fg">Spacebar:</strong> Jump, brake, or shoot</li>
              <li><strong className="text-fg">Mouse Click / Aim:</strong> Fire weapon, interact, or aim</li>
              <li><strong className="text-fg">Esc / P:</strong> Pause game menu</li>
              <li><strong className="text-fg">F:</strong> Toggle full-screen mode</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-panel/70 p-5 ring-1 ring-edge">
            <h3 className="font-display text-base font-bold text-sun">📱 Phone &amp; Tablet</h3>
            <ul className="mt-3 space-y-2 text-xs text-fg/80">
              <li><strong className="text-fg">Tap &amp; Drag:</strong> Steer, aim, or drag pieces</li>
              <li><strong className="text-fg">Virtual Joystick:</strong> On-screen thumbstick for movement</li>
              <li><strong className="text-fg">Landscape Mode:</strong> Rotate phone sideways for optimal screen size</li>
              <li><strong className="text-fg">Touch to Shoot:</strong> Tap buttons on screen to jump or attack</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-fg">🛠️ Quick Troubleshooting</h2>
        <div className="space-y-3">
          <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
            <h4 className="text-sm font-bold text-fg">Game is stuck on loading screen</h4>
            <p className="mt-1 text-xs text-mute leading-relaxed">
              Ensure hardware acceleration is enabled in your browser settings (Chrome: Settings &gt; System &gt; Use graphics acceleration). If using an ad blocker, try whitelisting arcadiagames.app.
            </p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
            <h4 className="text-sm font-bold text-fg">Lag or low FPS</h4>
            <p className="mt-1 text-xs text-mute leading-relaxed">
              Close background browser tabs and apps consuming CPU/RAM. 3D games require WebGL support from your graphics card.
            </p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
            <h4 className="text-sm font-bold text-fg">Lost my game progress</h4>
            <p className="mt-1 text-xs text-mute leading-relaxed">
              Make sure you are signed into your cloud account at <Link href="/signup" className="text-arcade underline">Sign Up / Cloud Save</Link>. Guest progress is stored in local browser cache and can be cleared if cookies are wiped.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-fg">💡 Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-panel/70 p-4 ring-1 ring-edge open:ring-arcade/50 transition"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-bold text-fg">
                <span>{faq.q}</span>
                <span className="text-arcade transition-transform group-open:rotate-180">▾</span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-fg/80">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-arcade/20 to-sun/15 p-6 ring-1 ring-edge flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-fg">Still need help?</h3>
          <p className="text-xs text-mute">We are here to help you get back to gaming.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/feedback"
            className="rounded-xl bg-panel px-4 py-2 text-xs font-bold text-fg ring-1 ring-edge hover:ring-arcade transition"
          >
            💬 Send Feedback
          </Link>
          <a
            href="mailto:contact@arcadiagames.app"
            className="rounded-xl bg-arcade px-4 py-2 text-xs font-bold text-ink hover:brightness-110 transition"
          >
            ✉️ Email Support
          </a>
        </div>
      </div>

      <AdBanner format="auto" className="my-6" />
    </main>
  );
}
