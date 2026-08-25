import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';

/**
 * =========================================================================
 * KONFIGURASI VIDEO & SOROTAN RESMI INSTAGRAM (@srkuaspolbat)
 * =========================================================================
 * Semua video ditampilkan dalam rasio seragam 16:9. Jika video vertikal / 
 * berukuran lain, area sisi samping/atas-bawah otomatis berlatar abu-abu.
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
    title: 'Perkenalan Seni Rupa',
    tag: 'Reels Resmi',
    badgeColor: 'bg-[#FF3388] text-white',
    emoji: '🎬',
    category: 'Profil & Pengenalan Divisi',
    audioTitle: 'Seni Rupa Polibatam • Audio Pengenalan',
    likesCount: '1.2k',
    commentsCount: '64',
    description: 'Video pengenalan resmi Divisi Seni Rupa Politeknik Negeri Batam: Mengenal visi, karya, dan semangat kreativitas kami.',
    videoUrl: '/videos/perkenalan.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=200&q=80',
    igUrl: 'https://www.instagram.com/reel/Cz0xOT1x8MN/?igsi=YXVzOG51MnRpZXZp'
  },
  {
    id: 'latihan-rutin',
    title: 'Latihan Rutin',
    tag: 'Sorotan Cerita',
    badgeColor: 'bg-[#FFE600] text-black',
    emoji: '🎨',
    category: 'Aktivitas Internal',
    audioTitle: 'Vibes Studio • Sesi Melukis Rutin',
    likesCount: '890',
    commentsCount: '42',
    description: 'Dokumentasi sorotan sesi latihan rutin menggambar sketsa, teknik sapuan kuas, dan kolaborasi karya bersama anggota.',
    videoUrl: '/videos/latihan-rutin.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1460661419200-fd4357a09be4?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1460661419200-fd4357a09be4?auto=format&fit=crop&w=200&q=80',
    igUrl: 'https://www.instagram.com/s/aGlnaGxpZ2h0OjE3ODY1ODk4NjM1NDQzNDM2?story_media_id=3702588706114146991_9043919714&igsi=eHczNHF5eGpieGdn'
  },
  {
    id: 'pbf-expo',
    title: 'Event PBF EXPO',
    tag: 'Sorotan Event',
    badgeColor: 'bg-[#00F0FF] text-black',
    emoji: '🏛️',
    category: 'Pameran & Expo Akbar',
    audioTitle: 'PBF Expo Live • Sorotan Acara',
    likesCount: '1.5k',
    commentsCount: '98',
    description: 'Sorotan keseruan dan keikutsertaan pameran stan Divisi Seni Rupa dalam gelaran akbar PBF EXPO Polibatam.',
    videoUrl: '/videos/pbf-expo.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=200&q=80',
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

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const currentVideo = OFFICIAL_IG_HIGHLIGHTS[selectedIdx] || OFFICIAL_IG_HIGHLIGHTS[0];

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
          } else {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [selectedIdx]);

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

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !videoRef.current.muted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = (e.clientX - rect.left) / rect.width;
    const seekTime = clickPos * videoRef.current.duration;
    if (!isNaN(seekTime)) {
      videoRef.current.currentTime = seekTime;
      setProgress(clickPos * 100);
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(console.error);
  };

  const toggleFullscreen = () => {
    if (!playerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      playerWrapperRef.current.requestFullscreen?.()
        .then(() => setIsFullscreen(true))
        .catch(console.error);
    } else {
      document.exitFullscreen?.()
        .then(() => setIsFullscreen(false))
        .catch(console.error);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2800);
  };

  const handleSelectHighlight = (idx) => {
    setSelectedIdx(idx);
    setIsPlaying(true);
    setProgress(0);
    setIsLiked(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="card-retro p-4 sm:p-7 bg-[#FFFDF5] border-3 border-black text-black space-y-6 text-left relative overflow-hidden shadow-retro-lg"
    >
      {/* Background Memphis Accent Shapes */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FFE600] rounded-full border-3 border-black -z-10 opacity-30"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#00F0FF] rounded-3xl border-3 border-black rotate-12 -z-10 opacity-30"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 sm:border-b-3 border-black pb-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white border-2 border-black text-[11px] sm:text-xs font-black px-3 py-1 rounded-full shadow-retro-sm uppercase">
              <InstagramIcon className="w-3.5 h-3.5" />
              <a
                href={OFFICIAL_IG_CONFIG.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] hover:text-[#FF3388] transition-colors underline decoration-2 underline-offset-2"
              >
                @{OFFICIAL_IG_CONFIG.username} <ExternalLink className="w-3 h-3" />
              </a>
            </span>
            <span className="bg-neutral-200 text-neutral-800 border border-black text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-md">
              Rasio Layar 16:9
            </span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-3xl text-black tracking-tight flex items-center gap-2">
            Pemutar Video & Sorotan Seni Rupa
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF3388] shrink-0" />
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 font-medium max-w-2xl leading-relaxed">
            Semua video diputar dalam rasio 16:9. Otomatis jalan saat di-scroll ke area video, bisa di-pause, di-unmute suara, dan dipilih per sorotan acara!
          </p>
        </div>

        {/* Action Button: Follow IG */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={OFFICIAL_IG_CONFIG.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-retro-pink text-xs font-black px-4 py-2.5 shadow-retro-sm flex items-center gap-1.5"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Kunjungi @{OFFICIAL_IG_CONFIG.username}</span>
          </a>
        </div>
      </div>

      {/* 3 REAL INSTAGRAM HIGHLIGHTS / REELS CARDS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-neutral-800">
          <span className="flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-[#ee2a7b]" /> PILIH SOROTAN UNTUK DIPUTAR:
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            {OFFICIAL_IG_HIGHLIGHTS.length} Video Tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {OFFICIAL_IG_HIGHLIGHTS.map((item, idx) => {
            const isCurrent = idx === selectedIdx;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectHighlight(idx)}
                className={`p-3 sm:p-4 rounded-2xl border-2 sm:border-3 border-black text-left transition-all duration-150 flex items-start gap-3 relative cursor-pointer ${
                  isCurrent 
                    ? 'bg-white shadow-retro -translate-y-1 ring-2 ring-[#ee2a7b] border-[#FF3388]' 
                    : 'bg-neutral-50 hover:bg-white shadow-retro-sm opacity-85 hover:opacity-100'
                }`}
              >
                {/* Bubble Avatar */}
                <div className={`p-[2px] rounded-full shrink-0 ${
                  isCurrent 
                    ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-sm' 
                    : 'bg-neutral-300'
                }`}>
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black relative bg-neutral-900">
                    <img 
                      src={item.avatarUrl || item.posterUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 bg-black/80 text-[10px] rounded-full px-1 border border-white">
                      {item.emoji}
                    </span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border border-black uppercase ${item.badgeColor}`}>
                      {item.tag}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-black text-[#ee2a7b] flex items-center gap-0.5 animate-pulse">
                        <CheckCircle2 className="w-3 h-3" /> Sedang Diputar
                      </span>
                    )}
                  </div>
                  <h4 className={`font-display font-black text-xs sm:text-sm truncate ${
                    isCurrent ? 'text-[#ee2a7b]' : 'text-black'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 line-clamp-1">
                    {item.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN RETRO HTML5 VIDEO PLAYER (TALLER EXPANDED CANVAS WITH GRAY SIDES) */}
      <div 
        ref={playerWrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full h-[580px] sm:h-[580px] md:h-[650px] bg-[#2a2a2a] border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro overflow-hidden group select-none transition-all duration-300"
      >
        {/* Retro Header Mac / Film Bar */}
        <div className="bg-[#181818] border-b-2 sm:border-b-3 border-black px-4 py-2.5 flex items-center justify-between text-white text-xs font-mono z-30 relative shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF3388] border border-black inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFE600] border border-black inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-[#00F0FF] border border-black inline-block"></span>
            </div>
            <span className="font-bold text-[11px] sm:text-xs text-neutral-300 ml-1 truncate max-w-[170px] sm:max-w-xs">
              {currentVideo.emoji} {currentVideo.title} • {currentVideo.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-xs">
            {isPlaying ? (
              <span className="inline-flex items-center gap-1 bg-[#CCFF00] text-black font-black px-2 py-0.5 rounded border border-black animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span> PLAYING
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-neutral-700 text-white font-bold px-2 py-0.5 rounded border border-neutral-600">
                PAUSED
              </span>
            )}
            <span className="hidden sm:inline bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-[10px]">
              HD PLAYER
            </span>
          </div>
        </div>

        {/* Video Canvas Container (Taller Canvas with Gray Background Pillarbox/Letterbox) */}
        <div 
          onClick={togglePlay}
          className="relative w-full h-[calc(100%-41px)] bg-[#333333] flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {/* Subtle blurred backdrop for aesthetic enhancement */}
          <div 
            className="absolute inset-0 bg-cover bg-center blur-2xl opacity-15 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${currentVideo.posterUrl})` }}
          />

          {/* HTML5 Video with object-contain (fits 16:9 frame with gray sides if aspect ratio differs) */}
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

          {/* INSTAGRAM REEL WATERMARK & INFO OVERLAY (BOTTOM LEFT) */}
          <div className="absolute bottom-16 sm:bottom-18 left-3 sm:left-4 right-14 text-white z-20 pointer-events-none drop-shadow-md space-y-1.5">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                <img 
                  src={currentVideo.avatarUrl || currentVideo.posterUrl} 
                  alt="avatar" 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white"
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
                <span className="w-3.5 h-3.5 bg-[#00F0FF] text-black text-[9px] rounded-full inline-flex items-center justify-center font-bold">✓</span>
              </a>
              <span className="bg-white/20 backdrop-blur-xs border border-white/40 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
                {currentVideo.tag}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-200 line-clamp-2 leading-snug">
              {currentVideo.description}
            </p>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-neutral-300 font-mono">
              <Music className="w-3 h-3 text-[#FFE600] animate-spin" />
              <span className="truncate">{currentVideo.audioTitle}</span>
            </div>
          </div>

          {/* INSTAGRAM REEL INTERACTION SIDEBAR (RIGHT SIDE) */}
          <div className="absolute bottom-16 sm:bottom-18 right-2.5 sm:right-3 flex flex-col items-center gap-3 z-20 pointer-events-auto">
            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className="flex flex-col items-center group/btn cursor-pointer"
              title="Suka Video Ini"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-black flex items-center justify-center shadow-retro-sm transition-transform active:scale-125 ${
                isLiked ? 'bg-[#FF3388] text-white' : 'bg-black/60 backdrop-blur-sm text-white hover:bg-black/80'
              }`}>
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">
                {isLiked ? 'Liked' : currentVideo.likesCount}
              </span>
            </button>

            {/* Comments Badge */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 backdrop-blur-sm border-2 border-black text-white flex items-center justify-center shadow-retro-sm">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">
                {currentVideo.commentsCount}
              </span>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
              className="flex flex-col items-center cursor-pointer"
              title="Simpan Video"
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-black flex items-center justify-center shadow-retro-sm transition-transform ${
                isSaved ? 'bg-[#FFE600] text-black' : 'bg-black/60 backdrop-blur-sm text-white'
              }`}>
                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-current' : ''}`} />
              </div>
            </button>

            {/* Direct Open in Instagram */}
            <a
              href={currentVideo.igUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border-2 border-black text-white flex items-center justify-center shadow-retro-sm hover:scale-110 transition-transform"
              title="Buka Postingan Ini di Instagram"
            >
              <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>

          {/* Big Center Play/Pause Button Overlay */}
          {(!isPlaying || showControls) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none transition-opacity">
              <div 
                className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full border-3 border-black flex items-center justify-center shadow-retro transition-transform duration-200 pointer-events-auto cursor-pointer ${
                  isPlaying 
                    ? 'bg-white/90 text-black hover:scale-110 opacity-70 hover:opacity-100' 
                    : 'bg-[#FFE600] text-black scale-110 animate-bounce'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                ) : (
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Mute Overlay Badge */}
          {isMuted && isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="absolute top-3 right-3 bg-black/80 hover:bg-[#FF3388] text-white border-2 border-white/50 hover:border-black text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl shadow-retro-sm flex items-center gap-1.5 backdrop-blur-sm transition-all z-20 cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Tap Suara 🔊</span>
            </button>
          )}
        </div>

        {/* Video Scrubber & Control Bar */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-[#181818]/95 border-t-2 sm:border-t-3 border-black p-2.5 sm:p-3 text-white transition-all duration-300 z-30 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {/* Scrubber Progress Bar */}
          <div 
            onClick={handleSeek}
            className="w-full h-2.5 sm:h-3 bg-neutral-800 rounded-full border-2 border-black cursor-pointer relative overflow-hidden mb-2 group/track"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] transition-all rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-black rounded-full shadow-retro-sm"></span>
            </div>
          </div>

          {/* Control Buttons Row */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={togglePlay}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-[#FFE600] text-black hover:bg-[#FFF04D] border-2 border-black rounded-lg flex items-center justify-center shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleRestart}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-neutral-800 text-white hover:bg-neutral-700 border-2 border-black rounded-lg flex items-center justify-center shadow-retro-sm transition-all cursor-pointer"
                title="Putar Ulang"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className={`w-8 h-8 sm:w-9 sm:h-9 border-2 border-black rounded-lg flex items-center justify-center shadow-retro-sm transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-neutral-800 text-neutral-400 hover:text-white' 
                    : 'bg-[#00F0FF] text-black'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <span className="text-[10px] sm:text-xs font-bold text-neutral-300 ml-1">
                {currentTimeFormatted} <span className="text-neutral-500">/</span> {durationFormatted}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-white text-black hover:bg-neutral-200 border-2 border-black rounded-lg flex items-center justify-center shadow-retro-sm active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-600 border-t-2 border-dashed border-neutral-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] inline-block"></span>
          <span>Sedang memutar: <strong>{currentVideo.title}</strong></span>
        </div>
        <a 
          href={currentVideo.igUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF3388] font-bold hover:underline flex items-center gap-1"
        >
          Lihat postingan asli di @{OFFICIAL_IG_CONFIG.username} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
}
