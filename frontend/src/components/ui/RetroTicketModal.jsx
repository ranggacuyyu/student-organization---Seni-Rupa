import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Clock,
  Ticket,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { EVENT_INFO } from '../../data/mockData';
import { downloadQrCode } from '../../utils/ticketGenerator';

export default function RetroTicketModal({ isOpen, onClose, ticket, onGoToPresensi }) {
  const modalBoxRef = useRef(null);
  const qrCanvasRef = useRef(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  const handleDownloadQr = async () => {
    if (!ticket) return;
    setIsDownloading(true);
    try {
      await downloadQrCode(ticket, qrCanvasRef.current);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to download QR Code:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        ref={modalBoxRef}
        className="relative w-full max-w-lg my-auto bg-[#FAF7EE] border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro-xl overflow-hidden max-h-[92dvh] flex flex-col"
      >
        
        {/* Header Ribbon */}
        <div className="bg-[#FFE600] border-b-3 border-black p-3.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FF3388] border border-black rounded-full animate-ping"></span>
            <h3 className="font-display font-black text-sm sm:text-lg text-black uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-black" /> DIGITAL ATTENDEE PASS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 shadow-retro-sm"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </button>
        </div>

        {ticket ? (
          /* When Ticket Exists */
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
            
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
                  <Sparkles className="w-5 h-5 text-black" />
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
                          <span>TERVERIFIKASI PANITIA</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-black" />
                          <span>STATUS: MENUNGGU SCAN QR</span>
                        </>
                      )}
                    </div>
                  <span className="text-[10px] font-mono uppercase bg-black text-white px-2 py-0.5 rounded">
                    {isCheckedIn ? 'AKSES TERBUKA' : 'BELUM SCAN'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px] truncate">Nama Peserta</span>
                    <strong className="text-sm font-display text-black truncate block" title={ticket.nama_lengkap}>{ticket.nama_lengkap}</strong>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px] truncate">NIM / Identitas</span>
                    <strong className="text-sm font-mono text-black truncate block" title={ticket.identifier || '-'}>{ticket.identifier || '-'}</strong>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px] truncate">Program Studi</span>
                    <span className="font-bold text-neutral-800 text-xs truncate block" title={ticket.jurusan_prodi || 'Polibatam'}>{ticket.jurusan_prodi || 'Polibatam'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-neutral-500 font-semibold block uppercase text-[10px] truncate">IP Log Terdaftar</span>
                    <span className="font-mono text-[11px] bg-[#00F0FF]/30 px-1.5 py-0.5 rounded border border-black text-black font-bold truncate inline-block max-w-full" title={ticket.ip_address || '180.254.88.99'}>
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
                <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <QRCodeCanvas
                      ref={qrCanvasRef}
                      value={ticket.id || ticket.identifier || 'PASS-POLIBATAM'}
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
                  <div className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-1 text-[#22C55E] text-xs font-black">
                      <ShieldCheck className="w-4 h-4" /> QR TIKET DIGITAL RESMI
                    </div>
                    <p className="text-xs text-black font-mono font-bold">
                      ID: <span className="bg-[#FFE600] px-1.5 py-0.5 rounded border border-black">{ticket.id || 'PASS-POLIBATAM'}</span>
                    </p>
                    <p className="text-[11px] text-neutral-600 max-w-xs mx-auto">
                      {isCheckedIn 
                        ? 'Tiket telah diverifikasi! Semua halaman dan katalog terbuka untuk Anda.'
                        : 'Arahkan QR ini ke kamera scanner panitia di meja registrasi untuk verifikasi!'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons (Direct QR Download without browser window.print dialog) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadQr}
                  disabled={isDownloading}
                  className={`flex-1 ${downloadSuccess ? 'btn-retro-lime' : 'btn-retro-yellow'} flex items-center justify-center gap-2 py-3`}
                  title="Download gambar QR Code untuk discan oleh panitia"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Mengunduh QR...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>QR Berhasil Disimpan!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black" />
                      <span>Download QR Code</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="btn-retro-white px-6 py-3"
                >
                  Tutup
                </button>
              </div>

              <p className="text-center text-[11px] text-neutral-500 font-medium">
                File QR otomatis terunduh dan dapat langsung discan panitia baik melalui kamera maupun foto/unggah gambar.
              </p>
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
              className="btn-retro-pink w-full py-3 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>Isi Presensi Sekarang</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
