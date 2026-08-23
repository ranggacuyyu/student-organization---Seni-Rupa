import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Gift, 
  Layers, 
  Clock, 
  Sparkles, 
  MapPin, 
  UserCheck, 
  Users, 
  Package, 
  CheckSquare, 
  Square, 
  LogOut, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Info,
  SlidersHorizontal,
  RefreshCw,
  Bell
} from 'lucide-react';
import { PanitiaService, RundownService } from '../../services/api';
import { BOOTH_ZONES } from '../../data/mockData';
import CameraQrScanner from '../../components/panitia/CameraQrScanner';

export default function PanitiaDashboard({ currentUser, onLogout, rundowns, onUpdateRundownStatus }) {
  const containerRef = useRef(null);
  const tabContentRef = useRef(null);

  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'participants' | 'monitoring'

  // Scanner State
  const [scanQuery, setScanQuery] = useState('');
  const [scannedTicket, setScannedTicket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success'|'warning'|'error', text: '' }

  // Participant Needs State
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantCatFilter, setParticipantCatFilter] = useState('Semua');
  const [participants, setParticipants] = useState(() => PanitiaService.getParticipantNeeds());

  // Tasks & Monitoring State
  const [tasks, setTasks] = useState(() => PanitiaService.getPanitiaTasks());
  const [announcements, setAnnouncements] = useState(() => PanitiaService.getAnnouncements());

  // Load participants data
  const refreshParticipantData = () => {
    setParticipants(PanitiaService.getParticipantNeeds());
    if (scannedTicket) {
      const updated = PanitiaService.verifyTicket(scannedTicket.id);
      setScannedTicket(updated);
    }
  };

  // GSAP Entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.panitia-header-card',
        { y: -25, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.panitia-quick-stat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'back.out(1.4)', delay: 0.15 }
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

  // Handle QR Verify
  const handleVerifyTicket = (query) => {
    setScanFeedback(null);
    const result = PanitiaService.verifyTicket(query);
    if (result) {
      setScannedTicket(result);
      setScanFeedback({
        type: result.isCheckedIn ? 'info' : 'success',
        text: result.isCheckedIn ? 'Pengunjung sudah pernah check-in sebelumnya.' : 'Tiket VALID! Siap untuk check-in.'
      });
    } else {
      setScannedTicket(null);
      setScanFeedback({
        type: 'error',
        text: `Data tiket "${query}" tidak ditemukan di daftar registrasi.`
      });
    }
  };

  // Handle Quick Sample Scan
  const handleSampleScan = (sampleId) => {
    setScanQuery(sampleId);
    handleVerifyTicket(sampleId);
  };

  // Toggle Check In
  const handleToggleCheckIn = (ticketId) => {
    PanitiaService.toggleCheckIn(ticketId);
    refreshParticipantData();
  };

  // Toggle Souvenir
  const handleToggleSouvenir = (ticketId) => {
    PanitiaService.toggleSouvenir(ticketId);
    refreshParticipantData();
  };

  // Toggle Task
  const handleToggleTask = (taskId) => {
    const updated = PanitiaService.toggleTask(taskId);
    setTasks(updated);
  };

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchCat = participantCatFilter === 'Semua' || p.kategori === participantCatFilter;
      const q = participantSearch.toLowerCase();
      const matchSearch =
        p.nama_lengkap?.toLowerCase().includes(q) ||
        p.identifier?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [participants, participantCatFilter, participantSearch]);

  const participantStats = useMemo(() => {
    const total = participants.length;
    const checkedIn = participants.filter(p => p.isCheckedIn).length;
    const souvenirClaimed = participants.filter(p => p.isSouvenirClaimed).length;
    return { total, checkedIn, souvenirClaimed };
  }, [participants]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* ================= HEADER BAR ================= */}
      <div className="panitia-header-card bg-[#FFE600] border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden bg-retro-dots">
        <div className="space-y-1.5 relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-[#FF3388] text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 rounded-lg border-2 border-black uppercase shadow-retro-sm">
              PORTAL PANITIA LAPANGAN
            </span>
            <span className="bg-black text-[#00F0FF] font-mono text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded border border-black truncate">
              {currentUser?.divisi || 'Divisi Pelaksana'}
            </span>
          </div>
          <h1 className="font-display font-black text-xl sm:text-4xl text-black leading-tight">
            Halo, {currentUser?.nama || 'Petugas Panitia'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-neutral-800 font-semibold flex items-center gap-1.5 sm:gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3388] shrink-0" />
            <span className="truncate">Penugasan: <strong>{currentUser?.assignedBooth || 'Student Centre Lt. 3'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            onClick={onLogout}
            className="btn-retro-white text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 w-full md:w-auto active:scale-95"
          >
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </div>

      {/* ================= QUICK STATS BAR ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-500 uppercase">Total Peserta Terdaftar</span>
            <div className="font-display font-black text-2xl text-black">{participantStats.total} Orang</div>
          </div>
          <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-500 uppercase">Telah Hadir (Checked In)</span>
            <div className="font-display font-black text-2xl text-[#22C55E]">{participantStats.checkedIn} Peserta</div>
          </div>
          <div className="w-10 h-10 bg-[#22C55E]/20 border-2 border-black rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-[#22C55E]" />
          </div>
        </div>

        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neutral-500 uppercase">Suvenir & Pass Terbagi</span>
            <div className="font-display font-black text-2xl text-[#FF3388]">{participantStats.souvenirClaimed} Paket</div>
          </div>
          <div className="w-10 h-10 bg-[#FF3388]/20 border-2 border-black rounded-xl flex items-center justify-center">
            <Gift className="w-5 h-5 text-[#FF3388]" />
          </div>
        </div>
      </div>

      {/* ================= PANITIA NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b-3 border-black pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR & Validasi Tiket</span>
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'participants'
              ? 'bg-[#FF3388] text-white border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kebutuhan & Hak Peserta ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'monitoring'
              ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Monitoring & Cek Semua Zona</span>
        </button>
      </div>

      {/* ================= TAB CONTENTS ================= */}
      <div ref={tabContentRef}>

        {/* ================= TAB 1: QR SCANNER & VALIDATOR ================= */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Interactive QR Scanner Viewfinder */}
            <div className="lg:col-span-6 space-y-6">
              <div className="card-retro p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#FF3388]" />
                    <span>Scanner Kamera Tiket QR</span>
                  </h3>
                  <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] border border-black font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
                    READY
                  </span>
                </div>

                {/* Live Device Camera & Image File QR Scanner */}
                <CameraQrScanner
                  onScanSuccess={(code) => {
                    setScanQuery(code);
                    handleVerifyTicket(code);
                  }}
                />

                {/* Manual Input Search Fallback */}
                <form onSubmit={(e) => { e.preventDefault(); handleVerifyTicket(scanQuery); }} className="space-y-2">
                  <label className="block text-xs font-bold text-black">
                    Atau Masukkan Check-in ID / NIM / Nama Peserta Secara Manual:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scanQuery}
                      onChange={(e) => setScanQuery(e.target.value)}
                      placeholder="Contoh: att-1 / 3312401001 / Alifia"
                      className="input-retro text-xs sm:text-sm flex-1"
                    />
                    <button type="submit" className="btn-retro-yellow px-5 py-2 text-xs sm:text-sm shrink-0">
                      Cek Tiket 🔍
                    </button>
                  </div>
                </form>

                {/* Quick Sample Scan Presets for Testing */}
                <div className="pt-2 border-t border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                    ⚡ Klik Sampel Tiket untuk Tes Cepat:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {participants.slice(0, 4).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSampleScan(p.id)}
                        className="text-xs bg-[#FAF7EE] hover:bg-[#FFE600] border-2 border-black px-2.5 py-1 rounded-lg font-bold transition-colors active:scale-95 shadow-retro-sm"
                      >
                        {p.nama_lengkap.split(' ')[0]} ({p.id})
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Scanned Ticket Details & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {scannedTicket ? (
                <div className="card-retro p-6 sm:p-8 bg-white space-y-6 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFE600] px-2 py-0.5 rounded">
                        HASIL VALIDASI TIKET
                      </span>
                      <h3 className="font-display font-black text-2xl text-black mt-1">
                        {scannedTicket.nama_lengkap}
                      </h3>
                      <p className="text-xs text-neutral-600 font-mono font-bold">
                        NIM/ID: {scannedTicket.identifier || '-'} • {scannedTicket.kategori}
                      </p>
                    </div>

                    <div className="text-right">
                      {scannedTicket.isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 bg-[#22C55E] text-white text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-retro-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SUDAH CHECK-IN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#FFE600] text-black text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-retro-sm">
                          ⏳ BELUM CHECK-IN
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ticket Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7EE] border-2 border-black rounded-2xl p-4">
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Program Studi</span>
                      <strong className="text-black font-bold">{scannedTicket.jurusan_prodi || 'Polibatam'}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Perangkat & IP Log</span>
                      <strong className="text-black font-mono text-[11px]">{scannedTicket.ip_address}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Waktu Daftar</span>
                      <span className="text-neutral-700 font-mono">{scannedTicket.waktu_kehadiran}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Status Suvenir</span>
                      <span className={`font-bold ${scannedTicket.isSouvenirClaimed ? 'text-[#22C55E]' : 'text-neutral-500'}`}>
                        {scannedTicket.isSouvenirClaimed ? '🎁 Sudah Diambil' : '⚪ Belum Diambil'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Verification Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCheckIn(scannedTicket.id)}
                      className={`w-full py-3 px-4 rounded-xl border-3 border-black font-display font-black text-sm flex items-center justify-center gap-2 shadow-retro transition-all active:scale-95 ${
                        scannedTicket.isCheckedIn
                          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          : 'btn-retro-pink'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>{scannedTicket.isCheckedIn ? 'Batalkan Status Hadir' : 'Konfirmasi Kehadiran Pengunjung (Check-In)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSouvenir(scannedTicket.id)}
                      className={`w-full py-3 px-4 rounded-xl border-3 border-black font-display font-black text-sm flex items-center justify-center gap-2 shadow-retro transition-all active:scale-95 ${
                        scannedTicket.isSouvenirClaimed
                          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          : 'btn-retro-yellow'
                      }`}
                    >
                      <Gift className="w-5 h-5" />
                      <span>{scannedTicket.isSouvenirClaimed ? 'Tandai Suvenir Belum Diambil' : 'Serahkan Sticker Pack & Kupon Photobooth'}</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="card-retro p-8 bg-white text-center space-y-4">
                  <div className="w-16 h-16 bg-[#00F0FF] border-3 border-black rounded-2xl shadow-retro mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-black" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-black text-xl text-black">
                      Menunggu Scan Tiket...
                    </h4>
                    <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                      Scan QR code tiket pengunjung melalui kamera atau gunakan input manual untuk menampilkan data verifikasi.
                    </p>
                  </div>

                  {scanFeedback && (
                    <div className={`p-3 rounded-xl border-2 border-black text-xs font-bold ${
                      scanFeedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scanFeedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 2: KEBUTUHAN & HAK PESERTA ================= */}
        {activeTab === 'participants' && (
          <div className="space-y-6">
            
            {/* Search & Filter bar */}
            <div className="card-retro p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    placeholder="Cari Nama, NIM, atau ID Tiket..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                  />
                </div>

                <select
                  value={participantCatFilter}
                  onChange={(e) => setParticipantCatFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Mahasiswa Baru">Mahasiswa Baru</option>
                  <option value="Mahasiswa Polibatam">Mahasiswa Polibatam</option>
                  <option value="Dosen/Staff">Dosen / Staff</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="text-xs font-bold text-neutral-600">
                Menampilkan <strong>{filteredParticipants.length}</strong> peserta
              </div>
            </div>

            {/* Participants Checklist Table */}
            <div className="card-retro bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF7EE] border-b-2 border-black font-display font-black text-black">
                      <th className="py-3.5 px-4">Nama Peserta</th>
                      <th className="py-3.5 px-4">NIM / Identitas</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4 text-center">Status Masuk</th>
                      <th className="py-3.5 px-4 text-center">Suvenir & Stiker</th>
                      <th className="py-3.5 px-4 text-center">Kupon Photobooth</th>
                      <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((p) => (
                        <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-black">
                            {p.nama_lengkap}
                            <span className="block text-[10px] font-normal text-neutral-500">{p.jurusan_prodi}</span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-neutral-700">
                            {p.identifier || '-'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-[#FAF7EE] text-black font-bold px-2 py-0.5 rounded border border-black text-[10px]">
                              {p.kategori}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleCheckIn(p.id)}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                                p.isCheckedIn ? 'bg-[#22C55E] text-white border-black' : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-black'
                              }`}
                            >
                              {p.isCheckedIn ? '✅ Hadir' : '⚪ Belum'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleSouvenir(p.id)}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${
                                p.isSouvenirClaimed ? 'bg-[#FF3388] text-white border-black' : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:border-black'
                              }`}
                            >
                              {p.isSouvenirClaimed ? '🎁 Diberikan' : '⚪ Belum'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[#7B2CBF]">
                            {p.kategori === 'Mahasiswa Baru' ? '⭐ Gratis Maba' : p.isSouvenirClaimed ? '🎟️ Klaim' : '—'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setActiveTab('scanner');
                                handleSampleScan(p.id);
                              }}
                              className="btn-retro-yellow text-[10px] px-2.5 py-1"
                            >
                              Buka Detail
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-neutral-500">
                          Tidak ada peserta yang cocok dengan kata kunci pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: MONITORING & CEK SEMUA ZONA ================= */}
        {activeTab === 'monitoring' && (
          <div className="space-y-8">
            
            {/* Zone Status Cards */}
            <div className="space-y-3">
              <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF3388]" />
                <span>Kesiapan Zona Pameran (Student Centre Lt. 3)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {BOOTH_ZONES.map((zone) => (
                  <div key={zone.id} className="card-retro p-5 bg-white space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                          {zone.name.split(' - ')[0]}
                        </span>
                        <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] font-black px-2 py-0.5 rounded border border-black">
                          AKTIF
                        </span>
                      </div>
                      <h4 className="font-display font-black text-base text-black">{zone.name}</h4>
                      <p className="text-xs text-neutral-600">{zone.description}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 text-xs font-bold text-[#7B2CBF]">
                      🎯 {zone.featuredCount} Karya Display Terpasang
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panitia Task Checklist */}
            <div className="card-retro p-6 sm:p-8 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#7B2CBF]" />
                  <span>Checklist Tugas Lapangan Panitia</span>
                </h3>
                <span className="text-xs font-bold text-neutral-500">
                  {tasks.filter(t => t.isCompleted).length} dari {tasks.length} Selesai
                </span>
              </div>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-2xl border-2 border-black flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98 ${
                      task.isCompleted ? 'bg-[#FAF7EE] opacity-75' : 'bg-white shadow-retro-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-lg border border-black ${task.isCompleted ? 'bg-[#22C55E] text-white' : 'bg-white'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className={`font-display font-bold text-sm text-black ${task.isCompleted ? 'line-through text-neutral-500' : ''}`}>
                          {task.title}
                        </h5>
                        <p className="text-xs text-neutral-500 font-semibold">
                          Lokasi: {task.location} • Petugas: {task.assignedTo}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-black ${
                      task.priority === 'Tinggi' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rundown Live Session Controller */}
            <div className="card-retro p-6 sm:p-8 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#00F0FF]" />
                  <span>Kontrol Cepat Sesi Rundown Acara</span>
                </h3>
              </div>

              <div className="space-y-3">
                {rundowns.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      item.status === 'ongoing' ? 'bg-[#FFE600]/30 border-3 border-[#FF3388]' : 'bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                          {item.time} WIB
                        </span>
                        <span className="text-xs font-bold text-neutral-600">{item.location}</span>
                      </div>
                      <h4 className="font-display font-black text-base text-black mt-1">{item.title}</h4>
                      <p className="text-xs text-neutral-600">Oleh: {item.speaker}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onUpdateRundownStatus(item.id, 'ongoing')}
                        className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs ${
                          item.status === 'ongoing'
                            ? 'bg-[#FF3388] text-white border-black shadow-retro-sm animate-pulse'
                            : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                        }`}
                      >
                        🔴 Set Live
                      </button>
                      <button
                        onClick={() => onUpdateRundownStatus(item.id, 'completed')}
                        className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs ${
                          item.status === 'completed'
                            ? 'bg-[#22C55E] text-white border-black shadow-retro-sm'
                            : 'bg-white text-neutral-600 border-neutral-300 hover:border-black'
                        }`}
                      >
                        ✅ Selesai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
