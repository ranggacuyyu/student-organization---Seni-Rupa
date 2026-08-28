import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { 
  Palette, 
  Search, 
  Heart, 
  Sparkles, 
  Layers, 
  User, 
  Eye, 
  MapPin, 
  SlidersHorizontal,
  Lock,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Compass,
  EyeOff,
  MoveHorizontal
} from 'lucide-react';

/**
 * Helper untuk mendeteksi apakah karya berasal dari pencipta yang dirahasiakan (anonim / secret)
 */
export const isArtworkSecret = (art) => {
  if (!art) return false;
  if (art.isAnonymous === true || art.isSecret === true || art.seniman_rahasia === true) return true;
  const artistStr = (art.artist || '').toLowerCase();
  return (
    artistStr.includes('rahasia') ||
    artistStr.includes('dirahasiakan') ||
    artistStr.includes('anonim') ||
    artistStr.includes('anonymous') ||
    artistStr.includes('secret') ||
    artistStr.includes('misterius')
  );
};

// Definisi 3 Kategori Utama Pameran
const CATEGORY_SECTIONS = [
  {
    id: 'lukis',
    categoryName: 'Lukis',
    matchKeys: ['lukis'],
    title: 'Karya Lukis',
    subtitle: 'Eksplorasi sapuan kuas, cat minyak, akrilik di atas kanvas bertema retro & history',
    badgeBg: 'bg-[#FFE600]',
    badgeText: 'text-black',
    borderColor: 'border-[#FFE600]',
    icon: <Palette className="w-5 h-5 text-black" />,
    boothHint: 'Zona A - Galeri Lukis Sejarah'
  },
  {
    id: 'kerajinan',
    categoryName: 'Kerajinan',
    matchKeys: ['kerajinan', 'kriya', 'craft', 'patung'],
    title: 'Karya Kerajinan',
    subtitle: 'Karya tiga dimensi, kriya resin, terracotta, dan instalasi daur ulang media kampus',
    badgeBg: 'bg-[#00F0FF]',
    badgeText: 'text-black',
    borderColor: 'border-[#00F0FF]',
    icon: <Layers className="w-5 h-5 text-black" />,
    boothHint: 'Zona B - Galeri Kerajinan & Kriya Tangan'
  },
  {
    id: 'sketsa',
    categoryName: 'Sketsa & Ilustrasi',
    matchKeys: ['sketsa', 'ilustrasi', 'sketch', 'gambar', 'doodle'],
    title: 'Sketsa & Ilustrasi',
    subtitle: 'Jurnal gambar spontan, doodle tinta, ilustrasi grafis, dan arsip manifesto visual',
    badgeBg: 'bg-[#FF3388]',
    badgeText: 'text-white',
    borderColor: 'border-[#FF3388]',
    icon: <Sparkles className="w-5 h-5 text-white" />,
    boothHint: 'Zona C - Pojok Gambar & Live Painting'
  }
];

/**
 * Komponen Baris Horizontal Scroll Slider per Kategori Karya
 */
