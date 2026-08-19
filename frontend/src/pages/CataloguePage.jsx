import React, { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  Palette, 
  Search, 
  Filter, 
  Heart, 
  Sparkles, 
  Layers, 
  User, 
  Tag, 
  Eye, 
  MapPin, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function CataloguePage({ 
  artworks, 
  onSelectArtwork, 
  onLikeArtwork, 
  likedIds 
}) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest' | 'title'

  const categories = ['Semua', 'Lukis', 'Kerajinan', 'Sketsa & Ilustrasi'];

  // Filter & Sort Artworks
  const filteredArtworks = useMemo(() => {
    return artworks
      .filter((art) => {
        const matchesCat = selectedCategory === 'Semua' || art.category === selectedCategory;
        const matchesSearch = 
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.likesCount - a.likesCount;
        if (sortBy === 'newest') return (b.year || '2024').localeCompare(a.year || '2024');
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [artworks, selectedCategory, searchQuery, sortBy]);

  // Initial Page Elements Entrance Animation
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
        '.cat-tab-btn',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.06, duration: 0.4, ease: 'back.out(1.8)', delay: 0.25 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isFirstGridRender = useRef(true);

  // Stagger Grid Items on Filter or Search Change (only on changes, not on initial mount)
  useEffect(() => {
    if (isFirstGridRender.current) {
      isFirstGridRender.current = false;
      return;
    }
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.cat-artwork-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.06,
            duration: 0.4,
            ease: 'power2.out'
          }
        );
      }
    }
  }, [selectedCategory, searchQuery, sortBy]);


  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="cat-header-banner bg-[#FF3388] text-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-black text-[#FFE600] px-3 py-1 rounded-lg text-xs font-black uppercase">
            <Sparkles className="w-3.5 h-3.5" /> EKSPLORASI KARYA SENI
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Katalog Karya & Apresiasi Seni
          </h1>
          <p className="text-white/90 text-xs sm:text-base font-medium">
            Kumpulan seluruh karya lukis, kriya kerajinan tangan, dan arsip visual hasil karya anggota Divisi Seni Rupa Politeknik Negeri Batam dalam tema <strong>"History"</strong>.
          </p>
        </div>
      </div>

      {/* Filter, Search, and Controls Bar */}
      <div className="cat-filter-bar bg-white border-3 border-black rounded-2xl p-4 sm:p-6 shadow-retro space-y-4">
        
        {/* Top: Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-tab-btn px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
                    : 'bg-[#FAF7EE] text-neutral-700 border-black/30 hover:bg-neutral-100 hover:border-black'
                }`}
              >
                {cat === 'Semua' ? '✨ Semua Karya' : cat}
              </button>
            );
          })}
        </div>

        {/* Bottom: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t-2 border-neutral-100">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, nama seniman, atau teknik..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-neutral-600 hidden sm:inline flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs sm:text-sm font-bold text-black focus:outline-none"
            >
              <option value="popular">🔥 Paling Disukai (Likes)</option>
              <option value="newest">📅 Tahun Terbaru</option>
              <option value="title">🔤 Judul (A - Z)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Artworks Grid */}
      {filteredArtworks.length > 0 ? (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArtworks.map((art) => {
            const isLiked = likedIds.includes(art.id);
            return (
              <div
                key={art.id}
                className="cat-artwork-card card-retro-hover bg-white overflow-hidden flex flex-col justify-between group"
              >
                
                {/* Artwork Thumbnail Container */}
                <div>
                  <div 
                    onClick={() => onSelectArtwork(art)}
                    className="relative aspect-[3/4] overflow-hidden bg-neutral-800 border-b-3 border-black cursor-pointer flex items-center justify-center"
                  >
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 bg-[#FFE600] text-black border-2 border-black text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-retro-sm">
                      {art.category}
                    </div>

                    {/* Dimensions Pill */}
                    <div className="absolute top-3 right-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/30">
                      {art.dimensions || 'Karya Seni'}
                    </div>

                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="btn-retro-white text-xs px-4 py-2 flex items-center gap-1.5 shadow-retro">
                        <Eye className="w-3.5 h-3.5" /> Baca Filosofi & Detail
                      </span>
                    </div>
                  </div>

                  {/* Artwork Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <h3 
                        onClick={() => onSelectArtwork(art)}
                        className="font-display font-black text-xl text-black hover:text-[#FF3388] cursor-pointer transition-colors line-clamp-1"
                      >
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold">
                        <User className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>{art.artist}</span>
                        {art.artistBatch && <span className="text-neutral-400">({art.artistBatch})</span>}
                      </div>
                    </div>

                    <div className="bg-[#FAF7EE] border border-black/20 p-2.5 rounded-xl text-xs text-neutral-700 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#FF3388] shrink-0" />
                      <span className="truncate">{art.medium}</span>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {art.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer: Location & Like Action */}
                <div className="px-5 pb-5 pt-2 border-t-2 border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#7B2CBF] truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{art.boothName?.split('-')[0] || 'Zona Pameran'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLikeArtwork(art.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-display font-bold text-xs transition-all active:scale-90 ${
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
      ) : (
        /* Empty State */
        <div className="card-retro p-12 text-center bg-white space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#FFE600] border-3 border-black rounded-2xl mx-auto flex items-center justify-center text-2xl font-black shadow-retro">
            🔍
          </div>
          <h3 className="font-display font-black text-xl text-black">
            Karya Tidak Ditemukan
          </h3>
          <p className="text-xs text-neutral-500">
            Tidak ada karya yang cocok dengan kata kunci <strong>"{searchQuery}"</strong> atau filter kategori yang dipilih.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Semua');
            }}
            className="btn-retro-cyan text-xs py-2.5 px-5"
          >
            Reset Pencarian 🔄
          </button>
        </div>
      )}

    </div>
  );
}

