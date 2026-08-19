/**
 * 💬 Digital Guestbook & Sticky Notes Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: guestbooks)
 */
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_GUESTBOOKS } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_guestbooks_v1';

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

    const newEntry = {
      id: 'gb-' + Date.now(),
      name: msg.name.trim(),
      role: msg.role || 'Pengunjung Pameran',
      message: msg.message.trim(),
      sticker: chosenSticker,
      color: chosenColor,
      textColor: chosenColor === 'bg-[#FF3388]' ? 'text-white' : 'text-black',
      createdAt: 'Baru saja',
    };

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
