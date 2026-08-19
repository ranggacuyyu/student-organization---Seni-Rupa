import React from 'react';
import { Palette, Heart, MapPin, Calendar, Sparkles, ExternalLink, Shield, Camera } from 'lucide-react';
import { EVENT_INFO } from '../../data/mockData';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="w-full bg-[#121212] text-white border-t-3 border-black relative overflow-hidden">
      {/* Decorative Top Stripes */}
      <div className="h-3 w-full bg-retro-stripes"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About Event */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFE600] text-black border-2 border-white rounded-xl shadow-[3px_3px_0px_#FFF] flex items-center justify-center font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white tracking-wide">
                  {EVENT_INFO.title}
                </h3>
                <span className="text-[#00F0FF] text-xs font-bold uppercase tracking-wider">
                  Tema: {EVENT_INFO.theme}
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Program kerja Divisi Seni Rupa Politeknik Negeri Batam untuk mengenalkan perjalanan, karya lukis, kriya kerajinan, dan proses kreatif seluruh anggota divisi.
            </p>
            <div className="inline-flex items-center gap-2 bg-[#FF3388]/20 border border-[#FF3388] text-[#FF3388] px-3 py-1.5 rounded-lg text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Palet Desain: Retro 
            </div>
          </div>

          {/* Col 2: Info Lokasi & Waktu */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-[#FFE600] uppercase tracking-wider border-b-2 border-neutral-800 pb-2">
              Lokasi & Waktu
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">{EVENT_INFO.venue}</p>
                  <p className="text-neutral-400 text-xs">{EVENT_INFO.venueSpecs}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Sabtu, 12 September 2026</p>
                  <p className="text-neutral-400 text-xs">{EVENT_INFO.timeRange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Struktur Panitia Inti */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-[#00F0FF] uppercase tracking-wider border-b-2 border-neutral-800 pb-2">
              Kepanitiaan
            </h4>
            <ul className="text-xs text-neutral-300 space-y-1.5 font-medium">
              <li><strong className="text-white">Ketua Pelaksana:</strong> {EVENT_INFO.committee.ketua}</li>
              <li><strong className="text-white">Bendahara:</strong> {EVENT_INFO.committee.bendahara}</li>
              <li><strong className="text-white">Sekretaris:</strong> {EVENT_INFO.committee.sekretaris}</li>
              <li><strong className="text-white">Koor Acara:</strong> {EVENT_INFO.committee.koorAcara}</li>
              <li><strong className="text-white">Koor Dokum:</strong> {EVENT_INFO.committee.koorDokum}</li>
              <li><strong className="text-white">Koor Perkap:</strong> {EVENT_INFO.committee.koorPerkap}</li>
            </ul>
          </div>

          {/* Col 4: Quick Portal & Socials */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-base text-[#FF3388] uppercase tracking-wider border-b-2 border-neutral-800 pb-2">
              Akses Cepat
            </h4>
            <div className="space-y-2">
              <button
                onClick={onNavigateAdmin}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-900 hover:bg-[#FFE600] hover:text-black text-white border border-neutral-700 hover:border-black rounded-xl text-xs font-bold transition-all"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00F0FF]" /> Portal Panitia & Log IP
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="pt-2">
              <p className="text-neutral-400 text-xs mb-2">Ikuti Akun Resmi:</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 border border-neutral-700">
                  <Camera className="w-3.5 h-3.5 text-[#FF3388]" /> @senirupa_polibatam
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2024 Divisi Seni Rupa Politeknik Negeri Batam. All Rights Reserved.</p>
          <div className="flex items-center gap-2">
            <span>Built with React + Laravel + Supabase</span>
            <span>•</span>
            <span className="text-[#FF3388] flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 fill-[#FF3388]" /> for Art Showcase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
