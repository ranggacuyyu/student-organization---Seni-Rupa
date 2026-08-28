import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  Flame, 
  Camera, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Music, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check
} from 'lucide-react';

/**
 * =========================================================================
 * KONFIGURASI VIDEO & SOROTAN RESMI INSTAGRAM (@srkuaspolbat)
 * =========================================================================
 * Responsif penuh untuk semua ukuran layar (Mobile, Tablet, Desktop, Fullscreen).
 */
export const OFFICIAL_IG_CONFIG = {
  username: 'srkuaspolbat',
  profileUrl: 'https://www.instagram.com/srkuaspolbat',
  displayName: 'Divisi Seni Rupa Polibatam',
  bio: 'Official Instagram of Seni Rupa Polibatam. Ruang eksplorasi karya, lukis, mural, dan kreativitas mahasiswa.',
};

export const OFFICIAL_IG_HIGHLIGHTS = [
  {
    id: 'perkenalan-senrup',
    title: 'Perkenalan Divisi Seni Rupa',
    tag: 'Reels Resmi',
    badgeColor: 'bg-[#FF3388] text-white',
    category: 'Profil & Pengenalan Divisi',
    audioTitle: 'Seni Rupa Polibatam • Sesi Pengenalan',
    likesCount: '1.2k',
    commentsCount: '64',
    description: 'Video pengenalan resmi Divisi Seni Rupa Politeknik Negeri Batam: Mengenal visi, karya, dan semangat kreativitas kami.',
    videoUrl: '/videos/perkenalan.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: '/fotos/profile-senrup.jpeg',
    igUrl: 'https://www.instagram.com/reel/Cz0xOT1x8MN/?igsi=YXVzOG51MnRpZXZp'
  },
  {
    id: 'latihan-rutin',
    title: 'Latihan Rutin',
    tag: 'Sorotan Cerita',
    badgeColor: 'bg-[#FFE600] text-black',
    category: 'Aktivitas Internal',
    audioTitle: 'Vibes Studio • Sesi Melukis Rutin',
    likesCount: '890',
    commentsCount: '42',
    description: 'Dokumentasi sorotan sesi latihan rutin menggambar sketsa, teknik sapuan kuas, dan kolaborasi karya bersama anggota.',
    videoUrl: '/videos/latihan-rutin.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1460661419200-fd4357a09be4?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: '/fotos/profile-senrup.jpeg',
    igUrl: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODY1ODk4NjM1NDQzNDM2?story_media_id=3702588706114146991_9043919714&igsi=eHczNHF5eGpieGdn'
  },
  {
    id: 'pbf-expo',
    title: 'Event PBF EXPO',
    tag: 'Sorotan Event',
    badgeColor: 'bg-[#00F0FF] text-black',
    category: 'Pameran & Expo Akbar',
    audioTitle: 'PBF Expo Live • Sorotan Acara',
    likesCount: '1.5k',
    commentsCount: '98',
    description: 'Sorotan keseruan dan keikutsertaan pameran stan Divisi Seni Rupa dalam gelaran akbar PBF EXPO Polibatam.',
    videoUrl: '/videos/pbf-expo.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: '/fotos/profile-senrup.jpeg',
    igUrl: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODY1ODk4NjM1NDQzNDM2?story_media_id=3703942511724358835_9043919714&igsi=eHczNHF5eGpieGdn'
  }
];

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function EventRecapVideo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('00:00');
  const [durationFormatted, setDurationFormatted] = useState('00:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [tapRipple, setTapRipple] = useState(null);

  // Scroll & Drag State for Reels Tray
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const trayRef = useRef(null);

  // Drag tracking refs
  const dragStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  const currentVideo = OFFICIAL_IG_HIGHLIGHTS[selectedIdx] || OFFICIAL_IG_HIGHLIGHTS[0];

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const triggerControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 3500);
  }, []);

  // Update Left/Right Scroll Arrows state
  const updateScrollButtons = useCallback(() => {
    if (!trayRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trayRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trayRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // Smooth scroll helper for Next / Prev buttons
  const scrollTray = (direction) => {
    if (!trayRef.current) return;
    const step = 260;
    const targetScroll = direction === 'left' 
      ? trayRef.current.scrollLeft - step 
      : trayRef.current.scrollLeft + step;
    
    trayRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Auto-scroll card into view
  const scrollToCard = useCallback((idx) => {
    if (!trayRef.current) return;
    const cards = trayRef.current.children;
    if (cards && cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, []);

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    if (!trayRef.current) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.pageX - trayRef.current.offsetLeft;
    scrollLeftStartRef.current = trayRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !trayRef.current) return;
    e.preventDefault();
    const x = e.pageX - trayRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    trayRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch swipe tracking handlers
  const handleTouchStart = (e) => {
    if (!trayRef.current || !e.touches[0]) return;
    hasMovedRef.current = false;
    dragStartXRef.current = e.touches[0].pageX - trayRef.current.offsetLeft;
    scrollLeftStartRef.current = trayRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!trayRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - trayRef.current.offsetLeft;
    const walk = x - dragStartXRef.current;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
  };

  // IntersectionObserver: Auto-play when video scrolls into view, auto-pause when scrolled away
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  triggerControlsTimer();
                })
                .catch(() => {});
            }
          } else {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
              setShowControls(true);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [selectedIdx, triggerControlsTimer]);

  // Video Events
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
    setCurrentTimeFormatted(formatTime(current));
    setDurationFormatted(formatTime(duration));
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDurationFormatted(formatTime(videoRef.current.duration));
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          triggerControlsTimer();
        })
        .catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    const nextMute = !videoRef.current.muted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
    triggerControlsTimer();
  };

  const handleSeek = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clickPos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const seekTime = clickPos * videoRef.current.duration;
    
    if (!isNaN(seekTime)) {
      videoRef.current.currentTime = seekTime;
      setProgress(clickPos * 100);
      setCurrentTimeFormatted(formatTime(seekTime));
    }
    triggerControlsTimer();
  };

  const handleRestart = (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play()
      .then(() => {
        setIsPlaying(true);
        triggerControlsTimer();
      })
      .catch(console.error);
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!playerWrapperRef.current) return;

    const elem = playerWrapperRef.current;
    const isCurrentlyFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!isCurrentlyFs) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(console.error);
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const handleCanvasTap = (e) => {
    // If controls are hidden, show controls
    if (!showControls) {
      triggerControlsTimer();
      return;
    }

    // If controls are already shown, toggle play
    togglePlay(e);
  };

  const handleSelectHighlight = (idx) => {
    setSelectedIdx(idx);
    setIsPlaying(true);
    setProgress(0);
    setIsLiked(false);
    setShowControls(true);
    triggerControlsTimer();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleCardClick = (idx) => {
    if (hasMovedRef.current) return;
    handleSelectHighlight(idx);
    scrollToCard(idx);
  };

  return (
    <div 
      ref={containerRef} 
      className="card-retro p-3.5 sm:p-6 md:p-7 bg-[#FFFDF5] border-2 sm:border-3 border-black text-black space-y-4 sm:space-y-6 text-left relative overflow-hidden shadow-retro-lg"
    >
      {/* Background Memphis Accent Shapes */}
      <div className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 bg-[#FFE600] rounded-full border-2 sm:border-3 border-black -z-10 opacity-30 pointer-events-none"></div>
      <div className="absolute -bottom-8 -left-8 w-20 h-20 sm:w-24 sm:h-24 bg-[#00F0FF] rounded-3xl border-2 sm:border-3 border-black rotate-12 -z-10 opacity-30 pointer-events-none"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 sm:border-b-3 border-black pb-3 sm:pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#FF3388] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded border border-black uppercase shadow-retro-xs">
            <Sparkles className="w-3 h-3" /> OFFICIAL RECAP FEED
          </div>
          <h2 className="font-display font-black text-lg sm:text-2xl md:text-3xl text-black tracking-tight flex items-center gap-2">
            <span>Pemutar Sorotan Seni Rupa</span>
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF3388] shrink-0" />
          </h2>
        </div>

        {/* Action Button: Follow IG */}
        <div className="w-full sm:w-auto shrink-0">
          <a
            href={OFFICIAL_IG_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-retro-pink w-full sm:w-auto text-xs sm:text-sm font-black px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-retro-sm flex items-center justify-center gap-2"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Kunjungi @{OFFICIAL_IG_CONFIG.username}</span>
          </a>
        </div>
      </div>

      {/* INSTAGRAM HIGHLIGHTS / REELS SELECTOR (RESPONSIVE CAROUSEL ON MOBILE, GRID ON DESKTOP) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-neutral-800 px-0.5">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ee2a7b]" /> PILIH SOROTAN UNTUK DIPUTAR:
          </span>

          {/* Quick Navigation Arrows for Mobile / Small Screens */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <button
              onClick={() => scrollTray('left')}
              disabled={!canScrollLeft}
              className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center font-bold text-xs transition-all ${
                canScrollLeft 
                  ? 'bg-[#FFE600] text-black shadow-retro-xs active:translate-x-0.5 active:translate-y-0.5 cursor-pointer' 
                  : 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-50'
              }`}
              title="Geser ke Kiri"
              aria-label="Geser ke Kiri"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTray('right')}
              disabled={!canScrollRight}
              className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center font-bold text-xs transition-all ${
                canScrollRight 
                  ? 'bg-[#FFE600] text-black shadow-retro-xs active:translate-x-0.5 active:translate-y-0.5 cursor-pointer' 
                  : 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-50'
              }`}
              title="Geser ke Kanan"
              aria-label="Geser ke Kanan"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="hidden sm:inline-block text-[10px] sm:text-[11px] text-neutral-500 font-mono">
            {OFFICIAL_IG_HIGHLIGHTS.length} Video Tersedia
          </span>
        </div>

        {/* Highlights Selector Tray: Horizontal Scroll & Drag Support */}
        <div 
          ref={trayRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`flex sm:grid sm:grid-cols-3 gap-2.5 sm:gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 touch-pan-x overscroll-x-contain select-none -mx-1 px-1 transition-colors ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default'
          }`}
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {OFFICIAL_IG_HIGHLIGHTS.map((item, idx) => {
            const isCurrent = idx === selectedIdx;
            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(idx);
                  }
                }}
                className={`flex-shrink-0 w-[240px] xs:w-[260px] sm:w-auto p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black text-left transition-all duration-150 flex items-start gap-2.5 sm:gap-3 relative cursor-pointer select-none ${
                  isCurrent 
                    ? 'bg-white shadow-retro -translate-y-0.5 sm:-translate-y-1 ring-2 ring-[#ee2a7b] border-[#FF3388]' 
                    : 'bg-neutral-50/90 hover:bg-white shadow-retro-sm opacity-90 hover:opacity-100'
                }`}
              >
                {/* Bubble Avatar with Instagram Gradient Ring */}
                <div className={`p-[2px] rounded-full shrink-0 pointer-events-none ${
                  isCurrent 
                    ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-sm' 
                    : 'bg-neutral-300'
                }`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-black relative bg-neutral-900">
                    <img 
                      src={item.avatarUrl || item.posterUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1 space-y-1 pointer-events-none">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[8.5px] sm:text-[9px] font-black px-1.5 py-0.5 rounded border border-black uppercase ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    {isCurrent && (
                      <span className="text-[8.5px] sm:text-[9px] font-black text-[#ee2a7b] flex items-center gap-0.5 animate-pulse">
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Memutar
                      </span>
                    )}
                  </div>
                  <h4 className={`font-display font-black text-xs sm:text-sm truncate ${
                    isCurrent ? 'text-[#ee2a7b]' : 'text-black'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-600 line-clamp-1">
                    {item.category}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Reel Dots / Indicator Strip */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-1">
          {OFFICIAL_IG_HIGHLIGHTS.map((item, idx) => {
            const isCurrent = idx === selectedIdx;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSelectHighlight(idx);
                  scrollToCard(idx);
                }}
                className={`h-2 rounded-full border border-black transition-all ${
                  isCurrent ? 'w-6 bg-[#FF3388]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
                title={`Pilih ${item.title}`}
                aria-label={`Pilih ${item.title}`}
              />
            );
          })}
        </div>
      </div>

      {/* MAIN RETRO HTML5 VIDEO PLAYER (PROPORTIONAL RESPONSIVE CANVAS) */}
      <div 
        ref={playerWrapperRef}
        onMouseMove={triggerControlsTimer}
        onTouchStart={triggerControlsTimer}
        className={`relative w-full aspect-[4/5] xs:aspect-[1/1] sm:aspect-video md:aspect-[16/10] lg:aspect-video min-h-[320px] sm:min-h-[400px] md:min-h-[460px] lg:min-h-[500px] max-h-[580px] bg-[#1a1a1a] border-2 sm:border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro overflow-hidden group select-none transition-all duration-300 ${
          isFullscreen ? '!fixed !inset-0 !z-50 !h-screen !w-screen !max-h-none !min-h-0 !rounded-none !border-none !aspect-auto !shadow-none' : ''
        }`}
      >
        {/* Retro Header Mac / Film Strip Bar */}
        <div className="bg-[#141414] border-b-2 sm:border-b-3 border-black px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-white text-[11px] sm:text-xs font-mono z-30 relative shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF3388] border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFE600] border border-black inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00F0FF] border border-black inline-block"></span>
            </div>
            <span className="font-bold text-[11px] sm:text-xs text-neutral-300 ml-0.5 truncate">
              {currentVideo.title} • {currentVideo.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs shrink-0">
            {isPlaying ? (
              <span className="inline-flex items-center gap-1 bg-[#CCFF00] text-black font-black px-1.5 sm:px-2 py-0.5 rounded border border-black animate-pulse text-[9px] sm:text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span> PLAYING
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-neutral-700 text-white font-bold px-1.5 sm:px-2 py-0.5 rounded border border-neutral-600 text-[9px] sm:text-[10px]">
                PAUSED
              </span>
            )}
          </div>
        </div>

        {/* Video Canvas Container */}
        <div 
          onClick={handleCanvasTap}
          className="relative w-full h-[calc(100%-35px)] sm:h-[calc(100%-41px)] bg-[#242424] flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {/* Subtle Ambient Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-125 pointer-events-none transition-all duration-500"
            style={{ backgroundImage: `url(${currentVideo.posterUrl})` }}
          />

          {/* HTML5 Video with object-contain */}
          <video
            ref={videoRef}
            src={currentVideo.videoUrl}
            poster={currentVideo.posterUrl}
            playsInline
            muted={isMuted}
            loop
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-contain relative z-10"
          />

          {/* Protective Gradient Overlay at Bottom for enhanced text contrast */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-10" />

          {/* INSTAGRAM REEL WATERMARK & INFO OVERLAY (BOTTOM LEFT) */}
          <div 
            className={`absolute left-3 sm:left-4 right-14 sm:right-16 text-white z-20 pointer-events-none drop-shadow-md space-y-1 sm:space-y-1.5 transition-all duration-300 ${
              showControls ? 'bottom-14 sm:bottom-16' : 'bottom-3 sm:bottom-4'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto flex-wrap">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shrink-0">
                <img 
                  src={currentVideo.avatarUrl || currentVideo.posterUrl} 
                  alt="avatar" 
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full object-cover border border-white"
                />
              </div>
              <a
                href={currentVideo.igUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-display font-black text-xs sm:text-sm text-white hover:text-[#FFE600] flex items-center gap-1"
              >
                @{OFFICIAL_IG_CONFIG.username}
                <span className="w-3.5 h-3.5 bg-[#00F0FF] text-black rounded-full inline-flex items-center justify-center font-bold">
                  <Check className="w-2.5 h-2.5" />
                </span>
              </a>
              <span className="bg-white/20 backdrop-blur-xs border border-white/40 text-[8.5px] sm:text-[9.5px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                {currentVideo.tag}
              </span>
            </div>

            <p className="text-[10.5px] sm:text-xs text-neutral-200 line-clamp-1 xs:line-clamp-2 leading-tight sm:leading-snug max-w-lg">
              {currentVideo.description}
            </p>

            <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] text-neutral-300 font-mono">
              <Music className="w-3 h-3 text-[#FFE600] shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs">{currentVideo.audioTitle}</span>
            </div>
          </div>

          {/* INSTAGRAM REEL INTERACTION SIDEBAR (RIGHT SIDE) */}
          <div 
            className={`absolute right-2 sm:right-3 flex flex-col items-center gap-2 sm:gap-2.5 md:gap-3 z-20 pointer-events-auto transition-all duration-300 ${
              showControls ? 'bottom-14 sm:bottom-16' : 'bottom-3 sm:bottom-4'
            }`}
          >
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="flex flex-col items-center group/btn cursor-pointer active:scale-90 transition-transform"
              title="Suka Video Ini"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center shadow-retro-sm transition-all ${
                isLiked ? 'bg-[#FF3388] text-white scale-110' : 'bg-black/60 backdrop-blur-sm text-white hover:bg-black/80'
              }`}>
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow mt-0.5">
                {isLiked ? 'Liked' : currentVideo.likesCount}
              </span>
            </button>

            {/* Comments Badge */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-black/60 backdrop-blur-sm border-2 border-black text-white flex items-center justify-center shadow-retro-sm">
                <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-white drop-shadow mt-0.5">
                {currentVideo.commentsCount}
              </span>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              className="flex flex-col items-center cursor-pointer active:scale-90 transition-transform"
              title="Simpan Video"
            >
              <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 border-black flex items-center justify-center shadow-retro-sm transition-all ${
                isSaved ? 'bg-[#FFE600] text-black scale-110' : 'bg-black/60 backdrop-blur-sm text-white hover:bg-black/80'
              }`}>
                <Bookmark className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${isSaved ? 'fill-current' : ''}`} />
              </div>
            </button>

            {/* Direct Open in Instagram */}
            <a
              href={currentVideo.igUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border-2 border-black text-white flex items-center justify-center shadow-retro-sm hover:scale-110 active:scale-95 transition-transform"
              title="Buka Postingan Ini di Instagram"
            >
              <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </a>
          </div>

          {/* Big Center Play/Pause Button Overlay */}
          {(!isPlaying || showControls) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/15 pointer-events-none transition-opacity z-20">
              <button 
                type="button"
                className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full border-2 sm:border-3 border-black flex items-center justify-center shadow-retro transition-transform duration-200 pointer-events-auto cursor-pointer active:scale-95 ${
                  isPlaying 
                    ? 'bg-white/85 text-black hover:scale-110 opacity-75 hover:opacity-100' 
                    : 'bg-[#FFE600] text-black scale-105 sm:scale-110 animate-bounce'
                }`}
                onClick={togglePlay}
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current" />
                ) : (
                  <Play className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 fill-current ml-0.5 sm:ml-1" />
                )}
              </button>
            </div>
          )}

          {/* Mute Overlay Badge */}
          {isMuted && isPlaying && (
            <button
              onClick={toggleMute}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/85 hover:bg-[#FF3388] text-white border-2 border-white/60 hover:border-black text-[9.5px] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-retro-sm flex items-center gap-1.5 backdrop-blur-sm transition-all z-20 cursor-pointer active:scale-95"
            >
              <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Buka Suara</span>
            </button>
          )}
        </div>

        {/* Video Scrubber & Control Bar */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-[#121212]/95 backdrop-blur-md border-t-2 sm:border-t-3 border-black p-2 sm:p-2.5 md:p-3 text-white transition-all duration-300 z-30 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          {/* Scrubber Progress Bar with larger hit-target on mobile */}
          <div 
            onClick={handleSeek}
            onTouchStart={handleSeek}
            className="w-full py-1.5 -my-1 cursor-pointer group/track relative select-none"
          >
            <div className="w-full h-2 sm:h-2.5 md:h-3 bg-neutral-800 rounded-full border border-neutral-700 sm:border-2 sm:border-black relative overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-all rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-black sm:border-2 rounded-full shadow-retro-sm"></span>
              </div>
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-xs font-mono mt-1.5 sm:mt-2">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <button
                onClick={togglePlay}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-[#FFE600] text-black hover:bg-[#FFF04D] border sm:border-2 border-black rounded-lg flex items-center justify-center shadow-retro-xs sm:shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-neutral-800 text-white hover:bg-neutral-700 border sm:border-2 border-black rounded-lg flex items-center justify-center shadow-retro-xs sm:shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0"
                title="Putar Ulang"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                onClick={toggleMute}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 border sm:border-2 border-black rounded-lg flex items-center justify-center shadow-retro-xs sm:shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer shrink-0 ${
                  isMuted 
                    ? 'bg-neutral-800 text-neutral-400 hover:text-white' 
                    : 'bg-[#00F0FF] text-black'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              <span className="text-[9.5px] sm:text-xs font-bold text-neutral-300 ml-1 truncate">
                {currentTimeFormatted} <span className="text-neutral-500">/</span> {durationFormatted}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={toggleFullscreen}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-white text-black hover:bg-neutral-200 border sm:border-2 border-black rounded-lg flex items-center justify-center shadow-retro-xs sm:shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] sm:text-xs font-mono text-neutral-600 border-t-2 border-dashed border-neutral-300">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block shrink-0"></span>
          <span className="truncate">Sedang memutar: <strong className="text-black">{currentVideo.title}</strong></span>
        </div>
        <a 
          href={currentVideo.igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF3388] font-bold hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          Lihat postingan asli di @{OFFICIAL_IG_CONFIG.username} <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </a>
      </div>

    </div>
  );
}
