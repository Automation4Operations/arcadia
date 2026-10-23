import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar"; import BottomNav from "@/components/BottomNav";
import { getAllCategories } from "@/lib/queries";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  icons: {
    icon: [
            { url: "/favicon.ico", sizes: "48x48" }, { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.ico"],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
    metadataBase: new URL("https://arcadiagames.app"), manifest: "/site.webmanifest",
  title: {
    default: "Arcadia Games (ArcadiaGames.app) — Play Free Online HTML5 & 3D Games",
    template: "%s | Arcadia Games",
  },
  description:
        "Play free online games instantly on Arcadia Games – shooters, racing, .io battles, puzzles, stickman fights and 2-player games. No download, no sign-up, on phone or PC.",
  keywords: [
    "arcadiagames",
    "arcadia games",
    "arcadiagames.app",
    "free online games",
    "browser games",
    "unblocked games",
    "multiplayer games",
    "3d webgl games",
  ],
  alternates: {
    canonical: "https://arcadiagames.app",
  },
  openGraph: {
    title: "Arcadia Games — Play Free Online Browser Games",
        description: "Hundreds of free HTML5 and 3D browser games. Instant play on phone or PC, no downloads required.",
    url: "https://arcadiagames.app",
    siteName: "Arcadia Games",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories().catch(() => []);

  return (
    <html lang="en" className={display.variable + " " + body.variable}>
      <body className="min-h-screen bg-ink font-body text-fg antialiased flex flex-col">
        {/* Animated background: sits behind everything */}
        <div className="aurora" aria-hidden>
          <div className="aurora-blob" />
          <div className="aurora-grid" />
        </div>

                <Navbar categories={categories} /><BottomNav />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-edge bg-panel/50 py-8 text-center text-xs text-mute">
          <div className="mx-auto max-w-[1600px] px-4 space-y-1.5">
            <p className="font-display font-bold text-fg">ARCADIA GAMES (ARCADIAGAMES.APP)</p>
            <p>
              Play free HTML5 & 3D browser games online. All games and trademarks are property of their respective creators and distributed via authorized publisher feeds.
            </p>
            <p className="text-fg/80">
              DMCA / Copyright Takedown & Business Inquiries:{" "}
              <a
                href="mailto:contact@arcadiagames.app"
                className="font-semibold text-arcade-soft hover:underline"
              >
                contact@arcadiagames.app
              </a>{" "}
              (or use the in-game <strong>Report</strong> button for instant review).
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
