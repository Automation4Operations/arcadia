"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pushRecent } from "@/lib/recent";

type Props = {
  game: {
    slug: string;
    title: string;
    thumbnailUrl: string;
    iframeUrl: string;
    width: number;
    height: number;
  };
};

const REASONS = [
  { value: "BROKEN", label: "Game doesn't load or is broken" },
  { value: "INAPPROPRIATE", label: "Inappropriate content" },
  { value: "COPYRIGHT", label: "Copyright issue" },
  { value: "OTHER", label: "Something else" },
] as const;

const LIKES_KEY = "arcadia:likes";

export default function GamePlayer({ game }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const ratio = game.width / game.height;

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  // Restore like state (guests: localStorage; swap for an authed API call once login is wired up)
  useEffect(() => {
    try {
      const likes: string[] = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
      setLiked(likes.includes(game.slug));
    } catch {}
  }, [game.slug]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function start() {
    setStarted(true);
    pushRecent({ slug: game.slug, title: game.title, thumbnailUrl: game.thumbnailUrl });
  }

  function toggleLike() {
    const next = !liked;
    setLiked(next);
    try {
      const likes: string[] = JSON.parse(localStorage.getItem(LIKES_KEY) ?? "[]");
      const updated = next ? [...new Set([...likes, game.slug])] : likes.filter((s) => s !== game.slug);
      localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
    } catch {}
    flash(next ? "Added to favorites" : "Removed from favorites");
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen();
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: game.title, url });
      else {
        await navigator.clipboard.writeText(url);
        flash("Link copied");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  }

  async function submitReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: game.slug,
        reason: data.get("reason"),
        details: data.get("details"),
      }),
    });
    setReportOpen(false);
    flash(res.ok ? "Report sent. Thanks for helping." : "Couldn't send the report. Try again.");
  }

  return (
    <div>
      {/* Theater frame: keeps the game's aspect ratio, never taller than the viewport */}
      <div
        ref={frameRef}
        className={`relative mx-auto overflow-hidden bg-black ${
          isFullscreen ? "h-screen w-screen" : "rounded-2xl ring-1 ring-edge"
        }`}
        style={
          isFullscreen
            ? undefined
            : { aspectRatio: `${game.width} / ${game.height}`, width: `min(100%, calc((100dvh - 15rem) * ${ratio}))` }
        }
      >
        {started ? (
          <iframe
            src={game.iframeUrl}
            title={game.title}
            className="absolute inset-0 h-full w-full border-0"
            allow="fullscreen; autoplay; gamepad; clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        ) : (
          <button
            onClick={start}
            className="group absolute inset-0 flex items-center justify-center focus-visible:outline-none"
            aria-label={`Play ${game.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:opacity-80" />
            <span className="relative flex items-center gap-2 rounded-full bg-sun px-8 py-3 font-display text-lg font-bold text-ink shadow-xl transition group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-arcade">
              <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden><path d="M6 4l11 6-11 6V4z" /></svg>
              Play
            </span>
          </button>
        )}
      </div>

      {/* Action bar */}
      <div className="mx-auto mt-3 flex flex-wrap items-center gap-2">
        <ActionButton onClick={toggleLike} pressed={liked} label={liked ? "Favorited" : "Favorite"}>
          <path d="M10 17l-1.1-1C4.9 12.4 2.5 10.2 2.5 7.5c0-2.2 1.7-3.8 3.7-3.8 1.4 0 2.8.8 3.8 2 1-1.2 2.4-2 3.8-2 2 0 3.7 1.6 3.7 3.8 0 2.7-2.4 4.9-6.4 8.5L10 17z" />
        </ActionButton>
        <ActionButton onClick={share} label="Share">
          <><circle cx="15" cy="4.5" r="2.2" /><circle cx="5" cy="10" r="2.2" /><circle cx="15" cy="15.5" r="2.2" /><path d="M6.8 9l6.4-3.6M6.8 11l6.4 3.6" stroke="currentColor" strokeWidth="1.5" fill="none" /></>
        </ActionButton>
        <ActionButton onClick={toggleFullscreen} label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
          <path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm12 0h2v5h-5v-2h3v-3z" />
        </ActionButton>
        <span className="flex-1" />
        <ActionButton onClick={() => setReportOpen(true)} label="Report" subtle>
          <path d="M4 3h1.500v14H4V3zm2.500 1h9l-2 3.500 2 3.500h-9V4z" />
        </ActionButton>
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-ink shadow-xl">
          {toast}
        </div>
      )}

      {reportOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="report-title" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
          <form onSubmit={submitReport} className="w-full max-w-md space-y-4 rounded-2xl bg-panel p-6 ring-1 ring-edge">
            <h2 id="report-title" className="font-display text-xl font-bold text-fg">Report {game.title}</h2>
            <fieldset className="space-y-2">
              <legend className="sr-only">Reason</legend>
              {REASONS.map((r, i) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-fg">
                  <input type="radio" name="reason" value={r.value} defaultChecked={i === 0} className="accent-arcade" />
                  {r.label}
                </label>
              ))}
            </fieldset>
            <textarea
              name="details"
              maxLength={500}
              rows={3}
              placeholder="Add details (optional)"
              className="w-full rounded-lg border border-edge bg-ink p-3 text-sm text-fg placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setReportOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-mute hover:text-fg">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-arcade px-4 py-2 text-sm font-semibold text-white hover:bg-arcade-soft">
                Send report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  children, label, onClick, pressed, subtle,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  pressed?: boolean;
  subtle?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={pressed}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-sun ${
        pressed
          ? "bg-arcade text-white"
          : subtle
            ? "text-mute hover:bg-panel hover:text-fg"
            : "bg-panel text-fg ring-1 ring-edge hover:ring-arcade"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>{children}</svg>
      {label}
    </button>
  );
}
