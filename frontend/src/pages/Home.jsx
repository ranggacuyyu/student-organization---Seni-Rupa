import React from 'react';
import {
  Palette,
  UserCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Heart,
  Layers,
  ShieldCheck,
  Ticket,
  Calendar,
  Compass,
  Smile,
  Brush
} from 'lucide-react';
import { EVENT_INFO, BOOTH_ZONES } from '../data/mockData';
import senrupLogo from '../assets/SENRUP.png';

export default function Home({
  onNavigate,
  artworks,
  attendancesCount,
  onSelectArtwork,
  currentLiveSession
}) {
  const featuredArtworks = artworks.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-retro-grid border-b-3 border-black">

        {/* Floating Memphis Elements */}
        <div className="absolute top-6 left-6 hidden sm:flex items-center gap-2 bg-[#00F0FF] border-2 border-black rounded-xl px-3 py-1 text-xs font-black shadow-retro rotate-[-6deg] animate-float">
          <img src={senrupLogo} alt="Logo Seni Rupa" className="w-10 h-10 object-contain inline-block" />

          <span>PROKER DIVISI SENI RUPA</span>
        </div>
        <div className="absolute top-12 right-10 hidden sm:flex items-center gap-2 bg-[#FFE600] border-2 border-black rounded-xl px-3 py-1 text-xs font-black shadow-retro rotate-[8deg] animate-float">
          <span>KUMPULAN ANAK SENI

          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">

            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-white border-3 border-black px-4 py-1.5 rounded-full shadow-retro-sm">
              <span className="w-2.5 h-2.5 bg-[#FF3388] rounded-full animate-ping"></span>
              <span className="font-display font-black text-xs sm:text-sm uppercase tracking-wide">
                EXHIBITION & ART SHOW CASE • TEMA: {EVENT_INFO.theme.toUpperCase()}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-black tracking-tight leading-[1.08]">
                JELAJAHI JEJAK KARYA & SEJARAH{' '}
                <span className="relative inline-block text-white bg-[#FF3388] px-4 py-1 border-3 border-black rounded-2xl shadow-retro rotate-[-2deg] my-2">
                  SENI RUPA
                </span>
              </h1>
              <p className="text-neutral-700 text-sm sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed pt-2">
                Pameran karya lukis, kriya kerajinan tangan, live painting, dan sarana apresiasi seni terbuka untuk seluruh <strong>Mahasiswa Baru & Civitas Politeknik Negeri Batam</strong>.
              </p>
            </div>

            {/* Venue & Time Badge Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-[#FAF7EE] border-2 border-black px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-retro-sm">
                <MapPin className="w-4 h-4 text-[#FF3388]" />
                <span>Student Centre Lantai 3 Polibatam</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FAF7EE] border-2 border-black px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-retro-sm">
                <Calendar className="w-4 h-4 text-[#00F0FF]" />
                <span>Sabtu, 12 September 2026 (10:00 - 17:00 WIB)</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('presensi')}
                className="btn-retro-yellow text-base sm:text-lg px-8 py-3.5 flex items-center gap-2"
              >
                <UserCheck className="w-5 h-5 text-black" />
                <span>Presensi Kehadiran (Scan / Isi)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('katalog')}
                className="btn-retro-cyan text-base sm:text-lg px-8 py-3.5 flex items-center gap-2"
              >
                <Palette className="w-5 h-5 text-black" />
                <span>Lihat Katalog Karya</span>
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t-3 border-black">
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-retro text-center">
              <div className="font-display font-black text-2xl sm:text-4xl text-[#FF3388]">
                {attendancesCount}+
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-700 mt-1">
                Pengunjung Terdaftar
              </div>
            </div>
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-retro text-center">
              <div className="font-display font-black text-2xl sm:text-4xl text-[#00F0FF]">
                {artworks.length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-700 mt-1">
                Karya Masterpiece
              </div>
            </div>
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-retro text-center">
              <div className="font-display font-black text-2xl sm:text-4xl text-[#FFE600]">
                5
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-700 mt-1">
                Zona Pameran Lt. 3
              </div>
            </div>
            <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-retro text-center">
              <div className="font-display font-black text-2xl sm:text-4xl text-[#7B2CBF]">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-700 mt-1">
                Gratis & Terbuka
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= LIVE SESSION ALERT BANNER ================= */}
      {currentLiveSession && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FFE600] border-3 border-black rounded-3xl p-6 shadow-retro-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black text-[#FFE600] border-2 border-black rounded-2xl flex items-center justify-center shrink-0 font-bold">
                <Clock className="w-7 h-7 animate-spin" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FF3388] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black uppercase animate-pulse">
                    🔴 SEDANG BERLANGSUNG (LIVE)
                  </span>
                  <span className="font-mono text-xs font-bold text-black">{currentLiveSession.time} WIB</span>
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-black">
                  {currentLiveSession.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium">
                  Lokasi: <strong>{currentLiveSession.location}</strong> • Oleh: {currentLiveSession.speaker}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('rundown')}
              className="btn-retro-white whitespace-nowrap text-sm px-6 py-3 shrink-0"
            >
              Lihat Seluruh Rundown 📅
            </button>
          </div>
        </section>
      )}

      {/* ================= HIGHLIGHT FITUR UTAMA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-block bg-[#00F0FF] border-2 border-black text-black text-xs font-black px-3 py-1 rounded-md uppercase">
            Fitur Portal Pameran
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-black">
            Semua yang Kamu Butuhkan di Art Showcase
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Presensi Smart IP */}
          <div className="card-retro p-6 space-y-4 bg-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#FFE600] border-3 border-black rounded-2xl flex items-center justify-center shadow-retro-sm">
                <UserCheck className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display font-black text-xl text-black">
                Presensi Cepat & Deteksi IP
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Check-in otomatis merekam IP address & device kamu untuk mendapatkan <strong>Digital VIP Ticket</strong> bergaya retro tanpa antre panjang di pintu masuk.
              </p>
            </div>
            <button
              onClick={() => onNavigate('presensi')}
              className="btn-retro-yellow w-full text-xs sm:text-sm mt-4"
            >
              Isi Presensi Sekarang ✍️
            </button>
          </div>

          {/* Card 2: Katalog Karya & Filosofi */}
          <div className="card-retro p-6 space-y-4 bg-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#FF3388] border-3 border-black rounded-2xl flex items-center justify-center shadow-retro-sm text-white">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-black">
                Katalog Karya & Makna Filosofis
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Eksplorasi lukisan dan kriya kerajinan dengan narasi mendalam, nama seniman, dimensi karya, serta berikan tanda suka (like) untuk karya favoritmu.
              </p>
            </div>
            <button
              onClick={() => onNavigate('katalog')}
              className="btn-retro-pink w-full text-xs sm:text-sm mt-4"
            >
              Jelajahi Galeri Karya 🖼️
            </button>
          </div>

          {/* Card 3: Interactive Floor Plan */}
          <div className="card-retro p-6 space-y-4 bg-white flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#00F0FF] border-3 border-black rounded-2xl flex items-center justify-center shadow-retro-sm text-black">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-black">
                Peta Denah Student Centre Lt 3
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Peta interaktif lantai 3 yang memandu kamu ke Zona Lukis, Zona Kriya, Pojok Live Painting, dan Panggung Utama tanpa tersesat.
              </p>
            </div>
            <button
              onClick={() => onNavigate('denah')}
              className="btn-retro-cyan w-full text-xs sm:text-sm mt-4"
            >
              Buka Peta Denah 🗺️
            </button>
          </div>

        </div>
      </section>

      {/* ================= PREVIEW KARYA TERPILIH ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block bg-[#FFE600] border-2 border-black text-black text-xs font-black px-3 py-1 rounded-md uppercase mb-2">
              Karya Unggulan
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-black">
              Sorotan Karya Anggota
            </h2>
          </div>
          <button
            onClick={() => onNavigate('katalog')}
            className="btn-retro-white text-xs sm:text-sm flex items-center gap-2"
          >
            <span>Lihat Semua ({artworks.length} Karya)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArtworks.map((art) => (
            <div
              key={art.id}
              onClick={() => onSelectArtwork(art)}
              className="card-retro-hover overflow-hidden cursor-pointer group bg-white flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-neutral-900 border-b-3 border-black">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#FFE600] border-2 border-black text-black text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-retro-sm">
                    {art.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white border border-white/40 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-[#FF3388] text-[#FF3388]" /> {art.likesCount}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-lg text-black group-hover:text-[#FF3388] transition-colors line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-semibold">
                    Oleh: <strong className="text-black">{art.artist}</strong> ({art.artistBatch || 'Anggota'})
                  </p>
                  <p className="text-xs text-neutral-600 line-clamp-2 pt-1 leading-relaxed">
                    {art.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[#7B2CBF]">
                <span>{art.boothName}</span>
                <span className="text-black group-hover:translate-x-1 transition-transform">Detail →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ZONA DENAH SPOTLIGHT ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7EE] border-3 border-black rounded-3xl p-8 shadow-retro-xl bg-retro-dots">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#7B2CBF] text-white border-2 border-black px-3 py-1 rounded-lg text-xs font-black uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#FFE600]" /> Student Centre Lt. 3
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-black">
                Denah Pameran Terbuka & Ramah Pengunjung
              </h2>
              <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed">
                Venue Lantai 3 Student Centre Polibatam dipilih karena memiliki <strong>sirkulasi udara yang sejuk, pencahayaan alami yang ideal untuk display seni</strong>, serta ruang pameran yang leluasa untuk eksplorasi karya.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {BOOTH_ZONES.map((booth) => (
                  <div key={booth.id} className="bg-white border-2 border-black rounded-xl p-3 shadow-retro-sm">
                    <span className="font-display font-bold text-xs text-black block">
                      {booth.name}
                    </span>
                    <span className="text-[11px] text-neutral-500">{booth.featuredCount} Spot Display</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('denah')}
                  className="btn-retro-purple text-xs sm:text-sm px-6 py-3 flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" /> Buka Peta Interaktif Lantai 3
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-retro relative overflow-hidden">
                <div className="aspect-4/3 bg-neutral-100 border-2 border-black rounded-xl p-4 flex flex-col justify-between relative">
                  <div className="flex justify-between items-center text-xs font-black font-mono">
                    <span className="bg-[#FFE600] px-2 py-0.5 border border-black rounded">ZONA A: LUKIS</span>
                    <span className="bg-[#00F0FF] px-2 py-0.5 border border-black rounded">ZONA C: LIVE PAINTING</span>
                  </div>
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto bg-[#FF3388] text-white border-3 border-black rounded-2xl shadow-retro flex items-center justify-center font-display font-black text-2xl rotate-[-4deg]">
                      LT. 3
                    </div>
                    <p className="font-display font-black text-sm text-black mt-3">STUDENT CENTRE POLIBATAM</p>
                    <p className="text-[11px] text-neutral-500 font-semibold">Art Show Case Area</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black font-mono">
                    <span className="bg-[#7B2CBF] text-white px-2 py-0.5 border border-black rounded">ZONA D: STAGE</span>
                    <span className="bg-[#FF6B35] text-white px-2 py-0.5 border border-black rounded">ZONA E: PHOTOBOOTH</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121212] text-white border-3 border-black rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-retro-xl">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="font-display font-black text-3xl sm:text-5xl text-white">
              Siap Mengapresiasi Karya Seni Rupa Polibatam?
            </h2>
            <p className="text-neutral-300 text-xs sm:text-base leading-relaxed">
              Lakukan presensi sekarang dan dapatkan kartu tiket digital resmimu untuk menikmati seluruh rangkaian Art Showcase 'History'!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={() => onNavigate('presensi')}
              className="btn-retro-yellow text-sm sm:text-base px-8 py-3.5"
            >
              Presensi Sekarang ✍️
            </button>
            <button
              onClick={() => onNavigate('pesan-kesan')}
              className="btn-retro-white text-sm sm:text-base px-8 py-3.5"
            >
              Tulis Kesan di Buku Tamu 💬
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
