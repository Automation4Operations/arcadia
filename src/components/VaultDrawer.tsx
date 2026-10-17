"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { clearRecent, readRecent, type RecentGame } from "@/lib/recent";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function VaultDrawer({ open, onClose }: Props) {
  const [recent, setRecent] = useState<RecentGame[]>([]);

  useEffect(() => {
    if (!open) return;
    setRecent(readRecent());
    const onUpdate = () => setRecent(readRecent());
    window.addEventListener("arcadia:recent-updated", onUpdate);
    return () => window.removeEventListener("arcadia:recent-updated", onUpdate);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div
        className="relative flex h-full w-full max-w-md flex-col border-l border-edge bg-panel p-6 text-fg shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="My Vault"
      >
        <div className="flex items-center justify-between border-b border-edge pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>⚡</span>
            <h2 className="font-display text-lg font-extrabold text-fg">My Vault — Recently Played</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge"
          >
            ✕ Close
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {recent.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-edge p-6 text-center">
              <p className="font-display text-sm font-bold text-fg">Your Vault is Empty</p>
              <p className="mt-1 text-xs text-mute">
                Games you play are saved directly on your device for instant access.
              </p>
            </div>
          ) : (
            recent.map((g) => (
              <Link
                key={g.slug}
                href={"/game/" + g.slug}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-xl bg-ink p-2.5 ring-1 ring-edge transition hover:ring-arcade"
              >
                <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-panel">
                  <Image
                    src={g.thumbnailUrl}
                    alt={g.title}
                    fill
                    sizes="96px"
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-sm font-bold text-fg group-hover:text-sun">
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-arcade-soft font-semibold">Continue Playing →</p>
                </div>
              </Link>
            ))
          )}
        </div>

        {recent.length > 0 && (
          <div className="mt-4 border-t border-edge pt-4 flex justify-between items-center">
            <span className="text-xs text-mute">{recent.length} saved on device</span>
            <button
              type="button"
              onClick={() => {
                clearRecent();
                setRecent([]);
              }}
              className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-mute hover:text-red-400 ring-1 ring-edge"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
