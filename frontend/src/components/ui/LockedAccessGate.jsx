import React from 'react';
import { Lock, QrCode, UserCheck, Map, ArrowLeft, Sparkles, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LockedAccessGate({ 
  pageTitle = 'Halaman Ini', 
  myTicket, 
  onOpenTicket, 
  onNavigatePresensi, 
  onNavigateDenah, 
  onNavigateHome,
  onRefreshStatus
}) {
  return (
    <div className="min-h-[75vh] py-6 sm:py-10 px-3.5 sm:px-6 lg:px-8 flex items-center justify-center bg-retro-dots">
      <div className="max-w-xl w-full bg-white border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro-lg sm:shadow-retro-xl space-y-5 sm:space-y-6 relative overflow-hidden">
        
        {/* Top Decorative Accent */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-retro-stripes" />

        {/* Lock Icon & Header */}
        <div className="text-center space-y-2.5 sm:space-y-3 pt-2">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#FF3388] text-white border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro-sm sm:shadow-retro mx-auto flex items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform">
            <Lock className="w-7 h-7 sm:w-10 sm:h-10 text-white animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#FFE600] text-black border-2 border-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase shadow-retro-sm">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3388]" /> Akses Khusus Pengunjung Terverifikasi
          </div>

          <h2 className="font-display font-black text-xl sm:text-3xl text-black leading-tight">
            {pageTitle} Sedang Terkunci
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
            Untuk menikmati konten pameran secara lengkap, silakan lakukan <strong>Presensi Kehadiran</strong> dan minta panitia di lokasi (<strong>Student Centre Lantai 3</strong>) untuk memindai <strong>QR Code Tiket</strong> Anda.
          </p>
        </div>

        {/* Ticket Status Box */}
        <div className="p-4 sm:p-5 bg-[#FAF7EE] border-2 border-black rounded-2xl shadow-retro-sm space-y-3">
          {myTicket ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" /> Tiket Digital Terdaftar
                </span>
                <span className="bg-[#FFE600] text-black text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase">
                  Menunggu Scan QR
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 text-[10px] block">Nama:</span>
                  <strong className="text-black font-display truncate block">{myTicket.nama_lengkap}</strong>
                </div>
                <div>
                  <span className="text-neutral-500 text-[10px] block">ID Tiket:</span>
                  <span className="font-mono font-bold text-black text-[11px] truncate block">{myTicket.id}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-neutral-300">
                <button
                  onClick={onOpenTicket}
                  className="w-full btn-retro-yellow text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 shadow-retro-sm active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-black" />
                  <span>Tampilkan QR Tiket ke Panitia</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 py-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-700">
                <AlertCircle className="w-4 h-4 text-[#FF3388]" />
                <span>Kamu belum melakukan presensi kehadiran</span>
              </div>
              <button
                onClick={onNavigatePresensi}
                className="w-full btn-retro-pink text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 shadow-retro-sm active:scale-95"
              >
                <UserCheck className="w-4 h-4" />
                <span>Isi Presensi Kehadiran Sekarang</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons & Secondary Navigation */}
        <div className="space-y-2 pt-1">
          {onRefreshStatus && (
            <button
              onClick={onRefreshStatus}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sudah di-scan? Klik untuk Periksa Ulang Status</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={onNavigateDenah}
              className="btn-retro-white text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <Map className="w-3.5 h-3.5 text-[#7B2CBF]" />
              <span>Lihat Denah</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="btn-retro-white text-xs py-2.5 flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ke Beranda</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
