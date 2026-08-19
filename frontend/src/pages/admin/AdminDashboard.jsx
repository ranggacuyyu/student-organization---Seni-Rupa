import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Wifi, 
  Download, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Palette, 
  Clock, 
  CheckCircle2, 
  Smartphone, 
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { BOOTH_ZONES } from '../../data/mockData';
import { ArtworkService, RundownService } from '../../services/api';

export default function AdminDashboard({ 
  attendances, 
  artworks, 
  rundowns, 
  onRefreshData,
  onUpdateRundownStatus 
}) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'artworks' | 'rundown'
  
  // Attendance Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');

  // New Artwork Form State
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: '',
    artistNim: '',
    artistBatch: '2024',
    category: 'Lukis',
    medium: 'Acrylic on Canvas',
    dimensions: '100 x 80 cm',
    year: '2024',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    description: '',
    boothId: 'booth-a',
    boothName: 'Zona A - Galeri Lukis Sejarah',
    tags: 'Retro Pop, History'
  });
  const [isAddingArt, setIsAddingArt] = useState(false);

  // Filtered Attendances
  const filteredAttendances = useMemo(() => {
    return attendances.filter((att) => {
      const matchCat = filterCategory === 'Semua' || att.kategori === filterCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        att.nama_lengkap?.toLowerCase().includes(q) ||
        att.identifier?.toLowerCase().includes(q) ||
        att.ip_address?.toLowerCase().includes(q) ||
        att.jurusan_prodi?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [attendances, filterCategory, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = attendances.length;
    const maba = attendances.filter(a => a.kategori === 'Mahasiswa Baru').length;
    const mahasiswa = attendances.filter(a => a.kategori === 'Mahasiswa Polibatam').length;
    const uniqueIps = new Set(attendances.map(a => a.ip_address)).size;
    return { total, maba, mahasiswa, uniqueIps };
  }, [attendances]);

  // Export to CSV / Excel
  const handleExportCSV = () => {
    if (attendances.length === 0) {
      alert('Belum ada data presensi untuk diekspor.');
      return;
    }

    const headers = ['ID', 'Nama Lengkap', 'NIM / Identitas', 'Kategori', 'Jurusan / Prodi', 'IP Address', 'Perangkat / Browser', 'Waktu Kehadiran', 'Catatan'];
    const rows = attendances.map(a => [
      `"${a.id || ''}"`,
      `"${a.nama_lengkap || ''}"`,
      `"${a.identifier || ''}"`,
      `"${a.kategori || ''}"`,
      `"${a.jurusan_prodi || ''}"`,
      `"${a.ip_address || ''}"`,
      `"${a.device_type || ''}"`,
      `"${a.waktu_kehadiran || ''}"`,
      `"${(a.catatan || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_presensi_art_showcase_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit New Artwork
  const handleAddArtwork = async (e) => {
    e.preventDefault();
    if (!newArtwork.title.trim() || !newArtwork.artist.trim() || !newArtwork.description.trim()) {
      alert('Lengkapi seluruh data karya wajib.');
      return;
    }

    const booth = BOOTH_ZONES.find(b => b.id === newArtwork.boothId);
    const payload = {
      ...newArtwork,
      boothName: booth ? booth.name : 'Student Centre Lt. 3',
      tags: newArtwork.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    await ArtworkService.addArtwork(payload);
    alert('Karya seni berhasil ditambahkan ke katalog!');
    setIsAddingArt(false);
    onRefreshData && onRefreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner Panitia */}
      <div className="bg-[#121212] text-white border-3 border-black rounded-3xl p-6 sm:p-8 shadow-retro-xl relative overflow-hidden bg-retro-dots">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#FFE600] text-black px-3 py-1 rounded-lg text-xs font-black uppercase">
            <ShieldCheck className="w-4 h-4 text-black" /> PORTAL RESMI PANITIA DIVISI SENI RUPA
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
            Dashboard Kontrol & Rekap Presensi
          </h1>
          <p className="text-neutral-300 text-xs sm:text-base font-medium">
            Monitor log IP presensi pengunjung, kelola katalog karya pameran, dan atur status timeline rundown secara real-time.
          </p>
        </div>
      </div>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card-retro p-5 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#FF3388]" /> Total Pengunjung
          </span>
          <div className="font-display font-black text-3xl text-black">{metrics.total}</div>
          <span className="text-[10px] text-neutral-400 font-semibold">Tercatat di sistem</span>
        </div>

        <div className="card-retro p-5 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE600]" /> Mahasiswa Baru (Maba)
          </span>
          <div className="font-display font-black text-3xl text-[#FF3388]">{metrics.maba}</div>
          <span className="text-[10px] text-neutral-400 font-semibold">Target utama pameran</span>
        </div>

        <div className="card-retro p-5 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#00F0FF]" /> IP Address Unik
          </span>
          <div className="font-display font-black text-3xl text-[#00F0FF]">{metrics.uniqueIps}</div>
          <span className="text-[10px] text-neutral-400 font-semibold">Validitas jaringan</span>
        </div>

        <div className="card-retro p-5 bg-white space-y-1">
          <span className="text-[11px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#7B2CBF]" /> Total Karya
          </span>
          <div className="font-display font-black text-3xl text-[#7B2CBF]">{artworks.length}</div>
          <span className="text-[10px] text-neutral-400 font-semibold">Di Student Centre Lt 3</span>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex items-center gap-2 border-b-3 border-black pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all ${
            activeTab === 'attendance'
              ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Log Presensi & IP Pengunjung ({attendances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all ${
            activeTab === 'artworks'
              ? 'bg-[#FF3388] text-white border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Kelola Karya Seni ({artworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rundown')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all ${
            activeTab === 'rundown'
              ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm -translate-y-0.5'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Kontrol Sesi Rundown</span>
        </button>
      </div>

      {/* ================= TAB 1: ATTENDANCE & IP LOG TABLE ================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          
          {/* Action Bar: Search, Category Filter, Export */}
          <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 shadow-retro flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Nama, NIM, atau IP..."
                  className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                />
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold text-black focus:outline-none"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Mahasiswa Baru">Mahasiswa Baru</option>
                <option value="Mahasiswa Polibatam">Mahasiswa Polibatam</option>
                <option value="Dosen/Staff">Dosen/Staff</option>
                <option value="Tamu Umum">Tamu Umum</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="btn-retro-yellow text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <FileSpreadsheet className="w-4 h-4 text-black" />
              <span>Ekspor Rekap (CSV / Excel)</span>
            </button>

          </div>

          {/* Table Responsive Container */}
          <div className="card-retro overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#121212] text-white border-b-3 border-black font-display font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">No</th>
                    <th className="py-3.5 px-4">Nama Lengkap</th>
                    <th className="py-3.5 px-4">NIM / Identitas</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Program Studi</th>
                    <th className="py-3.5 px-4 bg-neutral-900 text-[#00F0FF]">IP Address</th>
                    <th className="py-3.5 px-4">Perangkat & OS</th>
                    <th className="py-3.5 px-4">Waktu Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-neutral-200 font-medium">
                  {filteredAttendances.length > 0 ? (
                    filteredAttendances.map((att, idx) => (
                      <tr key={att.id || idx} className="hover:bg-[#FFE600]/10 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-neutral-400">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <strong className="font-display font-bold text-sm text-black block">{att.nama_lengkap}</strong>
                          {att.catatan && <span className="text-[10px] text-neutral-500 italic">"{att.catatan}"</span>}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-black">{att.identifier || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${
                            att.kategori === 'Mahasiswa Baru' 
                              ? 'bg-[#FF3388]/20 text-[#FF3388] border-[#FF3388]'
                              : 'bg-[#FFE600]/30 text-black border-black'
                          }`}>
                            {att.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-700">{att.jurusan_prodi || 'Polibatam'}</td>
                        <td className="py-3 px-4 font-mono font-bold bg-[#00F0FF]/15 text-black">
                          {att.ip_address}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                            {att.device_type || 'Desktop'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                          {att.waktu_kehadiran || 'Hari ini'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-12 text-center text-neutral-500">
                        Tidak ada data presensi yang sesuai kriteria pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: ARTWORK MANAGEMENT ================= */}
      {activeTab === 'artworks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-2xl text-black">
              Daftar Karya Seni Pameran
            </h3>
            <button
              onClick={() => setIsAddingArt(!isAddingArt)}
              className="btn-retro-pink text-xs sm:text-sm px-4 py-2.5 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingArt ? 'Tutup Form' : 'Tambah Karya Baru'}</span>
            </button>
          </div>

          {/* New Artwork Form */}
          {isAddingArt && (
            <div className="card-retro p-6 sm:p-8 bg-white space-y-6 animate-in slide-in-from-top-2">
              <h4 className="font-display font-black text-xl text-black border-b-2 border-neutral-200 pb-2">
                Input Data Karya Seni Baru
              </h4>

              <form onSubmit={handleAddArtwork} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-xs">Judul Karya *</label>
                  <input
                    type="text"
                    value={newArtwork.title}
                    onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                    required
                    placeholder="Contoh: Metamorfosis Warna Polibatam"
                    className="input-retro text-xs py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-xs">Nama Seniman / Anggota *</label>
                  <input
                    type="text"
                    value={newArtwork.artist}
                    onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                    required
                    placeholder="Contoh: Muhammad Rangga"
                    className="input-retro text-xs py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-xs">Kategori Karya</label>
                  <select
                    value={newArtwork.category}
                    onChange={(e) => setNewArtwork({ ...newArtwork, category: e.target.value })}
                    className="input-retro text-xs py-2 bg-white"
                  >
                    <option value="Lukis">Lukis</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Sketsa & Ilustrasi">Sketsa & Ilustrasi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-xs">Medium & Bahan</label>
                  <input
                    type="text"
                    value={newArtwork.medium}
                    onChange={(e) => setNewArtwork({ ...newArtwork, medium: e.target.value })}
                    placeholder="Contoh: Acrylic & Resin on Canvas"
                    className="input-retro text-xs py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-xs">Lokasi Booth (Lt. 3)</label>
                  <select
                    value={newArtwork.boothId}
                    onChange={(e) => setNewArtwork({ ...newArtwork, boothId: e.target.value })}
                    className="input-retro text-xs py-2 bg-white"
                  >
                    {BOOTH_ZONES.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-xs">URL Foto Karya (Supabase Storage / Image URL) *</label>
                  <input
                    type="url"
                    value={newArtwork.imageUrl}
                    onChange={(e) => setNewArtwork({ ...newArtwork, imageUrl: e.target.value })}
                    required
                    className="input-retro text-xs py-2 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block font-bold text-xs">Makna & Filosofi Karya *</label>
                  <textarea
                    rows="3"
                    value={newArtwork.description}
                    onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                    required
                    placeholder="Jelaskan pesan dan cerita di balik pembuatan karya seni ini..."
                    className="input-retro text-xs py-2 resize-none"
                  ></textarea>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button type="submit" className="btn-retro-yellow w-full py-3 text-sm">
                    Simpan Karya ke Katalog ✨
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Artwork Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art) => (
              <div key={art.id} className="card-retro p-4 bg-white flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-36 object-cover rounded-xl border-2 border-black"
                  />
                  <div>
                    <span className="bg-[#FFE600] text-black text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase">
                      {art.category}
                    </span>
                    <h4 className="font-display font-black text-base text-black mt-1 line-clamp-1">
                      {art.title}
                    </h4>
                    <p className="text-xs text-neutral-600">Oleh: <strong>{art.artist}</strong></p>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="text-[#7B2CBF] font-bold">{art.boothName?.split('-')[0]}</span>
                  <span className="text-neutral-500">❤️ {art.likesCount} Likes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: RUNDOWN CONTROLLER ================= */}
      {activeTab === 'rundown' && (
        <div className="space-y-6">
          <div className="border-b-2 border-neutral-200 pb-3">
            <h3 className="font-display font-black text-2xl text-black">
              Kontroler Status Live Sesi Acara
            </h3>
            <p className="text-xs text-neutral-500">
              Ubah status sesi kegiatan agar status <strong>"🔴 LIVE NOW"</strong> pada homepage dan rundown page terupdate secara real-time untuk pengunjung.
            </p>
          </div>

          <div className="space-y-4">
            {rundowns.map((item) => (
              <div
                key={item.id}
                className="card-retro p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                      {item.time} WIB
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">{item.location}</span>
                  </div>
                  <h4 className="font-display font-black text-lg text-black">{item.title}</h4>
                  <p className="text-xs text-neutral-600">{item.speaker}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateRundownStatus(item.id, 'ongoing')}
                    className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs transition-all ${
                      item.status === 'ongoing'
                        ? 'bg-[#FF3388] text-white border-black shadow-retro-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    🔴 Set Live Now
                  </button>
                  <button
                    onClick={() => onUpdateRundownStatus(item.id, 'completed')}
                    className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs transition-all ${
                      item.status === 'completed'
                        ? 'bg-[#22C55E] text-white border-black shadow-retro-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    ✅ Selesai
                  </button>
                  <button
                    onClick={() => onUpdateRundownStatus(item.id, 'upcoming')}
                    className={`px-3 py-1.5 rounded-xl border-2 font-display font-bold text-xs transition-all ${
                      item.status === 'upcoming'
                        ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    ⏳ Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
