import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import { getAllCategories } from "@/lib/queries";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: { default: "Arcadia — Instant Web Game Portal", template: "%s | Arcadia" },
  description: "Play curated HTML5 and WebGL games directly in your browser. Zero installs.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories().catch(() => []);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ink font-body text-fg antialiased flex flex-col">
        <Navbar categories={categories} />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-edge bg-panel/50 py-8 text-center text-xs text-mute">
          <div className="mx-auto max-w-[1600px] px-4">
            <p className="font-display font-bold text-fg">ARCADIA PORTAL</p>
            <p className="mt-1">
              All games are property of their respective creators and embedded via authorized distribution.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}