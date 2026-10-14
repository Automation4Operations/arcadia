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
  const [cinemaDim, setCinemaDim] = useState(false);
  const [liked, setLiked] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const ratio = game.width / game.height;

  const flash = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

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
    flash(next ? "Saved to My Vault" : "Removed from My Vault");
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
        flash("Game link copied!");
      }
    } catch {}
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
    flash(res.ok ? "Report sent. Thank you!" : "Couldn't send report. Try again.");
  }

  return (
    <div className="relative">
      {/* Cinema Lights-Off Backdrop */}
      {cinemaDim && (
        <div
          onClick={() => setCinemaDim(false)}
          className="fixed inset-0 z-30 bg-black/85 backdrop-blur-sm transition-opacity"
          aria-hidden
        />
      )}

      <div className={cinemaDim ? "relative z-40" : ""}>
        <div
          ref={frameRef}
          className={`relative mx-auto overflow-hidden bg-black ${
            isFullscreen ? "h-screen w-screen" : "rounded-2xl ring-1 ring-edge shadow-2xl"
          }`}
          style={
            isFullscreen
              ? undefined
              : {
                  aspectRatio: `${game.width} / ${game.height}`,
                  width: `min(100%, calc((100dvh - 14rem) * ${ratio}))`,
                }
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
              className="group absolute inset-0 flex flex-col items-center justify-center focus-visible:outline-none"
              aria-label={`Play ${game.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.thumbnailUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-50 blur-[2px] transition duration-300 group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="relative flex flex-col items-center gap-3">
                <span className="flex items-center gap-2.5 rounded-xl bg-sun px-8 py-3.5 font-display text-lg font-black text-ink shadow-[0_0_30px_rgba(204,255,0,0.5)] transition group-hover:scale-105">
                  <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden>
                    <path d="M6 4l11 6-11 6V4z" />
                  </svg>
                  LAUNCH GAME
                </span>
                <span className="rounded-md bg-ink/80 px-3 py-1 text-xs font-semibold text-fg backdrop-blur">
                  Instant Browser Play · No Downloads
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Control Deck */}
        <div className="mx-auto mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-edge bg-panel px-3 py-2">
          <ActionButton onClick={toggleLike} pressed={liked} label={liked ? "In Vault" : "Save"}>
            <path d="M10 17l-1.1-1C4.9 12.4 2.5 10.2 2.5 7.5c0-2.2 1.7-3.8 3.7-3.8 1.4 0 2.8.8 3.8 2 1-1.2 2.4-2 3.8-2 2 0 3.7 1.6 3.7 3.8 0 2.7-2.4 4.9-6.4 8.5L10 17z" />
          </ActionButton>

          <ActionButton
            onClick={() => setCinemaDim((d) => !d)}
            pressed={cinemaDim}
            label={cinemaDim ? "Lights On" : "Lights Off"}
          >
            <path d="M10 2a6 6 0 00-3.8 10.6V15a1 1 0 001 1h5.6a1 1 0 001-1v-2.4A6 6 0 0010 2zm-2 15h4v1H8v-1z" />
          </ActionButton>

          <ActionButton onClick={share} label="Share">
            <>
              <circle cx="15" cy="4.5" r="2.2" />
              <circle cx="5" cy="10" r="2.2" />
              <circle cx="15" cy="15.5" r="2.2" />
              <path
                d="M6.8 9l6.4-3.6M6.8 11l6.4 3.6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </>
          </ActionButton>

          <span className="flex-1" />

          <ActionButton onClick={() => setReportOpen(true)} label="Report" subtle>
            <path d="M4 3h1.5v14H4V3zm2.5 1h9l-2 3.5 2 3.5h-9V4z" />
          </ActionButton>

          <ActionButton
            onClick={toggleFullscreen}
            label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <path d="M3 3h5v2H5v3H3V3zm9 0h5v5h-2V5h-3V3zM3 12h2v3h3v2H3v-5zm12 0h2v5h-5v-2h3v-3z" />
          </ActionButton>
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-sun px-4 py-2 text-sm font-bold text-ink shadow-xl"
        >
          {toast}
        </div>
      )}

      {reportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
        >
          <form
            onSubmit={submitReport}
            className="w-full max-w-md space-y-4 rounded-2xl bg-panel p-6 ring-1 ring-edge"
          >
            <h2 id="report-title" className="font-display text-xl font-bold text-fg">
              Report {game.title}
            </h2>
            <fieldset className="space-y-2">
              <legend className="sr-only">Reason</legend>
              {REASONS.map((r, i) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-fg">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    defaultChecked={i === 0}
                    className="accent-arcade"
                  />
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
              <button
                type="button"
                onClick={() => setReportOpen(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-mute hover:text-fg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sun px-4 py-2 text-sm font-bold text-ink"
              >
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
  children,
  label,
  onClick,
  pressed,
  subtle,
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
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-sun ${
        pressed
          ? "bg-sun text-ink"
          : subtle
            ? "text-mute hover:bg-ink hover:text-fg"
            : "bg-ink text-fg ring-1 ring-edge hover:ring-arcade"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
        {children}
      </svg>
      {label}
    </button>
  );
}