import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { 
  MapPin, 
  Palette, 
  Sparkles, 
  Info, 
  Compass, 
  Eye, 
  CheckCircle2, 
  Wind, 
  SunMedium, 
  ArrowUpRight,
  Mic,
  Brush,
  Shapes,
  Camera,
  RotateCw,
  EyeOff,
  Database
} from 'lucide-react';
import { BOOTH_ZONES } from '../data/mockData';
import { BoothService, ArtworkService } from '../services/api';
import { resolveBoothId } from '../services/db/artworkDb';

export default function VenueLayoutPage({ artworks = [], onSelectArtwork, selectedBoothId, onNavigateCatalogue }) {
  const containerRef = useRef(null);
  const detailBoxRef = useRef(null);

  const [zones, setZones] = useState(BOOTH_ZONES);
  const [liveArtworks, setLiveArtworks] = useState(artworks);
  const [activeZoneId, setActiveZoneId] = useState(selectedBoothId || 'booth-a');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  // Sync selectedBoothId if changed from parent
  useEffect(() => {
    if (selectedBoothId) {
      setActiveZoneId(selectedBoothId);
    }
  }, [selectedBoothId]);

  // Load live data from Backend & Database on mount
  useEffect(() => {
    loadLiveData();
  }, []);

  // Update live artworks if prop updates
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      setLiveArtworks(artworks);
    }
  }, [artworks]);

  const loadLiveData = async () => {
    setIsLoading(true);
    try {
      const [boothsData, artsData] = await Promise.all([
        BoothService.getBooths(),
        ArtworkService.getAllArtworks()
      ]);

      if (Array.isArray(boothsData) && boothsData.length > 0) {
        setZones(boothsData);
      }
      if (Array.isArray(artsData) && artsData.length > 0) {
        setLiveArtworks(artsData);
      }
      setIsSynced(true);
    } catch (err) {
      console.warn('VenueLayoutPage live sync fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Find active zone with resilient fallback
  const activeZone = useMemo(() => {
    return zones.find(z => z.id === activeZoneId) || 
           zones.find(z => z.code?.toLowerCase() === activeZoneId?.toLowerCase()) || 
           zones[0] || 
           BOOTH_ZONES[0];
  }, [zones, activeZoneId]);

  // Filter artworks strictly connected to active zone
  const currentArtworkList = useMemo(() => {
    return (liveArtworks && liveArtworks.length > 0) ? liveArtworks : artworks;
  }, [liveArtworks, artworks]);

  const zoneArtworks = useMemo(() => {
    return currentArtworkList.filter(a => {
      const bId = resolveBoothId(a);
      return bId === activeZone.id || bId === activeZone.code?.toLowerCase();
    });
  }, [currentArtworkList, activeZone]);

  // Real-time count of artworks in each zone
  const getZoneArtworkCount = (zoneId) => {
    return currentArtworkList.filter(a => {
      const bId = resolveBoothId(a);
      return bId === zoneId;
    }).length;
  };

  // Entrance animations on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.denah-header-banner',
        { y: -30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        '.denah-map-card',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 }
      );

      gsap.fromTo(
        '.denah-booth-node',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)', delay: 0.3 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Zone Change Transition for detail panel
  useEffect(() => {
    if (detailBoxRef.current) {
      gsap.fromTo(
        detailBoxRef.current,
        { opacity: 0, y: 15, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' }
      );

      gsap.fromTo(
        '.denah-artwork-item',
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, stagger: 0.04, duration: 0.3, ease: 'power1.out', delay: 0.05 }
      );
    }
  }, [activeZoneId]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-10">
      
      {/* Header Banner */}
      <div className="denah-header-banner bg-[#00F0FF] text-black border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-2 sm:space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-[#00F0FF] px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black uppercase">
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFE600]" /> DENAH & PETA INTERAKTIF
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white border-2 border-black text-black px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-black">
              <Database className="w-3 h-3 text-[#22C55E]" /> Terhubung Database
            </div>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-5xl text-black leading-tight">
            Layout Student Centre Lantai 3
          </h1>
          <p className="text-neutral-900 text-xs sm:text-base font-medium leading-relaxed">
            Pemilihan venue lantai 3 dirancang agar sirkulasi udara tetap sejuk, pencahayaan alami optimal untuk karya, serta kapasitas luas yang nyaman bagi pengunjung.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Left) + Zone Details & Artworks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Interactive Visual Floor Plan Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="denah-map-card card-retro p-4 sm:p-6 bg-white space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-black">
                  Peta Denah Lantai 3 (Klik Zona)
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-500">
                  Klik salah satu kotak zona di bawah untuk melihat detail display & karya terdaftar.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadLiveData}
                  disabled={isLoading}
                  title="Sinkronkan dengan Database"
                  className="p-1.5 rounded-lg border-2 border-black bg-[#FAF7EE] hover:bg-[#FFE600] transition-colors disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-black ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-neutral-600 shrink-0">
                  <span className="w-2.5 h-2.5 bg-[#22C55E] rounded-full animate-ping"></span>
                  <span>Interaktif</span>
                </div>
              </div>
            </div>

            {/* Simulated Interactive SVG Floor Plan */}
            <div className="relative bg-[#FAF7EE] border-2 sm:border-3 border-black rounded-xl sm:rounded-2xl p-3.5 sm:p-6 overflow-hidden min-h-[320px] sm:min-h-[380px] flex flex-col justify-between bg-retro-grid">
              
              {/* North Indicator */}
              <div className="absolute top-2 right-3 font-mono text-[9px] sm:text-[10px] font-black bg-white px-2 py-0.5 rounded border border-black flex items-center gap-1 shadow-retro-sm">
                <span>⬆ UTARA</span>
              </div>

              {/* Top Row: Zona A (Lukis) */}
              <div className="w-full">
                <button
                  onClick={() => setActiveZoneId('booth-a')}
                  className={`denah-booth-node w-full p-3 sm:p-4 rounded-xl border-2 sm:border-3 border-black text-left transition-all duration-150 active:scale-95 ${
                    activeZoneId === 'booth-a'
                      ? 'bg-[#FFE600] shadow-retro scale-[1.01] sm:scale-[1.02]'
                      : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs sm:text-sm text-black truncate pr-2 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-black shrink-0" /> ZONA A: GALERI LUKISAN
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-black text-white font-black px-2 py-0.5 rounded shrink-0">
                      {getZoneArtworkCount('booth-a')} Karya
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-700 mt-0.5 sm:mt-1">Sisi Utara (Pencahayaan Kaca Terbuka)</p>
                </button>
              </div>

              {/* Middle Row: Zona D (Stage), Zona C (Pojok Live Painting), Zona B (Kerajinan) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 my-2.5 sm:my-4">
                
                {/* Zona D: Panggung Barat */}
                <button
                  onClick={() => setActiveZoneId('booth-d')}
                  className={`denah-booth-node p-2.5 sm:p-3 rounded-xl border-2 sm:border-3 border-black text-left transition-all active:scale-95 ${
                    activeZoneId === 'booth-d'
                      ? 'bg-[#7B2CBF] text-white shadow-retro scale-[1.01] sm:scale-[1.02]'
                      : 'bg-white hover:bg-neutral-50 text-black'
                  }`}
                >
                  <span className="font-display font-black text-xs flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 shrink-0" /> ZONA D: STAGE
                  </span>
                  <p className={`text-[10px] mt-1 ${activeZoneId === 'booth-d' ? 'text-white/80' : 'text-neutral-600'}`}>
                    Talkshow & Games
                  </p>
                </button>

                {/* Zona C: Pusat Tengah Live Painting */}
                <button
                  onClick={() => setActiveZoneId('booth-c')}
                  className={`denah-booth-node p-3 rounded-xl border-3 border-black text-left transition-all active:scale-95 ${
                    activeZoneId === 'booth-c'
                      ? 'bg-[#00F0FF] text-black shadow-retro scale-[1.02]'
                      : 'bg-white hover:bg-neutral-50 text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs flex items-center gap-1.5">
                      <Brush className="w-3.5 h-3.5 shrink-0" /> ZONA C: POJOK GAMBAR
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-neutral-700">Live Painting</p>
                    <span className="text-[9px] bg-black text-[#00F0FF] font-black px-1.5 py-0.5 rounded">
                      {getZoneArtworkCount('booth-c')} Karya
                    </span>
                  </div>
                </button>

                {/* Zona B: Kriya Kerajinan Timur */}
                <button
                  onClick={() => setActiveZoneId('booth-b')}
                  className={`denah-booth-node p-3 rounded-xl border-3 border-black text-left transition-all active:scale-95 ${
                    activeZoneId === 'booth-b'
                      ? 'bg-[#FF3388] text-white shadow-retro scale-[1.02]'
                      : 'bg-white hover:bg-neutral-50 text-black'
                  }`}
                >
                  <span className="font-display font-black text-xs flex items-center gap-1.5">
                    <Shapes className="w-3.5 h-3.5 shrink-0" /> ZONA B: KERAJINAN
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-[10px] ${activeZoneId === 'booth-b' ? 'text-white/80' : 'text-neutral-600'}`}>
                      Display 3D Kriya
                    </p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${activeZoneId === 'booth-b' ? 'bg-white text-black' : 'bg-black text-white'}`}>
                      {getZoneArtworkCount('booth-b')} Karya
                    </span>
                  </div>
                </button>

              </div>

              {/* Bottom Row: Zona E (Photobooth & Pintu Masuk) */}
              <div className="w-full">
                <button
                  onClick={() => setActiveZoneId('booth-e')}
                  className={`denah-booth-node w-full p-3.5 rounded-xl border-3 border-black text-left transition-all active:scale-95 ${
                    activeZoneId === 'booth-e'
                      ? 'bg-[#FF6B35] text-white shadow-retro scale-[1.02]'
                      : 'bg-white hover:bg-neutral-50 text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-xs sm:text-sm flex items-center gap-1.5">
                      <Camera className="w-4 h-4 shrink-0" /> ZONA E: PHOTOBOOTH & INFO DESK (PINTU MASUK)
                    </span>
                    <span className="text-[10px] bg-black text-[#FFE600] font-black px-2 py-0.5 rounded">Check-in Point</span>
                  </div>
                </button>
              </div>

            </div>

            {/* Venue Advantages Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                <Wind className="w-4 h-4 text-[#00F0FF] shrink-0" />
                <span className="font-bold">Sirkulasi Udara Terbuka & Sejuk</span>
              </div>
              <div className="p-3 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs flex items-center gap-2 hover:-translate-y-0.5 transition-transform">
                <SunMedium className="w-4 h-4 text-[#FFE600] shrink-0" />
                <span className="font-bold">Pencahayaan Alami Estetik</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Selected Zone Details & Featured Artworks */}
        <div className="lg:col-span-5 space-y-6">
          <div ref={detailBoxRef} className="card-retro p-6 sm:p-8 bg-white space-y-6">
            
            {/* Zone Title Header */}
            <div className="space-y-3 border-b-2 border-neutral-200 pb-4">
              <div className="flex items-center justify-between">
                <span className="bg-black text-[#FFE600] font-mono text-xs font-black px-2.5 py-1 rounded-md border border-black uppercase">
                  {activeZone.code}
                </span>
                <span className="text-xs font-bold text-neutral-500">
                  {activeZone.location}
                </span>
              </div>

              <h2 className="font-display font-black text-2xl text-black">
                {activeZone.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {activeZone.description}
              </p>
            </div>

            {/* List of Activities in this Zone */}
            <div className="space-y-2">
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-800">
                Aktivitas di Zona Ini:
              </h4>
              <div className="space-y-1.5">
                {(activeZone.activities || []).map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-[#FAF7EE] p-2 rounded-lg border border-black/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Artworks Displayed in this Zone */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-800">
                  Karya di Zona Ini ({zoneArtworks.length}):
                </h4>
                <button
                  onClick={onNavigateCatalogue}
                  className="text-xs font-bold text-[#FF3388] hover:underline flex items-center gap-1"
                >
                  Buka Katalog <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {zoneArtworks.length > 0 ? (
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1.5 catalogue-scrollbar">
                  {zoneArtworks.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => onSelectArtwork(art)}
                      className="denah-artwork-item p-3 bg-[#FAF7EE] hover:bg-[#FFE600]/20 border-2 border-black rounded-xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-10 h-10 object-cover rounded-lg border border-black shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                        <div className="overflow-hidden">
                          <h5 className="font-display font-bold text-xs text-black group-hover:text-[#FF3388] truncate">
                            {art.title}
                          </h5>
                          <span className="text-[10px] text-neutral-500 font-medium">
                            Oleh {art.isAnonymous || /rahasia|dirahasiakan|anonim|anonymous|secret/i.test(art.artist || '') ? 'Pencipta Dirahasiakan' : art.artist}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-[#FAF7EE] border-2 border-dashed border-neutral-300 rounded-xl text-center text-xs text-neutral-500 space-y-1">
                  <p className="font-bold text-neutral-700">Tidak ada karya di zona ini.</p>
                  <p>Area ini difokuskan untuk aktivitas interaktif, panggung utama, atau photobooth.</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
