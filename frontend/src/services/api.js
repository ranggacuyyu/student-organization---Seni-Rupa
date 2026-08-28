/**
 * 🎨 ART SHOW CASE "HISTORY" - UNIFIED API & DATABASE GATEWAY
 * Standar Rekayasa Perangkat Lunak: Modular Service Layer & Zero Hardcoded Secret
 * Sesuai Dokumen: BLUEPRINT_ART_SHOWCASE.md & Kerapian kode.md
 */
import axios from 'axios';
import { supabase, isSupabaseConfigured, testDatabaseConnection } from './supabaseClient';
import { AttendanceDb } from './db/attendanceDb';
import { ArtworkDb } from './db/artworkDb';
import { RundownDb } from './db/rundownDb';
import { GuestbookDb } from './db/guestbookDb';
import { AuthDb } from './db/authDb';
import { PanitiaDb } from './db/panitiaDb';
import { BoothDb } from './db/boothDb';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Axios Instance untuk integrasi opsional Laravel REST API
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 5000,
});

/**
 * Deteksi IP Address dan Tipe Perangkat Client
 * Sesuai Aturan: BLUEPRINT_ART_SHOWCASE.md (Attendance & IP Logging)
 */
export const detectClientInfo = async () => {
  // 1. Coba deteksi via Backend Laravel API
  try {
    const res = await apiClient.get('/client-info');
    if (res.data && res.data.ipAddress) {
      return {
        ipAddress: res.data.ipAddress,
        userAgent: res.data.userAgent || navigator.userAgent,
        deviceType: res.data.deviceType || 'Desktop',
      };
    }
  } catch {
    // Lanjut ke fallback
  }

  // 2. Fallback via ipify & browser navigator
  let ipAddress = '180.254.88.99'; // Default Batam fallback IP
  try {
    const res = await axios.get('https://api64.ipify.org?format=json', { timeout: 2500 });
    if (res.data && res.data.ip) {
      ipAddress = res.data.ip;
    }
  } catch (err) {
    console.log('Menggunakan simulated network IP:', ipAddress);
  }

  const userAgent = navigator.userAgent;
  let deviceType = 'Desktop';
  if (/Android/i.test(userAgent)) deviceType = 'Mobile (Android)';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) deviceType = 'Mobile (iOS)';
  else if (/Macintosh/i.test(userAgent)) deviceType = 'Desktop (macOS)';
  else if (/Windows/i.test(userAgent)) deviceType = 'Desktop (Windows)';
  else if (/Linux/i.test(userAgent)) deviceType = 'Desktop (Linux)';

  return { ipAddress, userAgent, deviceType };
};

// ================= RE-EXPORT MODULAR DATABASE SERVICES =================
export const AttendanceService = AttendanceDb;
export const ArtworkService = ArtworkDb;
export const RundownService = RundownDb;
export const GuestbookService = GuestbookDb;
export const AuthService = AuthDb;
export const PanitiaService = PanitiaDb;
export const BoothService = BoothDb;

export { supabase, isSupabaseConfigured, testDatabaseConnection };
