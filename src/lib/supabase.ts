import { createClient } from "@supabase/supabase-js";

// Server-side only. Uses the PUBLIC (anon / publishable) key; Row Level Security protects the data.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  return createClient(url, key, { auth: { persistSession: false } });
}
