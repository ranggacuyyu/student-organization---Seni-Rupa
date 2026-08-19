/**
 * ⏰ Rundown & Timeline Acara Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: rundowns)
 */
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { RUNDOWN_SCHEDULE } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_rundowns_v1';

const getLocalRundowns = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : RUNDOWN_SCHEDULE;
  } catch {
    return RUNDOWN_SCHEDULE;
  }
};

const saveLocalRundowns = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save rundowns to localStorage:', e);
  }
};

export const RundownDb = {
  /**
   * Ambil jadwal kegiatan rundown
   */
  async getRundowns() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('rundowns')
          .select('*')
          .order('urutan', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            time: item.waktu_mulai ? `${item.waktu_mulai} - ${item.waktu_selesai}` : item.time,
            title: item.sesi_kegiatan || item.title,
            speaker: item.pengisi_acara || item.speaker,
            location: item.lokasi_sesi || item.location,
            status: item.status,
            description: item.deskripsi || item.description,
            boothId: item.booth_id || 'booth-d',
          }));
          saveLocalRundowns(formatted);
          return formatted;
        }
      } catch (err) {
        console.warn('Supabase fetch rundowns failed, using fallback:', err);
      }
    }

    return getLocalRundowns();
  },

  /**
   * Update status sesi kegiatan ('upcoming' | 'ongoing' | 'completed')
   */
  async updateStatus(id, newStatus) {
    const list = getLocalRundowns();
    const updated = list.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    saveLocalRundowns(updated);

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('rundowns')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase update rundown status failed:', err);
      }
    }

    return updated;
  },
};
