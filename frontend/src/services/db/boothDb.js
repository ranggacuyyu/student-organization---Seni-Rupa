/**
 * 🗺️ Booth / Venue Layout Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md & Tabel: booths
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { BOOTH_ZONES } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_booths_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getLocalBooths = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      saveLocalBooths(BOOTH_ZONES);
      return BOOTH_ZONES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return BOOTH_ZONES;
  } catch {
    return BOOTH_ZONES;
  }
};

const saveLocalBooths = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save booths to localStorage:', e);
  }
};

export const BoothDb = {
  /**
   * Ambil seluruh data Zona / Booth Layout Lantai 3 dari Backend / DB
   */
  async getBooths() {
    // 1. Coba dari Laravel REST API
    try {
      const res = await axios.get(`${API_BASE_URL}/layout/booths`, { timeout: 4000 });
      if (res.data && res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        const formatted = res.data.data.map(b => ({
          id: b.id,
          name: b.name || b.nama_zona || 'Zona Pameran',
          code: b.code || b.kode_booth || b.id.toUpperCase(),
          x: b.x ?? b.koordinat_x ?? 50,
          y: b.y ?? b.koordinat_y ?? 50,
          description: b.description || b.deskripsi_zona || '',
          featuredCount: b.featuredCount ?? b.kapasitas_display ?? 10,
          color: b.color || '#FFE600',
          accent: b.accent || 'bg-[#FFE600]',
          icon: b.icon || 'Palette',
          location: b.location || 'Student Centre Lt. 3',
          activities: Array.isArray(b.activities) ? b.activities : (typeof b.activities === 'string' ? JSON.parse(b.activities) : []),
        }));
        saveLocalBooths(formatted);
        return formatted;
      }
    } catch (apiErr) {
      console.warn('Laravel API fetch booths failed, trying Supabase/Local:', apiErr.message);
    }

    // 2. Coba dari Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('booths')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          const formatted = data.map(b => ({
            id: b.id,
            name: b.nama_zona || b.name,
            code: b.kode_booth || b.code || b.id.toUpperCase(),
            x: b.koordinat_x ?? b.x ?? 50,
            y: b.koordinat_y ?? b.y ?? 50,
            description: b.deskripsi_zona || b.description,
            featuredCount: b.kapasitas_display ?? b.featuredCount ?? 10,
            color: b.color || '#FFE600',
            accent: b.accent || 'bg-[#FFE600]',
            icon: b.icon || 'Palette',
            location: b.location,
            activities: Array.isArray(b.activities) ? b.activities : (typeof b.activities === 'string' ? JSON.parse(b.activities) : []),
          }));
          saveLocalBooths(formatted);
          return formatted;
        }
      } catch (err) {
        console.warn('Supabase fetch booths failed, using fallback:', err);
      }
    }

    return getLocalBooths();
  },

  /**
   * Ambil detail booth berdasarkan ID
   */
  async getBoothById(id) {
    const booths = await this.getBooths();
    return booths.find(b => b.id === id || b.code === id) || booths[0];
  }
};
