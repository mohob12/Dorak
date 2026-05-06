import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://xaxtutlpcbmfemgkhiub.supabase.co";

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhheHR1dGxwY2JtZmVtZ2toaXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNDkwNjcsImV4cCI6MjA5MzYyNTA2N30.ssWlvaj9XsWrij391CMUGP-Krs8PQbQvNWW8yv6fJ6M";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const requireSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error("Missing Supabase environment variables.");
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});