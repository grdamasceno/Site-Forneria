import { createClient } from "@supabase/supabase-js";

// Anon client — safe to expose. Reads are governed by RLS.
// Fallbacks keep the module from throwing at import time during build when
// env vars aren't present; real values are used at request time.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
);
