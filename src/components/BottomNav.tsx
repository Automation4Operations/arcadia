"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function fire(name: string) {
  window.dispatchEvent(new Event(name));
}

export default function BottomNav() {
  const pathname = usePathname() || "/";

  // Leave space at the bottom of every page on phones so the bar never covers content
  useEffect(() => {
    document.body.classList.add("pb-16", "md:pb-0");
    return () => document.body.classList.remove("pb-16", "md:pb-0");
  }, []);

  const tab =
    "flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-bold transition cursor-pointer";
  const active = "text-arcade";
  const idle = "text-mute hover:text-fg";

  return (
    <nav
      aria-label="Bottom navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-edge bg-ink/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <Link href="/" className={`${tab} ${pathname === "/" ? active : idle}`}>
        <span className="text-lg leading-none">🏠</span>
        Home
      </Link>
      <button type="button" onClick={() => fire("arcadia:open-menu")} className={`${tab} ${idle}`}>
        <span className="text-lg leading-none">☰</span>
        Menu
      </button>
      <button type="button" onClick={() => fire("arcadia:open-search")} className={`${tab} ${idle}`}>
        <span className="text-lg leading-none">🔍</span>
        Search
      </button>
      <button type="button" onClick={() => fire("arcadia:open-vault")} className={`${tab} ${idle}`}>
        <span className="text-lg leading-none">⚡</span>
        Vault
      </button>
      <Link href="/profile" className={`${tab} ${pathname === "/profile" ? active : idle}`}>
        <span className="text-lg leading-none">👤</span>
        Me
      </Link>
    </nav>
  );
}
