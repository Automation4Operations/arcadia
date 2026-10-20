"use client";

import { useEffect, useRef, useState } from "react";
import { pushRecent } from "@/lib/recent";
import { formatCount } from "@/lib/format";

type GameObj = {
  slug: string;
  title: string;
  iframeUrl: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  likeCount?: number;
  dislikeCount?: number;
};

type Props = {
  slug?: string;
  title?: string;
  iframeUrl?: string;
  thumbnailUrl?: string;
  categoryName?: string;
  game?: GameObj;
};

type Vote = "like" | "dislike" | null;

const btn =
  "inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-1.5 text-xs font-bold text-mute ring-1 ring-edge transition hover:text-fg hover:ring-arcade cursor-pointer";

export default function GamePlayer(props: Props) {
  const slug = props.game?.slug || props.slug || "";
  const title = props.game?.title || props.title || "Arcadia Game";
  const rawIframeUrl = props.game?.iframeUrl || props.iframeUrl || "";
  const thumbnailUrl = props.game?.thumbnailUrl || props.thumbnailUrl || "";
  const gw = props.game?.width ?? 0;
  const gh = props.game?.height ?? 0;
  const isPortrait = gw > 0 && gh > 0 && gh > gw;

  const stageRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const [theater, setTheater] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [pseudoFs, setPseudoFs] = useState(false);

  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);

  const [vote, setVote] = useState<Vote>(null);
  const [likes, setLikes] = useState(props.game?.likeCount ?? 0);
  const [dislikes, setDislikes] = useState(props.game?.dislikeCount ?? 0);
  const voteKey = `arcadia:vote:${slug}`;

  const finalIframeUrl = (() => {
    try {
      const u = new URL(rawIframeUrl);
      if (u.hostname.includes("gamemonetize")) {
        u.search = "";
        if (!u.pathname.endsWith("/")) u.pathname += "/";
      }
      return u.toString();
    } catch {
      return rawIframeUrl;
    }
  })();

  /* Remember this player's earlier vote */
  useEffect(() => {
    try {
      const v = localStorage.getItem(voteKey);
      if (v === "like" || v === "dislike") setVote(v);
    } catch {}
  }, [voteKey]);

  /* Track real browser fullscreen on/off */
  useEffect(() => {
    const onChange = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = document as any;
      setIsFs(Boolean(document.fullscreenElement || d.webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  /* Esc closes Lights Off / phone fullscreen */
  useEffect(() => {
    if (!theater && !pseudoFs) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTheater(false);
        setPseudoFs(false);
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [theater, pseudoFs]);

  /* Safety: hide the loader after 10s even if the game never reports "loaded" */
  useEffect(() => {
    if (!started || loaded) return;
    const t = setTimeout(() => setLoaded(true), 10000);
    return () => clearTimeout(t);
  }, [started, loaded, iframeKey]);

  const startGame = () => {
    if (started) return;
    setStarted(true);
    setLoaded(false);
    if (!slug) return;
    pushRecent({ slug, title, thumbnailUrl });
    fetch("/api/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  };

  const reloadGame = () => {
    setLoaded(false);
    setIframeKey((k) => k + 1);
  };

  const enterFullscreen = async () => {
    if (!started) startGame();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const el = stageRef.current as any;
    if (!el) return;
    const request = el.requestFullscreen || el.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(el);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (screen.orientation as any)?.lock?.(isPortrait ? "portrait" : "landscape");
        } catch {}
        return;
      } catch {}
    }
    setPseudoFs(true); // iPhone fallback
  };

  const exitFullscreen = async () => {
    if (pseudoFs) {
      setPseudoFs(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = document as any;
    const exit = d.exitFullscreen || d.webkitExitFullscreen;
    if (exit) {
      try {
        await exit.call(d);
      } catch {}
    }
  };

  const castVote = (next: "like" | "dislike") => {
    const newVote: Vote = vote === next ? null : next;
    let dLike = 0;
    let dDislike = 0;
    if (vote === "like") dLike -= 1;
    if (vote === "dislike") dDislike -= 1;
    if (newVote === "like") dLike += 1;
    if (newVote === "dislike") dDislike += 1;

    setVote(newVote);
    setLikes((n) => Math.max(0, n + dLike));
    setDislikes((n) => Math.max(0, n + dDislike));
    try {
      if (newVote) localStorage.setItem(voteKey, newVote);
      else localStorage.removeItem(voteKey);
    } catch {}

    if (!slug || (dLike === 0 && dDislike === 0)) return;
    fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, like: dLike, dislike: dDislike }),
    }).catch(() => {});
  };

  const shareGame = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      alert("Game link copied!");
    }
  };

  const reportBroken = async () => {
    if (reported) return;
    setReported(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, reason: "Player reported issue" }),
    }).catch(() => {});
  };

  const totalVotes = likes + dislikes;
  const likePct = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : 0;
  const fullOn = isFs || pseudoFs;

  const normalSize = isPortrait
    ? "mx-auto w-full max-w-[480px] h-[calc(100vh-140px)] min-h-[520px] max-h-[880px] rounded-2xl"
    : "w-full aspect-[4/3] sm:aspect-auto sm:h-[calc(100vh-140px)] sm:min-h-[460px] sm:max-h-[860px] rounded-2xl";

  const wrapperClass = pseudoFs
    ? "fixed inset-0 z-[70] bg-black"
    : theater
    ? "fixed inset-0 z-[60] bg-black/95 p-3 sm:p-6 flex flex-col justify-center"
    : "w-full";

  const stageClass =
    "relative overflow-hidden bg-black flex items-center justify-center " +
    (fullOn
      ? "h-full w-full"
      : theater
      ? "w-full h-[calc(100vh-100px)] rounded-2xl ring-1 ring-edge"
      : normalSize + " ring-1 ring-edge shadow-2xl shadow-arcade/10");

  return (
    <div className={wrapperClass}>
      <div ref={stageRef} className={stageClass}>
        {/* ---------- PLAY SCREEN ---------- */}
        {!started && (
          <button
            type="button"
            onClick={startGame}
            className="group absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 overflow-hidden cursor-pointer"
            aria-label={`Play ${title}`}
          >
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
            {thumbnailUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailUrl}
                alt={title}
                className="relative w-40 rounded-2xl shadow-2xl shadow-arcade/30 ring-2 ring-arcade/60 transition duration-300 group-hover:scale-105 sm:w-60"
              />
            )}
            <span className="relative block px-4 text-center font-display text-xl font-bold text-fg sm:text-3xl">
              {title}
            </span>
            <span className="relative inline-flex items-center gap-2 rounded-full bg-sun px-8 py-3 font-display text-lg font-extrabold text-ink shadow-lg shadow-sun/40 transition duration-300 group-hover:scale-110">
              ▶ PLAY NOW
            </span>
          </button>
        )}

        {/* ---------- GAME ---------- */}
        {started && (
          <iframe
            key={iframeKey}
            src={finalIframeUrl}
            title={title}
            onLoad={() => setLoaded(true)}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gamepad; gyroscope; picture-in-picture; pointer-lock; web-share"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

        {/* ---------- LOADING SCREEN ---------- */}
        {started && !loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-ink">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-edge border-t-arcade" />
            <p className="font-display text-lg font-bold text-fg">Loading {title}…</p>
            <p className="text-xs text-mute">Tip: use Fullscreen for the best experience</p>
          </div>
        )}

        {/* ---------- EXIT BUTTON (fullscreen) ---------- */}
        {fullOn && (
          <button
            type="button"
            onClick={exitFullscreen}
            className="absolute right-3 top-3 z-30 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur cursor-pointer"
          >
            ✕ Exit
          </button>
        )}
      </div>

      {/* ---------- TOOLBAR ---------- */}
      {!pseudoFs && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-panel px-4 py-3 ring-1 ring-edge">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-ink p-1 ring-1 ring-edge">
              <button
                type="button"
                onClick={() => castVote("like")}
                aria-pressed={vote === "like"}
                className={
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer " +
                  (vote === "like" ? "bg-arcade text-ink" : "text-mute hover:text-fg")
                }
              >
                👍 {formatCount(likes)}
              </button>
              <button
                type="button"
                onClick={() => castVote("dislike")}
                aria-pressed={vote === "dislike"}
                className={
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer " +
                  (vote === "dislike" ? "bg-red-500 text-white" : "text-mute hover:text-fg")
                }
              >
                👎 {formatCount(dislikes)}
              </button>
            </div>

            {totalVotes > 0 && (
              <div className="flex items-center gap-2" title={`${likePct}% of players liked this`}>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-edge">
                  <div className="h-full bg-arcade" style={{ width: `${likePct}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-mute">{likePct}% liked</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                pushRecent({ slug, title, thumbnailUrl });
                setSaved(true);
              }}
              className={btn}
            >
              {saved ? "✓ Saved" : "♡ Save"}
            </button>
            <button type="button" onClick={shareGame} className={btn}>
              ↗ Share
            </button>
            <button
              type="button"
              onClick={reportBroken}
              className={btn + (reported ? " text-red-400" : "")}
            >
              {reported ? "Reported" : "⚑ Report"}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={reloadGame} className={btn} disabled={!started}>
              ↻ Reload
            </button>
            <button type="button" onClick={() => setTheater(!theater)} className={btn}>
              {theater ? "☀ Lights On" : "🌙 Lights Off"}
            </button>
            <button
              type="button"
              onClick={fullOn ? exitFullscreen : enterFullscreen}
              className="rounded-xl bg-arcade px-4 py-1.5 text-xs font-extrabold text-ink shadow-md shadow-arcade/30 transition hover:brightness-110 cursor-pointer"
            >
              ⛶ Fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
