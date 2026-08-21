import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, QrCode, CheckCircle2, MapPin, Calendar, User, ShieldCheck, Printer, Share2, Sparkles, Clock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EVENT_INFO } from '../../data/mockData';

export default function RetroTicketModal({ isOpen, onClose, ticket, onGoToPresensi }) {
  const modalBoxRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalBoxRef.current) {
      gsap.fromTo(
        modalBoxRef.current,
        { scale: 0.82, y: -40, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const checkedInList = JSON.parse(localStorage.getItem('senrup_checked_in_tickets_v1') || '[]');
  const isCheckedIn = ticket && (
    checkedInList.includes(ticket.id) || 
    ticket.isCheckedIn || 
    ticket.is_checked_in || 
    ticket.status === 'checked_in'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div 
        ref={modalBoxRef}
        className="relative w-full max-w-lg bg-[#FAF7EE] border-3 border-black rounded-3xl shadow-retro-xl overflow-hidden"
      >
        
        {/* Header Ribbon */}
        <div className="bg-[#FFE600] border-b-3 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#FF3388] border border-black rounded-full animate-ping"></span>
            <h3 className="font-display font-black text-lg text-black uppercase tracking-wider">
              🎟️ DIGITAL ATTENDEE PASS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 shadow-retro-sm"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {ticket ? (
          /* When Ticket Exists */
          <div className="p-6 space-y-6">
            
            {/* The Retro Ticket Card */}
            <div className="relative bg-white border-3 border-black rounded-2xl shadow-retro overflow-hidden">
              
              {/* Ticket Top Part */}
              <div className="bg-[#FF3388] text-white p-4 border-b-3 border-dashed border-black flex items-center justify-between">
                <div>
                  <span className="bg-black text-[#FFE600] text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase tracking-wider">
                    {ticket.kategori || 'Pengunjung Resmi'}
                  </span>
                  <h4 className="font-display font-black text-xl text-white mt-1">
                    {EVENT_INFO.title}
                  </h4>
                  <p className="text-xs text-white/90 font-medium">Tema: {EVENT_INFO.theme}</p>
                </div>
                <div className="w-12 h-12 bg-[#FFE600] border-2 border-black rounded-xl text-black flex items-center justify-center font-display font-black text-lg shadow-retro-sm">
                  ★
                </div>
              </div>

              {/* Perforated Notch Circles */}
              <div className="absolute top-[88px] -left-3 w-6 h-6 bg-[#FAF7EE] border-r-3 border-black rounded-full"></div>
              <div className="absolute top-[88px] -right-3 w-6 h-6 bg-[#FAF7EE] border-l-3 border-black rounded-full"></div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4 bg-retro-dots/20">
                
                {/* Verification Status Banner */}
                <div className={`p-2.5 rounded-xl border-2 border-black flex items-center justify-between text-xs font-bold ${
                  isCheckedIn ? 'bg-[#CCFF00] text-black shadow-retro-sm' : 'bg-[#FFE600] text-black shadow-retro-sm'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {isCheckedIn ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>TERVERIFIKASI PANITIA ✅</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-black" />
                        <span>STATUS: MENUNGGU SCAN QR ⏳</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded">
                    {isCheckedIn ? 'AKSES TERBUKA' : 'BELUM SCAN'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Nama Peserta</span>
                    <strong className="text-sm font-display text-black">{ticket.nama_lengkap}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px]">NIM / Identitas</span>
                    <strong className="text-sm font-mono text-black">{ticket.identifier || '-'}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px]">Program Studi</span>
                    <span className="font-bold text-neutral-800">{ticket.jurusan_prodi || 'Polibatam'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px]">IP Log Terdaftar</span>
                    <span className="font-mono text-[11px] bg-[#00F0FF]/30 px-1.5 py-0.5 rounded border border-black text-black font-bold">
                      {ticket.ip_address || '180.254.88.99'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t-2 border-dashed border-neutral-300 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF3388]" /> Student Centre Lt. 3
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7B2CBF]" /> 12 Sep 2026
                  </div>
                </div>

                {/* Real Scannable QR Code & Verification Badge */}
                <div className="bg-[#FAF7EE] border-2 border-black rounded-xl p-3 flex items-center gap-4">
                  <div className="p-2 bg-white border-2 border-black rounded-xl shrink-0 shadow-retro-sm">
                    <QRCodeSVG
                      value={ticket.id || ticket.identifier || 'PASS-POLIBATAM'}
                      size={72}
                      level="M"
                      includeMargin={false}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[#22C55E] text-xs font-black">
                      <ShieldCheck className="w-4 h-4" /> QR TIKET DIGITAL RESMI
                    </div>
                    <p className="text-[11px] text-black font-mono font-bold">
                      ID: <span className="bg-[#FFE600] px-1.5 py-0.5 rounded border border-black">{ticket.id || 'PASS-POLIBATAM'}</span>
                    </p>
                    <p className="text-[10px] text-neutral-600">
                      {isCheckedIn 
                        ? 'Tiket telah diverifikasi! Semua halaman dan katalog terbuka untuk Anda.'
                        : 'Arahkan QR ini ke kamera scanner panitia di meja registrasi & photobooth untuk verifikasi!'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 btn-retro-yellow flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Cetak / Simpan
              </button>
              <button
                onClick={onClose}
                className="btn-retro-white px-6"
              >
                Tutup
              </button>
            </div>

          </div>
        ) : (
          /* Empty State (Belum Presensi) */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-[#FFE600] border-3 border-black rounded-2xl shadow-retro mx-auto flex items-center justify-center">
              <QrCode className="w-8 h-8 text-black" />
            </div>
            <div className="space-y-2">
              <h4 className="font-display font-black text-xl text-black">
                Kamu Belum Melakukan Presensi
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-sm mx-auto">
                Isi form kehadiran pengunjung untuk mendapatkan Digital Pass resmi bertema Retro Art Showcase dengan pencatatan IP otomatis!
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onGoToPresensi();
              }}
              className="btn-retro-pink w-full py-3"
            >
              Isi Presensi Sekarang ✍️
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
