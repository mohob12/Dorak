import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://xaxtutlpcbmfemgkhiub.supabase.co";

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1cmVmIjoieGF4dHV0bHBjYm1mZW1na2hpdWIiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3ODA0OTA2NywiZXhwIjoyMDkzNjI1MDY3fQ.ssWlvaj9XsWrij391CMUGP-Krs8PQbQvNWW8yv6fJ6M";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const requireSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Missing Supabase environment variables.");
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);