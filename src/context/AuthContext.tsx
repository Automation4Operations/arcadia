"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { syncCloudProgress } from "@/lib/progress";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, pass: string) => Promise<{ error: Error | null; needsEmailConfirm?: boolean }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user?.id) {
        syncCloudProgress(session.user.id).catch(() => {});
      }
    });

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN" && newSession?.user?.id) {
        syncCloudProgress(newSession.user.id).catch(() => {});
        if (typeof window !== "undefined" && window.location.hash.includes("access_token=")) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await supabase.auth.signInWithPassword({ email, password: pass });
    if (res.error) return { error: res.error };
    if (res.data.user) {
      syncCloudProgress(res.data.user.id).catch(() => {});
    }
    return { error: null };
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const res = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/signup` : undefined,
      },
    });
    if (res.error) return { error: res.error };
    if (res.data.user && res.data.session) {
      syncCloudProgress(res.data.user.id).catch(() => {});
    }
    return { error: null, needsEmailConfirm: Boolean(res.data.user && !res.data.session) };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/signup` : undefined,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
