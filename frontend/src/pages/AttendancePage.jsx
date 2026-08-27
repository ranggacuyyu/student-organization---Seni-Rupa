import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Info,
  Download,
  Edit3,
  XCircle,
  Save,
  ArrowRight,
  MapPin,
  Calendar,
  MessageSquare,
  Palette,
  AlertTriangle,
  PlusCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRCodeCanvas } from 'qrcode.react';
import { AttendanceService, detectClientInfo } from '../services/api';
import { EVENT_INFO } from '../data/mockData';
import { downloadQrCode } from '../utils/ticketGenerator';

// Helper to format timestamps cleanly without overflowing boxes
const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return '-';
  try {
    const s = String(timeStr).trim();
    if (s.includes('T')) {
      const parts = s.split('T');
      const datePart = parts[0];
      const timePart = (parts[1] || '').split('.')[0].replace('Z', '');
      return `${datePart} ${timePart.slice(0, 5)}`;
    }
    return s.slice(0, 16);
  } catch {
    return String(timeStr).slice(0, 16);
  }
};

export default function AttendancePage({ 
  onOpenTicket, 
  onAttendanceSuccess, 
  onAttendanceUpdate, 
  onNavigateTab,
  myTicket: propTicket,
  isVerified: propIsVerified 
}) {
  const containerRef = useRef(null);
  const formBoxRef = useRef(null);
  const successQrCanvasRef = useRef(null);

  // Form State for initial registration
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    identifier: '',
    kategori: 'Mahasiswa Baru',
    jurusan_prodi: 'D4 Teknik Informatika',
    catatan: '',
  });

  // Client IP & Device Info
  const [clientInfo, setClientInfo] = useState({
    ip_address: 'Sedang mendeteksi IP...',
    user_agent: '',
    device_type: 'Desktop/Mobile',
  });

  // Ticket states
  const [submittedTicket, setSubmittedTicket] = useState(() => propTicket || AttendanceService.getMyTicket());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPass, setIsDownloadingPass] = useState(false);
  const [downloadPassSuccess, setDownloadPassSuccess] = useState(false);

  // Edit / Resubmit State (Only for tickets NOT yet scanned)
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nama_lengkap: '',
    identifier: '',
    kategori: 'Mahasiswa Baru',
    jurusan_prodi: 'D4 Teknik Informatika',
    catatan: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState(null);

  // Synchronize when propTicket changes
  useEffect(() => {
    if (propTicket) {
      setSubmittedTicket(propTicket);
    }
  }, [propTicket]);

  // Determine current active ticket and its verification/scan status
  const activeTicket = submittedTicket || propTicket;

  const isCheckedIn = useMemo(() => {
    if (!activeTicket) return false;
    if (propIsVerified) return true;

    try {
      const checkedInList = JSON.parse(localStorage.getItem('senrup_checked_in_tickets_v1') || '[]');
      if (activeTicket.id && checkedInList.includes(activeTicket.id)) {
        return true;
      }
      if (activeTicket.isCheckedIn || activeTicket.is_checked_in || activeTicket.status === 'checked_in') {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [activeTicket, propIsVerified]);

  // Fetch client IP on mount
  useEffect(() => {
    const fetchInfo = async () => {
      const info = await detectClientInfo();
      setClientInfo(info);
    };

    fetchInfo();
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

      // Form / Pass Box Entrance
      gsap.fromTo(
        '.att-form-box, .att-success-pass',
        { x: -25, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 }
      );

      // Right Column (IP Tracker)
      gsap.fromTo(
        '.att-ip-tracker',
        { x: 25, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', delay: 0.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeTicket, isEditing, isCheckedIn]);

  // Download QR pass image directly
  const handleDownloadQrDirect = async () => {
    if (!activeTicket) return;
    setIsDownloadingPass(true);
    try {
      await downloadQrCode(activeTicket, successQrCanvasRef.current);
      setDownloadPassSuccess(true);
      setTimeout(() => setDownloadPassSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to download QR:', err);
    } finally {
      setIsDownloadingPass(false);
    }
  };

  // Handle Initial Registration Submission
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
        user_agent: clientInfo.user_agent,
        device_type: clientInfo.device_type,
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
    } catch (err) {
      alert('Terjadi kesalahan saat mencatat presensi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enter Edit / Resubmission Mode
  const handleStartEdit = () => {
    if (isCheckedIn) {
      alert('Tiket Anda sudah diverifikasi oleh panitia dan tidak dapat diubah.');
      return;
    }
    if (!activeTicket) return;

    setEditFormData({
      nama_lengkap: activeTicket.nama_lengkap || '',
      identifier: activeTicket.identifier === '-' ? '' : (activeTicket.identifier || ''),
      kategori: activeTicket.kategori || 'Mahasiswa Baru',
      jurusan_prodi: activeTicket.jurusan_prodi || 'D4 Teknik Informatika',
      catatan: activeTicket.catatan || '',
    });
    setIsEditing(true);
    setUpdateFeedback(null);
  };

  // Handle Edit Input Change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Resubmitted / Updated Attendance Data
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.nama_lengkap.trim()) {
      setUpdateFeedback({ type: 'error', message: 'Nama lengkap tidak boleh kosong.' });
      return;
    }

    setIsUpdating(true);
    try {
      const result = await AttendanceService.updateAttendance(activeTicket.id, editFormData);
      if (result.success && result.ticket) {
        setSubmittedTicket(result.ticket);
        setIsEditing(false);
        setUpdateFeedback({ type: 'success', message: 'Data presensi berhasil diperbarui!' });

        onAttendanceUpdate && onAttendanceUpdate(result.ticket);

        // Confetti celebration on update
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#22C55E', '#FFE600']
        });

        setTimeout(() => setUpdateFeedback(null), 4000);
      } else {
        setUpdateFeedback({ type: 'error', message: result.message || 'Gagal memperbarui data presensi.' });
      }
    } catch (err) {
      console.error('Update error:', err);
      setUpdateFeedback({ type: 'error', message: 'Terjadi kesalahan sistem saat memperbarui data.' });
    } finally {
      setIsUpdating(false);
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
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-10">
      
      {/* Header Title Banner */}
      <div className="att-header-banner bg-[#FFE600] border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-[#FFE600] px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00F0FF]" /> MODUL PRESENSI RESMI ART SHOWCASE
          </div>
          <h1 className="font-display font-black text-2xl sm:text-5xl text-black leading-tight">
            {isCheckedIn ? 'Detail Presensi Terverifikasi' : 'Presensi Pengunjung & Perekaman IP'}
          </h1>
          <p className="text-neutral-800 text-xs sm:text-base font-medium leading-relaxed">
            {isCheckedIn 
              ? 'Kehadiran Anda telah resmi diverifikasi oleh panitia. Selamat menikmati pameran Art Show Case "History" di Student Centre Lantai 3.'
              : 'Sistem secara otomatis mendeteksi alamat IP jaringan dan tipe perangkat Anda untuk validasi kehadiran pameran Student Centre Lt. 3 Politeknik Negeri Batam.'
            }
          </p>
        </div>
      </div>

      {/* Main Grid: Left (Form/Pass/Detail) + Right (IP Tracker & Recent Stream) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-7 space-y-6">

          {/* Toast / Feedback Notice */}
          {updateFeedback && (
            <div className={`p-4 rounded-2xl border-3 border-black shadow-retro-sm text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
              updateFeedback.type === 'success' 
                ? 'bg-[#22C55E]/20 text-[#15803D] border-[#15803D]' 
                : 'bg-[#FF3388]/20 text-[#BE185D] border-[#BE185D]'
            }`}>
              {updateFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-[#BE185D] shrink-0" />
              )}
              <span>{updateFeedback.message}</span>
            </div>
          )}

          {/* ================= CONDITION 1: ALREADY SCANNED & VERIFIED BY PANITIA ================= */}
          {activeTicket && isCheckedIn ? (
            <div className="att-success-pass card-retro p-4 sm:p-8 bg-white space-y-5 sm:space-y-6">
              
              {/* Verified Ribbon */}
              <div className="flex items-start sm:items-center gap-3 bg-[#22C55E]/15 border-3 border-[#22C55E] p-4 rounded-2xl">
                <div className="w-10 h-10 bg-[#22C55E] border-2 border-black rounded-xl text-white flex items-center justify-center font-display font-black shrink-0 shadow-retro-sm">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 bg-[#22C55E] text-black text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded border border-black uppercase">
                    <ShieldCheck className="w-3.5 h-3.5" /> STATUS: TERVERIFIKASI PANITIA
                  </div>
                  <h3 className="font-display font-black text-base sm:text-xl text-black">
                    Kehadiran Anda Telah Diverifikasi!
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-700">
                    Akses pameran, katalog karya penuh, dan buku tamu telah aktif untuk Anda.
                  </p>
                </div>
              </div>

              {/* Verified Attendance Detail Card */}
              <div className="bg-[#FAF7EE] border-3 border-black rounded-2xl p-4 sm:p-6 space-y-4 bg-retro-dots/20 shadow-retro-sm">
                <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Nama Pengunjung</span>
                    <h4 className="font-display font-black text-lg sm:text-2xl text-black truncate capitalize" title={activeTicket.nama_lengkap}>
                      {activeTicket.nama_lengkap}
                    </h4>
                  </div>
                  <span className="bg-[#FF3388] text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-xl border-2 border-black uppercase shadow-retro-sm shrink-0 whitespace-nowrap text-center">
                    {activeTicket.kategori}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">NIM / Identitas</span>
                    <strong className="font-mono text-black text-xs sm:text-sm truncate block" title={activeTicket.identifier || '-'}>
                      {activeTicket.identifier || '-'}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">Program Studi</span>
                    <strong className="text-black text-[11px] sm:text-xs truncate block" title={activeTicket.jurusan_prodi}>
                      {activeTicket.jurusan_prodi}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">IP Terdaftar</span>
                    <span className="font-mono font-bold text-black text-[10px] sm:text-[11px] bg-[#00F0FF]/30 px-1.5 py-0.5 rounded border border-black inline-block mt-0.5 truncate max-w-full" title={activeTicket.ip_address || clientInfo.ip_address}>
                      {activeTicket.ip_address || clientInfo.ip_address}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">Waktu Kehadiran</span>
                    <strong className="text-black text-[10px] sm:text-xs block truncate" title={formatTimeDisplay(activeTicket.waktu_kehadiran)}>
                      {formatTimeDisplay(activeTicket.waktu_kehadiran)}
                    </strong>
                  </div>
                </div>

                {activeTicket.catatan && (
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black text-xs min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Kesan / Minat Pameran</span>
                    <p className="text-black italic mt-0.5 break-words text-xs">"{activeTicket.catatan}"</p>
                  </div>
                )}

                {/* Direct Clean QR Code Display without surrounding border */}
                <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <QRCodeCanvas
                      ref={successQrCanvasRef}
                      value={activeTicket.id || activeTicket.identifier || 'PASS-POLIBATAM'}
                      size={180}
                      level="H"
                      includeMargin={false}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      style={{
                        width: '180px',
                        height: '180px',
                        maxWidth: '100%',
                        display: 'block'
                      }}
                      className="mx-auto"
                    />
                  </div>
                  <div className="space-y-0.5 text-center">
                    <span className="text-xs font-black text-green-700 uppercase flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-green-600" /> TIKET RESMI TERVALIDASI
                    </span>
                    <p className="text-xs font-mono font-bold text-black">
                      ID: {activeTicket.id || 'PASS-POLIBATAM'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Disahkan oleh Panitia Divisi Seni Rupa Polibatam
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Verified Visitor */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadQrDirect}
                    disabled={isDownloadingPass}
                    className={`flex-1 ${downloadPassSuccess ? 'btn-retro-lime' : 'btn-retro-yellow'} py-3 flex items-center justify-center gap-2`}
                    title="Download gambar QR Code pass"
                  >
                    {isDownloadingPass ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Mengunduh QR...</span>
                      </>
                    ) : downloadPassSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>QR Berhasil Disimpan!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-black" />
                        <span>Download QR Pass</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onOpenTicket}
                    className="btn-retro-cyan py-3 px-5 flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-black" />
                    <span>Lihat Full Card Pass</span>
                  </button>
                </div>

                {/* Quick Navigation Hub */}
                <div className="pt-2 border-t-2 border-dashed border-neutral-200">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase block mb-2">
                    Jelajahi Pameran Sekarang:
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('katalog')}
                      className="btn-retro-white text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 text-left font-bold"
                    >
                      <Palette className="w-3.5 h-3.5 text-[#FF3388]" />
                      <span>Galeri Katalog</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
                    </button>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('denah')}
                      className="btn-retro-white text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 text-left font-bold"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                      <span>Denah Lantai 3</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
                    </button>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('rundown')}
                      className="btn-retro-white text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 text-left font-bold"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#FFE600]" />
                      <span>Rundown Acara</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
                    </button>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('pesan-kesan')}
                      className="btn-retro-white text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 text-left font-bold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#7B2CBF]" />
                      <span>Pojok Ekspresi</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto text-neutral-400" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTicket && !isEditing ? (
            /* ================= CONDITION 2: REGISTERED BUT NOT YET SCANNED (CAN RESUBMIT/EDIT) ================= */
            <div className="att-success-pass card-retro p-4 sm:p-8 bg-white space-y-5 sm:space-y-6">
              
              {/* Pending Scan Ribbon */}
              <div className="flex items-start sm:items-center gap-3 bg-[#FFE600]/25 border-3 border-[#FFE600] p-4 rounded-2xl">
                <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl text-black flex items-center justify-center font-display font-black shrink-0 shadow-retro-sm">
                  ⏳
                </div>
                <div className="space-y-0.5">
                  <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded border border-black uppercase">
                    <Clock className="w-3.5 h-3.5 text-black" /> MENUNGGU SCAN QR PANITIA
                  </div>
                  <h3 className="font-display font-black text-base sm:text-xl text-black">
                    Presensi Berhasil Dicatat!
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-700">
                    Tunjukkan QR Code ini ke panitia di meja registrasi (Student Centre Lt. 3) untuk verifikasi.
                  </p>
                </div>
              </div>

              {/* Digital Pass Summary */}
              <div className="bg-[#FAF7EE] border-3 border-black rounded-2xl p-4 sm:p-6 space-y-4 bg-retro-dots/20 shadow-retro-sm">
                <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-neutral-300 pb-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block">Nama Pengunjung</span>
                    <h4 className="font-display font-black text-lg sm:text-2xl text-black truncate capitalize" title={activeTicket.nama_lengkap}>
                      {activeTicket.nama_lengkap}
                    </h4>
                  </div>
                  <span className="bg-[#FF3388] text-white text-[11px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-xl border-2 border-black uppercase shadow-retro-sm shrink-0 whitespace-nowrap text-center">
                    {activeTicket.kategori}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-xs">
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">NIM / Identitas</span>
                    <strong className="font-mono text-black text-xs sm:text-sm truncate block" title={activeTicket.identifier || '-'}>
                      {activeTicket.identifier || '-'}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">Program Studi</span>
                    <strong className="text-black text-[11px] sm:text-xs truncate block" title={activeTicket.jurusan_prodi}>
                      {activeTicket.jurusan_prodi}
                    </strong>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">IP Terdaftar</span>
                    <span className="font-mono font-bold text-black text-[10px] sm:text-[11px] bg-[#00F0FF]/30 px-1.5 py-0.5 rounded border border-black inline-block mt-0.5 truncate max-w-full" title={activeTicket.ip_address || clientInfo.ip_address}>
                      {activeTicket.ip_address || clientInfo.ip_address}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase truncate">Waktu Pendaftaran</span>
                    <strong className="text-black text-[10px] sm:text-xs block truncate" title={formatTimeDisplay(activeTicket.waktu_kehadiran)}>
                      {formatTimeDisplay(activeTicket.waktu_kehadiran)}
                    </strong>
                  </div>
                </div>

                {activeTicket.catatan && (
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border-2 border-black text-xs min-w-0">
                    <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Kesan / Minat Pameran</span>
                    <p className="text-black italic mt-0.5 break-words text-xs">"{activeTicket.catatan}"</p>
                  </div>
                )}

                {/* Direct Clean QR Code Display without surrounding border */}
                <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <QRCodeCanvas
                      ref={successQrCanvasRef}
                      value={activeTicket.id || activeTicket.identifier || 'PASS-POLIBATAM'}
                      size={180}
                      level="H"
                      includeMargin={false}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      style={{
                        width: '180px',
                        height: '180px',
                        maxWidth: '100%',
                        display: 'block'
                      }}
                      className="mx-auto"
                    />
                  </div>
                  <div className="space-y-0.5 text-center">
                    <span className="text-xs font-black text-amber-700 uppercase flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> QR TIKET DIGITAL AKTIF
                    </span>
                    <p className="text-xs font-mono font-bold text-black">
                      ID: {activeTicket.id || 'PASS-POLIBATAM'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      Tunjukkan QR ini ke scanner panitia di meja registrasi
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Including Edit / Resubmit Data Option) */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* EDIT / AJUKAN ULANG BUTTON */}
                  <button
                    onClick={handleStartEdit}
                    className="flex-1 btn-retro-cyan py-3 flex items-center justify-center gap-2 font-bold"
                    title="Ajukan ulang atau perbaiki data presensi jika ada kesalahan input"
                  >
                    <Edit3 className="w-4 h-4 text-black" />
                    <span>Ajukan Ulang / Edit Data</span>
                  </button>

                  <button
                    onClick={handleDownloadQrDirect}
                    disabled={isDownloadingPass}
                    className={`flex-1 ${downloadPassSuccess ? 'btn-retro-lime' : 'btn-retro-yellow'} py-3 flex items-center justify-center gap-2`}
                    title="Download gambar QR Code untuk discan panitia"
                  >
                    {isDownloadingPass ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Mengunduh QR...</span>
                      </>
                    ) : downloadPassSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>QR Berhasil Disimpan!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-black" />
                        <span>Download QR Pass</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onOpenTicket}
                    className="flex-1 btn-retro-white py-2.5 text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-black" />
                    <span>Lihat Full Card Pass</span>
                  </button>

                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setIsEditing(false);
                      setFormData({
                        nama_lengkap: '',
                        identifier: '',
                        kategori: 'Mahasiswa Baru',
                        jurusan_prodi: 'D4 Teknik Informatika',
                        catatan: '',
                      });
                    }}
                    className="flex-1 btn-retro-white py-2.5 text-xs sm:text-sm flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-black" />
                    <span>Presensi Pengunjung Lain</span>
                  </button>
                </div>
              </div>

            </div>
          ) : isEditing && activeTicket ? (
            /* ================= CONDITION 3: EDITING / RESUBMITTING FORM ================= */
            <div className="att-form-box card-retro p-4 sm:p-8 bg-white space-y-5 sm:space-y-6 border-3 border-black">
              
              <div className="border-b-2 border-neutral-200 pb-3 sm:pb-4 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 bg-[#00F0FF] text-black text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase mb-1">
                    <Edit3 className="w-3 h-3" /> MODE AJUKAN ULANG
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-black">
                    Edit / Ajukan Ulang Data Presensi
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500">
                    Perbarui informasi diri Anda sebelum kartu tiket dipindai oleh panitia di lokasi acara.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 shadow-retro-sm shrink-0"
                  title="Batal Edit"
                >
                  <XCircle className="w-5 h-5 text-neutral-700" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                
                {/* Field 1: Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FF3388]" /> Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={editFormData.nama_lengkap}
                    onChange={handleEditInputChange}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                    className="input-retro text-sm"
                  />
                </div>

                {/* Field 2: NIM / Identitas & Kategori */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-[#00F0FF]" /> NIM / No. Identitas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="identifier"
                      value={editFormData.identifier}
                      onChange={handleEditInputChange}
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
                      value={editFormData.kategori}
                      onChange={handleEditInputChange}
                      className="input-retro text-sm font-bold bg-white"
                    >
                      <option value="Mahasiswa Baru">Mahasiswa Baru (Maba)</option>
                      <option value="Mahasiswa Aktif">Mahasiswa Aktif Polibatam</option>
                      <option value="Dosen/Staff">Dosen / Tendik Polibatam</option>
                      <option value="Tamu Umum">Tamu Undangan / Umum</option>
                    </select>
                  </div>
                </div>

                {/* Field 3: Program Studi */}
                <div className="space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-[#FF6B35]" /> Program Studi / Jurusan
                  </label>
                  <select
                    name="jurusan_prodi"
                    value={editFormData.jurusan_prodi}
                    onChange={handleEditInputChange}
                    className="input-retro text-sm bg-white"
                  >
                    {prodiOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Field 4: Catatan / Minat Pameran */}
                <div className="space-y-1.5">
                  <label className="block font-display font-bold text-xs sm:text-sm text-black">
                    Kesan Awal / Zona yang Ingin Dikunjungi (Opsional)
                  </label>
                  <input
                    type="text"
                    name="catatan"
                    value={editFormData.catatan}
                    onChange={handleEditInputChange}
                    placeholder="Contoh: Ingin melihat karya seni digital & instalasi 3D"
                    className="input-retro text-sm"
                  />
                </div>

                <div className="p-3 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-black shrink-0" />
                  <span className="text-neutral-700">
                    ID Tiket (<strong className="font-mono">{activeTicket.id}</strong>) dan rekaman IP akan tetap terjaga.
                  </span>
                </div>

                {/* Save & Cancel Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 btn-retro-yellow py-3.5 text-sm sm:text-base flex items-center justify-center gap-2 font-display font-black"
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Menyimpan Perubahan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan Data</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-retro-white py-3.5 px-6 text-sm flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4 text-neutral-600" />
                    <span>Batal</span>
                  </button>
                </div>

              </form>

            </div>
          ) : (
            /* ================= CONDITION 4: INITIAL REGISTRATION FORM ================= */
            <div ref={formBoxRef} className="att-form-box card-retro p-4 sm:p-8 bg-white space-y-5 sm:space-y-6">
              
              <div className="border-b-2 border-neutral-200 pb-3 sm:pb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-black">
                    Formulir Kehadiran
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500">
                    Isi data diri Anda di bawah ini untuk rekam jejak kehadiran acara.
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center font-bold shadow-retro-sm shrink-0">
                  <UserCheck className="w-5 h-5 text-black" />
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
                      <span>Kirim Presensi & Dapatkan Tiket Digital</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

        </div>

        {/* ================= RIGHT COLUMN: IP AUTO-TRACKER & RECENT VISITOR TICKER ================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* IP Detector Card */}
          <div className="att-ip-tracker card-retro p-4 sm:p-6 bg-[#00F0FF]/15 border-3 border-black space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00F0FF] border-2 border-black rounded-xl shadow-retro-sm">
                  <Wifi className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm sm:text-base text-black">
                    Live IP & Device Tracker
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-neutral-600 font-semibold">
                    Terekam Otomatis Oleh Sistem
                  </span>
                </div>
              </div>
              <span className="w-3 h-3 bg-[#22C55E] rounded-full border border-black animate-pulse"></span>
            </div>

            <div className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 space-y-2 text-xs">
              <div>
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Alamat IP Anda</span>
                <span className="font-mono text-xs sm:text-base font-black text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black inline-block mt-0.5 shadow-retro-sm break-all">
                  {clientInfo.ip_address}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <span className="text-neutral-500 font-bold block uppercase text-[10px]">Perangkat & Browser</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1.5 mt-0.5 text-xs truncate">
                  <Smartphone className="w-3.5 h-3.5 text-[#FF3388] shrink-0" /> {clientInfo.device_type}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[10px] sm:text-[11px] text-neutral-700 bg-white/70 p-2.5 sm:p-3 rounded-xl border border-black/20">
              <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span>
                Data IP address digunakan oleh panitia divisi seni rupa untuk memverifikasi kehadiran valid dan mencegah duplikasi absensi pada saat event berlangsung.
              </span>
            </div>
          </div>

          {/* Information & Verification Flow Card */}
          <div className="card-retro p-4 sm:p-6 bg-white border-3 border-black space-y-4">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-2.5">
              <h4 className="font-display font-black text-sm sm:text-base text-black flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF3388]" /> Alur Registrasi & Lokasi
              </h4>
              <span className="text-[10px] bg-[#FFE600] font-black px-2 py-0.5 rounded border border-black uppercase">
                SC Lt. 3
              </span>
            </div>

            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex items-start gap-2.5 bg-[#FAF7EE] p-3 rounded-xl border-2 border-black/10">
                <span className="w-5 h-5 bg-[#FFE600] border border-black rounded-full flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-black block font-display">Isi Form / Buka Tiket</strong>
                  <p className="text-[11px] text-neutral-600">Lakukan presensi kehadiran untuk memperoleh QR Pass digital Anda.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-[#FAF7EE] p-3 rounded-xl border-2 border-black/10">
                <span className="w-5 h-5 bg-[#00F0FF] border border-black rounded-full flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-black block font-display">Scan di Meja Panitia</strong>
                  <p className="text-[11px] text-neutral-600">Tunjukkan QR Code ke panitia di meja registrasi Student Centre Lt. 3.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-[#FAF7EE] p-3 rounded-xl border-2 border-black/10">
                <span className="w-5 h-5 bg-[#22C55E] text-white border border-black rounded-full flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-black block font-display">Nikmati Pameran & Karya</strong>
                  <p className="text-[11px] text-neutral-600">Setelah diverifikasi, seluruh katalog dan fitur interaktif pameran terbuka untuk Anda.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
