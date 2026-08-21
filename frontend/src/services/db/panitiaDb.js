/**
 * 📋 Panitia Portal & Admin Operations Database Service
 * Sesuai Spesifikasi: BLUEPRINT_ART_SHOWCASE.md (Tabel: users, panitia_tasks, panitia_announcements)
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { 
  INITIAL_PANITIA_ACCOUNTS, 
  INITIAL_PANITIA_TASKS, 
  INITIAL_PANITIA_ANNOUNCEMENTS,
  INITIAL_ATTENDANCES
} from '../../data/mockData';

const ACCOUNTS_KEY = 'senrup_panitia_accounts_v1';
const TASKS_KEY = 'senrup_panitia_tasks_v1';
const ANNOUNCEMENTS_KEY = 'senrup_panitia_announcements_v1';
const ATTENDANCES_KEY = 'senrup_attendances_v1';
const CHECKED_IN_KEY = 'senrup_checked_in_tickets_v1';
const SOUVENIR_KEY = 'senrup_souvenir_claims_v1';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const PanitiaDb = {
  // === 1. TIKET & SCAN QR CODE ===
  verifyTicket(query) {
    if (!query) return null;
    let cleanQ = String(query).trim().toLowerCase();

    // Check if query is JSON string from QR Code
    if (cleanQ.startsWith('{') && cleanQ.endsWith('}')) {
      try {
        const parsed = JSON.parse(query);
        if (parsed.id) cleanQ = String(parsed.id).toLowerCase();
        else if (parsed.identifier) cleanQ = String(parsed.identifier).toLowerCase();
        else if (parsed.nim) cleanQ = String(parsed.nim).toLowerCase();
      } catch (e) {
        console.warn('JSON QR parse failed, using raw query');
      }
    }

    // Check if query has prefix ART-PASS:id:nim:nama
    if (cleanQ.startsWith('art-pass:')) {
      const parts = cleanQ.split(':');
      if (parts[1]) cleanQ = parts[1].trim();
    }

    const attendances = JSON.parse(localStorage.getItem(ATTENDANCES_KEY) || '[]');
    const checkedInList = JSON.parse(localStorage.getItem(CHECKED_IN_KEY) || '[]');
    const souvenirList = JSON.parse(localStorage.getItem(SOUVENIR_KEY) || '[]');

    const match = attendances.find(
      (a) =>
        (a.id && a.id.toLowerCase() === cleanQ) ||
        (a.identifier && a.identifier.toLowerCase() === cleanQ) ||
        (a.nama_lengkap && a.nama_lengkap.toLowerCase().includes(cleanQ)) ||
        (a.ip_address && a.ip_address.toLowerCase() === cleanQ)
    );

    if (!match) return null;

    return {
      ...match,
      isCheckedIn: checkedInList.includes(match.id),
      isSouvenirClaimed: souvenirList.includes(match.id),
    };
  },

  async verifyTicketRemote(query) {
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance/verify?q=${encodeURIComponent(query)}`, { timeout: 3000 });
      if (res.data && res.data.success && res.data.ticket) {
        return res.data.ticket;
      }
    } catch {
      // fallback
    }
    return this.verifyTicket(query);
  },

  toggleCheckIn(ticketId) {
    const list = JSON.parse(localStorage.getItem(CHECKED_IN_KEY) || '[]');
    let updated;
    if (list.includes(ticketId)) {
      updated = list.filter((id) => id !== ticketId);
    } else {
      updated = [...list, ticketId];
    }
    localStorage.setItem(CHECKED_IN_KEY, JSON.stringify(updated));

    // Background sync to Laravel API
    axios.patch(`${API_BASE_URL}/attendance/${ticketId}/check-in`).catch(() => {});

    return updated.includes(ticketId);
  },

  toggleSouvenir(ticketId) {
    const list = JSON.parse(localStorage.getItem(SOUVENIR_KEY) || '[]');
    let updated;
    if (list.includes(ticketId)) {
      updated = list.filter((id) => id !== ticketId);
    } else {
      updated = [...list, ticketId];
    }
    localStorage.setItem(SOUVENIR_KEY, JSON.stringify(updated));

    // Background sync to Laravel API
    axios.patch(`${API_BASE_URL}/attendance/${ticketId}/souvenir`).catch(() => {});

    return updated.includes(ticketId);
  },

  getParticipantNeeds() {
    const attendances = JSON.parse(localStorage.getItem(ATTENDANCES_KEY) || '[]');
    const checkedInList = JSON.parse(localStorage.getItem(CHECKED_IN_KEY) || '[]');
    const souvenirList = JSON.parse(localStorage.getItem(SOUVENIR_KEY) || '[]');

    return attendances.map((att) => ({
      ...att,
      isCheckedIn: checkedInList.includes(att.id),
      isSouvenirClaimed: souvenirList.includes(att.id),
      hasPassCard: true,
      hasBooklet: checkedInList.includes(att.id),
      hasPhotoboothAccess: att.kategori === 'Mahasiswa Baru' || souvenirList.includes(att.id),
    }));
  },

  // === 2. AKUN PANITIA (ADMIN CRUD) ===
  getPanitiaAccounts() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_PANITIA_ACCOUNTS;
    } catch {
      return INITIAL_PANITIA_ACCOUNTS;
    }
  },

  addPanitiaAccount(newAcc) {
    const list = this.getPanitiaAccounts();
    const colors = ['bg-[#FF3388]', 'bg-[#FFE600]', 'bg-[#00F0FF]', 'bg-[#7B2CBF]', 'bg-[#22C55E]'];
    const created = {
      id: 'user-panitia-' + Date.now(),
      status: 'active',
      avatarBg: colors[Math.floor(Math.random() * colors.length)],
      ...newAcc,
    };

    // Background sync ke Laravel API
    axios.post(`${API_BASE_URL}/panitia/accounts`, newAcc).catch(() => {});

    if (isSupabaseConfigured() && supabase) {
      try {
        supabase.from('users').insert([
          {
            name: created.nama,
            username: created.username,
            password: created.password,
            role: created.role || 'panitia',
            divisi: created.divisi,
            assigned_booth: created.assignedBooth,
            kontak: created.kontak,
            status: 'active',
            avatar_bg: created.avatarBg,
          },
        ]);
      } catch (err) {
        console.warn('Supabase insert panitia failed:', err);
      }
    }

    list.push(created);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
    return list;
  },

  updatePanitiaAccount(id, updatedData) {
    const list = this.getPanitiaAccounts();
    const updated = list.map((acc) => (acc.id === id ? { ...acc, ...updatedData } : acc));
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updated));

    // Background sync ke Laravel API
    axios.put(`${API_BASE_URL}/panitia/accounts/${id}`, updatedData).catch(() => {});

    if (isSupabaseConfigured() && supabase) {
      try {
        supabase.from('users').update(updatedData).eq('id', id);
      } catch (err) {
        console.warn('Supabase update panitia failed:', err);
      }
    }

    return updated;
  },

  deletePanitiaAccount(id) {
    const list = this.getPanitiaAccounts();
    const filtered = list.filter((acc) => acc.id !== id);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filtered));

    // Background sync ke Laravel API
    axios.delete(`${API_BASE_URL}/panitia/accounts/${id}`).catch(() => {});

    if (isSupabaseConfigured() && supabase) {
      try {
        supabase.from('users').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete panitia failed:', err);
      }
    }

    return filtered;
  },

  // === 3. TUGAS & LOGISTIK PANITIA ===
  getPanitiaTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_PANITIA_TASKS;
    } catch {
      return INITIAL_PANITIA_TASKS;
    }
  },

  toggleTask(id) {
    const list = this.getPanitiaTasks();
    const updated = list.map((task) => (task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
    localStorage.setItem(TASKS_KEY, JSON.stringify(updated));

    // Background sync ke Laravel API
    axios.patch(`${API_BASE_URL}/panitia/tasks/${id}/toggle`).catch(() => {});

    return updated;
  },

  addTask(newTask) {
    const list = this.getPanitiaTasks();
    const created = {
      id: 'task-' + Date.now(),
      isCompleted: false,
      priority: newTask.priority || 'Sedang',
      ...newTask,
    };

    // Background sync ke Laravel API
    axios.post(`${API_BASE_URL}/panitia/tasks`, newTask).catch(() => {});

    list.unshift(created);
    localStorage.setItem(TASKS_KEY, JSON.stringify(list));
    return list;
  },

  deleteTask(id) {
    const list = this.getPanitiaTasks();
    const filtered = list.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));

    // Background sync ke Laravel API
    axios.delete(`${API_BASE_URL}/panitia/tasks/${id}`).catch(() => {});

    return filtered;
  },

  // === 4. PENGUMUMAN INTERNAL ===
  getAnnouncements() {
    try {
      const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
      return raw ? JSON.parse(raw) : INITIAL_PANITIA_ANNOUNCEMENTS;
    } catch {
      return INITIAL_PANITIA_ANNOUNCEMENTS;
    }
  },

  addAnnouncement(newAnn) {
    const list = this.getAnnouncements();
    const created = {
      id: 'ann-' + Date.now(),
      waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      isPinned: false,
      ...newAnn,
    };

    // Background sync ke Laravel API
    axios.post(`${API_BASE_URL}/panitia/announcements`, newAnn).catch(() => {});

    list.unshift(created);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
    return list;
  },
};
