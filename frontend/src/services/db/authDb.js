/**
 * 🔐 Authentication & Session Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: users)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_PANITIA_ACCOUNTS } from '../../data/mockData';

const AUTH_USER_KEY = 'senrup_auth_user_v1';
const AUTH_TOKEN_KEY = 'senrup_auth_token_v1';
const ACCOUNTS_KEY = 'senrup_panitia_accounts_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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

    // 1. Coba verifikasi dengan Laravel REST API
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { username: cleanUser, password },
        { timeout: 4000 }
      );
      if (res.data && res.data.success && res.data.user) {
        if (res.data.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
        }
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
    } catch (apiErr) {
      if (apiErr.response && apiErr.response.data && apiErr.response.data.message) {
        // Jika server aktif tapi menolak karena password salah atau nonaktif
        if (apiErr.response.status === 401 || apiErr.response.status === 403) {
          return { success: false, message: apiErr.response.data.message };
        }
      }
      console.warn('Laravel API auth failed, trying Supabase/local fallback:', apiErr.message);
    }

    // 2. Coba verifikasi dengan Supabase jika terhubung
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .ilike('username', cleanUser)
          .eq('password', password)
          .maybeSingle();

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
      } catch (err) {
        console.warn('Supabase auth failed, fallback to local accounts:', err);
      }
    }

    // 3. Fallback ke Local Accounts Engine
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
  async logout() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 2000,
          }
        );
      }
    } catch {
      // Ignore network error on logout
    }

    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
