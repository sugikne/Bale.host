import { createClient } from '@supabase/supabase-js';

// WAJIB pakai import.meta.env di Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// cek konfigurasi
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey
);

// hanya buat client kalau config lengkap
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
