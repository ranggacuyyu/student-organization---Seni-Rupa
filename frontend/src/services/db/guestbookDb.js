/**
 * 💬 Digital Guestbook & Sticky Notes Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: guestbooks)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_GUESTBOOKS } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_guestbooks_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getLocalGuestbooks = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GUESTBOOKS;
  } catch {
    return INITIAL_GUESTBOOKS;
  }
};

const saveLocalGuestbooks = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save guestbooks to localStorage:', e);
  }
};

export const GuestbookDb = {
  /**
   * Ambil pesan kesan pengunjung
   */
  async getMessages() {
    // 1. Coba dari Laravel REST API
    try {
      const res = await axios.get(`${API_BASE_URL}/guestbook`, { timeout: 4000 });
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        saveLocalGuestbooks(res.data.data);
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API fetch guestbook failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 2. Coba dari Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('guestbooks')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const formatted = data.map((msg) => ({
            id: msg.id,
            name: msg.nama_pengirim || msg.name,
            role: msg.status_pengirim || msg.role,
            message: msg.pesan || msg.message,
            sticker: msg.stiker_ikon || msg.sticker,
            color: msg.warna_kartu || msg.color || 'bg-[#FFE600]',
            textColor: msg.warna_kartu === 'bg-[#FF3388]' ? 'text-white' : 'text-black',
            createdAt: msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB' : 'Baru saja',
          }));
          saveLocalGuestbooks(formatted);
          return formatted;
        }
      } catch (err) {
        console.warn('Supabase fetch guestbook failed, using fallback:', err);
      }
    }

    return getLocalGuestbooks();
  },

  /**
   * Kirim pesan kesan baru
   */
  async addMessage(msg) {
    const list = getLocalGuestbooks();
    const colors = ['bg-[#FFE600]', 'bg-[#FF3388]', 'bg-[#00F0FF]', 'bg-[#CCFF00]', 'bg-[#FF6B35]'];
    const stickers = ['retro-star', 'retro-heart', 'retro-brush', 'retro-smile'];

    const chosenColor = msg.color || colors[Math.floor(Math.random() * colors.length)];
    const chosenSticker = msg.sticker || stickers[Math.floor(Math.random() * stickers.length)];

    const payload = {
      name: msg.name.trim(),
      role: msg.role || 'Pengunjung Pameran',
      message: msg.message.trim(),
      sticker: chosenSticker,
      color: chosenColor,
    };

    // 1. Coba kirim ke Laravel REST API
    try {
      const res = await axios.post(`${API_BASE_URL}/guestbook`, payload, { timeout: 4000 });
      if (res.data && res.data.success && res.data.data) {
        list.unshift(res.data.data);
        saveLocalGuestbooks(list);
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API add guestbook failed, fallback to Supabase/Local:', apiErr.message);
    }

    const newEntry = {
      id: 'gb-' + Date.now(),
      name: payload.name,
      role: payload.role,
      message: payload.message,
      sticker: payload.sticker,
      color: payload.color,
      textColor: payload.color === 'bg-[#FF3388]' ? 'text-white' : 'text-black',
      createdAt: 'Baru saja',
    };

    // 2. Coba kirim ke Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('guestbooks')
          .insert([
            {
              nama_pengirim: newEntry.name,
              status_pengirim: newEntry.role,
              pesan: newEntry.message,
              stiker_ikon: newEntry.sticker,
              warna_kartu: newEntry.color,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          newEntry.id = data.id;
        }
      } catch (err) {
        console.warn('Supabase insert guestbook failed:', err);
      }
    }

    list.unshift(newEntry);
    saveLocalGuestbooks(list);
    return newEntry;
  },
};
