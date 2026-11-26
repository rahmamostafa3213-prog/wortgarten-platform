import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when a real Supabase project is configured. */
export const supabaseConfigured = Boolean(url && anon);

let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  client ??= createClient(url!, anon!);
  return client;
}
