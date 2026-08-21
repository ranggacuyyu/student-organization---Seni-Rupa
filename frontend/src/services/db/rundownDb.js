/**
 * ⏰ Rundown & Timeline Acara Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: rundowns)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { RUNDOWN_SCHEDULE } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_rundowns_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
    // 1. Coba dari Laravel REST API
    try {
      const res = await axios.get(`${API_BASE_URL}/rundown`, { timeout: 4000 });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        saveLocalRundowns(res.data.data);
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API fetch rundowns failed, fallback to Supabase/Local:', apiErr.message);
    }

    // 2. Coba dari Supabase
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

    // 1. Coba via Laravel REST API
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/rundown/${id}/status`,
        { status: newStatus },
        { timeout: 4000 }
      );
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        saveLocalRundowns(res.data.data);
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('Laravel API update rundown status failed, fallback:', apiErr.message);
    }

    // 2. Coba via Supabase
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
