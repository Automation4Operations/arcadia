"use client";

import { useEffect, useRef, useState } from "react";
import { pushRecent } from "@/lib/recent";

type GameObj = {
  slug: string;
  title: string;
  iframeUrl: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
};

type Props = {
  slug?: string;
  title?: string;
  iframeUrl?: string;
  thumbnailUrl?: string;
  categoryName?: string;
  game?: GameObj;
};

export default function GamePlayer(props: Props) {
  // Support both direct props and game={...} object wrapper
  const slug = props.game?.slug || props.slug || "";
  const title = props.game?.title || props.title || "Arcadia Game";
  const iframeUrl = props.game?.iframeUrl || props.iframeUrl || "";
  const thumbnailUrl = props.game?.thumbnailUrl || props.thumbnailUrl || "";

  const stageRef = useRef<HTMLDivElement>(null);
  const [theater, setTheater] = useState(false);
  const [fitMode, setFitMode] = useState<"fit" | "wide" | "tall">("fit");
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Append referrer URL for GameMonetize / HTML5 ad SDKs so ads validate properly
  const finalIframeUrl = (() => {
    try {
      const u = new URL(iframeUrl);
      if (u.hostname.includes("gamemonetize") && !u.searchParams.has("gd_sdk_referrer_url")) {
        u.searchParams.set("gd_sdk_referrer_url", `https://arcadiagames.app/game/${slug}`);
      }
      return u.toString();
    } catch {
      return iframeUrl;
    }
  })();

  useEffect(() => {
    if (!slug) return;
    pushRecent({ slug, title, thumbnailUrl });
    fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug, title, thumbnailUrl]);

  const toggleFullscreen = async () => {
    const el = stageRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    } else {
      await el.requestFullscreen().catch(() => {});
    }
  };

  const shareGame = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert("Game link copied to clipboard!");
    }
  };

  const reportBroken = async () => {
    if (reported) return;
    setReported(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, reason: "Player reported broken or cut-off game" }),
    }).catch(() => {});
  };

  const stageSizeClass =
    fitMode === "tall"
      ? "mx-auto w-full max-w-[440px] h-[calc(100vh-175px)] min-h-[480px] max-h-[760px]"
      : fitMode === "wide"
      ? "w-full aspect-video max-h-[calc(100vh-175px)] min-h-[380px]"
      : "w-full h-[calc(100vh-175px)] min-h-[400px] max-h-[720px]";

  return (
    <div className={theater ? "fixed inset-0 z-50 bg-black/95 p-3 sm:p-6 flex flex-col justify-center" : "w-full"}>
      <div
        ref={stageRef}
        className={`relative overflow-hidden rounded-2xl bg-black ring-1 ring-edge shadow-2xl flex items-center justify-center ${
          theater ? "w-full h-[calc(100vh-90px)]" : stageSizeClass
        }`}
      >
        <iframe
          key={iframeKey}
          src={finalIframeUrl}
          title={title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; pointer-lock; web-share"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-panel px-4 py-2.5 ring-1 ring-edge">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              pushRecent({ slug, title, thumbnailUrl });
              setSaved(true);
            }}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-fg ring-1 ring-edge transition hover:ring-arcade cursor-pointer"
          >
            {saved ? "✓ Saved in Vault" : "⚡ Save"}
          </button>

          <button
            type="button"
            onClick={() => setTheater(!theater)}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-fg ring-1 ring-edge transition hover:ring-arcade cursor-pointer"
          >
            {theater ? "💡 Lights On" : "🌙 Lights Off"}
          </button>

          <div className="flex items-center rounded-xl bg-ink p-0.5 ring-1 ring-edge">
            <button
              type="button"
              onClick={() => setFitMode("fit")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                fitMode === "fit" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }`}
            >
              🖥️ Fit Screen
            </button>
            <button
              type="button"
              onClick={() => setFitMode("wide")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                fitMode === "wide" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }`}
            >
              16:9
            </button>
            <button
              type="button"
              onClick={() => setFitMode("tall")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition cursor-pointer ${
                fitMode === "tall" ? "bg-arcade text-white" : "text-mute hover:text-fg"
              }`}
            >
              📱 Mobile View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIframeKey((k) => k + 1)}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge cursor-pointer"
          >
            ↻ Reload
          </button>

          <button
            type="button"
            onClick={shareGame}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-mute hover:text-fg ring-1 ring-edge cursor-pointer"
          >
            🔗 Share
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reportBroken}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-mute hover:text-red-400 ring-1 ring-edge cursor-pointer"
          >
            {reported ? "✓ Reported" : "⚑ Report"}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="rounded-xl bg-arcade px-4 py-1.5 text-xs font-extrabold text-white shadow-md shadow-arcade/30 transition hover:bg-arcade-soft cursor-pointer"
          >
            ⛶ Fullscreen
          </button>
        </div>
      </div>
    </div>
  );
}