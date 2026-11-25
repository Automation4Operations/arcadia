"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AdBanner from "@/components/AdBanner";

export default function SignUpPage() {
  const { user, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleClick = async () => {
    setStatusMsg(null);
    try {
      await signInWithGoogle();
    } catch {
      setStatusMsg({
        ok: false,
        text: "Google Sign-In is being configured. Please use Email & Password below.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password || submitting) return;
    setSubmitting(true);
    setStatusMsg(null);

    try {
      if (isSignUp) {
        const res = await signUpWithEmail(cleanEmail, password);
        if (res.error) {
          setStatusMsg({ ok: false, text: res.error.message || String(res.error) });
        } else if (res.needsEmailConfirm) {
          setStatusMsg({
            ok: true,
            text: "Account created! Check your email inbox to confirm your address, then log in.",
          });
        } else {
          setStatusMsg({
            ok: true,
            text: "Account created! You are now signed in and your progress is cloud-saved.",
          });
        }
      } else {
        const res = await signInWithEmail(cleanEmail, password);
        if (res.error) {
          setStatusMsg({ ok: false, text: res.error.message || String(res.error) });
        } else {
          setStatusMsg({
            ok: true,
            text: "Welcome back! Your game progress is now synced.",
          });
        }
      }
    } catch (err: unknown) {
      setStatusMsg({
        ok: false,
        text: err instanceof Error ? err.message : "Authentication failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="rounded-3xl bg-panel/60 p-6 ring-1 ring-edge sm:p-8">
        <h1 className="font-display text-3xl font-black text-fg sm:text-4xl">
          ☁️ Cloud Save &amp; Player Account
        </h1>
        <p className="mt-2 text-sm text-mute">
          Save your levels, XP, and high scores across all your devices with a free Arcadia account.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Benefits Card */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-fg">Why create an account?</h2>
          <div className="space-y-3">
            <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
              <h3 className="text-sm font-bold text-arcade">🔄 Seamless Cross-Device Sync</h3>
              <p className="mt-1 text-xs text-mute leading-relaxed">
                Start a puzzle on your phone during your commute, and resume right where you left off on your PC at home.
              </p>
            </div>
            <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
              <h3 className="text-sm font-bold text-sun">🏆 Player Level &amp; XP Progression</h3>
              <p className="mt-1 text-xs text-mute leading-relaxed">
                Earn XP for every minute you play. Level up your player badge and show off your gamer rank.
              </p>
            </div>
            <div className="rounded-2xl bg-panel/70 p-4 ring-1 ring-edge">
              <h3 className="text-sm font-bold text-fg">🛡️ Never Lose Saved Data</h3>
              <p className="mt-1 text-xs text-mute leading-relaxed">
                Guest saves can disappear if your browser cache is cleared. Cloud Save keeps your game history safe permanently.
              </p>
            </div>
          </div>
        </div>

        {/* Auth Box */}
        <div className="rounded-3xl bg-panel p-6 ring-1 ring-edge">
          {user ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-arcade/20 text-3xl">
                ☁️
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-fg">Cloud Save Active</h3>
                <p className="mt-1 text-xs text-mute">
                  Logged in as <strong className="text-fg">{user.email}</strong>
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  ● Progress Synced
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/profile"
                  className="rounded-xl bg-arcade px-4 py-2.5 text-xs font-extrabold text-ink transition hover:brightness-110"
                >
                  View Profile &amp; Level
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="rounded-xl bg-ink px-4 py-2 text-xs font-bold text-mute ring-1 ring-edge hover:text-fg transition cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex rounded-xl bg-ink p-1 ring-1 ring-edge">
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                    isSignUp ? "bg-arcade text-ink" : "text-mute hover:text-fg"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                    !isSignUp ? "bg-arcade text-ink" : "text-mute hover:text-fg"
                  }`}
                >
                  Log In
                </button>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-gray-900 transition hover:bg-gray-100 cursor-pointer shadow-sm"
              >
                <span>Google</span>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 border-t border-edge" />
                <span className="relative bg-panel px-3 text-[10px] uppercase font-bold text-mute">
                  or with email
                </span>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-mute mb-1">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-ink px-3.5 py-2.5 text-xs text-fg ring-1 ring-edge placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
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
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl bg-ink px-3.5 py-2.5 text-xs text-fg ring-1 ring-edge placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-arcade"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full rounded-xl bg-arcade py-2.5 text-xs font-extrabold text-ink shadow-md shadow-arcade/20 transition hover:brightness-110 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Processing…" : isSignUp ? "Create Free Account" : "Log In"}
                </button>

                {statusMsg && (
                  <p
                    className={`rounded-xl p-3 text-xs font-semibold ring-1 ${
                      statusMsg.ok
                        ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/30"
                        : "bg-red-500/10 text-red-300 ring-red-500/30"
                    }`}
                  >
                    {statusMsg.text}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <AdBanner format="auto" className="my-6" />
    </main>
  );
}
