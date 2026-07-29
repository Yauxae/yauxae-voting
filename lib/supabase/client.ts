import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in development so misconfiguration is caught early.
  // eslint-disable-next-line no-console
  console.warn(
    "[YAUXAÉ] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
  );
}

// Client-side Supabase instance — safe to use in "use client" components.
// Uses the public anon key, which is restricted by Row Level Security policies
// defined in supabase/schema.sql.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});