function ArtworkCategoryRail({
  section,
  artworks = [],
  selectedArtist,
  onlySecret,
  searchQuery,
  onSelectArtwork,
  onLikeArtwork,
  likedIds = []
}) {
  const railRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Drag tracking refs
  const dragStartXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Update Left/Right Scroll Arrows state & Active Card index
  const updateScrollState = useCallback(() => {
    if (!railRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    // Calculate approximate active card index for dots indicator
    if (artworks.length > 0) {
      const cardWidth = 280; // approximate width + gap on mobile
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCardIndex(Math.max(0, Math.min(index, artworks.length - 1)));
    }
  }, [artworks.length]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, artworks]);

  // Smooth scroll helper for Next / Prev buttons
  const scrollRail = (direction) => {
    if (!railRef.current) return;
    const step = 320;
    const targetScroll = direction === 'left' 
      ? railRef.current.scrollLeft - step 
      : railRef.current.scrollLeft + step;
    
    railRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Auto-scroll card into view
  const scrollToCard = useCallback((idx) => {
    if (!railRef.current) return;
    const cards = railRef.current.children;
    if (cards && cards[idx]) {
      cards[idx].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
      setActiveCardIndex(idx);
    }
  }, []);

  // Mouse Drag to Scroll Handlers
  const handleMouseDown = (e) => {
    if (!railRef.current) return;
    if (e.target.closest('button')) return;
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.pageX - railRef.current.offsetLeft;
    scrollLeftStartRef.current = railRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !railRef.current) return;
    e.preventDefault();
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.5;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
    railRef.current.scrollLeft = scrollLeftStartRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch swipe tracking handlers
  const handleTouchStart = (e) => {
    if (!railRef.current || !e.touches[0]) return;
    hasMovedRef.current = false;
    dragStartXRef.current = e.touches[0].pageX - railRef.current.offsetLeft;
    scrollLeftStartRef.current = railRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!railRef.current || !e.touches[0]) return;
    const x = e.touches[0].pageX - railRef.current.offsetLeft;
    const walk = x - dragStartXRef.current;
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true;
    }
  };

  // Card Click Protection (Prevent opening modal if user was dragging/swiping)
  const handleCardClick = (art, idx) => {
    if (hasMovedRef.current) return;
    onSelectArtwork(art);
    scrollToCard(idx);
  };

  // Pesan informatif jika pencipta atau pencarian tidak memiliki karya pada kategori ini
  const getEmptyNotification = () => {
    if (onlySecret || selectedArtist === '__anonymous__') {
      return `Pencipta Dirahasiakan belum memiliki karya pada kategori ${section.title}.`;
    }
    if (selectedArtist && selectedArtist !== 'Semua') {
      return `${selectedArtist} belum memiliki karya pada kategori ${section.title}.`;
    }
    if (searchQuery.trim()) {
      return `Tidak ditemukan karya pada kategori ${section.title} dengan kata kunci "${searchQuery}".`;
    }
    return `Belum ada karya yang terdaftar pada kategori ${section.title}.`;
  };

  return (
    <section id={`cat-rail-${section.id}`} className="cat-rail-block space-y-4 pt-2">
      {/* Section Header with Left-Right Carousel Buttons & Gesture Hint */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-2 sm:border-3 border-black rounded-2xl p-4 sm:p-5 shadow-retro-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 sm:p-3 rounded-2xl border-2 border-black ${section.badgeBg} shadow-retro-xs shrink-0`}>
            {section.icon}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-display font-black text-lg sm:text-2xl text-black">
                {section.title}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-black border border-black shadow-retro-xs ${section.badgeBg} ${section.badgeText}`}>
                {artworks.length} Karya
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium line-clamp-1 mt-0.5">
              {section.subtitle}
            </p>
          </div>
        </div>

        {/* Scroll Controls & Navigation Hint */}
        {artworks.length > 0 && (
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <span className="text-[11px] text-neutral-500 font-bold bg-[#FAF7EE] px-2 py-1 rounded-lg border border-black/10 flex items-center gap-1.5">
              <MoveHorizontal className="w-3.5 h-3.5 text-neutral-600" /> <span className="hidden sm:inline">Tarik & Geser</span> Bebas
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollRail('left')}
                disabled={!canScrollLeft}
                className={`p-2 sm:p-2.5 rounded-xl border-2 border-black transition-all flex items-center justify-center ${
                  canScrollLeft
                    ? 'bg-[#FAF7EE] hover:bg-[#FFE600] text-black shadow-retro-xs active:translate-x-0.5 active:translate-y-0.5 cursor-pointer'
                    : 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-50'
                }`}
                title="Geser karya ke kiri"
                aria-label="Geser ke kiri"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scrollRail('right')}
                disabled={!canScrollRight}
                className={`p-2 sm:p-2.5 rounded-xl border-2 border-black transition-all flex items-center justify-center ${
                  canScrollRight
                    ? 'bg-[#FAF7EE] hover:bg-[#FFE600] text-black shadow-retro-xs active:translate-x-0.5 active:translate-y-0.5 cursor-pointer'
                    : 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed opacity-50'
                }`}
                title="Geser karya ke kanan"
                aria-label="Geser ke kanan"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Artworks Horizontal Carousel Slider with Drag-to-Scroll Support */}
      {artworks.length > 0 ? (
        <div className="space-y-2">
          <div
            ref={railRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`flex gap-3.5 sm:gap-6 overflow-x-auto pb-4 pt-1 touch-auto overscroll-x-contain select-none transition-colors ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab sm:cursor-default'
            } catalogue-scrollbar focus:outline-none -mx-1 px-1`}
            style={{
              WebkitOverflowScrolling: 'touch'
            }}
            tabIndex={0}
          >
            {artworks.map((art, idx) => {
              const isLiked = likedIds.includes(art.id);
              const isSecret = isArtworkSecret(art);

              return (
                <div
                  key={art.id}
                  onClick={() => handleCardClick(art, idx)}
                  className={`w-[260px] xs:w-[280px] sm:w-[320px] shrink-0 cat-artwork-card card-retro-hover bg-white overflow-hidden flex flex-col justify-between group cursor-pointer select-none ${
                    isSecret ? 'border-purple-900 shadow-[4px_4px_0px_#7B2CBF]' : ''
                  }`}
                >
                  {/* Artwork Image Container */}
                  <div>
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800 border-b-3 border-black flex items-center justify-center pointer-events-none">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        draggable={false}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                        loading="lazy"
                      />

                      {/* Category Pill */}
                      <div className={`absolute top-3 left-3 ${section.badgeBg} ${section.badgeText} border-2 border-black text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-retro-sm pointer-events-none`}>
                        {art.category || section.categoryName}
                      </div>

                      {/* Confidential Artist Badge on image if secret */}
                      {isSecret ? (
                        <div className="absolute top-3 right-3 bg-[#7B2CBF] text-[#FFE600] text-[10px] font-black px-2.5 py-0.5 rounded-lg border-2 border-black shadow-retro-sm flex items-center gap-1 pointer-events-none">
                          <Lock className="w-3 h-3" /> Dirahasiakan
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/30 pointer-events-none">
                          {art.dimensions || 'Karya Seni'}
                        </div>
                      )}

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="btn-retro-white text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-retro">
                          <Eye className="w-3.5 h-3.5" /> Baca Filosofi & Detail
                        </span>
                      </div>
                    </div>

                    {/* Artwork Details */}
                    <div className="p-4 sm:p-5 space-y-2.5 pointer-events-none">
                      <div className="space-y-1">
                        <h3 
                          className="font-display font-black text-lg sm:text-xl text-black group-hover:text-[#FF3388] transition-colors line-clamp-1"
                          title={art.title}
                        >
                          {art.title}
                        </h3>

                        {/* Creator Info */}
                        {isSecret ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-purple-800 font-black bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                            <EyeOff className="w-3 h-3 text-[#7B2CBF]" />
                            <span>Pencipta Dirahasiakan</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-semibold truncate">
                            <User className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                            <span className="truncate">{art.artist}</span>
                            {art.artistBatch && <span className="text-neutral-400">({art.artistBatch})</span>}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#FAF7EE] border border-black/20 p-2 rounded-xl text-xs text-neutral-700 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-[#FF3388] shrink-0" />
                        <span className="truncate">{art.medium}</span>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                        {art.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Location & Like Action */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t-2 border-neutral-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#7B2CBF] truncate pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{art.boothName?.split('-')[0] || section.boothHint.split('-')[0]}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeArtwork(art.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-display font-bold text-xs transition-all active:scale-90 cursor-pointer ${
                        isLiked
                          ? 'bg-[#FF3388] text-white shadow-retro-sm'
                          : 'bg-white text-black hover:bg-neutral-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : 'text-black'}`} />
                      <span>{art.likesCount}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>


        </div>
      ) : (
        /* Empty State Notice for this Category */
        <div className="card-retro p-6 sm:p-8 bg-[#FAF7EE] border-2 border-dashed border-black/40 text-center space-y-2.5 animate-in fade-in">
          <div className="w-12 h-12 bg-white border-2 border-black rounded-2xl mx-auto flex items-center justify-center text-xl shadow-retro-xs">
            {section.icon}
          </div>
          <h4 className="font-display font-black text-sm sm:text-base text-black">
            {getEmptyNotification()}
          </h4>
          <p className="text-xs text-neutral-600 max-w-lg mx-auto leading-relaxed">
            {selectedArtist && selectedArtist !== 'Semua'
              ? `Seniman ini tidak memiliki karya terdaftar di kategori ${section.title}. Silakan cek karya di kategori lain atau pilih pencipta lainnya.`
              : `Tidak ada karya yang sesuai dengan filter atau kata kunci pencarian pada kategori ${section.title}.`}
          </p>
        </div>
      )}
    </section>
  );
}

export default function CataloguePage({ 
  artworks = [], 
  onSelectArtwork, 
  onLikeArtwork, 
  likedIds = [] 
}) {
  const containerRef = useRef(null);

  // Filter & Sort states (No category tab button filter needed since all 3 categories are provided directly)
  const [selectedArtist, setSelectedArtist] = useState('Semua');
  const [onlySecret, setOnlySecret] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'title'

  // Ekstrak daftar pencipta unik dan hitung karya dirahasiakan
  const { artistList, secretCount, totalCount } = useMemo(() => {
    const artistCounts = {};
    let secrets = 0;

    artworks.forEach((art) => {
      if (isArtworkSecret(art)) {
        secrets++;
      } else if (art.artist && art.artist.trim()) {
        const name = art.artist.trim();
        artistCounts[name] = (artistCounts[name] || 0) + 1;
      }
    });

    const sortedArtists = Object.keys(artistCounts).sort((a, b) => a.localeCompare(b));

    return {
      artistList: sortedArtists.map(name => ({ name, count: artistCounts[name] })),
      secretCount: secrets,
      totalCount: artworks.length
    };
  }, [artworks]);

  // Handler ganti dropdown pencipta
  const handleArtistChange = (val) => {
    setSelectedArtist(val);
    if (val === '__anonymous__') {
      setOnlySecret(true);
    } else {
      setOnlySecret(false);
    }
  };

  // Handler toggle khusus karya pencipta dirahasiakan
  const handleToggleSecretFilter = () => {
    if (onlySecret) {
      setOnlySecret(false);
      if (selectedArtist === '__anonymous__') {
        setSelectedArtist('Semua');
      }
    } else {
      setOnlySecret(true);
      setSelectedArtist('__anonymous__');
    }
  };

  // Reset semua filter pencipta & search
  const handleResetFilters = () => {
    setSelectedArtist('Semua');
    setOnlySecret(false);
    setSearchQuery('');
    setSortBy('popular');
  };

  // Cek apakah ada filter aktif yang non-default
  const hasActiveFilters = 
    selectedArtist !== 'Semua' || 
    onlySecret || 
    searchQuery.trim().length > 0;

  // Filter global artworks berdasarkan creator, search query, dan sort
  const globallyFilteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        const isSecret = isArtworkSecret(art);

        // 1. Filter Pencipta Dirahasiakan (Secret / Anonim)
        if (onlySecret && !isSecret) {
          return false;
        }

        // 2. Filter Dropdown Pencipta
        let matchesArtist = true;
        if (selectedArtist === '__anonymous__') {
          matchesArtist = isSecret;
        } else if (selectedArtist !== 'Semua') {
          matchesArtist = !isSecret && art.artist === selectedArtist;
        }

        // 3. Filter Pencarian Teks
        const q = searchQuery.toLowerCase().trim();
        let matchesSearch = true;
        if (q) {
          const matchTitle = (art.title || '').toLowerCase().includes(q);
          const matchArtist = (art.artist || '').toLowerCase().includes(q);
          const matchDesc = (art.description || '').toLowerCase().includes(q);
          const matchMedium = (art.medium || '').toLowerCase().includes(q);
          const matchTags = Array.isArray(art.tags) && art.tags.some(t => t.toLowerCase().includes(q));
          const matchSecretKeyword = isSecret && ('pencipta dirahasiakan anonim anonymous secret misteri'.includes(q));

          matchesSearch = matchTitle || matchArtist || matchDesc || matchMedium || matchTags || matchSecretKeyword;
        }

        return matchesArtist && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.likesCount || 0) - (a.likesCount || 0);
        if (sortBy === 'newest') return (b.year || '2024').localeCompare(a.year || '2024');
        if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
        return 0;
      });
  }, [artworks, selectedArtist, onlySecret, searchQuery, sortBy]);

  // Kelompokkan karya berdasarkan 3 Kategori Utama
  const categorizedArtworks = useMemo(() => {
    const map = {};

    CATEGORY_SECTIONS.forEach((sec) => {
      map[sec.id] = globallyFilteredArtworks.filter((art) => {
        const artCat = (art.category || '').toLowerCase();
        return sec.matchKeys.some(k => artCat.includes(k));
      });
    });

    return map;
  }, [globallyFilteredArtworks]);
  
  // Initial Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cat-header-banner',
        { y: -30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.cat-filter-bar',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.cat-rail-block',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.5, ease: 'power2.out', delay: 0.25 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
      
      {/* ================= 1. HEADER BANNER ================= */}
      <div className="cat-header-banner bg-[#FF3388] text-white border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-[#FFE600] px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 3 ZONA GALERI UTAMA
          </div>
          <h1 className="font-display font-black text-2xl sm:text-5xl text-white leading-tight">
            Katalog Karya & Apresiasi Seni
          </h1>
          <p className="text-white/90 text-xs sm:text-base font-medium leading-relaxed">
            Jelajahi seluruh karya anggota dalam 3 kategori langsung: <strong>Karya Lukis</strong>, <strong>Karya Kerajinan</strong>, dan <strong>Sketsa & Ilustrasi</strong>. Geser karya ke kanan-kiri untuk menjelajahi seluruh koleksi pameran.
          </p>
        </div>
      </div>

      {/* ================= 2. FILTER & SEARCH CONTROLS BAR ================= */}
      <div className="cat-filter-bar bg-white border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-retro-sm sm:shadow-retro space-y-3 sm:space-y-4">
        
        {/* Top: Category Quick Jump & Secret Filter Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-neutral-100">

        </div>

        {/* Middle: Search Input, Dropdown Filter Pencipta, & Sort Selector */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
          
          {/* 1. Search Input (5 cols on md) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, nama seniman, atau filosofi karya..."
              className="w-full pl-10 pr-9 py-2.5 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 2. Dropdown Filter Pencipta (4 cols on md) */}
          <div className="md:col-span-4 relative">
            <div className="flex items-center gap-2 bg-[#FAF7EE] border-2 border-black rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-[#00F0FF]">
              <User className="w-4 h-4 text-[#00F0FF] shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold text-neutral-500 uppercase leading-none pt-1">
                  Filter Pencipta:
                </span>
                <select
                  value={selectedArtist}
                  onChange={(e) => handleArtistChange(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-black focus:outline-none truncate py-1 cursor-pointer"
                >
                  <option value="Semua">Semua Pencipta ({totalCount})</option>
                  
                  {secretCount > 0 && (
                    <option value="__anonymous__" className="font-bold text-purple-700 bg-purple-50">
                      Pencipta Dirahasiakan ({secretCount} Karya)
                    </option>
                  )}

                  <optgroup label="Seniman & Anggota Terdaftar">
                    {artistList.map(({ name, count }) => (
                      <option key={name} value={name}>
                        {name} ({count})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Sort Selector (3 cols on md) */}
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <div className="flex items-center gap-2 bg-[#FAF7EE] border-2 border-black rounded-xl px-3 py-1 w-full focus-within:ring-2 focus-within:ring-[#00F0FF]">
              <SlidersHorizontal className="w-4 h-4 text-neutral-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold text-neutral-500 uppercase leading-none pt-1">
                  Urutkan:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-black focus:outline-none truncate py-1 cursor-pointer"
                >
                  <option value="popular">Paling Disukai (Terpopuler)</option>
                  <option value="newest">Tahun Rilis Terbaru</option>
                  <option value="title">Judul Karya (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom: Active Filters Bar & Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-neutral-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-neutral-600">
              Menampilkan <strong>{globallyFilteredArtworks.length}</strong> dari {artworks.length} total karya
            </span>

            {/* Active Secret Chip */}
            {(onlySecret || selectedArtist === '__anonymous__') && (
              <span className="inline-flex items-center gap-1 bg-[#7B2CBF] text-white border border-black px-2 py-0.5 rounded-lg font-bold text-[11px]">
                <EyeOff className="w-3 h-3" />
                <span>Pencipta Dirahasiakan</span>
                <button onClick={() => { setOnlySecret(false); setSelectedArtist('Semua'); }} className="hover:text-[#FFE600] ml-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Named Artist Chip */}
            {selectedArtist !== 'Semua' && selectedArtist !== '__anonymous__' && (
              <span className="inline-flex items-center gap-1 bg-[#00F0FF] text-black border border-black px-2 py-0.5 rounded-lg font-bold text-[11px]">
                Pencipta: {selectedArtist}
                <button onClick={() => setSelectedArtist('Semua')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Active Search Chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 bg-white text-neutral-800 border border-black px-2 py-0.5 rounded-lg font-bold text-[11px]">
                Cari: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 hover:underline transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Semua Filter</span>
            </button>
          )}
        </div>

      </div>

      {/* ================= 3. THREE DIRECT CATEGORY SECTIONS (HORIZONTAL CAROUSELS) ================= */}
      <div className="space-y-10 sm:space-y-14">
        {CATEGORY_SECTIONS.map((section) => {
          const sectionArtworks = categorizedArtworks[section.id] || [];

          return (
            <ArtworkCategoryRail
              key={section.id}
              section={section}
              artworks={sectionArtworks}
              selectedArtist={selectedArtist}
              onlySecret={onlySecret}
              searchQuery={searchQuery}
              onSelectArtwork={onSelectArtwork}
              onLikeArtwork={onLikeArtwork}
              likedIds={likedIds}
            />
          );
        })}
      </div>

    </div>
  );
}

