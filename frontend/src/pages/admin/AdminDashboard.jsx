import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  ShieldCheck, 
  Users, 
  Wifi, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Palette, 
  Clock, 
  CheckCircle2, 
  Smartphone, 
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  KeyRound,
  Shield,
  Megaphone,
  Calendar,
  ClipboardList,
  CheckSquare,
  LogOut,
  MapPin,
  Send,
  Save,
  RotateCcw,
  BarChart3,
  EyeOff,
  Database,
  Circle
} from 'lucide-react';
import { BOOTH_ZONES, INITIAL_PANITIA_SHIFTS } from '../../data/mockData';
import { ArtworkService, PanitiaService, testDatabaseConnection, isSupabaseConfigured } from '../../services/api';
import { seedArtworksToSupabase, countSupabaseArtworks, clearAllSupabaseArtworks } from '../../utils/seedArtworksToSupabase';

export default function AdminDashboard({ 
  currentUser,
  onLogout,
  attendances, 
  artworks, 
  rundowns, 
  onRefreshData,
  onUpdateRundownStatus 
}) {
  const containerRef = useRef(null);
  const tabContentRef = useRef(null);

  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'logistics' | 'master' | 'artworks'
  
  // Panitia Accounts State
  const [panitiaAccounts, setPanitiaAccounts] = useState(() => PanitiaService.getPanitiaAccounts());
  const [isAddingPanitia, setIsAddingPanitia] = useState(false);
  const [newPanitia, setNewPanitia] = useState({
    username: '',
    password: '',
    nama: '',
    role: 'panitia',
    divisi: 'Divisi Registrasi & Presensi',
    assignedBooth: 'Pintu Masuk (Lobby Lt. 3)',
    kontak: '',
  });

  // Panitia Tasks & Announcements State
  const [tasks, setTasks] = useState(() => PanitiaService.getPanitiaTasks());
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    location: 'Zona A - Galeri Lukis',
    assignedTo: 'Samuel Siregar',
    priority: 'Sedang',
    category: 'Display Seni'
  });

  const [announcements, setAnnouncements] = useState(() => PanitiaService.getAnnouncements());
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState({
    isConnected: null,
    message: 'Memeriksa koneksi database...',
  });

  useEffect(() => {
    const checkConnection = async () => {
      const result = await testDatabaseConnection();
      setDbStatus(result);
    };
    checkConnection();
  }, []);

  // Attendance Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // New Artwork Form State
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: '',
    artistNim: '',
    artistBatch: '2024',
    isAnonymous: false,
    category: 'Lukis',
    medium: 'Acrylic on Canvas',
    dimensions: '100 x 80 cm',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    description: '',
    boothId: 'booth-a',
    boothName: 'Zona A - Galeri Lukis Sejarah',
    tags: 'Retro Pop, History'
  });
  const [isAddingArt, setIsAddingArt] = useState(false);

  // Supabase Seeder State
  const [seedStatus, setSeedStatus] = useState({ isSeeding: false, progress: '', result: null });
  const [supabaseArtCount, setSupabaseArtCount] = useState(null);

  // Filtered Attendances
  const filteredAttendances = useMemo(() => {
    return attendances.filter((att) => {
      const matchCat = filterCategory === 'Semua' || att.kategori === filterCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        att.nama_lengkap?.toLowerCase().includes(q) ||
        att.identifier?.toLowerCase().includes(q) ||
        att.ip_address?.toLowerCase().includes(q) ||
        att.jurusan_prodi?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [attendances, filterCategory, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = attendances.length;
    const maba = attendances.filter(a => a.kategori === 'Mahasiswa Baru').length;
    const uniqueIps = new Set(attendances.map(a => a.ip_address)).size;
    const activePanitia = panitiaAccounts.filter(p => p.status === 'active').length;
    return { total, maba, uniqueIps, activePanitia };
  }, [attendances, panitiaAccounts]);

  // Entrance animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.admin-header-banner',
        { y: -30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.admin-metric-card',
        { y: 25, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)', delay: 0.15 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isFirstTabRender = useRef(true);
  useEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false;
      return;
    }
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  // === PANITIA ACCOUNTS ACTIONS ===
  const handleAddPanitia = (e) => {
    e.preventDefault();
    if (!newPanitia.username || !newPanitia.password || !newPanitia.nama) return;

    const updated = PanitiaService.addPanitiaAccount(newPanitia);
    setPanitiaAccounts(updated);
    setIsAddingPanitia(false);
    setNewPanitia({
      username: '',
      password: '',
      nama: '',
      role: 'panitia',
      divisi: 'Divisi Registrasi & Presensi',
      assignedBooth: 'Pintu Masuk (Lobby Lt. 3)',
      kontak: '',
    });
  };

  const handleTogglePanitiaStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const updated = PanitiaService.updatePanitiaAccount(id, { status: nextStatus });
    setPanitiaAccounts(updated);
  };

  const handleDeletePanitia = (id, nama) => {
    if (confirm(`Yakin ingin menghapus akun panitia "${nama}"?`)) {
      const updated = PanitiaService.deletePanitiaAccount(id);
      setPanitiaAccounts(updated);
    }
  };

  // === TASKS & ANNOUNCEMENTS ACTIONS ===
  const handleToggleTask = (taskId) => {
    const updated = PanitiaService.toggleTask(taskId);
    setTasks(updated);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    const updated = PanitiaService.addTask(newTask);
    setTasks(updated);
    setIsAddingTask(false);
    setNewTask({
      title: '',
      location: 'Zona A - Galeri Lukis',
      assignedTo: panitiaAccounts[0]?.nama || 'Petugas',
      priority: 'Sedang',
      category: 'Display Seni'
    });
  };

  const handleDeleteTask = (taskId) => {
    const updated = PanitiaService.deleteTask(taskId);
    setTasks(updated);
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncementTitle || !newAnnouncementText) return;
    const updated = PanitiaService.addAnnouncement({
      title: newAnnouncementTitle,
      content: newAnnouncementText,
      author: currentUser?.nama || 'Super Admin'
    });
    setAnnouncements(updated);
    setNewAnnouncementTitle('');
    setNewAnnouncementText('');
  };

  // === ARTWORK ACTIONS ===
  const handleAddArtwork = async (e) => {
    e.preventDefault();
    await ArtworkService.addArtwork(newArtwork);
    setIsAddingArt(false);
    onRefreshData && onRefreshData();
  };

  // === SUPABASE SEEDER ACTIONS ===
  const handleSeedToSupabase = async (resetFirst = false) => {
    if (seedStatus.isSeeding) return;
    const confirmMsg = resetFirst
      ? 'Ini akan MENGHAPUS semua karya lama di Supabase dan mengisinya dengan 160+ data dummy baru. Lanjutkan?'
      : 'Ini akan menambahkan 160+ karya dummy ke Supabase (data lama tetap ada). Lanjutkan?';
    if (!confirm(confirmMsg)) return;

    setSeedStatus({ isSeeding: true, progress: 'Memulai proses seed...', result: null });

    try {
      const result = await seedArtworksToSupabase({
        clearExisting: clearFirst,
        onProgress: (current, total, message) => {
          setSeedStatus(prev => ({ ...prev, progress: message }));
        },
      });
      setSeedStatus({ isSeeding: false, progress: '', result });
      // Refresh data setelah seed
      if (result.success && onRefreshData) {
        onRefreshData();
      }
      // Update count
      const counts = await countSupabaseArtworks();
      setSupabaseArtCount(counts);
    } catch (err) {
      setSeedStatus({ isSeeding: false, progress: '', result: { success: false, message: `Error: ${err.message}` } });
    }
  };

  const handleCheckSupabaseCount = async () => {
    const counts = await countSupabaseArtworks();
    setSupabaseArtCount(counts);
  };

  const handleClearSupabaseArtworks = async () => {
    if (!confirm('PERINGATAN: Ini akan menghapus SEMUA karya seni dari database Supabase. Tindakan ini tidak dapat dibatalkan. Yakin?')) return;
    setSeedStatus({ isSeeding: true, progress: 'Menghapus semua karya...', result: null });
    const result = await clearAllSupabaseArtworks();
    setSeedStatus({ isSeeding: false, progress: '', result: { success: result.success, message: result.message, inserted: 0, errors: result.success ? 0 : 1 } });
    if (result.success && onRefreshData) onRefreshData();
    const counts = await countSupabaseArtworks();
    setSupabaseArtCount(counts);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (attendances.length === 0) {
      alert('Belum ada data presensi untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Nama Lengkap', 'NIM / Identitas', 'Kategori', 'Jurusan / Prodi', 'IP Address', 'Perangkat / Browser', 'Waktu Kehadiran', 'Catatan'];
    const rows = attendances.map(a => [
      `"${a.id || ''}"`,
      `"${a.nama_lengkap || ''}"`,
      `"${a.identifier || ''}"`,
      `"${a.kategori || ''}"`,
      `"${a.jurusan_prodi || ''}"`,
      `"${a.ip_address || ''}"`,
      `"${a.device_type || ''}"`,
      `"${a.waktu_kehadiran || ''}"`,
      `"${(a.catatan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_presensi_art_showcase_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* ================= HEADER BANNER ================= */}
      <div className="admin-header-banner bg-[#121212] text-white border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden bg-retro-dots">
        <div className="space-y-1.5 relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-[#FF3388] text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 rounded-lg border border-black uppercase shadow-retro-sm flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-white" /> SUPER ADMIN CONTROL PANEL
            </span>
            <span className="bg-[#FFE600] text-black font-mono text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded border border-black truncate">
              Koordinator Utama
            </span>
          </div>
          <h1 className="font-display font-black text-xl sm:text-4xl text-white leading-tight">
            Pusat Kontrol & Manajemen Panitia
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-medium">
            Kelola akun panitia, checklist logistik acara, jadwal shift, dan pantau master data pameran secara real-time.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2.5 sm:gap-3 relative z-10 w-full md:w-auto">
          {/* Database Connection Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold w-full md:w-auto justify-center ${
            dbStatus.isConnected === null
              ? 'bg-neutral-700 border-neutral-500 text-neutral-300'
              : dbStatus.isConnected
              ? 'bg-green-900 border-green-400 text-green-300'
              : 'bg-yellow-900 border-yellow-400 text-yellow-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              dbStatus.isConnected === null ? 'bg-neutral-400 animate-pulse' :
              dbStatus.isConnected ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-yellow-400'
            }`} />
            {dbStatus.isConnected === null ? 'Memeriksa Database...' :
             dbStatus.isConnected ? 'Cloud Supabase (Online)' : 'Local Engine (Offline Mode)'}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-retro-white text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 w-full md:w-auto active:scale-95"
            >
              <LogOut className="w-4 h-4 text-red-500 shrink-0" />
              <span>Keluar (Logout)</span>
            </button>
          )}
        </div>
      </div>

      {/* ================= SUMMARY STATS CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="admin-metric-card card-retro p-3.5 sm:p-5 bg-white space-y-1 hover:-translate-y-1 transition-transform">
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5 truncate">
            <Shield className="w-3.5 h-3.5 text-[#FF3388] shrink-0" /> Total Akun Panitia
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-black">{panitiaAccounts.length} Akun</div>
          <span className="text-[9px] sm:text-[10px] text-green-600 font-bold block truncate">{metrics.activePanitia} Aktif bertugas</span>
        </div>

        <div className="admin-metric-card card-retro p-3.5 sm:p-5 bg-white space-y-1 hover:-translate-y-1 transition-transform">
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-[#FFE600] shrink-0" /> Pengunjung
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-[#FF3388]">{metrics.total} Orang</div>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-semibold block truncate">{metrics.maba} Maba</span>
        </div>

        <div className="admin-metric-card card-retro p-3.5 sm:p-5 bg-white space-y-1 hover:-translate-y-1 transition-transform">
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5 truncate">
            <Wifi className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" /> IP Address
          </span>
          <div className="font-display font-black text-2xl sm:text-3xl text-[#00F0FF]">{metrics.uniqueIps}</div>
          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-semibold block truncate">Validitas jaringan</span>
        </div>

        <div className="admin-metric-card card-retro p-3.5 sm:p-5 bg-white space-y-1 hover:-translate-y-1 transition-transform">
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5 truncate">
            <Palette className="w-3.5 h-3.5 text-[#7B2CBF] shrink-0" /> Total Karya
          </span>
          <div className="font-display font-black text-3xl text-[#7B2CBF]">{artworks.length}</div>
          <span className="text-[10px] text-neutral-400 font-semibold">Di Student Centre Lt. 3</span>
        </div>
      </div>

      {/* ================= ADMIN NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b-3 border-black pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Akun Panitia ({panitiaAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'logistics'
              ? 'bg-[#FF3388] text-white border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Kebutuhan & Logistik Panitia</span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'master'
              ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Master Data Presensi & IP ({attendances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'artworks'
              ? 'bg-[#7B2CBF] text-white border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Katalog Karya Seni ({artworks.length})</span>
        </button>
      </div>

      {/* ================= DYNAMIC TAB CONTENTS ================= */}
      <div ref={tabContentRef}>

        {/* ================= TAB 1: KELOLA AKUN PANITIA ================= */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-2xl text-black">
                  Daftar Akun Panitia & Koordinator
                </h3>
                <p className="text-xs text-neutral-500 font-semibold">
                  Atur hak akses login, divisi, dan penugasan booth panitia di lantai 3.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPanitia(!isAddingPanitia)}
                className="btn-retro-yellow text-xs sm:text-sm px-4 py-2.5 flex items-center gap-1.5 active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isAddingPanitia ? 'Tutup Form' : 'Tambah Panitia Baru'}</span>
              </button>
            </div>

            {/* New Panitia Form */}
            {isAddingPanitia && (
              <form onSubmit={handleAddPanitia} className="card-retro p-6 bg-white space-y-4 animate-in zoom-in-95">
                <h4 className="font-display font-black text-lg text-black border-b-2 border-neutral-200 pb-2 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#FF3388]" />
                  <span>Formulir Tambah Akun Panitia Baru</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={newPanitia.nama}
                      onChange={(e) => setNewPanitia({ ...newPanitia, nama: e.target.value })}
                      placeholder="Contoh: Budi Santoso"
                      required
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Username Login *</label>
                    <input
                      type="text"
                      value={newPanitia.username}
                      onChange={(e) => setNewPanitia({ ...newPanitia, username: e.target.value })}
                      placeholder="Contoh: panitia_stand1"
                      required
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Password *</label>
                    <input
                      type="text"
                      value={newPanitia.password}
                      onChange={(e) => setNewPanitia({ ...newPanitia, password: e.target.value })}
                      placeholder="Contoh: panitia123"
                      required
                      className="input-retro text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Divisi Panitia</label>
                    <select
                      value={newPanitia.divisi}
                      onChange={(e) => setNewPanitia({ ...newPanitia, divisi: e.target.value })}
                      className="input-retro text-xs sm:text-sm bg-white"
                    >
                      <option value="Divisi Registrasi & Presensi">Divisi Registrasi & Presensi</option>
                      <option value="Divisi Acara & Rundown">Divisi Acara & Rundown</option>
                      <option value="Divisi Perlengkapan & Display">Divisi Perlengkapan & Display</option>
                      <option value="Divisi Suvenir & Photobooth">Divisi Suvenir & Photobooth</option>
                      <option value="Divisi Dokumentasi & Publikasi">Divisi Dokumentasi & Publikasi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Penugasan Booth / Lokasi</label>
                    <input
                      type="text"
                      value={newPanitia.assignedBooth}
                      onChange={(e) => setNewPanitia({ ...newPanitia, assignedBooth: e.target.value })}
                      placeholder="Contoh: Zona A - Galeri Lukis"
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">No. WhatsApp / Kontak</label>
                    <input
                      type="text"
                      value={newPanitia.kontak}
                      onChange={(e) => setNewPanitia({ ...newPanitia, kontak: e.target.value })}
                      placeholder="Contoh: 0812-xxxx-xxxx"
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingPanitia(false)}
                    className="btn-retro-white text-xs px-4 py-2"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-retro-yellow text-xs px-6 py-2 flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Akun Panitia</span>
                  </button>
                </div>
              </form>
            )}

            {/* Accounts Table */}
            <div className="card-retro bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7EE] border-b-2 border-black font-display font-black text-black">
                      <th className="py-3.5 px-4">Nama & Akun</th>
                      <th className="py-3.5 px-4">Role / Peran</th>
                      <th className="py-3.5 px-4">Divisi</th>
                      <th className="py-3.5 px-4">Penugasan Stand</th>
                      <th className="py-3.5 px-4">Kontak</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {panitiaAccounts.map((acc) => (
                      <tr key={acc.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl border border-black flex items-center justify-center font-black text-xs ${acc.avatarBg || 'bg-[#FFE600]'}`}>
                              {acc.nama.charAt(0)}
                            </div>
                            <div>
                              <strong className="font-bold text-black block">{acc.nama}</strong>
                              <span className="font-mono text-[11px] text-neutral-500">@{acc.username}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-black ${
                            acc.role === 'admin' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'
                          }`}>
                            {acc.role === 'admin' ? 'SUPER ADMIN' : 'PANITIA'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-neutral-700">
                          {acc.divisi}
                        </td>

                        <td className="py-3.5 px-4 font-medium text-neutral-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#FF3388]" />
                            {acc.assignedBooth}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-600">
                          {acc.kontak || '-'}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePanitiaStatus(acc.id, acc.status)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 ${
                              acc.status === 'active'
                                ? 'bg-[#22C55E]/20 text-[#22C55E] border-black'
                                : 'bg-neutral-200 text-neutral-500 border-neutral-400'
                            }`}
                          >
                            <Circle className={`w-2 h-2 rounded-full ${acc.status === 'active' ? 'bg-[#22C55E] fill-[#22C55E]' : 'bg-neutral-500'}`} />
                            <span>{acc.status === 'active' ? 'Aktif' : 'Non-Aktif'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {acc.role !== 'admin' && (
                            <button
                              onClick={() => handleDeletePanitia(acc.id, acc.nama)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: KEBUTUHAN & LOGISTIK PANITIA ================= */}
        {activeTab === 'logistics' && (
          <div className="space-y-8">
            
            {/* 1. Broadcast Announcement Bar */}
            <div className="card-retro p-6 bg-white space-y-4">
              <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#FF3388]" />
                <span>Broadcast Pengumuman Internal Panitia</span>
              </h3>

              <form onSubmit={handleAddAnnouncement} className="space-y-3">
                <input
                  type="text"
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                  placeholder="Judul Pengumuman (Contoh: Briefing Evaluasi Sesi Siang)..."
                  required
                  className="input-retro text-xs sm:text-sm font-bold"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAnnouncementText}
                    onChange={(e) => setNewAnnouncementText(e.target.value)}
                    placeholder="Isi pesan broadcast untuk seluruh panitia..."
                    required
                    className="input-retro text-xs sm:text-sm flex-1"
                  />
                  <button type="submit" className="btn-retro-pink px-5 py-2 text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
                    <Send className="w-4 h-4" />
                    <span>Kirim Broadcast</span>
                  </button>
                </div>
              </form>

              {/* Announcements List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-3.5 bg-[#FAF7EE] border-2 border-black rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-black">{ann.title}</span>
                      <span className="font-mono text-[10px] text-neutral-500">{ann.waktu}</span>
                    </div>
                    <p className="text-xs text-neutral-700">{ann.content}</p>
                    <span className="text-[10px] text-neutral-500 font-semibold block pt-1">Oleh: {ann.author}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tasks & Logistics Checklist */}
            <div className="card-retro p-6 sm:p-8 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#7B2CBF]" />
                  <span>Checklist Kebutuhan & Tugas Lapangan</span>
                </h3>
                <button
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  className="btn-retro-yellow text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Tugas</span>
                </button>
              </div>

              {isAddingTask && (
                <form onSubmit={handleAddTask} className="p-4 bg-[#FAF7EE] border-2 border-black rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Nama Tugas / Kebutuhan..."
                      required
                      className="input-retro text-xs"
                    />
                    <input
                      type="text"
                      value={newTask.location}
                      onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                      placeholder="Lokasi (Contoh: Zona A)"
                      required
                      className="input-retro text-xs"
                    />
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="input-retro text-xs bg-white"
                    >
                      {panitiaAccounts.map(p => (
                        <option key={p.id} value={p.nama}>{p.nama} ({p.divisi.split(' ')[1]})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAddingTask(false)} className="btn-retro-white text-xs px-3 py-1">Batal</button>
                    <button type="submit" className="btn-retro-pink text-xs px-4 py-1">Simpan Tugas</button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border-2 border-black flex items-center justify-between gap-3 ${
                      task.isCompleted ? 'bg-[#FAF7EE] opacity-75' : 'bg-white shadow-retro-sm'
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <div className={`p-1 rounded-lg border border-black ${task.isCompleted ? 'bg-[#22C55E] text-white' : 'bg-white'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className={`font-display font-bold text-sm text-black ${task.isCompleted ? 'line-through text-neutral-500' : ''}`}>
                          {task.title}
                        </h5>
                        <p className="text-xs text-neutral-500 font-semibold">
                          Lokasi: {task.location} • Penanggung Jawab: <strong>{task.assignedTo}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-black bg-[#FFE600]">
                        {task.category || 'Logistik'}
                      </span>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Shift Schedule */}
            <div className="card-retro p-6 sm:p-8 bg-white space-y-4">
              <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00F0FF]" />
                <span>Jadwal Shift Jaga Stand & Gate Panitia</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_PANITIA_SHIFTS.map((shift) => (
                  <div key={shift.id} className="p-5 bg-[#FAF7EE] border-2 border-black rounded-2xl space-y-3">
                    <div>
                      <span className="font-mono text-xs font-bold bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                        {shift.waktu}
                      </span>
                      <h4 className="font-display font-black text-base text-black mt-2">{shift.namaShift}</h4>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-300 text-xs">
                      {shift.petugas.map((ptg, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-bold text-black">{ptg.nama}</span>
                          <span className="text-[10px] text-neutral-500">{ptg.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: MASTER DATA PRESENSI & IP ================= */}
        {activeTab === 'master' && (
          <div className="space-y-6">
            
            {/* Actions Bar */}
            <div className="card-retro p-4 sm:p-5 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari Nama, NIM, atau IP..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Mahasiswa Baru">Mahasiswa Baru</option>
                  <option value="Mahasiswa Polibatam">Mahasiswa Polibatam</option>
                  <option value="Dosen/Staff">Dosen/Staff</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <button
                onClick={handleExportCSV}
                className="btn-retro-yellow text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Rekap CSV / Excel</span>
              </button>
            </div>

            {/* Attendance Table */}
            <div className="card-retro bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7EE] border-b-2 border-black font-display font-black text-black">
                      <th className="py-3.5 px-4">Nama Lengkap</th>
                      <th className="py-3.5 px-4">NIM / Identitas</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Program Studi</th>
                      <th className="py-3.5 px-4">IP Address Log</th>
                      <th className="py-3.5 px-4">Perangkat</th>
                      <th className="py-3.5 px-4">Waktu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredAttendances.map((att) => (
                      <tr key={att.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 font-bold text-black">{att.nama_lengkap}</td>
                        <td className="py-3 px-4 font-mono font-bold text-neutral-700">{att.identifier || '-'}</td>
                        <td className="py-3 px-4">
                          <span className="bg-[#FAF7EE] px-2 py-0.5 rounded border border-black text-[10px] font-bold">
                            {att.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-600">{att.jurusan_prodi || 'Polibatam'}</td>
                        <td className="py-3 px-4 font-mono font-bold bg-[#00F0FF]/15 text-black">{att.ip_address}</td>
                        <td className="py-3 px-4 text-neutral-500">{att.device_type || 'Desktop'}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{att.waktu_kehadiran}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: KATALOG KARYA SENI ================= */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="font-display font-black text-2xl text-black">Daftar Karya Seni Pameran</h3>
              <button
                onClick={() => setIsAddingArt(!isAddingArt)}
                className="btn-retro-pink text-xs sm:text-sm px-4 py-2.5 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingArt ? 'Tutup Form' : 'Tambah Karya Baru'}</span>
              </button>
            </div>

            {/* ===== SUPABASE SEEDER PANEL ===== */}
            <div className="card-retro p-5 bg-gradient-to-br from-purple-50 to-blue-50 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#7B2CBF]" />
                <h4 className="font-display font-black text-base text-black">Seed Data Dummy ke Supabase</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Generate dan upload 160+ karya seni dummy (12 pencipta × 10-20 karya per pencipta) langsung ke database Supabase.
                Setiap pencipta memiliki karya di 3 kategori: Lukis, Kerajinan, Sketsa & Ilustrasi.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSeedToSupabase(false)}
                  disabled={seedStatus.isSeeding || !isSupabaseConfigured()}
                  className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs border-2 border-black flex items-center gap-2 transition-all active:scale-95 ${
                    seedStatus.isSeeding ? 'bg-neutral-300 text-neutral-500 cursor-wait' : 'bg-[#22C55E] text-white hover:bg-green-600 shadow-retro-sm'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{seedStatus.isSeeding ? 'Sedang Proses...' : 'Seed Karya (Tambah)'}</span>
                </button>
                <button
                  onClick={() => handleSeedToSupabase(true)}
                  disabled={seedStatus.isSeeding || !isSupabaseConfigured()}
                  className={`px-4 py-2.5 rounded-xl font-display font-bold text-xs border-2 border-black flex items-center gap-2 transition-all active:scale-95 ${
                    seedStatus.isSeeding ? 'bg-neutral-300 text-neutral-500 cursor-wait' : 'bg-[#FF6B35] text-white hover:bg-orange-600 shadow-retro-sm'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset & Seed Ulang</span>
                </button>
                <button
                  onClick={handleCheckSupabaseCount}
                  disabled={!isSupabaseConfigured()}
                  className="px-4 py-2.5 rounded-xl font-display font-bold text-xs border-2 border-black bg-[#00F0FF] text-black hover:bg-cyan-400 shadow-retro-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Cek Jumlah di Supabase</span>
                </button>
                <button
                  onClick={handleClearSupabaseArtworks}
                  disabled={seedStatus.isSeeding || !isSupabaseConfigured()}
                  className="px-4 py-2.5 rounded-xl font-display font-bold text-xs border-2 border-black bg-red-500 text-white hover:bg-red-600 shadow-retro-sm flex items-center gap-2 transition-all active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Semua dari Supabase</span>
                </button>
              </div>

              {!isSupabaseConfigured() && (
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 text-xs text-yellow-800 font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Supabase belum dikonfigurasi. Isi <code className="bg-yellow-200 px-1 rounded">VITE_SUPABASE_URL</code> dan <code className="bg-yellow-200 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> di file <code className="bg-yellow-200 px-1 rounded">.env</code></span>
                </div>
              )}

              {/* Seed Progress */}
              {seedStatus.isSeeding && (
                <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-3 text-xs text-blue-800 font-bold flex items-center gap-2">
                  <span className="animate-spin">⏳</span> {seedStatus.progress}
                </div>
              )}

              {/* Seed Result */}
              {seedStatus.result && (
                <div className={`border-2 rounded-xl p-3 text-xs font-bold ${
                  seedStatus.result.success
                    ? 'bg-green-100 border-green-400 text-green-800'
                    : 'bg-red-100 border-red-400 text-red-800'
                }`}>
                  {seedStatus.result.message}
                </div>
              )}

              {/* Supabase Count Display */}
              {supabaseArtCount && (
                <div className="bg-white border-2 border-black/20 rounded-xl p-4 space-y-2">
                  <div className="font-display font-black text-sm text-black">
                    Total Karya di Supabase: <span className="text-[#7B2CBF]">{supabaseArtCount.total}</span>
                  </div>
                  {supabaseArtCount.byCategory && Object.keys(supabaseArtCount.byCategory).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(supabaseArtCount.byCategory).map(([cat, count]) => (
                        <span key={cat} className="bg-[#FAF7EE] border border-black/20 px-2.5 py-1 rounded-lg text-[11px] font-bold text-neutral-700">
                          {cat}: <span className="text-[#FF3388]">{count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                  {supabaseArtCount.byCreator && Object.keys(supabaseArtCount.byCreator).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer font-bold text-neutral-600 hover:text-black">Detail per Pencipta ({Object.keys(supabaseArtCount.byCreator).length} seniman)</summary>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {Object.entries(supabaseArtCount.byCreator).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
                          <span key={name} className="bg-neutral-50 border border-neutral-200 px-2 py-1 rounded text-[10px] truncate">
                            {name}: <strong>{count}</strong>
                          </span>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>

            {/* New Artwork Form */}
            {isAddingArt && (
              <form onSubmit={handleAddArtwork} className="card-retro p-6 bg-white space-y-4">
                <h4 className="font-display font-bold text-lg text-black border-b-2 border-neutral-200 pb-2">
                  Formulir Tambah Karya Baru
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Judul Karya *</label>
                    <input
                      type="text"
                      value={newArtwork.title}
                      onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                      placeholder="Contoh: Senandung Hang Nadim"
                      required
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Nama Seniman / Pembuat *</label>
                    <input
                      type="text"
                      value={newArtwork.artist}
                      onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                      placeholder={newArtwork.isAnonymous ? "Pencipta Dirahasiakan" : "Contoh: Rangga & Tim Seni Rupa"}
                      required
                      className="input-retro text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-black">Kategori Karya *</label>
                    <select
                      value={newArtwork.category}
                      onChange={(e) => setNewArtwork({ ...newArtwork, category: e.target.value })}
                      className="input-retro text-xs sm:text-sm"
                    >
                      <option value="Lukis">Lukis</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Sketsa & Ilustrasi">Sketsa & Ilustrasi</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer bg-[#FAF7EE] border-2 border-black p-2.5 rounded-xl text-xs font-bold w-full hover:bg-neutral-100">
                      <input
                        type="checkbox"
                        checked={newArtwork.isAnonymous}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNewArtwork({
                            ...newArtwork,
                            isAnonymous: checked,
                            artist: checked && (!newArtwork.artist || newArtwork.artist === '') ? 'Pencipta Dirahasiakan' : newArtwork.artist
                          });
                        }}
                        className="w-4 h-4 text-[#7B2CBF] rounded border-black focus:ring-black"
                      />
                      <span className="flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5 text-[#7B2CBF]" /> Rahasiakan Nama Pencipta (Karya Anonim)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-black">URL Gambar *</label>
                  <input
                    type="url"
                    value={newArtwork.imageUrl}
                    onChange={(e) => setNewArtwork({ ...newArtwork, imageUrl: e.target.value })}
                    placeholder="https://..."
                    required
                    className="input-retro text-xs sm:text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-black">Deskripsi & Filosofi *</label>
                  <textarea
                    rows="3"
                    value={newArtwork.description}
                    onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                    placeholder="Jelaskan makna di balik karya..."
                    required
                    className="input-retro text-xs sm:text-sm resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingArt(false)} className="btn-retro-white text-xs px-4 py-2">Batal</button>
                  <button type="submit" className="btn-retro-yellow text-xs px-6 py-2">Simpan ke Katalog</button>
                </div>
              </form>
            )}

            {/* Artworks List Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artworks.map((art) => (
                <div key={art.id} className="card-retro p-4 bg-white space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-black bg-neutral-800 flex items-center justify-center">
                      <img src={art.imageUrl} alt={art.title} className="w-full h-full object-contain" />
                      <span className="absolute top-2 left-2 bg-[#FFE600] text-black text-[10px] font-black px-2 py-0.5 rounded border border-black">
                        {art.category}
                      </span>
                      {(art.isAnonymous || /rahasia|dirahasiakan|anonim|anonymous|secret/i.test(art.artist || '')) && (
                        <span className="absolute top-2 right-2 bg-[#7B2CBF] text-[#FFE600] text-[10px] font-black px-2 py-0.5 rounded border border-black flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-[#FFE600]" /> Dirahasiakan
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-base text-black line-clamp-1">{art.title}</h4>
                    <p className="text-xs text-neutral-500 font-semibold">
                      Oleh: {(art.isAnonymous || /rahasia|dirahasiakan|anonim|anonymous|secret/i.test(art.artist || '')) ? 'Pencipta Dirahasiakan' : art.artist}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#7B2CBF]">{art.boothName?.split('-')[0]}</span>
                    <button
                      onClick={async () => {
                        if (confirm(`Hapus karya "${art.title}"?`)) {
                          await ArtworkService.deleteArtwork(art.id);
                          onRefreshData && onRefreshData();
                        }
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
