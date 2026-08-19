/**
 * 📝 Attendance & Client IP Tracking Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: attendances)
 */
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { INITIAL_ATTENDANCES } from '../../data/mockData';

const LOCAL_STORAGE_KEY = 'senrup_attendances_v1';
const MY_TICKET_KEY = 'senrup_my_attendance_ticket_v1';

// Helper: Ambil data lokal
const getLocalAttendances = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ATTENDANCES;
  } catch {
    return INITIAL_ATTENDANCES;
  }
};

// Helper: Simpan data lokal
const saveLocalAttendances = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const AttendanceDb = {
  /**
   * Catat presensi baru (Cloud Supabase + Local Cache)
   * Alias: submitAttendance (kompatibel dengan AttendancePage.jsx)
   * @param {Object} data - { nama_lengkap, identifier, kategori, jurusan_prodi, ip_address, user_agent, device_type, catatan }
   */
  async recordAttendance(data) {
    const newEntry = {
      id: 'att-' + Date.now(),
      nama_lengkap: data.nama_lengkap.trim(),
      identifier: data.identifier ? data.identifier.trim() : '-',
      kategori: data.kategori || 'Mahasiswa Baru',
      jurusan_prodi: data.jurusan_prodi || 'Politeknik Negeri Batam',
      ip_address: data.ip_address || '180.254.88.99',
      user_agent: data.user_agent || navigator.userAgent,
      device_type: data.device_type || 'Desktop',
      waktu_kehadiran: new Date().toISOString().replace('T', ' ').substring(0, 19),
      catatan: data.catatan || '',
    };

    // 1. Simpan ke Supabase jika terhubung
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('attendances')
          .insert([
            {
              nama_lengkap: newEntry.nama_lengkap,
              identifier: newEntry.identifier,
              kategori: newEntry.kategori,
              jurusan_prodi: newEntry.jurusan_prodi,
              ip_address: newEntry.ip_address,
              user_agent: newEntry.user_agent,
              device_type: newEntry.device_type,
              catatan: newEntry.catatan,
            },
          ])
          .select()
          .single();

        if (!error && inserted) {
          newEntry.id = inserted.id;
        }
      } catch (err) {
        console.warn('Supabase insert failed, using fallback engine:', err);
      }
    }

    // 2. Simpan ke Local Storage Cache & Ticket Saya
    const currentList = getLocalAttendances();
    const updatedList = [newEntry, ...currentList];
    saveLocalAttendances(updatedList);
    localStorage.setItem(MY_TICKET_KEY, JSON.stringify(newEntry));

    return {
      success: true,
      ticket: newEntry,
      totalCount: updatedList.length,
    };
  },

  /**
   * Ambil seluruh data presensi
   */
  async getAllAttendances() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('attendances')
          .select('*')
          .order('waktu_kehadiran', { ascending: false });

        if (!error && data && data.length > 0) {
          saveLocalAttendances(data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch attendances failed, using fallback:', err);
      }
    }

    return getLocalAttendances();
  },

  /**
   * Ambil tiket digital pengunjung aktif
   */
  getMyTicket() {
    try {
      const saved = localStorage.getItem(MY_TICKET_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  },

  /**
   * Alias untuk recordAttendance — kompatibel dengan AttendancePage.jsx
   * Mengembalikan { data: ticket, success, totalCount }
   */
  async submitAttendance(data) {
    const result = await this.recordAttendance(data);
    return {
      ...result,
      data: result.ticket, // AttendancePage mengakses result.data
    };
  },
};
