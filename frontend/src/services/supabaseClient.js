/**
 * 🎨 Supabase Client & Connection Manager
 * Standar Rekayasa Perangkat Lunak: Zero Hardcoded Secret & Graceful Fallback
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Cek apakah kredensial Supabase telah dikonfigurasi di file .env
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-ref')
  );
};

/**
 * Instance Supabase Client Resmi
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      db: {
        schema: 'public',
      },
    })
  : null;

/**
 * Tes status konektivitas ke Supabase Database
 * @returns {Promise<{ isConnected: boolean, message: string }>}
 */
export const testDatabaseConnection = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      isConnected: false,
      message: 'Supabase Cloud belum dikonfigurasi di .env (Menggunakan Local Engine Fallback).',
    };
  }

  try {
    const { error } = await supabase.from('booths').select('id').limit(1);
    if (error) throw error;
    return {
      isConnected: true,
      message: 'Terhubung ke Database Cloud Supabase PostgreSQL.',
    };
  } catch (err) {
    return {
      isConnected: false,
      message: `Gagal terhubung ke Cloud: ${err.message || 'Koneksi timeout'}. Beralih ke Local Engine.`,
    };
  }
};
