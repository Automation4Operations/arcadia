"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleClick = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Google Sign-In is being configured. Please use Email & Password below.");
    }
  };

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (mode === "signin") {
        const res = await signInWithEmail(email.trim(), password);
        if (res.error) {
          setError(
            res.error.message.includes("Invalid login")
              ? "Incorrect email or password."
              : res.error.message
          );
        } else {
          setSuccess("Welcome back! Your game level and XP are synced.");
          setTimeout(() => closeAuthModal(), 1000);
        }
      } else {
        const res = await signUpWithEmail(email.trim(), password);
        if (res.error) {
          setError(res.error.message);
        } else {
          setSuccess("Account created! You are now logged in and progress is cloud-saved.");
          setTimeout(() => closeAuthModal(), 1200);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-edge bg-panel p-6 sm:p-8 text-fg shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-xl bg-ink p-2 text-xs font-bold text-mute ring-1 ring-edge hover:text-fg hover:scale-105 transition cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink ring-2 ring-arcade shadow-[0_0_20px] shadow-arcade/20 text-2xl">
            🕹️
          </div>
          <h2 className="mt-3 font-display text-xl sm:text-2xl font-black text-fg">
            {mode === "signin" ? "Welcome Back to Arcadia" : "Save Your Game Level"}
          </h2>
          <p className="mt-1 text-xs text-mute">
            {mode === "signin"
              ? "Sign in to load your saved levels and XP on this device."
              : "Keep your Level, XP, and badges auto-saved on any laptop or phone."}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="mt-5 flex rounded-xl bg-ink p-1 ring-1 ring-edge">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={
              "flex-1 rounded-lg py-2 text-xs font-extrabold transition cursor-pointer " +
              (mode === "signin" ? "bg-arcade text-ink" : "text-mute hover:text-fg")
            }
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={
              "flex-1 rounded-lg py-2 text-xs font-extrabold transition cursor-pointer " +
              (mode === "signup" ? "bg-arcade text-ink" : "text-mute hover:text-fg")
            }
          >
            Create Account
          </button>
        </div>

        {/* Google 1-Click Sign In */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleGoogleClick}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-ink py-2.5 text-xs font-bold text-fg ring-1 ring-edge hover:ring-arcade hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-edge" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-mute">or with email</span>
          <div className="h-px flex-1 bg-edge" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-ink px-3.5 py-2.5 text-xs text-fg ring-1 ring-edge focus:outline-none focus:ring-2 focus:ring-arcade transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-mute mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-ink px-3.5 py-2.5 text-xs text-fg ring-1 ring-edge focus:outline-none focus:ring-2 focus:ring-arcade transition"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-2 text-xs font-semibold text-red-400 ring-1 ring-red-500/20">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-lg bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-arcade py-2.5 text-xs font-black text-ink shadow-lg shadow-arcade/20 hover:brightness-110 active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Saving..." : mode === "signin" ? "Sign In & Load Progress" : "Create Account & Save Level"}
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-mute">
          🔒 Zero spam. We only use your account to persist your game levels and rank across devices.
        </p>
      </div>
    </div>
  );
}
