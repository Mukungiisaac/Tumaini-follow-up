import { createClient } from '@supabase/supabase-js';

function normalizeEnvironmentValue(value) {
  const trimmedValue = String(value || '').trim();
  const quote = trimmedValue[0];
  if ((quote === '"' || quote === "'") && trimmedValue.endsWith(quote)) {
    return trimmedValue.slice(1, -1).trim();
  }
  return trimmedValue;
}

export const supabaseUrl = normalizeEnvironmentValue(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey = normalizeEnvironmentValue(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;