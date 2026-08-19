import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  Flame
} from 'lucide-react';
import { RUNDOWN_SCHEDULE, EVENT_INFO } from '../data/mockData';

export default function RundownPage({ rundowns, onNavigateBooth }) {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRundowns = rundowns.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 bg-[#FF3388] text-white border-2 border-black text-xs font-black px-3 py-1 rounded-full animate-pulse shadow-retro-sm">
            <Flame className="w-3.5 h-3.5 fill-white" /> SEDANG BERLANGSUNG (LIVE)
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-[#22C55E]/20 text-[#15803D] border border-[#22C55E] text-xs font-bold px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#FAF7EE] text-neutral-600 border border-neutral-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Akan Datang
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-[#7B2CBF] text-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFE600] text-black px-3 py-1 rounded-lg text-xs font-black uppercase">
            <Clock className="w-3.5 h-3.5 text-black" /> TIMELINE & SUSUNAN ACARA
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Rundown Pameran & Kegiatan
          </h1>
          <p className="text-white/90 text-xs sm:text-base font-medium">
            Jadwal komprehensif seluruh rangkaian acara Art Showcase 'History', mulai dari tur galeri lukis & kerajinan, live painting, talkshow, hingga games tebak gambar.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 transition-all ${
            filterStatus === 'all'
              ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          Semua Agenda ({rundowns.length})
        </button>
        <button
          onClick={() => setFilterStatus('ongoing')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 transition-all ${
            filterStatus === 'ongoing'
              ? 'bg-[#FF3388] text-white border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          🔴 Sesi Live Sekarang
        </button>
        <button
          onClick={() => setFilterStatus('upcoming')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 transition-all ${
            filterStatus === 'upcoming'
              ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          ⏳ Akan Datang
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm border-2 transition-all ${
            filterStatus === 'completed'
              ? 'bg-neutral-800 text-white border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          ✅ Selesai
        </button>
      </div>

      {/* Vertical Timeline List */}
      <div className="space-y-6">
        {filteredRundowns.map((item, index) => {
          const isOngoing = item.status === 'ongoing';
          return (
            <div
              key={item.id}
              className={`card-retro p-6 sm:p-8 transition-all ${
                isOngoing
                  ? 'bg-[#FAF7EE] border-3 border-[#FF3388] shadow-retro-lg ring-4 ring-[#FF3388]/20'
                  : 'bg-white hover:-translate-y-0.5'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Left Side: Time & Status */}
                <div className="space-y-3 lg:w-72 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-lg sm:text-xl text-black bg-[#FFE600] px-3 py-1 rounded-xl border-2 border-black inline-block shadow-retro-sm">
                      {item.time} WIB
                    </span>
                  </div>
                  <div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Center Side: Title, Speaker & Details */}
                <div className="space-y-2.5 flex-1 border-t-2 lg:border-t-0 lg:border-l-2 border-dashed border-neutral-300 pt-4 lg:pt-0 lg:pl-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-[#00F0FF]/30 text-black text-[11px] font-black px-2.5 py-0.5 rounded border border-black uppercase">
                      {item.category}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#FF3388]" /> {item.location}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl sm:text-2xl text-black">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-bold bg-[#FAF7EE] p-2 rounded-lg border border-black/20 w-fit">
                    <User className="w-3.5 h-3.5 text-[#7B2CBF]" />
                    <span>Pemateri / Penanggung Jawab: {item.speaker}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
