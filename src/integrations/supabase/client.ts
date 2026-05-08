import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://exqgcaewajeadaivzifm.supabase.co";

const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6ImV4cWdjYWV3YWplYWRhaXZ6aWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODExMzIsImV4cCI6MjA5Mzc1NzEzMn0._kMc-GTSAb1xfSlGLBzNazsuppG1XHGQn_NJt2CorYo";

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
