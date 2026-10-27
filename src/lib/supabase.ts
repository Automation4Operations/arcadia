import { createClient } from "@supabase/supabase-js";

// Public values (safe to ship). Used only if the environment variables are missing or damaged.
const FALLBACK_URL = "https://lbjyfamkklphtmiugthe.supabase.co";
const FALLBACK_KEY = "sb_publishable_MXvaRf71eBr9HTQyCVMx9g_dX0Z3NBE";

function usableKey(k: string | undefined): k is string {
  return !!k && k.length > 30 && (k.startsWith("sb_") || k.startsWith("eyJ"));
}

// Server-side only. Uses the PUBLIC (anon / publishable) key; Row Level Security protects the data.
export function getSupabase() {
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;
  const url = envUrl && envUrl.startsWith("https://") ? envUrl : FALLBACK_URL;
  const key = usableKey(envKey) ? envKey : FALLBACK_KEY;
  return createClient(url, key, { auth: { persistSession: false } });
}
