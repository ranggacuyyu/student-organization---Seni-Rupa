import axios from 'axios';
import { 
  INITIAL_ARTWORKS, 
  INITIAL_ATTENDANCES, 
  INITIAL_GUESTBOOKS, 
  RUNDOWN_SCHEDULE, 
  BOOTH_ZONES,
  EVENT_INFO 
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 4000,
});

// Helper: Local Storage Keys
const STORAGE_KEYS = {
  ATTENDANCES: 'senrup_attendances_v1',
  ARTWORKS: 'senrup_artworks_v1',
  LIKED_ARTWORKS: 'senrup_liked_artworks_v1',
  RUNDOWNS: 'senrup_rundowns_v1',
  GUESTBOOKS: 'senrup_guestbooks_v1',
  MY_TICKET: 'senrup_my_attendance_ticket_v1',
};

// Initialize LocalStorage with mock data if not existing
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCES)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(INITIAL_ATTENDANCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ARTWORKS)) {
    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(INITIAL_ARTWORKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RUNDOWNS)) {
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(RUNDOWN_SCHEDULE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GUESTBOOKS)) {
    localStorage.setItem(STORAGE_KEYS.GUESTBOOKS, JSON.stringify(INITIAL_GUESTBOOKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIKED_ARTWORKS)) {
    localStorage.setItem(STORAGE_KEYS.LIKED_ARTWORKS, JSON.stringify([]));
  }
};

initStorage();

/**
 * Deteksi IP dan Device Client secara pintar
 */
export const detectClientInfo = async () => {
  let ipAddress = '180.254.88.99'; // default fallback IP Batam
  try {
    const res = await axios.get('https://api64.ipify.org?format=json', { timeout: 2500 });
    if (res.data && res.data.ip) {
      ipAddress = res.data.ip;
    }
  } catch (err) {
    console.log('Using simulated local network IP:', ipAddress);
  }

  const userAgent = navigator.userAgent;
  let deviceType = 'Desktop';
  if (/Android/i.test(userAgent)) deviceType = 'Mobile (Android)';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) deviceType = 'Mobile (iOS)';
  else if (/Macintosh/i.test(userAgent)) deviceType = 'Desktop (macOS)';
  else if (/Windows/i.test(userAgent)) deviceType = 'Desktop (Windows)';
  else if (/Linux/i.test(userAgent)) deviceType = 'Desktop (Linux)';

  return {
    ip_address: ipAddress,
    user_agent: userAgent,
    device_type: deviceType,
  };
};

/**
 * Service Presensi (Attendance)
 */
export const AttendanceService = {
  async submitAttendance(data) {
    const clientInfo = await detectClientInfo();
    const payload = {
      ...data,
      ip_address: data.ip_address || clientInfo.ip_address,
      user_agent: clientInfo.user_agent,
      device_type: clientInfo.device_type,
      waktu_kehadiran: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    try {
      const response = await apiClient.post('/attendance', payload);
      const result = response.data;
      localStorage.setItem(STORAGE_KEYS.MY_TICKET, JSON.stringify(result.data || payload));
      return result;
    } catch (err) {
      // Offline / Standalone Mock Persistence
      console.log('Backend not reachable, saving to local storage mock');
      const currentList = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCES) || '[]');
      const newEntry = {
        id: 'att-' + Date.now(),
        ...payload,
      };
      currentList.unshift(newEntry);
      localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(currentList));
      localStorage.setItem(STORAGE_KEYS.MY_TICKET, JSON.stringify(newEntry));
      return {
        success: true,
        message: 'Presensi berhasil dicatat! Selamat datang di Art Showcase.',
        data: newEntry,
      };
    }
  },

  async getAllAttendances() {
    try {
      const response = await apiClient.get('/admin/attendances');
      return response.data.data;
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCES) || '[]');
    }
  },

  getMyTicket() {
    const ticket = localStorage.getItem(STORAGE_KEYS.MY_TICKET);
    return ticket ? JSON.parse(ticket) : null;
  }
};

