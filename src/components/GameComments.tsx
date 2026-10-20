"use client";

import { FormEvent, useEffect, useState } from "react";

type Kind = "comment" | "suggestion" | "issue";
type Item = { id: string; kind: Kind; name: string; body: string; created_at: string };

const KINDS: { value: Kind; label: string; hint: string }[] = [
  { value: "comment", label: "💬 Comment", hint: "Share what you think." },
  { value: "suggestion", label: "💡 Suggestion", hint: "Ideas to make it better." },
  {
    value: "issue",
    label: "🐞 Issue",
    hint: "Not loading, broken controls, wrong info… (private, only our team sees it)",
  },
];

function timeAgo(iso: string): string {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function GameComments({
  slug = null,
  heading = "Comments & feedback",
}: {
  slug?: string | null;
  heading?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState<Kind>("comment");
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  // Remember the player's nickname
  useEffect(() => {
    try {
      setName(localStorage.getItem("arcadia:nickname") || "");
    } catch {}
  }, []);

  // Load approved comments
  useEffect(() => {
    let alive = true;
    const url = slug ? `/api/comments?slug=${encodeURIComponent(slug)}` : "/api/comments";
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setItems(Array.isArray(d?.comments) ? d.comments : []);
      })
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, kind, name, body }),
      });
      const data = await res.json().catch(() => ({}));
      const ok = Boolean(data?.ok);
      setNotice({ ok, text: data?.message || (ok ? "Sent!" : "Something went wrong.") });
      if (ok) {
        setBody("");
        try {
          if (name.trim()) localStorage.setItem("arcadia:nickname", name.trim());
        } catch {}
      }
    } catch {
      setNotice({ ok: false, text: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  };

  const current = KINDS.find((k) => k.value === kind)!;
  const tooLong = body.length > 500;

  return (
    <section className="mt-8 rounded-2xl bg-panel/70 p-5 ring-1 ring-edge" aria-label={heading}>
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 rounded-full bg-sun" />
        <h2 className="font-display text-lg font-bold text-fg">{heading}</h2>
        {items.length > 0 && <span className="text-xs text-mute">({items.length})</span>}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              role="tab"
              aria-selected={kind === k.value}
              onClick={() => setKind(k.value)}
              className={
                "rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 transition cursor-pointer " +
                (kind === k.value
                  ? "bg-arcade text-ink ring-arcade"
                  : "bg-ink text-mute ring-edge hover:text-fg hover:ring-arcade/60")
              }
            >
              {k.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-mute">{current.hint}</p>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Nickname (optional)"
          className="w-full rounded-xl bg-ink px-3.5 py-2.5 text-sm text-fg ring-1 ring-edge placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade sm:max-w-xs"
        />

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder={
            kind === "issue" ? "Describe the problem…" : kind === "suggestion" ? "Your idea…" : "Write a comment…"
          }
          className="w-full resize-y rounded-xl bg-ink px-3.5 py-2.5 text-sm text-fg ring-1 ring-edge placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={"text-[11px] " + (tooLong ? "font-bold text-red-400" : "text-mute")}>
            {body.length}/500 · No links · Shown after review
          </span>
          <button
            type="submit"
            disabled={sending || body.trim().length < 3 || tooLong}
            className="rounded-xl bg-sun px-5 py-2 text-xs font-extrabold text-ink shadow-md shadow-sun/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {sending ? "Sending…" : "Send"}
          </button>
        </div>

        {notice && (
          <p
            role="status"
            className={
              "rounded-xl px-3.5 py-2.5 text-xs font-semibold ring-1 " +
              (notice.ok
                ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                : "bg-red-500/10 text-red-300 ring-red-500/30")
            }
          >
            {notice.text}
          </p>
        )}
      </form>

      {/* Approved comments */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-xs text-mute">Loading comments…</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-mute">No comments yet. Be the first!</p>
        ) : (
          items.map((c) => (
            <article key={c.id} className="rounded-xl bg-ink/70 p-3.5 ring-1 ring-edge">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="font-bold text-fg">{c.name}</span>
                <span
                  className={
                    "rounded-full px-2 py-0.5 font-bold " +
                    (c.kind === "suggestion" ? "bg-sun/15 text-sun" : "bg-arcade/15 text-arcade")
                  }
                >
                  {c.kind === "suggestion" ? "💡 Suggestion" : "💬 Comment"}
                </span>
                <span className="text-mute">{timeAgo(c.created_at)}</span>
              </div>
              <p className="mt-1.5 whitespace-pre-line break-words text-sm text-fg/90">{c.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
