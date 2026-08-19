/**
 * 🔐 Authentication & Session Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: users)
 */
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_PANITIA_ACCOUNTS } from '../../data/mockData';

const AUTH_USER_KEY = 'senrup_auth_user_v1';
const ACCOUNTS_KEY = 'senrup_panitia_accounts_v1';

const getLocalAccounts = () => {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PANITIA_ACCOUNTS;
  } catch {
    return INITIAL_PANITIA_ACCOUNTS;
  }
};

export const AuthDb = {
  /**
   * Login petugas (Super Admin & Panitia)
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    const cleanUser = username.trim().toLowerCase();

    // 1. Coba verifikasi dengan Supabase jika terhubung
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('username', cleanUser)
          .eq('password', password)
          .maybeSingle(); // pakai maybeSingle agar tidak error saat 0 baris

        // Hanya return jika user benar-benar ditemukan di Cloud
        if (!error && data) {
          if (data.status !== 'active') {
            return { success: false, message: 'Akun ini dinonaktifkan oleh Koordinator.' };
          }

          const userSession = {
            id: data.id,
            username: data.username,
            nama: data.name || data.nama,
            role: data.role || 'panitia',
            divisi: data.divisi || 'Divisi Pelaksana',
            assignedBooth: data.assigned_booth || data.assignedBooth,
            kontak: data.kontak,
            status: data.status,
            avatarBg: data.avatar_bg || 'bg-[#FFE600]',
          };

          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userSession));
          return { success: true, user: userSession };
        }
        // Jika data null (tidak ditemukan di Cloud), lanjut ke fallback lokal
      } catch (err) {
        console.warn('Supabase auth failed, fallback to local accounts:', err);
      }
    }

    // 2. Fallback ke Local Accounts Engine
    const accounts = getLocalAccounts();
    const user = accounts.find(
      (acc) => acc.username.trim().toLowerCase() === cleanUser && acc.password === password
    );

    if (!user) {
      return { success: false, message: 'Username atau password tidak cocok!' };
    }

    if (user.status !== 'active') {
      return { success: false, message: 'Akun ini sedang dinonaktifkan oleh Koordinator.' };
    }

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  /**
   * Logout user aktif
   */
  logout() {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  /**
   * Dapatkan user yang sedang login
   */
  getCurrentUser() {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },
};