/**
 * Service Katalog Karya (Artworks)
 */
export const ArtworkService = {
  async getAllArtworks() {
    try {
      const res = await apiClient.get('/artworks');
      return res.data.data;
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTWORKS) || '[]');
    }
  },

  async getArtworkBySlug(slug) {
    const all = await this.getAllArtworks();
    return all.find(a => a.slug === slug || a.id === slug) || null;
  },

  async toggleLike(artworkId) {
    const likedList = JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_ARTWORKS) || '[]');
    const isAlreadyLiked = likedList.includes(artworkId);

    try {
      await apiClient.post(`/artworks/${artworkId}/like`, { isLiked: !isAlreadyLiked });
    } catch (e) {
      // Mock Fallback
    }

    const currentArtworks = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTWORKS) || '[]');
    const updated = currentArtworks.map(art => {
      if (art.id === artworkId) {
        return {
          ...art,
          likesCount: isAlreadyLiked ? Math.max(0, art.likesCount - 1) : art.likesCount + 1
        };
      }
      return art;
    });

    localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(updated));

    if (isAlreadyLiked) {
      const filtered = likedList.filter(id => id !== artworkId);
      localStorage.setItem(STORAGE_KEYS.LIKED_ARTWORKS, JSON.stringify(filtered));
      return { isLiked: false, updatedList: updated };
    } else {
      likedList.push(artworkId);
      localStorage.setItem(STORAGE_KEYS.LIKED_ARTWORKS, JSON.stringify(likedList));
      return { isLiked: true, updatedList: updated };
    }
  },

  getLikedIds() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_ARTWORKS) || '[]');
  },

  async addArtwork(newArt) {
    try {
      const res = await apiClient.post('/admin/artworks', newArt);
      return res.data.data;
    } catch (err) {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARTWORKS) || '[]');
      const created = {
        id: 'art-' + Date.now(),
        slug: newArt.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        likesCount: 0,
        ...newArt
      };
      list.unshift(created);
      localStorage.setItem(STORAGE_KEYS.ARTWORKS, JSON.stringify(list));
      return created;
    }
  }
};

/**
 * Service Rundown Acara
 */
export const RundownService = {
  async getRundowns() {
    try {
      const res = await apiClient.get('/rundown');
      return res.data.data;
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.RUNDOWNS) || '[]');
    }
  },

  async updateStatus(id, newStatus) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.RUNDOWNS) || '[]');
    const updated = list.map(item => item.id === id ? { ...item, status: newStatus } : item);
    localStorage.setItem(STORAGE_KEYS.RUNDOWNS, JSON.stringify(updated));
    return updated;
  }
};

/**
 * Service Guestbook (Kesan & Pesan)
 */
export const GuestbookService = {
  async getMessages() {
    try {
      const res = await apiClient.get('/guestbook');
      return res.data.data;
    } catch (err) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.GUESTBOOKS) || '[]');
    }
  },

  async addMessage(msg) {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.GUESTBOOKS) || '[]');
    const colors = ['bg-[#FFE600]', 'bg-[#FF3388]', 'bg-[#00F0FF]', 'bg-[#CCFF00]', 'bg-[#FF6B35]'];
    const stickers = ['retro-star', 'retro-heart', 'retro-brush', 'retro-smile'];
    
    const newEntry = {
      id: 'gb-' + Date.now(),
      name: msg.name,
      role: msg.role || 'Pengunjung',
      message: msg.message,
      sticker: msg.sticker || stickers[Math.floor(Math.random() * stickers.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      textColor: msg.color === 'bg-[#FF3388]' ? 'text-white' : 'text-black',
      createdAt: 'Baru saja'
    };

    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.GUESTBOOKS, JSON.stringify(list));
    return newEntry;
  }
};
