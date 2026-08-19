import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  UserCheck, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Ticket, 
  Send, 
  CheckCircle2, 
  Clock, 
  User, 
  Hash, 
  GraduationCap, 
  Building,
  RefreshCw,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AttendanceService, detectClientInfo } from '../services/api';
import { EVENT_INFO } from '../data/mockData';

export default function AttendancePage({ onOpenTicket, onAttendanceSuccess }) {
  const containerRef = useRef(null);
  const formBoxRef = useRef(null);

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    identifier: '',
    kategori: 'Mahasiswa Baru',
    jurusan_prodi: 'D4 Teknik Informatika',
    catatan: '',
  });

  const [clientInfo, setClientInfo] = useState({
    ip_address: 'Sedang mendeteksi IP...',
    user_agent: '',
    device_type: 'Desktop/Mobile',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [recentAttendances, setRecentAttendances] = useState([]);

  // Fetch client IP on mount
  useEffect(() => {
    const fetchInfo = async () => {
      setIsLoading(true);
      const info = await detectClientInfo();
      setClientInfo(info);
      setIsLoading(false);
    };

    fetchInfo();
    loadRecentAttendances();
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Banner pop
      gsap.fromTo(
        '.att-header-banner',
        { y: -25, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      // Form Box Entrance
      gsap.fromTo(
        '.att-form-box',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 }
      );

      // Form Fields Stagger
      gsap.fromTo(
        '.att-form-field',
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.25 }
      );

      // Right Column (IP Tracker & Recent stream)
      gsap.fromTo(
        '.att-ip-tracker',
        { x: 30, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', delay: 0.2 }
      );

      gsap.fromTo(
        '.att-recent-stream',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.35 }
      );

      gsap.fromTo(
        '.att-recent-item',
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power1.out', delay: 0.45 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Success Ticket Entrance Animation
  useEffect(() => {
    if (submittedTicket) {
      gsap.fromTo(
        '.att-success-pass',
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.8)' }
      );
    }
  }, [submittedTicket]);

  const loadRecentAttendances = async () => {
    const list = await AttendanceService.getAllAttendances();
    setRecentAttendances(list.slice(0, 5));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_lengkap.trim()) {
      alert('Silakan masukkan Nama Lengkap Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        ip_address: clientInfo.ip_address,
      };

      const result = await AttendanceService.submitAttendance(payload);
      
      // Fire festive confetti animation
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF3388', '#00F0FF', '#7B2CBF', '#CCFF00']
      });

      setSubmittedTicket(result.data);
      onAttendanceSuccess && onAttendanceSuccess(result.data);
      loadRecentAttendances();
    } catch (err) {
      alert('Terjadi kesalahan saat mencatat presensi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const prodiOptions = [
    'D4 Teknik Informatika',
    'D4 Rekayasa Keamanan Siber',
    'D4 Animasi & Desain Grafis',
    'D4 Rekayasa Perangkat Lunak',
    'D3 Teknik Informatika',
    'D3 Teknik Geomatika',
    'D4 Teknik Mekatronika',
    'D3 Teknik Mesin',
    'D4 Administrasi Bisnis Terapan',
    'D4 Akuntansi Manajerial',
    'D4 Manajemen Bisnis Internasional',
    'Dosen / Tenaga Kependidikan',
    'Umum / Luar Kampus'
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header Title Banner */}
      <div className="att-header-banner bg-[#FFE600] border-3 border-black rounded-3xl p-6 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-black text-[#FFE600] px-3 py-1 rounded-lg text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" /> MODUL PRESENSI RESMI ART SHOWCASE
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-black">
            Presensi Pengunjung & Perekaman IP
          </h1>
          <p className="text-neutral-800 text-xs sm:text-base font-medium">
            Sistem secara otomatis mendeteksi alamat IP jaringan dan tipe perangkat Anda untuk validasi kehadiran pameran <strong>Student Centre Lt. 3 Politeknik Negeri Batam</strong>.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + IP Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Smart Attendance Form / Success Pass */}
        <div className="lg:col-span-7 space-y-6">
          {submittedTicket ? (
            /* Success State After Check-In */
            <div className="att-success-pass card-retro p-6 sm:p-8 bg-white space-y-6">
              <div className="flex items-center gap-3 bg-[#22C55E]/15 border-2 border-[#22C55E] p-4 rounded-2xl">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E] shrink-0" />
                <div>
                  <h3 className="font-display font-black text-lg text-black">
                    Presensi Berhasil Dicatat!
                  </h3>
                  <p className="text-xs text-neutral-600">
                    Selamat datang di Art Show Case 'History'. Kartu tiket digital Anda sudah aktif.
                  </p>
                </div>
              </div>

              {/* Digital Pass Summary */}
              <div className="bg-[#FAF7EE] border-3 border-black rounded-2xl p-5 space-y-3 bg-retro-dots/20">
                <div className="flex items-center justify-between border-b-2 border-dashed border-neutral-300 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Nama Pengunjung</span>
                    <h4 className="font-display font-black text-xl text-black">{submittedTicket.nama_lengkap}</h4>
                  </div>
                  <span className="bg-[#FF3388] text-white text-xs font-black px-2.5 py-1 rounded-lg border border-black uppercase">
                    {submittedTicket.kategori}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-semibold block">NIM / Identitas:</span>
                    <strong className="font-mono text-black">{submittedTicket.identifier || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block">Program Studi:</span>
                    <strong className="text-black">{submittedTicket.jurusan_prodi}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block">IP Terdaftar:</span>
                    <span className="font-mono bg-[#00F0FF]/30 px-1.5 py-0.5 rounded border border-black font-bold text-black">
                      {submittedTicket.ip_address}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block">Waktu Check-in:</span>
                    <strong className="text-black">{submittedTicket.waktu_kehadiran}</strong>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onOpenTicket}
                  className="btn-retro-cyan flex-1 py-3 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" /> Buka Tiket Lengkap (QR Pass)
                </button>
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setFormData({
                      nama_lengkap: '',
                      identifier: '',
                      kategori: 'Mahasiswa Baru',
                      jurusan_prodi: 'D4 Teknik Informatika',
                      catatan: '',
                    });
                  }}
                  className="btn-retro-white py-3 px-5"
                >
                  Presensi Orang Lain ➕
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Input */
            <div ref={formBoxRef} className="att-form-box card-retro p-6 sm:p-8 bg-white space-y-6">
              
              <div className="border-b-2 border-neutral-200 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-2xl text-black">
                    Formulir Kehadiran
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Isi data diri Anda di bawah ini untuk rekam jejak kehadiran acara.
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-retro-sm">
                  ✍️
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Field 1: Nama Lengkap */}
                <div className="att-form-field space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FF3388]" /> Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Contoh: Muhammad Rangga / Siti Nurhaliza"
                    required
                    className="input-retro text-sm"
                  />
                </div>

                {/* Field 2: NIM / No Identitas & Kategori */}
                <div className="att-form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-[#00F0FF]" /> NIM / No. Identitas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder="Contoh: 3312401032"
                      required
                      className="input-retro text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#7B2CBF]" /> Kategori Pengunjung
                    </label>
                    <select
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="input-retro text-sm font-bold bg-white"
                    >
                      <option value="Mahasiswa Baru">Mahasiswa Baru (Maba)</option>
                      <option value="Mahasiswa Aktif">Mahasiswa Aktif Polibatam</option>
                      <option value="Dosen/Staff">Dosen / Tendik Polibatam</option>
                      <option value="Tamu Umum">Tamu Undangan / Umum</option>
                    </select>
                  </div>
                </div>

                {/* Field 3: Jurusan / Program Studi */}
                <div className="att-form-field space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#FF6B35]" /> Program Studi / Jurusan
                  </label>
                  <select
                    name="jurusan_prodi"
                    value={formData.jurusan_prodi}
                    onChange={handleInputChange}
                    className="input-retro text-sm bg-white"
                  >
                    {prodiOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Field 4: Catatan / Minat Pameran */}
                <div className="att-form-field space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black">
                    Kesan Awal / Zona yang Ingin Dikunjungi (Opsional)
                  </label>
                  <input
                    type="text"
                    name="catatan"
                    value={formData.catatan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Penasaran dengan karya lukis retro & live painting"
                    className="input-retro text-sm"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="att-form-field w-full btn-retro-yellow py-4 text-base flex items-center justify-center gap-2 font-display font-black hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Menyimpan Presensi & IP...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Kirim Presensi & Dapatkan Tiket Digital ✨</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          )}
        </div>

        {/* Right Column: IP Auto-Detector & Info Box */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* IP Detector Card */}
          <div className="att-ip-tracker card-retro p-6 bg-[#00F0FF]/15 border-3 border-black space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00F0FF] border-2 border-black rounded-xl shadow-retro-sm">
                  <Wifi className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-display font-black text-base text-black">
                    Live IP & Device Tracker
                  </h4>
                  <span className="text-[11px] text-neutral-600 font-semibold">
                    Terekam Otomatis Oleh Sistem
                  </span>
                </div>
              </div>
              <span className="w-3 h-3 bg-[#22C55E] rounded-full border border-black animate-pulse"></span>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-4 space-y-2 text-xs">
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Alamat IP Anda</span>
                <span className="font-mono text-sm sm:text-base font-black text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black inline-block mt-0.5 shadow-retro-sm">
                  {clientInfo.ip_address}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Perangkat & Browser</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5 mt-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#FF3388]" /> {clientInfo.device_type}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-neutral-700 bg-white/70 p-3 rounded-xl border border-black/20">
              <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span>
                Data IP address digunakan oleh panitia divisi seni rupa untuk memverifikasi kehadiran valid dan mencegah duplikasi absensi pada saat event berlangsung.
              </span>
            </div>
          </div>

          {/* Recent Visitors Ticker */}
          <div className="att-recent-stream card-retro p-6 bg-white space-y-4">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-2">
              <h4 className="font-display font-bold text-sm text-black flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7B2CBF]" /> Presensi Terbaru Hari Ini
              </h4>
              <span className="text-[10px] bg-[#FFE600] font-bold px-2 py-0.5 rounded border border-black">
                Real-Time
              </span>
            </div>

            <div className="space-y-2.5">
              {recentAttendances.map((item, idx) => (
                <div key={item.id || idx} className="att-recent-item p-2.5 bg-[#FAF7EE] border-2 border-black rounded-xl flex items-center justify-between text-xs hover:-translate-y-0.5 transition-transform">
                  <div>
                    <strong className="text-black font-display block">{item.nama_lengkap}</strong>
                    <span className="text-[10px] text-neutral-500">{item.jurusan_prodi || item.kategori}</span>
                  </div>
                  <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-black font-bold">
                    {item.ip_address?.substring(0, 10)}...
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

