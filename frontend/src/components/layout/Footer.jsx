import React from 'react';
import { Palette, Heart, MapPin, Calendar, ExternalLink, Shield, Camera } from 'lucide-react';
import { EVENT_INFO } from '../../data/mockData';

export default function Footer({ onNavigateAdmin }) {
  return (
    <footer className="w-full bg-[#121212] text-white border-t-3 border-black relative overflow-hidden">
      {/* Decorative Top Stripes */}
      <div className="h-2.5 sm:h-3 w-full bg-retro-stripes"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Col 1: About Event & Brand */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFE600] text-black border-2 border-white rounded-xl shadow-[3px_3px_0px_#FFF] flex items-center justify-center font-bold shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-wide truncate">
                  {EVENT_INFO.title}
                </h3>
                <span className="text-[#00F0FF] text-[11px] font-bold uppercase tracking-wider block truncate">
                  Tema: {EVENT_INFO.theme}
                </span>
              </div>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Program kerja Divisi Seni Rupa Politeknik Negeri Batam untuk mengenalkan perjalanan, karya lukis, kriya kerajinan, dan proses kreatif seluruh anggota divisi.
            </p>
          </div>

          {/* Col 2: Info Lokasi & Waktu */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm sm:text-base text-[#FFE600] uppercase tracking-wider border-b-2 border-neutral-800 pb-1.5 sm:pb-2">
              Lokasi & Waktu
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-start gap-2.5 bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-xl">
                <MapPin className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs sm:text-sm">{EVENT_INFO.venue}</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{EVENT_INFO.venueSpecs}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-neutral-900/60 border border-neutral-800/80 p-2.5 rounded-xl">
                <Calendar className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-white text-xs sm:text-sm">Sabtu, 12 September 2026</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{EVENT_INFO.timeRange}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Struktur Panitia Inti */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm sm:text-base text-[#00F0FF] uppercase tracking-wider border-b-2 border-neutral-800 pb-1.5 sm:pb-2">
              Kepanitiaan
            </h4>
            <div className="bg-neutral-900/60 border border-neutral-800/80 p-3 rounded-xl space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Ketua Pelaksana</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.ketua}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Bendahara</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.bendahara}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Sekretaris</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.sekretaris}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Koor Acara</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.koorAcara}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Koor Dokum</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.koorDokum}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 text-[11px] sm:text-xs">Koor Perkap</span>
                <span className="font-bold text-white text-xs">{EVENT_INFO.committee.koorPerkap}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Portal & Socials */}
          <div className="space-y-3.5">
            <h4 className="font-display font-bold text-sm sm:text-base text-[#FF3388] uppercase tracking-wider border-b-2 border-neutral-800 pb-1.5 sm:pb-2">
              Akses Cepat & Medsos
            </h4>
            
            <div className="space-y-2.5">
              <button
                onClick={onNavigateAdmin}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-900 hover:bg-[#FFE600] hover:text-black text-white border border-neutral-700 hover:border-black rounded-xl text-xs font-bold transition-all shadow-retro-sm active:scale-95 group"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00F0FF] group-hover:text-black" /> Portal Panitia & Log IP
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
              </button>

              <a 
                href="https://www.instagram.com/srkuaspolbat"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl transition-all group active:scale-95"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3388]/20 border border-[#FF3388]/40 flex items-center justify-center text-[#FF3388] group-hover:scale-110 transition-transform shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 block">Instagram Resmi</span>
                    <span className="text-xs font-bold text-white group-hover:text-[#FF3388] transition-colors truncate block">
                      @srkuaspolbat
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white shrink-0" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 text-center sm:text-left">
          <p className="text-[11px] sm:text-xs">
            © 2026 Divisi Seni Rupa Politeknik Negeri Batam. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px]">
            <span className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded-md font-mono text-[10px]">
              React + Laravel + Supabase
            </span>
            <span className="text-[#FF3388] flex items-center gap-1 font-semibold">
              Made with <Heart className="w-3 h-3 fill-[#FF3388]" /> for Art Showcase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
