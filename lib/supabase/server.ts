import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

// Server-only client. Prefers the service role key (never exposed to the
// browser) so server components / route handlers can read aggregate data
// and, for the admin dashboard, bypass RLS for moderation actions.
// Falls back to the anon key so the app still runs before the service
// role key is configured.
const serverKey =
  (process.env.SUPABASE_SERVICE_ROLE_KEY as string) ||
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string);

export const supabaseServer = createClient<Database>(supabaseUrl, serverKey, {
  auth: { persistSession: false },
});
