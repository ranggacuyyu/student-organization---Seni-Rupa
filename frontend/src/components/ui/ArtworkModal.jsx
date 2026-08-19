import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Heart, Sparkles, MapPin, User, Layers, Maximize2, Tag, Calendar } from 'lucide-react';

export default function ArtworkModal({ artwork, isOpen, onClose, onLike, isLiked, onGoToBooth }) {
  const modalBoxRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalBoxRef.current) {
      gsap.fromTo(
        modalBoxRef.current,
        { scale: 0.85, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' }
      );
    }
  }, [isOpen, artwork?.id]);

  if (!isOpen || !artwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        ref={modalBoxRef}
        className="relative w-full max-w-4xl my-auto bg-[#FAF7EE] border-3 border-black rounded-3xl shadow-retro-xl overflow-hidden"
      >
        
        {/* Top Bar Ribbon */}
        <div className="bg-[#FFE600] border-b-3 border-black px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF3388] text-white text-xs font-black px-2.5 py-0.5 rounded-lg border-2 border-black uppercase">
              {artwork.category}
            </span>
            <span className="font-display font-bold text-sm text-black hidden sm:inline">
              Katalog Karya Seni Rupa Polibatam
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 shadow-retro-sm"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          
          {/* Left Column: Image Artwork HD Display */}
          <div className="lg:col-span-6 bg-neutral-900 border-b-3 lg:border-b-0 lg:border-r-3 border-black p-6 flex flex-col justify-center items-center relative min-h-[320px]">
            <div className="relative group max-w-full">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full max-h-[460px] object-contain rounded-2xl border-3 border-black shadow-retro-lg bg-black"
              />
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-lg border border-white/40 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#00F0FF]" /> {artwork.dimensions || 'HD Artwork'}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Narrative & Metadatas */}
          <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 bg-white">
            
            {/* Title & Artist */}
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-black leading-tight">
                {artwork.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-neutral-800 font-bold bg-[#00F0FF]/20 px-2.5 py-1 rounded-lg border border-black">
                  <User className="w-4 h-4 text-black" /> {artwork.artist}
                </div>
                {artwork.artistBatch && (
                  <span className="text-neutral-500 font-semibold">
                    Angkatan {artwork.artistBatch}
                  </span>
                )}
                {artwork.year && (
                  <span className="flex items-center gap-1 text-neutral-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> Tahun {artwork.year}
                  </span>
                )}
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <Layers className="w-4 h-4 text-[#FF3388] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-black font-display">Medium & Bahan:</strong>
                  <p className="text-neutral-700 font-medium">{artwork.medium || 'Akrilik di atas Kanvas'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2 border-t border-neutral-300">
                <MapPin className="w-4 h-4 text-[#7B2CBF] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-black font-display">Lokasi Pameran:</strong>
                  <p className="text-neutral-700 font-medium">{artwork.boothName || 'Student Centre Lt. 3'}</p>
                </div>
              </div>
            </div>

            {/* Deep Narrative / Filosofi Karya */}
            <div className="space-y-2">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF3388]" /> Makna & Filosofi Karya
              </h4>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed bg-[#FAF7EE]/50 p-3.5 rounded-xl border border-neutral-200">
                {artwork.description}
              </p>
            </div>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {artwork.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-[#FFE600]/30 text-black border border-black text-[11px] font-bold px-2 py-0.5 rounded-md"
                  >
                    <Tag className="w-3 h-3 text-black" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Bar (Like & Go To Booth) */}
            <div className="pt-4 border-t-2 border-dashed border-neutral-300 flex items-center gap-3">
              <button
                onClick={() => onLike(artwork.id)}
                className={`flex-1 flex items-center justify-center gap-2 font-display font-bold text-sm py-3 px-4 rounded-xl border-3 border-black shadow-retro transition-all active:scale-95 ${
                  isLiked
                    ? 'bg-[#FF3388] text-white shadow-retro-lg -translate-y-0.5'
                    : 'bg-white text-black hover:bg-neutral-100 hover:-translate-y-0.5'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white text-white animate-bounce' : 'text-black'}`} />
                <span>{isLiked ? 'Disukai!' : 'Beri Apresiasi (Like)'}</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-black ${isLiked ? 'bg-black text-[#FFE600]' : 'bg-[#FFE600] text-black border border-black'}`}>
                  {artwork.likesCount}
                </span>
              </button>

              {onGoToBooth && (
                <button
                  onClick={() => {
                    onClose();
                    onGoToBooth(artwork.boothId);
                  }}
                  className="btn-retro-cyan px-4 py-3 flex items-center gap-1.5 text-xs sm:text-sm active:scale-95"
                  title="Lihat Titik Booth di Denah Lt. 3"
                >
                  <MapPin className="w-4 h-4" /> Lihat di Denah
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

