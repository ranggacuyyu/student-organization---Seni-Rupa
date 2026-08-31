import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { 
  X, 
  Heart, 
  Sparkles, 
  MapPin, 
  User, 
  Layers, 
  Maximize2, 
  Tag, 
  Calendar, 
  EyeOff, 
  ZoomIn, 
  Share2, 
  Check, 
  Compass,
  Palette,
  ShoppingBag,
  Lock,
  ShieldCheck
} from 'lucide-react';
import PurchaseModal from './PurchaseModal';
import { ArtworkService } from '../../services/api';

export default function ArtworkModal({ artwork, isOpen, onClose, onLike, isLiked, onGoToBooth }) {
  const modalBoxRef = useRef(null);
  const backdropRef = useRef(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // GSAP Modal Entrance Animation
  useEffect(() => {
    if (isOpen && modalBoxRef.current) {
      setIsLightboxOpen(false);
      setIsPurchaseModalOpen(false);
      setIsCopied(false);

      gsap.fromTo(
        modalBoxRef.current,
        { scale: 0.9, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }
  }, [isOpen, artwork?.id]);

  // Handle ESC key and Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (isPurchaseModalOpen) {
          setIsPurchaseModalOpen(false);
        } else {
          onClose?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLightboxOpen, isPurchaseModalOpen, onClose]);

  if (!isOpen || !artwork) return null;

  // Handle Backdrop Click
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose?.();
    }
  };

  // Handle Share / Copy Link
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: artwork.title,
          text: `Lihat karya seni "${artwork.title}" di Pameran Seni Rupa Polibatam!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${artwork.title} - Pameran Seni Rupa Polibatam: ${window.location.href}`
        );
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (err) {
      console.log('Share dismissed', err);
    }
  };

  const displayImageUrl = artwork.imageUrl || artwork.foto_utama_url || artwork.image || artwork.foto || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';

  const isAnonymousArtist = artwork.isAnonymous || 
    (typeof artwork.artist === 'string' && /rahasia|dirahasiakan|anonim|anonymous|secret|misterius/i.test(artwork.artist));

  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(artwork.price ?? 150000);

  const saleStatus = artwork.saleStatus || artwork.sale_status || 'available';
  const isSold = saleStatus === 'sold';
  const isBooked = saleStatus === 'booked';
  const isAvailable = saleStatus === 'available' && (artwork.isForSale !== false);

  const handlePurchaseSuccess = (orderData) => {
    ArtworkService.updateArtworkSaleStatus(artwork.id, 'sold', {
      buyerName: orderData.buyerName,
      orderId: orderData.orderId,
    });
    artwork.saleStatus = 'sold';
    artwork.buyerName = orderData.buyerName;
  };

  return (
    <>
      {/* Outer Modal Overlay */}
      <div 
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      >
        <div 
          ref={modalBoxRef}
          className="relative w-full max-w-5xl my-auto bg-[#FAF7EE] border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro-xl overflow-hidden flex flex-col max-h-[92dvh]"
        >
          
          {/* Top Bar Ribbon Header */}
          <div className="bg-[#FFE600] border-b-3 border-black px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="bg-[#FF3388] text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-lg border-2 border-black uppercase tracking-wider shrink-0 shadow-retro-xs">
                {artwork.category || 'Karya Seni'}
              </span>
              <span className="font-display font-black text-xs sm:text-sm text-black truncate hidden sm:inline">
                Katalog Pameran Seni Rupa Polibatam
              </span>
              <span className="font-display font-black text-xs text-black sm:hidden truncate">
                Detail Karya
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick Share Button */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Bagikan karya"
                className="p-1.5 sm:p-2 bg-white border-2 border-black rounded-xl hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 shadow-retro-xs transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
                title="Salin / Bagikan Informasi Karya"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                    <span className="text-[11px] text-green-700 hidden md:inline">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
                    <span className="text-[11px] text-black hidden md:inline">Bagikan</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                className="p-1.5 sm:p-2 bg-white border-2 border-black rounded-xl hover:bg-[#FF3388] hover:text-white active:translate-x-0.5 active:translate-y-0.5 shadow-retro-xs transition-all text-black cursor-pointer"
                title="Tutup (ESC)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: Responsive 2-Column Grid on Desktop, Smooth Stack on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">
            
            {/* Left Column: Image Artwork HD Display */}
            <div className="lg:col-span-6 bg-neutral-950 border-b-3 lg:border-b-0 lg:border-r-3 border-black p-3.5 sm:p-6 flex flex-col justify-center items-center relative overflow-hidden bg-retro-dots-white/10 min-h-[260px] sm:min-h-[340px] select-none">
              
              {/* Interactive Image Frame Button */}
              <button 
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="relative group max-w-full flex items-center justify-center cursor-zoom-in rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-retro-sm sm:shadow-retro-lg overflow-hidden bg-black transition-all hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                title="Klik untuk membuka layar penuh (HD)"
              >
                <img
                  src={displayImageUrl}
                  alt={artwork.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';
                  }}
                  className="w-full h-auto max-h-[250px] xs:max-h-[290px] sm:max-h-[360px] lg:max-h-[440px] object-contain rounded-lg sm:rounded-xl pointer-events-none"
                />

                {/* Hover / Tap Hint Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                  <span className="bg-white text-black font-display font-black text-xs px-3 py-1.5 rounded-xl border-2 border-black shadow-retro-xs flex items-center gap-1.5">
                    <ZoomIn className="w-4 h-4 text-[#FF3388]" /> Ketuk untuk Perbesar HD
                  </span>
                </div>

                {/* Dimension Tag Floating on Bottom Right */}
                <div className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] sm:text-xs font-mono font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-white/30 backdrop-blur-xs flex items-center gap-1.5 shadow-sm pointer-events-none">
                  <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00F0FF]" />
                  <span>{artwork.dimensions || 'HD Artwork'}</span>
                </div>
              </button>

              {/* Direct Touch-friendly Action Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-black bg-[#00F0FF] hover:bg-[#33F3FF] active:scale-95 px-3.5 py-1.5 rounded-xl border-2 border-black shadow-retro-xs transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-black shrink-0" />
                <span>Buka Layar Penuh (HD)</span>
              </button>
            </div>

            {/* Right Column: Detailed Narrative, Specs, Purchase & Actions */}
            <div className="lg:col-span-6 p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 bg-white lg:overflow-y-auto catalogue-scrollbar flex flex-col justify-between">
              
              <div className="space-y-4 sm:space-y-5">
                
                {/* Title & Artist Identity */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h2 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-black leading-tight break-words">
                      {artwork.title}
                    </h2>

                    {/* Price Tag Pill */}
                    {artwork.isForSale !== false && (
                      <div className="bg-[#CCFF00] text-black font-display font-black text-xs sm:text-sm px-3 py-1 rounded-xl border-2 border-black shadow-retro-xs">
                        {priceFormatted}
                      </div>
                    )}
                  </div>

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                    {/* Sale Status Pill */}
                    {isSold ? (
                      <div className="flex items-center gap-1.5 text-white font-black bg-[#FF3388] px-2.5 py-1 rounded-xl border-2 border-black shadow-retro-xs text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Koleksi Terjual (SOLD)</span>
                      </div>
                    ) : isBooked ? (
                      <div className="flex items-center gap-1.5 text-black font-black bg-[#FFE600] px-2.5 py-1 rounded-xl border-2 border-black shadow-retro-xs text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sedang Diproses</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-black font-black bg-[#CCFF00] px-2.5 py-1 rounded-xl border-2 border-black shadow-retro-xs text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Tersedia untuk Dikoleksi</span>
                      </div>
                    )}

                    {isAnonymousArtist ? (
                      <div className="flex items-center gap-1.5 text-purple-950 font-black bg-purple-100 px-3 py-1 rounded-xl border-2 border-purple-800 shadow-retro-xs">
                        <EyeOff className="w-4 h-4 text-purple-800 shrink-0" />
                        <span>Pencipta Dirahasiakan (Anonim)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-neutral-900 font-bold bg-[#00F0FF]/25 px-2.5 py-1 rounded-xl border-2 border-black shadow-retro-xs">
                        <User className="w-3.5 h-3.5 text-black shrink-0" />
                        <span className="truncate max-w-[200px]">{artwork.artist}</span>
                      </div>
                    )}

                    {!isAnonymousArtist && artwork.artistBatch && (
                      <span className="text-neutral-700 font-bold bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-300">
                        Angkatan {artwork.artistBatch}
                      </span>
                    )}

                    {artwork.year && (
                      <span className="flex items-center gap-1 text-neutral-700 font-bold bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-300">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{artwork.year}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Specifications Grid Micro-Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 text-xs sm:text-sm">
                  
                  {/* Medium & Material */}
                  <div className="bg-[#FAF7EE] border-2 border-black rounded-xl p-3 flex items-start gap-2.5 shadow-retro-xs">
                    <div className="p-1.5 bg-[#FF3388]/15 text-[#FF3388] rounded-lg border border-black shrink-0 mt-0.5">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-black uppercase text-neutral-500">Medium & Bahan</div>
                      <p className="text-black font-bold text-xs sm:text-sm leading-snug break-words">
                        {artwork.medium || 'Akrilik di atas Kanvas'}
                      </p>
                    </div>
                  </div>

                  {/* Exhibition Location / Booth */}
                  <div className="bg-[#FAF7EE] border-2 border-black rounded-xl p-3 flex items-start gap-2.5 shadow-retro-xs">
                    <div className="p-1.5 bg-[#7B2CBF]/15 text-[#7B2CBF] rounded-lg border border-black shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-black uppercase text-neutral-500">Lokasi Pameran</div>
                      <p className="text-black font-bold text-xs sm:text-sm leading-snug break-words">
                        {artwork.boothName || 'Student Centre Lt. 3'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Deep Narrative / Filosofi & Makna Karya */}
                <div className="space-y-2">
                  <h4 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#FF3388] shrink-0" /> Makna & Filosofi Karya
                  </h4>
                  <div className="bg-[#FAF7EE] p-3.5 sm:p-4 rounded-xl border-2 border-black shadow-retro-xs">
                    <p className="text-neutral-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                      {artwork.description || 'Tidak ada deskripsi filosofi khusus yang disertakan oleh seniman.'}
                    </p>
                  </div>
                </div>

                {/* Tags Section (if any) */}
                {artwork.tags && artwork.tags.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono font-bold uppercase text-neutral-500 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Tagar Terkait:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {artwork.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 bg-[#FFE600]/30 text-black border border-black text-[11px] font-bold px-2 py-0.5 rounded-md hover:bg-[#FFE600] transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* ACTION AREA: Purchase Button & Like/Booth Bar */}
              <div className="pt-3.5 mt-4 border-t-2 border-dashed border-neutral-300 space-y-3 shrink-0 select-none">
                
                {/* 1. Primary Purchase Button (Midtrans Integration) */}
                {artwork.isForSale !== false && (
                  <div>
                    {isSold ? (
                      <div className="w-full py-3 px-4 bg-neutral-100 border-2 border-neutral-400 rounded-xl text-center font-display font-black text-xs sm:text-sm text-neutral-600 shadow-retro-xs flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-neutral-500" />
                        <span>Karya Asli (1-of-1) Ini Telah Terjual kepada Kolektor</span>
                      </div>
                    ) : isBooked ? (
                      <div className="w-full py-3 px-4 bg-[#FFE600]/20 border-2 border-amber-500 rounded-xl text-center font-display font-black text-xs sm:text-sm text-amber-950 shadow-retro-xs flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4 text-amber-700" />
                        <span>Sedang Dalam Proses Pembayaran oleh Pembeli Lain</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPurchaseModalOpen(true)}
                        className="w-full btn-retro-yellow py-3 px-4 flex items-center justify-center gap-2 font-display font-black text-xs sm:text-sm shadow-retro hover:scale-[1.01] active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-black shrink-0" />
                        <span>Beli / Koleksi Karya Ini • {priceFormatted}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 2. Secondary Buttons (Like & Go To Booth) */}
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3">
                  
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => onLike(artwork.id)}
                    aria-label="Sukai karya ini"
                    className={`flex-1 flex items-center justify-center gap-2 font-display font-black text-xs sm:text-sm py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl border-3 border-black shadow-retro transition-all active:scale-95 cursor-pointer ${
                      isLiked
                        ? 'bg-[#FF3388] text-white shadow-retro-lg -translate-y-0.5'
                        : 'bg-white text-black hover:bg-[#FFE600]/20 hover:-translate-y-0.5'
                    }`}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isLiked ? 'fill-white text-white scale-110' : 'text-black'}`} />
                    <span className="truncate">
                      {isLiked ? 'Disukai!' : 'Apresiasi Karya'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-mono font-black shrink-0 ${
                      isLiked 
                        ? 'bg-black text-[#FFE600] border border-white/40' 
                        : 'bg-[#FFE600] text-black border border-black'
                    }`}>
                      {artwork.likesCount || 0}
                    </span>
                  </button>

                  {/* Go To Booth on Floor Plan Button */}
                  {onGoToBooth && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onGoToBooth(artwork.boothId);
                      }}
                      className="btn-retro-cyan py-2.5 sm:py-3 px-3.5 sm:px-4 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-display font-black shrink-0 active:scale-95 shadow-retro cursor-pointer"
                      title="Lihat Titik Booth di Denah Lt. 3"
                    >
                      <Compass className="w-4 h-4 shrink-0" />
                      <span>Lihat di Denah</span>
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Purchase Modal Form (Midtrans Gateway) */}
      <PurchaseModal
        artwork={artwork}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
      />

      {/* Fullscreen HD Artwork Lightbox Viewer rendered directly via React Portal */}
      {isLightboxOpen && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-fade-in select-none"
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999 }}
        >
          {/* Lightbox Top Header */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between w-full max-w-6xl mx-auto text-white pb-3 border-b border-white/20 shrink-0"
          >
            <div className="min-w-0 pr-4">
              <span className="text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider font-bold">
                {artwork.category} • Mode Layar Penuh (HD)
              </span>
              <h3 className="font-display font-black text-base sm:text-xl truncate text-white">
                {artwork.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 sm:p-2.5 bg-white/15 hover:bg-[#FF3388] border border-white/40 text-white rounded-xl transition-all shrink-0 active:scale-95 cursor-pointer shadow-lg"
              title="Tutup Pratinjau (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Center Image */}
          <div className="flex-1 flex items-center justify-center p-2 sm:p-4 min-h-0 overflow-hidden">
            <img
              src={displayImageUrl}
              alt={artwork.title}
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80';
              }}
              className="max-h-[78vh] sm:max-h-[84vh] max-w-[96vw] object-contain rounded-xl sm:rounded-2xl border-2 border-white/30 shadow-2xl transition-transform"
            />
          </div>

          {/* Lightbox Footer Caption */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl mx-auto text-center bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-xs text-neutral-300 font-medium shrink-0"
          >
            {artwork.artist && !isAnonymousArtist ? `Oleh ${artwork.artist}` : 'Karya Seniman Polibatam'} 
            {artwork.dimensions ? ` • Ukuran: ${artwork.dimensions}` : ''}
            <span className="hidden sm:inline"> • Ketuk latar belakang atau tombol X untuk keluar</span>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}




