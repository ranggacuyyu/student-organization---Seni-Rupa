import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Star, 
  Heart, 
  Smile, 
  Brush, 
  User, 
  Quote, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestbookService } from '../services/api';

export default function GuestbookPage({ messages, onAddMessage }) {
  const containerRef = useRef(null);
  const wallRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Mahasiswa Baru (Maba)',
    message: '',
    sticker: 'retro-star'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stickers = [
    { id: 'retro-star', label: '⭐ Bintang', icon: Star },
    { id: 'retro-heart', label: '💖 Cinta Seni', icon: Heart },
    { id: 'retro-brush', label: '🖌️ Kuas Lukis', icon: Brush },
    { id: 'retro-smile', label: '😃 Keren Banget', icon: Smile },
  ];

  // Entrance animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.guestbook-header-banner',
        { y: -30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.guestbook-form-card',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Staggered Sticky Notes drop-in
  useEffect(() => {
    if (wallRef.current) {
      const notes = wallRef.current.querySelectorAll('.guestbook-sticky-note');
      if (notes.length > 0) {
        gsap.fromTo(
          notes,
          { scale: 0.8, opacity: 0, y: 25 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.55,
            ease: 'back.out(1.8)'
          }
        );
      }
    }
  }, [messages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Silakan isi Nama dan Pesan Kesan Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newMsg = await GuestbookService.addMessage(formData);
      onAddMessage && onAddMessage(newMsg);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      setFormData({
        name: '',
        role: 'Mahasiswa Baru (Maba)',
        message: '',
        sticker: 'retro-star'
      });
    } catch (err) {
      alert('Gagal mengirim pesan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
      
      {/* Header Banner */}
      <div className="guestbook-header-banner bg-[#CCFF00] text-black border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-[#CCFF00] px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3388]" /> POJOK EKSPRESI & KESAN PESAN
          </div>
          <h1 className="font-display font-black text-2xl sm:text-5xl text-black leading-tight">
            Buku Tamu Digital Art Showcase
          </h1>
          <p className="text-neutral-900 text-xs sm:text-base font-medium leading-relaxed">
            Tinggalkan pesan, saran, atau kesanmu setelah berkeliling melihat pameran karya lukis & kriya di Student Centre Lantai 3 Polibatam!
          </p>
        </div>
      </div>

      {/* Grid: Form Input (Left) + Sticky Notes Wall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left: Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="guestbook-form-card card-retro p-4 sm:p-6 bg-white space-y-4 sm:space-y-5 lg:sticky lg:top-28">
            <div className="border-b-2 border-neutral-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-black">
                  Tulis Pesan Kesan
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-500">
                  Tempelkan catatanmu di dinding pameran digital.
                </p>
              </div>
              <span className="text-xl sm:text-2xl">📝</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block font-display font-bold text-xs text-black">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Sarah / Rizky"
                  required
                  className="input-retro text-xs sm:text-sm py-2.5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-display font-bold text-xs text-black">
                  Status / Prodi
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-retro text-xs sm:text-sm py-2.5 bg-white font-bold"
                >
                  <option value="Mahasiswa Baru (Maba)">Mahasiswa Baru (Maba)</option>
                  <option value="Mahasiswa Polibatam">Mahasiswa Aktif Polibatam</option>
                  <option value="Dosen / Staff">Dosen / Tendik Polibatam</option>
                  <option value="Pengunjung Umum">Pengunjung Umum</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-display font-bold text-xs text-black">
                  Pilih Stiker Ikon
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {stickers.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, sticker: stk.id })}
                      className={`p-2 rounded-xl border-2 font-display font-bold text-xs flex items-center gap-1.5 justify-center transition-all active:scale-95 ${
                        formData.sticker === stk.id
                          ? 'bg-[#FFE600] border-black shadow-retro-sm text-black scale-105'
                          : 'bg-[#FAF7EE] border-neutral-300 text-neutral-600 hover:border-black'
                      }`}
                    >
                      <span>{stk.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-display font-bold text-xs text-black">
                  Kesan & Pesan Anda <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Keren banget pamerannya! Suka banget sama booth lukisan di Zona A..."
                  required
                  className="input-retro text-xs sm:text-sm py-2.5 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-retro-pink py-3 text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengirim...' : 'Tempelkan Catatan ✨'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Sticky Notes Wall */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between bg-white border-3 border-black rounded-2xl p-4 shadow-retro">
            <div>
              <h3 className="font-display font-black text-lg text-black">
                Dinding Sticky Notes ({messages.length} Pesan)
              </h3>
              <p className="text-xs text-neutral-500">
                Apresiasi dari pengunjung pameran Art Showcase 'History'.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-600 bg-[#FAF7EE] px-3 py-1.5 rounded-xl border border-black">
              <span>📌 Live Guestbook</span>
            </div>
          </div>

          {/* Sticky Notes Grid */}
          <div ref={wallRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {messages.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`guestbook-sticky-note p-6 rounded-2xl border-3 border-black shadow-retro space-y-3 transition-transform hover:-translate-y-1.5 hover:rotate-0 ${
                  item.color || 'bg-[#FFE600]'
                } ${item.textColor || 'text-black'} ${idx % 2 === 0 ? 'rotate-[-1deg]' : 'rotate-[1.5deg]'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-display font-black text-base">
                      {item.name}
                    </h4>
                    <span className="text-[11px] font-bold opacity-85 block">
                      {item.role}
                    </span>
                  </div>
                  <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center text-lg shadow-sm">
                    {item.sticker === 'retro-heart' ? '💖' : item.sticker === 'retro-brush' ? '🖌️' : item.sticker === 'retro-smile' ? '😃' : '⭐'}
                  </div>
                </div>

                <div className="relative">
                  <Quote className="w-5 h-5 opacity-30 mb-1" />
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    "{item.message}"
                  </p>
                </div>

                <div className="pt-2 border-t border-black/15 flex items-center justify-between text-[10px] font-mono font-bold opacity-75">
                  <span>Student Centre Lt. 3</span>
                  <span>{item.createdAt || 'Hari Ini'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

