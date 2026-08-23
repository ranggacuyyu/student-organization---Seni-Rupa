import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
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
  User,
  Shield,
  ChevronRight,
  Rocket,
  Flame
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenTicket, ticketCount, currentUser, onLogout, isVerified }) {
  const navRef = useRef(null);
  const curtainRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [showCurtain, setShowCurtain] = useState(false);

  // Initial Entrance Animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Prevent Body Scrolling when Mobile Drawer or Curtain is Open & Listen for Escape Key
  useEffect(() => {
    if (mobileMenuOpen || showCurtain) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
          setShowCurtain(false);
          setIsPulling(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen, showCurtain]);

  const isProtectedItem = (id) => ['katalog', 'rundown', 'pesan-kesan'].includes(id);
  const isItemLocked = (id) => !currentUser && !isVerified && isProtectedItem(id);

  const publicNavItems = [
    { id: 'home', label: 'Beranda', icon: Palette, desc: 'Halaman utama showcase' },
    ...(!currentUser ? [{ id: 'presensi', label: 'Presensi', icon: UserCheck, highlight: true, desc: 'Check-in cepat deteksi IP' }] : []),
    { 
      id: 'katalog', 
      label: 'Katalog', 
      icon: ImageIcon, 
      isLocked: isItemLocked('katalog'), 
      desc: isItemLocked('katalog') ? 'Wajib Verifikasi QR' : 'Karya lukis & kriya kerajinan' 
    },
    { id: 'denah', label: 'Denah', icon: Map, desc: 'Peta booth Student Centre Lt 3' },
    { 
      id: 'rundown', 
      label: 'Rundown', 
      icon: Clock, 
      isLocked: isItemLocked('rundown'), 
      desc: isItemLocked('rundown') ? 'Wajib Verifikasi QR' : 'Jadwal & live acara pameran' 
    },
    { 
      id: 'pesan-kesan', 
      label: 'Pojok Ekspresi', 
      icon: MessageSquare, 
      isLocked: isItemLocked('pesan-kesan'), 
      desc: isItemLocked('pesan-kesan') ? 'Wajib Verifikasi QR' : 'Papan ulasan & sticky notes' 
    },
  ];

  const adminNavItems = [];
  if (currentUser) {
    adminNavItems.push({ 
      id: 'panitia', 
      label: 'Portal Panitia', 
      icon: QrCode, 
      badgeColor: 'bg-[#FFE600] text-black',
      desc: 'Scan QR & kelola kebutuhan peserta' 
    });
    if (currentUser.role === 'admin') {
      adminNavItems.push({ 
        id: 'admin', 
        label: 'Super Admin', 
        icon: ShieldAlert, 
        badgeColor: 'bg-[#FF3388] text-white',
        desc: 'Kelola akun panitia & master data' 
      });
    }
  }

  const allNavItems = [...publicNavItems, ...adminNavItems];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Theatrical Curtain Pull Action Animation
  const handlePullCurtain = () => {
    if (isPulling) return;
    setIsPulling(true);
    setShowCurtain(true);
    setMobileMenuOpen(false);

    // Fire celebratory confetti bursts
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.15, x: 0.2 },
        colors: ['#FFE600', '#FF3388', '#00F0FF', '#7B2CBF', '#CCFF00']
      });
    } catch {
      // Ignored if canvas not ready
    }

    // Trigger GSAP Roll-Down Curtain Effect
    requestAnimationFrame(() => {
      if (curtainRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            setActiveTab('coming-soon');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Roll curtain back up smoothly to reveal the Coming Soon page
            gsap.to(curtainRef.current, {
              y: '-100%',
              duration: 0.45,
              ease: 'power3.in',
              onComplete: () => {
                setShowCurtain(false);
                setIsPulling(false);
              }
            });
          }
        });

        tl.fromTo(
          curtainRef.current,
          { y: '-100%' },
          { y: '0%', duration: 0.45, ease: 'back.out(1.4)' }
        ).to({}, { duration: 0.65 }); // Brief dramatic pause for presentation
      } else {
        setTimeout(() => {
          setActiveTab('coming-soon');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowCurtain(false);
          setIsPulling(false);
        }, 900);
      }
    });
  };

  return (
    <>
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
        <div className="w-full mx-auto py-3 sm:py-4 px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between relative">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group transition-transform active:scale-95 shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#FF3388] border-2 sm:border-3 border-black rounded-xl shadow-retro-sm sm:shadow-retro flex items-center justify-center text-white group-hover:rotate-6 transition-transform shrink-0">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-base sm:text-xl tracking-tight text-black truncate">
                  ART SHOWCASE
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] font-semibold text-neutral-600 tracking-tight truncate">
                Divisi Seni Rupa Polibatam
              </p>
            </div>
          </button>

          {/* Desktop Nav Links (Responsive scaling for lg to xl screens) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSpecialAdmin = item.id === 'admin';
              const isSpecialPanitia = item.id === 'panitia';

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 lg:px-2.5 lg:py-1.5 xl:px-3.5 xl:py-2 rounded-xl font-display text-xs xl:text-sm font-bold border-2 transition-all duration-150 active:scale-95 ${
                    isActive
                      ? 'bg-[#121212] text-white border-black shadow-retro-sm -translate-y-0.5'
                      : isSpecialAdmin
                      ? 'bg-[#FF3388]/15 text-black border-black hover:bg-[#FF3388] hover:text-white hover:-translate-y-0.5 shadow-retro-sm'
                      : isSpecialPanitia
                      ? 'bg-[#FFE600]/30 text-black border-black hover:bg-[#FFE600] hover:-translate-y-0.5 shadow-retro-sm'
                      : item.highlight
                      ? 'bg-[#FFE600] text-black border-black hover:bg-[#FFF04D] hover:-translate-y-0.5 shadow-retro-sm'
                      : 'bg-transparent text-neutral-800 border-transparent hover:bg-[#00F0FF] hover:border-black/30'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${
                    isActive ? 'text-[#00F0FF]' : isSpecialAdmin ? 'text-[#FF3388]' : item.highlight ? 'text-black' : 'text-neutral-700'
                  }`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.isLocked && (
                    <span className="text-[10px] opacity-70 ml-0.5">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons (User / Login / Ticket / Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Digital Ticket Button (Only for visitors / not logged in) */}
            {!currentUser && (
              <button
                onClick={onOpenTicket}
                className="flex items-center gap-1 sm:gap-2 bg-[#00F0FF] text-black font-display font-bold text-[11px] sm:text-sm px-2 sm:px-3.5 py-1.5 sm:py-2 border-2 sm:border-3 border-black rounded-xl shadow-retro-sm sm:shadow-retro hover:bg-[#33F3FF] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all active:scale-95"
                title="Lihat Bukti Tiket Presensi Digital"
              >
                <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black shrink-0" />
                <span className="inline sm:inline">Tiket</span>
                {ticketCount > 0 && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-[#FF3388] text-white text-[9px] sm:text-[10px] font-black rounded-full border border-black flex items-center justify-center animate-bounce shrink-0">
                    1
                  </span>
                )}
              </button>
            )}

            {/* User Auth Status / Login Button (Desktop / Tablet) */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <div 
                  onClick={() => handleNavClick(currentUser.role === 'admin' ? 'admin' : 'panitia')}
                  className="flex items-center gap-2 bg-white border-2 sm:border-3 border-black px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-retro-sm cursor-pointer hover:bg-[#FFE600]/20 transition-all"
                  title="Buka Portal Petugas"
                >
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border border-black flex items-center justify-center font-black text-[9px] sm:text-[10px] ${
                    currentUser.role === 'admin' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'
                  }`}>
                    {currentUser.role === 'admin' ? '👑' : '📋'}
                  </div>
                  <span className="text-xs font-black text-black max-w-[90px] xl:max-w-[120px] truncate">
                    {currentUser.nama.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 bg-white border-2 border-black rounded-xl hover:bg-red-50 text-red-500 shadow-retro-sm active:scale-95"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="hidden sm:flex items-center gap-1.5 bg-[#FAF7EE] text-black font-display font-bold text-xs sm:text-sm px-3 py-1.5 sm:py-2 border-2 border-black rounded-xl hover:bg-[#FFE600] shadow-retro-sm transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login Petugas</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 border-2 sm:border-3 border-black rounded-xl shadow-retro-sm sm:shadow-retro transition-colors active:translate-x-0.5 active:translate-y-0.5 ${
                mobileMenuOpen ? 'bg-[#FF3388] text-white' : 'bg-white text-black hover:bg-[#FFE600]'
              }`}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu Navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* ================= TARIKAN HORDEN / BLIND PULL CORD (RESPONSIF HP) ================= */}
        <div className="lg:hidden absolute -bottom-9 left-4 sm:left-6 z-40 flex flex-col items-center select-none pointer-events-auto">
          {/* Top Brass Ring Mount on Navbar Border */}
          <div className="w-2.5 h-1.5 bg-[#FFE600] border-2 border-black rounded-t -mt-0.5" />

          {/* Elastic Hanging Cord String */}
          <div 
            className={`w-[2.5px] bg-black transition-all duration-300 origin-top shadow-[1px_0px_0px_#fff] ${
              isPulling ? 'h-9 bg-[#FF3388]' : 'h-4'
            }`} 
          />

          {/* Pull Knob / Charm Badge */}
          <button
            onClick={handlePullCurtain}
            className={`-mt-0.5 group flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border-2 border-black font-display font-black text-[9px] sm:text-[10px] tracking-wider transition-all duration-200 active:scale-90 shadow-retro-sm ${
              isPulling 
                ? 'bg-[#FF3388] text-white translate-y-3 rotate-6' 
                : activeTab === 'coming-soon'
                ? 'bg-[#CCFF00] text-black hover:bg-[#FFE600]'
                : 'bg-[#FFE600] text-black hover:bg-[#FF3388] hover:text-white animate-bounce'
            }`}
            title="Tarik untuk melihat Coming Soon!"
            aria-label="Tarik horden Coming Soon"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#FF3388] group-hover:text-white shrink-0" />
            <span className="whitespace-nowrap font-bold">
              {activeTab === 'coming-soon' ? 'PROKER' : 'PROKER SOON'}
            </span>
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7EE] border-t-2 border-black/10 border-b-3 border-black px-3.5 sm:px-5 pt-3 pb-8 max-h-[calc(100dvh-4.5rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain animate-in slide-in-from-top-2 duration-200">
            
            {/* Logged-In User Profile Card Banner on Mobile */}
            {currentUser && (
              <div className="mb-3.5 p-3 sm:p-3.5 bg-white border-2 border-black rounded-2xl shadow-retro-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center text-base shrink-0 ${
                    currentUser.role === 'admin' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'
                  }`}>
                    {currentUser.role === 'admin' ? '👑' : '📋'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-xs sm:text-sm text-black truncate">
                        {currentUser.nama}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.2 rounded border border-black ${
                        currentUser.role === 'admin' ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black'
                      }`}>
                        {currentUser.role === 'admin' ? 'SUPER ADMIN' : 'PANITIA'}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium truncate">
                        {currentUser.divisi || 'Petugas'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-black rounded-xl shadow-retro-sm shrink-0 active:scale-95"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Special Section: Admin / Panitia Management Links */}
            {adminNavItems.length > 0 && (
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#FF3388]" /> Portal Manajemen & Kontrol
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isSuperAdmin = item.id === 'admin';

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl font-display text-sm sm:text-base font-bold border-2 text-left transition-all active:scale-98 ${
                          isActive
                            ? 'bg-[#121212] text-white border-black shadow-retro-sm'
                            : isSuperAdmin
                            ? 'bg-[#FF3388]/10 hover:bg-[#FF3388]/20 text-black border-black shadow-retro-sm'
                            : 'bg-[#FFE600]/20 hover:bg-[#FFE600]/30 text-black border-black shadow-retro-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded-lg border border-black shrink-0 ${
                            isActive 
                              ? (isSuperAdmin ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black')
                              : (isSuperAdmin ? 'bg-[#FF3388] text-white' : 'bg-[#FFE600] text-black')
                          }`}>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-display font-black text-xs sm:text-sm flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {isSuperAdmin && (
                                <span className="text-[9px] bg-[#FF3388] text-white px-1.5 py-0.2 rounded border border-black font-mono">
                                  MASTER
                                </span>
                              )}
                            </div>
                            <div className={`text-[11px] font-normal truncate ${isActive ? 'text-neutral-300' : 'text-neutral-600'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00F0FF]' : 'text-neutral-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Standard Navigation Links Section */}
            <div className="space-y-1.5">
              {adminNavItems.length > 0 && (
                <div className="flex items-center justify-between px-1 pt-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-[#00F0FF]" /> Menu Pameran
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {publicNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl font-display text-xs sm:text-sm font-bold border-2 text-left transition-all active:scale-98 ${
                        isActive
                          ? 'bg-[#121212] text-white border-black shadow-retro-sm'
                          : item.highlight
                          ? 'bg-[#FFE600] text-black border-black shadow-retro-sm'
                          : 'bg-white text-black border-black/25 hover:bg-neutral-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg border border-black shrink-0 ${
                        isActive ? 'bg-[#00F0FF] text-black' : 'bg-[#FAF7EE] text-black'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-display font-bold text-xs sm:text-sm truncate flex items-center justify-between gap-1">
                          <span>{item.label}</span>
                          {item.isLocked && (
                            <span className="text-[9px] bg-[#FF3388]/15 text-[#FF3388] px-1.5 py-0.2 rounded border border-[#FF3388]/30 font-mono font-bold">
                              🔒 TERKUNCI
                            </span>
                          )}
                        </div>
                        <div className={`text-[10px] font-normal truncate ${isActive ? 'text-neutral-300' : item.isLocked ? 'text-[#FF3388]' : 'text-neutral-500'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer: Auth Action */}
            <div className="pt-3 mt-3 border-t-2 border-dashed border-neutral-300">
              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-black rounded-xl font-display font-bold text-xs sm:text-sm shadow-retro-sm active:scale-95 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun ({currentUser.nama})</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-[#FFE600] hover:bg-[#FFF04D] text-black border-2 border-black rounded-xl font-display font-bold text-xs sm:text-sm shadow-retro-sm active:scale-95 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login Petugas / Panitia</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ================= THEATRICAL CURTAIN DROP ANIMATION OVERLAY ================= */}
      {showCurtain && (
        <div className="fixed inset-0 top-0 z-50 pointer-events-none flex flex-col justify-start overflow-hidden">
          <div 
            ref={curtainRef}
            className="w-full bg-[#121212] border-b-6 border-[#FFE600] shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden bg-retro-dots"
          >
            {/* Memphis Pattern overlay inside curtain */}
            <div className="absolute inset-0 bg-retro-stripes opacity-15 pointer-events-none" />
            
            <div className="relative z-10 space-y-3.5 py-10 sm:py-14">
              <div className="inline-flex items-center gap-2 bg-[#FFE600] text-black font-display font-black text-xs sm:text-sm px-4 py-1.5 rounded-full border-3 border-black shadow-retro-sm animate-bounce">
                <Sparkles className="w-4 h-4 text-[#FF3388] animate-spin" /> MEMBUKA TIRAI RAHASIA...
              </div>

              <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                COMING{' '}
                <span className="bg-[#FF3388] text-white px-3.5 py-1 rounded-2xl border-3 border-black shadow-retro inline-block rotate-[-3deg]">
                  SOON! 
                </span>
              </h2>

              <p className="text-neutral-300 text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto font-medium leading-relaxed">
                Menarik tirai panggung agenda & program kerja spektakuler Seni Rupa Polibatam berikutnya...
              </p>
            </div>

            {/* Theatrical Scalloped Teeth Bottom Edge of the Curtain */}
            <div className="absolute -bottom-3 left-0 right-0 h-5 flex justify-around overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="w-6 h-6 bg-[#FFE600] border-2 border-black rounded-full -mt-3 shrink-0 shadow-retro-sm" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop Overlay when Mobile Menu is Open */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 top-[100px] bg-black/40 backdrop-blur-xs z-30 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
}
