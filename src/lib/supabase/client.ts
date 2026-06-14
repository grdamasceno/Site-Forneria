import { createClient } from "@supabase/supabase-js";

// Browser/anon client — safe to expose. Reads are governed by RLS.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
