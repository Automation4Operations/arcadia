import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getAllCategories } from "@/lib/queries";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://arcadiagames.app"),
  title: {
    default: "Arcadia Games (ArcadiaGames.app) — Play Free Online HTML5 & 3D Games",
    template: "%s | Arcadia Games",
  },
  description:
    "Play 1,500+ free online games instantly at ArcadiaGames.app! Action, Fighting, Live Multiplayer, Driving, 3D WebGL, Shooting, and Adventure games with no downloads.",
  keywords: [
    "arcadiagames",
    "arcadia games",
    "arcadiagames.app",
    "free online games",
    "browser games",
    "unblocked games",
    "multiplayer games",
    "fighting games online",
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
          <div className="mx-auto max-w-[1600px] px-4">
            <p className="font-display font-bold text-fg">ARCADIA GAMES (ARCADIAGAMES.APP)</p>
            <p className="mt-1">
              Play free HTML5 & 3D browser games online. All games are property of their respective creators.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
