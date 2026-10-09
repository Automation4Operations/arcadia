import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Arcadia - Free online games", template: "%s | Arcadia" },
  description: "Play free browser games instantly. No downloads, no installs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ink font-body text-fg antialiased">
        <header className="sticky top-0 z-40 border-b border-edge bg-ink/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3">
            <Link href="/" className="font-display text-2xl font-extrabold text-fg">
              arcadia
            </Link>
            <form action="/search" role="search" className="mx-auto w-full max-w-xl">
              <input
                name="q"
                type="search"
                placeholder="Search games"
                aria-label="Search games"
                className="w-full rounded-full border border-edge bg-panel px-5 py-2 text-sm text-fg placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
              />
            </form>
            {/* Next step: category icon rail + profile drawer */}
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
