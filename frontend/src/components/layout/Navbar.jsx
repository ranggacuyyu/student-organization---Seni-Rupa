import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  Palette, 
  UserCheck, 
  Image as ImageIcon, 
  Map, 
  Clock, 
  MessageSquare, 
  ShieldAlert, 
  Menu, 
  X, 
  Ticket, 
  Sparkles,
  QrCode,
  Lock,
  LogOut,
  User
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenTicket, ticketCount, currentUser, onLogout }) {
  const navRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const navItems = [
    { id: 'home', label: 'Beranda', icon: Palette },
    ...(!currentUser ? [{ id: 'presensi', label: 'Presensi', icon: UserCheck, highlight: true }] : []),
    { id: 'katalog', label: 'Katalog', icon: ImageIcon },
    { id: 'denah', label: 'Denah', icon: Map },
    { id: 'rundown', label: 'Rundown', icon: Clock },
    { id: 'pesan-kesan', label: 'Pojok Ekspresi', icon: MessageSquare },
  ];

  // Tambahkan link portal panitia jika sudah login sebagai panitia atau admin
  if (currentUser) {
    navItems.push({ id: 'panitia', label: 'Portal Panitia', icon: QrCode, badgeColor: 'bg-[#FFE600]' });
    if (currentUser.role === 'admin') {
      navItems.push({ id: 'admin', label: 'Super Admin', icon: ShieldAlert, badgeColor: 'bg-[#FF3388]' });
    }
  }

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header ref={navRef} className="sticky top-0 z-40 w-full bg-[#FAF7EE]/95 backdrop-blur-md border-b-3 border-black">
      {/* Top Retro Marquee Ticker */}
      <div className="bg-[#FFE600] border-b-2 border-black py-1 overflow-hidden font-display text-xs font-bold tracking-wider select-none">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3388] animate-spin" /> PROKER RESMI DIVISI SENI RUPA POLIBATAM
          </span>
          <span className="mx-4">★</span>
          <span className="mx-4">TEMA: HISTORY (MENGGALI JEJAK KARYA & PERJALANAN)</span>
          <span className="mx-4">★</span>
          <span className="mx-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" /> ART SHOW CASE 2026  
          </span>
          <span className="mx-4">★</span>
          <span className="mx-4">TEMA: HISTORY (MENGGALI JEJAK KARYA & PERJALANAN)</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95"
        >
          <div className="w-11 h-11 bg-[#FF3388] border-3 border-black rounded-xl shadow-retro flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl tracking-tight text-black">
                ART SHOWCASE
              </span>
            </div>
            <p className="text-[11px] font-semibold text-neutral-600 tracking-tight">
              Divisi Seni Rupa Polibatam
            </p>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-display text-sm font-bold border-2 transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-[#121212] text-white border-black shadow-retro-sm -translate-y-0.5'
                    : item.highlight
                    ? 'bg-[#FFE600] text-black border-black hover:bg-[#FFF04D] hover:-translate-y-0.5 shadow-retro-sm'
                    : 'bg-transparent text-neutral-800 border-transparent hover:bg-[#00F0FF] hover:border-black/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00F0FF]' : item.highlight ? 'text-black' : 'text-neutral-700'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons (User / Login / Ticket / Mobile Toggle) */}
        <div className="flex items-center gap-2.5">
          
          {/* Digital Ticket Button (Only for visitors / not logged in) */}
          {!currentUser && (
            <button
              onClick={onOpenTicket}
              className="flex items-center gap-2 bg-[#00F0FF] text-black font-display font-bold text-xs sm:text-sm px-3.5 py-2 border-3 border-black rounded-xl shadow-retro hover:bg-[#33F3FF] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all active:scale-95"
              title="Lihat Bukti Tiket Presensi Digital"
            >
              <Ticket className="w-4 h-4 text-black" />
              <span className="hidden sm:inline">Tiket Saya</span>
              {ticketCount > 0 && (
                <span className="w-5 h-5 bg-[#FF3388] text-white text-[10px] font-black rounded-full border border-black flex items-center justify-center animate-bounce">
                  1
                </span>
              )}
            </button>
          )}

          {/* User Auth Status / Login Button */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <div 
                onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'panitia')}
                className="flex items-center gap-2 bg-white border-3 border-black px-3 py-1.5 rounded-xl shadow-retro-sm cursor-pointer hover:bg-[#FFE600]/20 transition-all"
                title="Buka Portal Petugas"
              >
                <div className={`w-6 h-6 rounded-lg border border-black flex items-center justify-center font-black text-[10px] ${currentUser.role === 'admin' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'}`}>
                  {currentUser.role === 'admin' ? '👑' : '📋'}
                </div>
                <span className="text-xs font-black text-black max-w-[100px] truncate">{currentUser.nama.split(' ')[0]}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 bg-white border-2 border-black rounded-xl hover:bg-red-50 text-red-500 shadow-retro-sm active:scale-95"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('login')}
              className="hidden sm:flex items-center gap-1.5 bg-[#FAF7EE] text-black font-display font-bold text-xs sm:text-sm px-3.5 py-2 border-2 border-black rounded-xl hover:bg-[#FFE600] shadow-retro-sm transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login Petugas</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white border-3 border-black rounded-xl shadow-retro text-black active:translate-x-0.5 active:translate-y-0.5"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7EE] border-b-3 border-black px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-display text-base font-bold border-2 text-left transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#121212] text-white border-black shadow-retro'
                    : item.highlight
                    ? 'bg-[#FFE600] text-black border-black shadow-retro-sm'
                    : 'bg-white text-black border-black/30 hover:bg-neutral-100'
                }`}
              >
                <div className={`p-1.5 rounded-lg border border-black ${isActive ? 'bg-[#FF3388] text-white' : 'bg-[#00F0FF] text-black'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-display font-bold">{item.label}</div>
                  <div className="text-xs text-neutral-500 font-normal">
                    {item.id === 'presensi' && 'Check-in cepat dengan deteksi IP'}
                    {item.id === 'katalog' && 'Karya lukis & kriya kerajinan'}
                    {item.id === 'denah' && 'Peta booth Student Centre Lt 3'}
                    {item.id === 'rundown' && 'Jadwal & live acara pameran'}
                    {item.id === 'pesan-kesan' && 'Papan ulasan & sticky notes'}
                    {item.id === 'panitia' && 'Scan QR & kelola kebutuhan peserta'}
                    {item.id === 'admin' && 'Kelola akun panitia & master data'}
                    {item.id === 'home' && 'Halaman utama showcase'}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Mobile Login / Logout Button */}
          <div className="pt-2 border-t-2 border-dashed border-neutral-300">
            {currentUser ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border-2 border-black rounded-xl font-display font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar ({currentUser.nama})</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFE600] text-black border-2 border-black rounded-xl font-display font-bold text-sm shadow-retro-sm"
              >
                <Lock className="w-4 h-4" />
                <span>Login Petugas / Panitia</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


