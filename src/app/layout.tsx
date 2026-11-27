import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import FxLayer from "@/components/FxLayer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { getNavCategories } from "@/lib/queries";
import "./globals.css";

const display = Outfit({ subsets: ["latin"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
    apple: ["/favicon.ico"],
  },
  metadataBase: new URL("https://arcadiagames.app"),
  title: {
    default: "Arcadia Games (ArcadiaGames.app) — Play Free Online HTML5 & 3D Games",
    template: "%s | Arcadia Games",
  },
  description:
    "Play free online games instantly at ArcadiaGames.app! Shooting, driving, .io multiplayer, brain puzzles, online chess, and 3D WebGL games with no downloads.",
  alternates: {
    canonical: "https://arcadiagames.app",
  },
  openGraph: {
    title: "Arcadia Games — Play Free Online Browser Games",
    description: "Instant browser gaming portal with 1,500+ HTML5 and 3D WebGL games. No downloads required.",
    url: "https://arcadiagames.app",
    siteName: "Arcadia Games",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getNavCategories().catch(() => []);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9212888811032637";

  return (
    <html lang="en" className={display.variable + " " + body.variable + " " + mono.variable}>
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-ink font-body text-fg antialiased flex flex-col">
        <AuthProvider>
          <FxLayer />
          <Navbar categories={categories} />
          <AuthModal />
          <main className="flex-1">{children}</main>
        </AuthProvider>
        <footer className="mt-20 border-t border-edge bg-panel/50 py-10 text-xs text-mute">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 space-y-6">
            {/* Nav links */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <p className="font-display font-extrabold text-fg uppercase tracking-widest text-[11px]">Explore</p>
                <ul className="space-y-1.5">
                  <li><a href="/" className="hover:text-fg transition">🏠 Home</a></li>
                  <li><a href="/games" className="hover:text-fg transition">🎮 All Games</a></li>
                  <li><a href="/scores" className="hover:text-fg transition">🏆 Scores</a></li>
                  <li><a href="/reviews" className="hover:text-fg transition">⭐ Reviews</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-display font-extrabold text-fg uppercase tracking-widest text-[11px]">Collections</p>
                <ul className="space-y-1.5">
                  <li><a href="/collection/trending-now" className="hover:text-fg transition">🔥 Trending Now</a></li>
                  <li><a href="/collection/3d" className="hover:text-fg transition">🧊 3D Games</a></li>
                  <li><a href="/collection/multiplayer" className="hover:text-fg transition">🌍 Multiplayer</a></li>
                  <li><a href="/collection/zombie" className="hover:text-fg transition">🧟 Zombie</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-display font-extrabold text-fg uppercase tracking-widest text-[11px]">Categories</p>
                <ul className="space-y-1.5">
                  <li><a href="/category/shooting" className="hover:text-fg transition">🔫 Shooting</a></li>
                  <li><a href="/category/driving" className="hover:text-fg transition">🚗 Driving</a></li>
                  <li><a href="/category/io" className="hover:text-fg transition">⚡ .io Games</a></li>
                  <li><a href="/category/puzzle" className="hover:text-fg transition">🧩 Puzzle</a></li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-display font-extrabold text-fg uppercase tracking-widest text-[11px]">Info</p>
                <ul className="space-y-1.5">
                  <li><a href="/about" className="hover:text-fg transition">🛡️ About &amp; DMCA</a></li>
                  <li><a href="/help" className="hover:text-fg transition">❓ Help</a></li>
                  <li><a href="/signup" className="hover:text-fg transition">☁️ Cloud Save</a></li>
                  <li><a href="/feedback" className="hover:text-fg transition">💬 Feedback</a></li>
                </ul>
              </div>
            </div>
            {/* Legal */}
            <div className="border-t border-edge pt-4 text-center space-y-1.5">
              <p className="font-display font-bold text-fg">ARCADIA GAMES (ARCADIAGAMES.APP)</p>
              <p>
                Play free HTML5 &amp; 3D browser games online. All games and trademarks are property of their respective creators and distributed via authorized publisher feeds.
              </p>
              <p className="text-fg/80">
                DMCA / Copyright Takedown &amp; Business Inquiries:{" "}
                <a
                  href="mailto:contact@arcadiagames.app"
                  className="font-semibold text-arcade-soft hover:underline"
                >
                  contact@arcadiagames.app
                </a>{" "}
                (or use the in-game <strong>Report</strong> button for instant review).
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
