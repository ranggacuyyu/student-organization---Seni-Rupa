import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  Sparkles, 
  ArrowLeft, 
  Palette, 
  Calendar, 
  Rocket, 
  Layers, 
  Heart, 
  Brush, 
  Star, 
  BellRing,
  Clock,
  ExternalLink
} from 'lucide-react';
import senrupLogo from '../assets/SENRUP.png';

export default function ComingSoonPage({ onNavigateHome }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Stagger
      gsap.fromTo(
        '.coming-soon-badge',
        { scale: 0, rotation: -20, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' }
      );

      gsap.fromTo(
        '.coming-soon-title',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.coming-soon-card',
        { y: 40, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const upcomingProkerList = [
    {
      id: 'proker-1',
      title: 'Open Recruitment Anggota 2027',
      tag: 'Segera Hadir',
      date: 'Oktober 2026',
      color: 'bg-[#FFE600]',
      desc: 'Pendaftaran terbuka untuk mahasiswa baru & civitas Polibatam yang memiliki minat dalam seni lukis, digital art, sketsa, dan kriya 3D.',
      icon: Palette
    },
    {
      id: 'proker-2',
      title: 'Workshop Mural & Live Illustration',
      tag: 'Edisi Khusus',
      date: 'November 2026',
      color: 'bg-[#00F0FF]',
      desc: 'Sesi belajar langsung bersama seniman mural Batam untuk mengeksplorasi teknik kuas, spray paint, dan komposisi warna kontemporer.',
      icon: Brush
    },
    {
      id: 'proker-3',
      title: 'Art Showcase Merch Drop Vol. 2',
      tag: 'Official Drop',
      date: 'Desember 2026',
      color: 'bg-[#FF3388]',
      textColor: 'text-white',
      desc: 'Koleksi merchandise eksklusif: T-Shirt sablon retro, gantungan kunci resin daur ulang, tote bag kanvas, dan vinyl sticker pack.',
      icon: Rocket
    },
    {
      id: 'proker-4',
      title: 'Pameran Akhir Tahun & Art Awarding',
      tag: 'Main Event',
      date: 'Januari 2027',
      color: 'bg-[#CCFF00]',
      desc: 'Eksibisi akbar tahunan penutup kepengurusan dengan panggung pertunjukan seni kolaboratif & apresiasi karya mahasiswa terfavorit.',
      icon: Star
    }
  ];

  return (
    <div ref={containerRef} className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-retro-dots flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Floating Memphis Accents */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-[#FFE600] rounded-full border-3 border-black opacity-40 blur-[1px] -z-10 animate-bounce"></div>
      <div className="absolute bottom-12 right-12 w-24 h-24 bg-[#FF3388] rounded-3xl border-3 border-black rotate-12 opacity-30 -z-10"></div>
      <div className="absolute top-1/3 right-8 w-12 h-12 bg-[#00F0FF] rounded-lg border-2 border-black rotate-45 opacity-40 -z-10"></div>

      <div className="max-w-4xl w-full mx-auto space-y-10 text-center relative z-10">

        {/* Big Header Banner */}
        <div className="space-y-4">
          
          {/* Animated Badge & Logo */}
          <div className="coming-soon-badge inline-flex items-center gap-3 bg-[#FFE600] border-3 border-black px-5 py-2.5 rounded-2xl shadow-retro">
            <img src={senrupLogo} alt="Logo Seni Rupa" className="w-10 h-10 object-contain drop-shadow" />
            <div className="text-left">
              <span className="text-[10px] font-black tracking-wider text-black/70 block uppercase">
                DIVISI SENI RUPA POLIBATAM
              </span>
              <span className="font-display font-black text-sm text-black">
                AGENDA PROGRAM KERJA RESMI
              </span>
            </div>
          </div>

          <div className="coming-soon-title space-y-3">
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-black tracking-tight leading-tight">
              COMING{' '}
              <span className="bg-[#FF3388] text-white px-4 py-1 border-3 border-black rounded-2xl shadow-retro inline-block rotate-[-2deg]">
                SOON!
              </span>
            </h1>

            <p className="text-sm sm:text-lg font-medium text-neutral-700 max-w-2xl mx-auto leading-relaxed">
              Kami sedang menyiapkan serangkaian <strong>Program Kerja & Agenda Seni Spektakuler</strong> berikutnya untuk seluruh mahasiswa dan civitas akademika Politeknik Negeri Batam!
            </p>
          </div>

        </div>

        {/* Upcoming Proker Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
          {upcomingProkerList.map((proker) => {
            const Icon = proker.icon;
            return (
              <div
                key={proker.id}
                className="coming-soon-card card-retro-hover p-6 bg-white flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl border-3 border-black flex items-center justify-center shadow-retro-sm ${proker.color} ${proker.textColor || 'text-black'} group-hover:rotate-6 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-black text-[#FFE600] font-black px-2 py-0.5 rounded border border-black uppercase block">
                        {proker.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-600 block mt-1">
                        {proker.date}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-xl text-black group-hover:text-[#FF3388] transition-colors">
                      {proker.title}
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium leading-relaxed mt-2">
                      {proker.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-dashed border-neutral-200 flex items-center justify-between text-xs font-bold text-neutral-500">
                  <span>Status: Dalam Tahap Kurasi</span>
                  <span className="text-[#FF3388] font-black">Nantikan Segera</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="card-retro p-8 bg-[#00F0FF] border-3 border-black text-black text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white text-black border-2 border-black text-xs font-black px-3 py-1 rounded-full shadow-retro-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF3388]" /> TETAP TERHUBUNG BERSAMA KAMI
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-black">
            Ingin Berkolaborasi atau Mengajukan Karya?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-800 font-semibold max-w-lg mx-auto">
            Kunjungi booth pameran kami di <strong>Student Centre Lantai 3 Polibatam</strong> atau temui tim panitia di lokasi pameran.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateHome}
              className="btn-retro-pink text-xs sm:text-sm px-6 py-3 shadow-retro"
            >
              Jelajahi Pameran Sekarang
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
