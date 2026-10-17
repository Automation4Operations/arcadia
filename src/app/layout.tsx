import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getAllCategories } from "@/lib/queries";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

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
    "Play 1,500+ free online games instantly at ArcadiaGames.app! Battle Royale, Dr. Driving, Screw & Rope Physics, Online Chess, Ludo, Snake, and 3D WebGL games with no downloads.",
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
    description: "Instant browser gaming portal with 1,500+ HTML5 and 3D WebGL games. No downloads required.",
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
        <Navbar categories={categories} />
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