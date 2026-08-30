import React, { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Gift, 
  Layers, 
  Clock, 
  Sparkles, 
  MapPin, 
  User,
  Mail,
  Phone,
  UserCheck, 
  Users, 
  Package, 
  CheckSquare, 
  Square, 
  LogOut, 
  ArrowRight, 
  ShieldCheck, 
  Smartphone, 
  Info, 
  SlidersHorizontal, 
  RefreshCw, 
  Bell, 
  Radio, 
  Star, 
  Ticket, 
  Circle,
  Palette,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  Save,
  X,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  FileText,
  Compass,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Upload,
  ExternalLink,
  MessageSquare,
  XCircle
} from 'lucide-react';
import { PanitiaService, RundownService, ArtworkService, OrderService } from '../../services/api';
import { BOOTH_ZONES } from '../../data/mockData';
import { resolveBoothId, resolveBoothName } from '../../services/db/artworkDb';
import CameraQrScanner from '../../components/panitia/CameraQrScanner';
import ImageUploadField from '../../components/common/ImageUploadField';

const INITIAL_ARTWORK_FORM = {
  title: '',
  artist: '',
  artistNim: '',
  artistBatch: '2024 (Maba)',
  isAnonymous: false,
  category: 'Lukis',
  medium: 'Acrylic on Canvas',
  dimensions: '100 x 80 cm',
  price: 150000,
  isForSale: true,
  year: '2024',
  imageUrl: '',
  imageFile: null,
  description: '',
  boothId: 'booth-a',
  boothName: 'Zona A - Galeri Karya Lukis',
  isHighlighted: false,
  tags: 'Retro Pop, History'
};

export default function PanitiaDashboard({ 
  currentUser, 
  onLogout, 
  rundowns, 
  artworks = [], 
  onRefreshData, 
  onUpdateRundownStatus 
}) {
  const containerRef = useRef(null);
  const tabContentRef = useRef(null);

  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks' | 'transactions' | 'scanner' | 'participants' | 'monitoring'

  // ================= TRANSACTIONS & MANUAL QRIS VERIFICATION STATE =================
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({});
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Semua');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [previewProofUrl, setPreviewProofUrl] = useState(null);
  const [checkingOrder, setCheckingOrder] = useState(null);
  const [adminCheckNotes, setAdminCheckNotes] = useState('');
  const [qrisSettings, setQrisSettings] = useState({
    merchant_name: 'CHARMY LUCK ART OFFICIAL',
    qris_image_url: '/qris-dana.png',
    dana_number: 'NMID: ID1025452455724',
  });
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [isSavingQris, setIsSavingQris] = useState(false);

  // ================= SCANNER STATE =================
  const [scanQuery, setScanQuery] = useState('');
  const [scannedTicket, setScannedTicket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null);

  // ================= PARTICIPANT NEEDS STATE =================
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantCatFilter, setParticipantCatFilter] = useState('Semua');
  const [participants, setParticipants] = useState(() => PanitiaService.getParticipantNeeds());

  // ================= TASKS & MONITORING STATE =================
  const [tasks, setTasks] = useState(() => PanitiaService.getPanitiaTasks());
  const [announcements, setAnnouncements] = useState(() => PanitiaService.getAnnouncements());

  // ================= ARTWORKS CRUD STATE =================
  const [artworksList, setArtworksList] = useState(artworks);
  const [artSearchQuery, setArtSearchQuery] = useState('');
  const [artCategoryFilter, setArtCategoryFilter] = useState('Semua');
  const [artBoothFilter, setArtBoothFilter] = useState('Semua');
  
  // Modal & Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtId, setEditingArtId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_ARTWORK_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmArt, setDeleteConfirmArt] = useState(null);
  const [previewArt, setPreviewArt] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync with prop artworks
  useEffect(() => {
    if (artworks && artworks.length > 0) {
      setArtworksList(artworks);
    }
  }, [artworks]);

  // Load live artworks on mount
  useEffect(() => {
    loadLatestArtworks();
  }, []);

  const loadLatestArtworks = async () => {
    try {
      const live = await ArtworkService.getAllArtworks();
      if (Array.isArray(live) && live.length > 0) {
        setArtworksList(live);
      }
    } catch (e) {
      console.warn('Failed to load live artworks in PanitiaDashboard:', e);
    }
  };

  // Load orders
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await OrderService.getOrders();
      setOrders(res.orders || []);
      setOrderStats(res.stats || {});
    } catch (err) {
      console.warn('Failed to load orders in PanitiaDashboard:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const loadQrisSettings = async () => {
    try {
      const data = await OrderService.getQrisSettings();
      if (data) setQrisSettings(data);
    } catch (err) {
      console.warn('Failed to load QRIS settings:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadOrders();
      loadQrisSettings();
    }
  }, [activeTab]);

  const handleVerifyOrder = async (orderId, notes = '') => {
    try {
      const notesToSave = notes || adminCheckNotes;
      const res = await OrderService.verifyOrder(orderId, currentUser?.nama || 'Panitia', notesToSave);
      showToast('success', res.message || 'Pembayaran berhasil diverifikasi & karya resmi TERJUAL!');
      setCheckingOrder(null);
      setAdminCheckNotes('');
      loadOrders();
      loadLatestArtworks();
    } catch (err) {
      showToast('error', err.message || 'Gagal memverifikasi pesanan.');
    }
  };

  const handleRejectOrder = async (orderId, explicitReason = null) => {
    let reason = explicitReason;
    if (reason === null) {
      reason = window.prompt('Masukkan alasan penolakan pesanan (opsional):', 'Bukti transfer tidak valid atau dana belum masuk.');
    }
    if (reason === null) return; // User cancelled prompt

    try {
      const res = await OrderService.rejectOrder(orderId, currentUser?.nama || 'Panitia', reason);
      showToast('success', res.message || 'Pesanan ditolak & karya kembali tersedia di katalog.');
      setCheckingOrder(null);
      loadOrders();
      loadLatestArtworks();
    } catch (err) {
      showToast('error', err.message || 'Gagal menolak pesanan.');
    }
  };

  const handleTogglePickup = async (orderId) => {
    try {
      const res = await OrderService.togglePickup(orderId, currentUser?.nama || 'Panitia Booth');
      showToast('success', res.message || 'Status serah terima berhasil diperbarui!');
      loadOrders();
    } catch (err) {
      showToast('error', err.message || 'Gagal memperbarui status serah terima.');
    }
  };

  const handleUploadQrisImage = async (file) => {
    if (!file) return;
    setIsSavingQris(true);
    try {
      const updated = await OrderService.saveQrisSettings(file);
      if (updated && updated.qris_image_url) {
        setQrisSettings(updated);
      }
      showToast('success', 'Gambar QRIS Pameran berhasil diperbarui!');
    } catch (err) {
      showToast('error', 'Gagal memperbarui gambar QRIS.');
    } finally {
      setIsSavingQris(false);
    }
  };

  // Toast auto dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
  };

  // Load participants data
  const refreshParticipantData = () => {
    setParticipants(PanitiaService.getParticipantNeeds());
    if (scannedTicket) {
      const updated = PanitiaService.verifyTicket(scannedTicket.id);
      setScannedTicket(updated);
    }
  };

  // GSAP Entrance animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.panitia-header-card',
        { y: -25, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(
        '.panitia-quick-stat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'back.out(1.4)', delay: 0.15 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const isFirstTabRender = useRef(true);
  useEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false;
      return;
    }
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab]);

  // ================= ARTWORK FORM HANDLERS =================
  const handleOpenAddForm = () => {
    setEditingArtId(null);
    setFormData({
      ...INITIAL_ARTWORK_FORM,
      artistBatch: '2024 (Maba)',
      category: 'Lukis',
      boothId: 'booth-a',
      boothName: 'Zona A - Galeri Karya Lukis',
      imageUrl: '',
      imageFile: null,
    });
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (art) => {
    setEditingArtId(art.id);
    const bId = resolveBoothId(art);
    setFormData({
      title: art.title || art.judul || '',
      artist: art.artist || art.seniman_nama || '',
      artistNim: art.artistNim || art.seniman_nim || '',
      artistBatch: art.artistBatch || art.seniman_angkatan || '2024 (Maba)',
      isAnonymous: Boolean(art.isAnonymous || art.is_anonymous),
      category: art.category || art.kategori || 'Lukis',
      medium: art.medium || art.medium_bahan || 'Acrylic on Canvas',
      dimensions: art.dimensions || art.dimensi || '100 x 80 cm',
      price: Number(art.price ?? art.harga ?? 150000),
      isForSale: art.isForSale !== undefined ? Boolean(art.isForSale) : (art.is_for_sale !== undefined ? Boolean(art.is_for_sale) : true),
      year: String(art.year || art.tahun_pembuatan || '2024'),
      imageUrl: art.imageUrl || art.foto_utama_url || '',
      imageFile: null,
      description: art.description || art.deskripsi_filosofi || '',
      boothId: bId,
      boothName: art.boothName || art.booth_name || resolveBoothName(bId),
      isHighlighted: Boolean(art.isHighlighted || art.is_highlighted),
      tags: Array.isArray(art.tags) ? art.tags.join(', ') : (typeof art.tags === 'string' ? art.tags : 'Retro Pop, History')
    });
    setIsFormOpen(true);
  };

  const handleCategoryChange = (newCat) => {
    let bId = 'booth-a';
    if (newCat === 'Kerajinan') bId = 'booth-b';
    if (newCat === 'Sketsa & Ilustrasi') bId = 'booth-c';
    
    setFormData(prev => ({
      ...prev,
      category: newCat,
      boothId: bId,
      boothName: resolveBoothName(bId)
    }));
  };

  const handleSubmitArtwork = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.artist.trim()) {
      showToast('error', 'Harap isi Judul dan Nama Seniman karya!');
      return;
    }

    if (!formData.imageUrl.trim() && !formData.imageFile) {
      showToast('error', 'Harap unggah file foto karya atau masukkan URL gambar!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : (formData.tags || ['Retro Pop', 'History']),
        boothId: resolveBoothId({ category: formData.category, boothId: formData.boothId }),
        boothName: resolveBoothName(formData.boothId)
      };

      if (editingArtId) {
        // UPDATE
        const updated = await ArtworkService.updateArtwork(editingArtId, payload);
        setArtworksList(prev => prev.map(a => String(a.id) === String(editingArtId) ? updated : a));
        showToast('success', `Karya "${payload.title}" berhasil diperbarui!`);
      } else {
        // CREATE
        const created = await ArtworkService.addArtwork(payload);
        setArtworksList(prev => [created, ...prev]);
        showToast('success', `Karya "${payload.title}" berhasil disimpan ke Supabase Storage & Katalog!`);
      }

      setIsFormOpen(false);
      setEditingArtId(null);
      onRefreshData && onRefreshData();
    } catch (err) {
      console.error('Submit artwork error:', err);
      showToast('error', `Gagal menyimpan karya: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteArtwork = async () => {
    if (!deleteConfirmArt) return;
    setIsSubmitting(true);
    try {
      await ArtworkService.deleteArtwork(deleteConfirmArt.id);
      setArtworksList(prev => prev.filter(a => String(a.id) !== String(deleteConfirmArt.id)));
      showToast('success', `Karya "${deleteConfirmArt.title}" dan filenya di Supabase Storage berhasil dihapus.`);
      setDeleteConfirmArt(null);
      onRefreshData && onRefreshData();
    } catch (err) {
      console.error('Delete artwork error:', err);
      showToast('error', `Gagal menghapus karya: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered Artworks
  const filteredArtworks = useMemo(() => {
    return artworksList.filter(art => {
      const matchCat = artCategoryFilter === 'Semua' || (art.category || art.kategori) === artCategoryFilter;
      const bId = resolveBoothId(art);
      const matchBooth = artBoothFilter === 'Semua' || bId === artBoothFilter;
      
      const q = artSearchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        (art.title || art.judul || '').toLowerCase().includes(q) ||
        (art.artist || art.seniman_nama || '').toLowerCase().includes(q) ||
        (art.artistNim || art.seniman_nim || '').toLowerCase().includes(q) ||
        (art.medium || art.medium_bahan || '').toLowerCase().includes(q) ||
        (art.description || art.deskripsi_filosofi || '').toLowerCase().includes(q)
      );

      return matchCat && matchBooth && matchSearch;
    });
  }, [artworksList, artCategoryFilter, artBoothFilter, artSearchQuery]);

  // Metrics
  const artworkMetrics = useMemo(() => {
    const total = artworksList.length;
    const lukis = artworksList.filter(a => resolveBoothId(a) === 'booth-a').length;
    const kerajinan = artworksList.filter(a => resolveBoothId(a) === 'booth-b').length;
    const sketsa = artworksList.filter(a => resolveBoothId(a) === 'booth-c').length;
    return { total, lukis, kerajinan, sketsa };
  }, [artworksList]);

  // Scanner handlers
  const handleVerifyTicket = (query) => {
    setScanFeedback(null);
    const result = PanitiaService.verifyTicket(query);
    if (result) {
      setScannedTicket(result);
      setScanFeedback({
        type: result.isCheckedIn ? 'info' : 'success',
        text: result.isCheckedIn ? 'Pengunjung sudah pernah check-in sebelumnya.' : 'Tiket VALID! Siap untuk check-in.'
      });
    } else {
      setScannedTicket(null);
      setScanFeedback({
        type: 'error',
        text: `Data tiket "${query}" tidak ditemukan di daftar registrasi.`
      });
    }
  };

  const handleToggleCheckIn = (ticketId) => {
    PanitiaService.toggleCheckIn(ticketId);
    refreshParticipantData();
  };

  const handleToggleSouvenir = (ticketId) => {
    PanitiaService.toggleSouvenir(ticketId);
    refreshParticipantData();
  };

  const handleToggleTask = (taskId) => {
    const updated = PanitiaService.toggleTask(taskId);
    setTasks(updated);
  };

  // Filtered Participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchCat = participantCatFilter === 'Semua' || p.kategori === participantCatFilter;
      const q = participantSearch.toLowerCase();
      const matchSearch =
        p.nama_lengkap?.toLowerCase().includes(q) ||
        p.identifier?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [participants, participantCatFilter, participantSearch]);

  const participantStats = useMemo(() => {
    const total = participants.length;
    const checkedIn = participants.filter(p => p.isCheckedIn).length;
    const souvenirClaimed = participants.filter(p => p.isSouvenirClaimed).length;
    return { total, checkedIn, souvenirClaimed };
  }, [participants]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* ================= TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`p-4 rounded-2xl border-3 border-black shadow-retro flex items-center gap-3 text-xs sm:text-sm font-bold ${
            toastMessage.type === 'success' ? 'bg-[#22C55E] text-white' : 'bg-[#FF3388] text-white'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= HEADER BAR ================= */}
      <div className="panitia-header-card bg-[#FFE600] border-3 border-black rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-retro flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden bg-retro-dots">
        <div className="space-y-1.5 relative z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="bg-[#FF3388] text-white text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 rounded-lg border-2 border-black uppercase shadow-retro-sm">
              PORTAL PANITIA LAPANGAN
            </span>
            <span className="bg-black text-[#00F0FF] font-mono text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded border border-black truncate">
              {currentUser?.divisi || 'Divisi Seni Rupa'}
            </span>
          </div>
          <h1 className="font-display font-black text-xl sm:text-4xl text-black leading-tight">
            Halo, {currentUser?.nama || 'Petugas Panitia'}! 
          </h1>
          <p className="text-xs sm:text-sm text-neutral-800 font-semibold flex items-center gap-1.5 sm:gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3388] shrink-0" />
            <span className="truncate">Penugasan: <strong>{currentUser?.assignedBooth || 'Student Centre Lt. 3'}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10 w-full md:w-auto">
          <button
            onClick={loadLatestArtworks}
            className="p-2.5 bg-white hover:bg-neutral-100 border-2 border-black rounded-xl text-black font-bold text-xs flex items-center gap-1.5 shadow-retro-sm transition-all active:scale-95"
            title="Sinkronkan Data"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Sinkron Data</span>
          </button>
        </div>
      </div>

      {/* ================= QUICK STATS BAR ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Total Karya Pameran</span>
            <div className="font-display font-black text-2xl text-black">{artworkMetrics.total} Karya</div>
          </div>
          <div className="w-10 h-10 bg-[#FFE600] border-2 border-black rounded-xl flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-black" />
          </div>
        </div>

        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Zona A (Lukisan)</span>
            <div className="font-display font-black text-2xl text-black">{artworkMetrics.lukis} Karya</div>
          </div>
          <div className="w-10 h-10 bg-[#FFE600] text-black border-2 border-black rounded-xl flex items-center justify-center shrink-0 font-display font-black text-sm">
            A
          </div>
        </div>

        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Zona B (Kriya 3D)</span>
            <div className="font-display font-black text-2xl text-[#FF3388]">{artworkMetrics.kerajinan} Karya</div>
          </div>
          <div className="w-10 h-10 bg-[#FF3388] text-white border-2 border-black rounded-xl flex items-center justify-center shrink-0 font-display font-black text-sm">
            B
          </div>
        </div>

        <div className="panitia-quick-stat card-retro p-4 bg-white flex items-center justify-between hover:-translate-y-0.5 transition-transform">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-neutral-500 uppercase">Zona C (Sketsa)</span>
            <div className="font-display font-black text-2xl text-[#00F0FF]">{artworkMetrics.sketsa} Karya</div>
          </div>
          <div className="w-10 h-10 bg-[#00F0FF] text-black border-2 border-black rounded-xl flex items-center justify-center shrink-0 font-display font-black text-sm">
            C
          </div>
        </div>
      </div>

      {/* ================= PANITIA NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 sm:gap-4 border-b-3 border-black p-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('artworks')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'artworks'
              ? 'bg-[#FFE600] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Palette className="w-4 h-4 text-black" />
          <span>Kelola & CRUD Karya ({artworksList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'bg-[#CCFF00] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-black" />
          <span>Penjualan & Transaksi ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-[#FF3388] text-white border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Scan QR Presensi</span>
        </button>

        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'participants'
              ? 'bg-[#00F0FF] text-black border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Kebutuhan Peserta ({participants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 sm:px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm border-2 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap ${
            activeTab === 'monitoring'
              ? 'bg-[#7B2CBF] text-white border-black shadow-retro-sm -translate-y-0.5 scale-105'
              : 'bg-white text-neutral-700 border-black/30 hover:bg-neutral-50'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Monitoring & Shift</span>
        </button>
      </div>

      {/* ================= TAB CONTENTS ================= */}
      <div ref={tabContentRef}>

        {/* ================= TAB 1: KELOLA & CRUD KARYA SENI ================= */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">
            
            {/* Action Bar: Search, Filters & Add Button */}
            <div className="card-retro p-4 sm:p-5 bg-white space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
                  
                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={artSearchQuery}
                      onChange={(e) => setArtSearchQuery(e.target.value)}
                      placeholder="Cari Judul, Seniman, NIM, Medium..."
                      className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                    />
                    {artSearchQuery && (
                      <button onClick={() => setArtSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <select
                    value={artCategoryFilter}
                    onChange={(e) => setArtCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Semua">Semua Kategori</option>
                    <option value="Lukis">Lukis</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Sketsa & Ilustrasi">Sketsa & Ilustrasi</option>
                  </select>

                  {/* Booth Filter */}
                  <select
                    value={artBoothFilter}
                    onChange={(e) => setArtBoothFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Semua">Semua Zona Booth</option>
                    <option value="booth-a">Zona A: Galeri Lukis</option>
                    <option value="booth-b">Zona B: Kriya Kerajinan</option>
                    <option value="booth-c">Zona C: Pojok Gambar</option>
                  </select>

                </div>

                {/* Tambah Karya Button */}
                <button
                  onClick={handleOpenAddForm}
                  className="btn-retro-pink text-xs sm:text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-full md:w-auto shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Karya Baru</span>
                </button>
              </div>
            </div>

            {/* Artworks Grid Card (Fixed Size & Scrollable) */}
            <div className="card-retro bg-white overflow-hidden flex flex-col">
              <div className="p-4 sm:p-5 border-b-2 border-black bg-[#FAF7EE] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-base sm:text-lg text-black">
                    Daftar Karya Seni Pameran
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500">
                    Menampilkan {filteredArtworks.length} dari {artworksList.length} total karya terdaftar di database.
                  </p>
                </div>
                <button
                  onClick={loadLatestArtworks}
                  className="p-1.5 bg-white hover:bg-neutral-100 border border-black rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[580px] sm:max-h-[640px] catalogue-scrollbar">
                {filteredArtworks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredArtworks.map((art) => {
                      const bId = resolveBoothId(art);
                      const isAnon = Boolean(art.isAnonymous || art.is_anonymous || /rahasia|dirahasiakan|anonim|anonymous|secret/i.test(art.artist || art.seniman_nama || ''));
                      
                      return (
                        <div 
                          key={art.id} 
                          className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 space-y-3 flex flex-col justify-between hover:border-[#FF3388] transition-all group"
                        >
                          <div className="space-y-2.5">
                            
                            {/* Artwork Image & Badges */}
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-black bg-neutral-900 flex items-center justify-center">
                              <img 
                                src={art.imageUrl || art.foto_utama_url} 
                                alt={art.title || art.judul} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80';
                                }}
                              />

                              {/* Category Badge */}
                              <span className="absolute top-2 left-2 bg-[#FFE600] text-black font-mono text-[10px] font-black px-2 py-0.5 rounded border border-black shadow-retro-sm">
                                {art.category || art.kategori}
                              </span>

                              {/* Booth Zone Badge */}
                              <span className={`absolute bottom-2 left-2 text-[10px] font-black px-2 py-0.5 rounded border border-black ${
                                bId === 'booth-b' ? 'bg-[#FF3388] text-white' : bId === 'booth-c' ? 'bg-[#00F0FF] text-black' : 'bg-black text-[#FFE600]'
                              }`}>
                                {bId === 'booth-b' ? 'ZONA B (KRIYA)' : bId === 'booth-c' ? 'ZONA C (SKETSA)' : 'ZONA A (LUKIS)'}
                              </span>

                              {/* Anonymous Badge */}
                              {isAnon && (
                                <span className="absolute top-2 right-2 bg-[#7B2CBF] text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-black flex items-center gap-1">
                                  <EyeOff className="w-3 h-3" /> Anonim
                                </span>
                              )}
                            </div>

                            {/* Title & Artist Info */}
                            <div>
                              <h4 className="font-display font-black text-sm text-black line-clamp-1 group-hover:text-[#FF3388] transition-colors">
                                {art.title || art.judul}
                              </h4>
                              <p className="text-xs text-neutral-600 font-semibold mt-0.5">
                                Oleh: <strong className="text-black">{isAnon ? 'Pencipta Dirahasiakan' : (art.artist || art.seniman_nama)}</strong>
                                {art.artistBatch && <span className="text-neutral-400 font-normal"> ({art.artistBatch || art.seniman_angkatan})</span>}
                              </p>
                            </div>

                            {/* Medium & Dimensions */}
                            <div className="text-[11px] text-neutral-500 font-medium space-y-0.5 bg-white p-2 rounded-xl border border-black/20">
                              <div className="truncate"><strong>Medium:</strong> {art.medium || art.medium_bahan || 'Mixed Media'}</div>
                              <div><strong>Ukuran:</strong> {art.dimensions || art.dimensi || 'Standar'} • <strong>Tahun:</strong> {art.year || art.tahun_pembuatan || '2024'}</div>
                            </div>

                          </div>

                          {/* Action Buttons: Preview, Edit, Delete */}
                          <div className="pt-2 border-t border-black/10 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => setPreviewArt(art)}
                              className="px-2.5 py-1.5 bg-white hover:bg-neutral-100 border border-black rounded-lg text-xs font-bold text-neutral-700 flex items-center gap-1 transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#00F0FF]" />
                              <span>Lihat</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditForm(art)}
                                className="px-3 py-1.5 bg-[#FFE600] hover:bg-[#FFE600]/80 border border-black rounded-lg text-xs font-bold text-black flex items-center gap-1 shadow-retro-sm active:scale-95 transition-all"
                                title="Edit Karya"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              
                              <button
                                onClick={() => setDeleteConfirmArt(art)}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 rounded-lg transition-colors"
                                title="Hapus Karya"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-14 h-14 bg-[#FAF7EE] border-2 border-black rounded-2xl mx-auto flex items-center justify-center shadow-retro-sm">
                      <Palette className="w-7 h-7 text-neutral-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-base text-black">Tidak Ada Karya Ditemukan</h4>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Karya dengan filter yang dipilih tidak ditemukan. Coba sesuaikan kata kunci pencarian atau tambah karya baru.
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddForm}
                      className="btn-retro-yellow text-xs px-4 py-2 inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Karya Baru</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 bg-[#FAF7EE] border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-neutral-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  Menampilkan {filteredArtworks.length} dari {artworksList.length} karya di sistem
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Scroll vertikal untuk melihat seluruh daftar karya ↓
                </span>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 1.5: TRANSAKSI & VERIFIKASI QRIS BUKTI TRANSFER ================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Revenue */}
              <div className="card-retro p-4 sm:p-5 bg-white space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                  <span>Total Omzet Terverifikasi</span>
                  <div className="p-1.5 bg-[#CCFF00] text-black border border-black rounded-lg">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-xl sm:text-2xl text-black">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(orderStats.total_sales_amount || 0)}
                </div>
                <div className="text-[11px] text-neutral-600 font-medium">
                  Dari {orderStats.total_sold_artworks || 0} karya lunas terverifikasi
                </div>
              </div>

              {/* Menunggu Review */}
              <div className="card-retro p-4 sm:p-5 bg-white space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                  <span>Menunggu Verifikasi</span>
                  <div className="p-1.5 bg-[#FFE600] text-black border border-black rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-xl sm:text-2xl text-black">
                  {orderStats.pending_orders || 0} Pesanan
                </div>
                <div className="text-[11px] text-neutral-600 font-medium">
                  Ada bukti transfer baru perlu dicek
                </div>
              </div>

              {/* Total Artworks Sold */}
              <div className="card-retro p-4 sm:p-5 bg-white space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                  <span>Karya Terjual (1-of-1)</span>
                  <div className="p-1.5 bg-[#FF3388] text-white border border-black rounded-lg">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-xl sm:text-2xl text-black">
                  {orderStats.total_sold_artworks || 0} Karya
                </div>
                <div className="text-[11px] text-neutral-600 font-medium">
                  Karya resmi menjadi milik kolektor
                </div>
              </div>

              {/* Physical Artwork Picked Up */}
              <div className="card-retro p-4 sm:p-5 bg-white space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-xs font-bold uppercase">
                  <span>Serah Terima Fisik</span>
                  <div className="p-1.5 bg-[#00F0FF] text-black border border-black rounded-lg">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display font-black text-xl sm:text-2xl text-black">
                  {orderStats.picked_up_count || 0} / {orderStats.total_sold_artworks || 0}
                </div>
                <div className="text-[11px] text-neutral-600 font-medium">
                  Karya fisik diambil di booth pameran
                </div>
              </div>

            </div>

            {/* QRIS Settings Banner for Panitia */}
            <div className="card-retro p-4 sm:p-5 bg-gradient-to-r from-[#FFE600]/30 to-[#00F0FF]/20 border-3 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white border-2 border-black rounded-xl p-1 shadow-retro-xs shrink-0 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-black text-sm text-black">QRIS Pembayaran Pameran Aktif</h4>
                    <span className="bg-[#22C55E] text-white text-[9px] font-black px-2 py-0.5 rounded border border-black uppercase">Aktif</span>
                  </div>
                  <p className="text-xs text-neutral-700 font-medium mt-0.5">
                    Merchant: <strong>{qrisSettings.merchant_name}</strong> • Pengunjung scan QRIS ini saat memesan karya.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrisModalOpen(true)}
                className="btn-retro-yellow text-xs px-4 py-2 flex items-center gap-1.5 shrink-0 shadow-retro-xs active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Lihat / Ganti Gambar QRIS</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="card-retro p-4 sm:p-5 bg-white space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1">
                  
                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Cari ID Pesanan, Nama Pembeli, Karya..."
                      className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                    />
                    {orderSearch && (
                      <button onClick={() => setOrderSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="Semua">Semua Status Pesanan</option>
                    <option value="pending_review">🟡 Menunggu Verifikasi Bukti Transfer</option>
                    <option value="settlement">🟢 Lunas Terverifikasi (Karya Terjual)</option>
                    <option value="not_picked_up">📦 Lunas, Belum Diambil di Booth</option>
                    <option value="picked_up">✅ Lunas & Sudah Diserahkan</option>
                    <option value="rejected">🔴 Pesanan Ditolak</option>
                  </select>

                </div>

                {/* Refresh Orders Button */}
                <button
                  onClick={loadOrders}
                  disabled={isLoadingOrders}
                  className="btn-retro-yellow text-xs sm:text-sm px-4 py-2 flex items-center justify-center gap-2 w-full md:w-auto shrink-0 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  <span>Refresh Pesanan</span>
                </button>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="card-retro bg-white overflow-hidden">
              <div className="p-4 sm:p-5 border-b-2 border-black flex items-center justify-between bg-[#FAF7EE]">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-black" />
                  <h3 className="font-display font-black text-base sm:text-lg text-black">
                    Kelola Pesanan & Verifikasi Bukti Transfer Masuk
                  </h3>
                </div>
                <span className="text-xs font-bold font-mono bg-black text-[#FFE600] px-2.5 py-1 rounded-lg">
                  {orders.length} Total Pesanan
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-16 px-4 text-center space-y-3">
                  <div className="w-16 h-16 bg-[#FFE600] border-2 border-black rounded-2xl mx-auto flex items-center justify-center shadow-retro-sm">
                    <ShoppingBag className="w-8 h-8 text-black" />
                  </div>
                  <h4 className="font-display font-black text-lg text-black">Belum Ada Pesanan Masuk</h4>
                  <p className="text-xs text-neutral-600 max-w-md mx-auto">
                    Saat pengunjung memesan karya dan mengunggah screenshot bukti transfer, data pembeli dan bukti struk akan otomatis muncul di sini untuk Anda verifikasi.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-100 border-b-2 border-black text-neutral-700 font-bold uppercase tracking-wider text-[10px]">
                        <th className="p-3.5">ID Pesanan & Waktu</th>
                        <th className="p-3.5">Karya Seni & Nominal</th>
                        <th className="p-3.5">Data Pembeli / Kolektor</th>
                        <th className="p-3.5 text-center">Bukti Transfer</th>
                        <th className="p-3.5 text-center">Status & Aksi Verifikasi</th>
                        <th className="p-3.5 text-center">Serah Terima Fisik (Booth)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {orders
                        .filter((ord) => {
                          const q = orderSearch.toLowerCase();
                          const matchSearch =
                            !orderSearch ||
                            ord.id?.toLowerCase().includes(q) ||
                            ord.artwork_title?.toLowerCase().includes(q) ||
                            ord.artwork?.judul?.toLowerCase().includes(q) ||
                            ord.buyer_name?.toLowerCase().includes(q) ||
                            ord.buyer_email?.toLowerCase().includes(q) ||
                            ord.buyer_phone?.toLowerCase().includes(q);

                          const status = (ord.transaction_status || 'pending_review').toLowerCase();
                          let matchStatus = true;
                          if (orderStatusFilter === 'settlement') matchStatus = ['settlement', 'verified', 'success'].includes(status);
                          else if (orderStatusFilter === 'pending_review') matchStatus = ['pending_review', 'pending'].includes(status);
                          else if (orderStatusFilter === 'rejected') matchStatus = ['rejected', 'cancel', 'expire'].includes(status);
                          else if (orderStatusFilter === 'picked_up') matchStatus = Boolean(ord.is_picked_up);
                          else if (orderStatusFilter === 'not_picked_up') matchStatus = !ord.is_picked_up && ['settlement', 'verified', 'success'].includes(status);

                          return matchSearch && matchStatus;
                        })
                        .map((order) => {
                          const status = (order.transaction_status || 'pending_review').toLowerCase();
                          const isSettled = ['settlement', 'verified', 'success'].includes(status);
                          const isPendingReview = ['pending_review', 'pending'].includes(status);
                          const isRejected = ['rejected', 'cancel', 'expire'].includes(status);

                          const grossFormatted = new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0,
                          }).format(order.gross_amount || 0);

                          const artworkTitle = order.artwork?.judul || order.artwork_title || 'Karya Seni Unik';

                          return (
                            <tr key={order.id} className="hover:bg-[#FAF7EE] transition-colors">
                              
                              {/* Order ID & Date */}
                              <td className="p-3.5 align-top">
                                <div className="font-mono font-bold text-black text-[11px]">
                                  {order.id}
                                </div>
                                <div className="text-[10px] text-neutral-500 font-medium mt-0.5">
                                  {order.created_at ? new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-'}
                                </div>
                              </td>

                              {/* Artwork details & Price */}
                              <td className="p-3.5 align-top">
                                <div className="font-display font-black text-black text-xs sm:text-sm">
                                  {artworkTitle}
                                </div>
                                <div className="font-display font-black text-[#FF3388] text-xs mt-0.5">
                                  {grossFormatted}
                                </div>
                                <div className="text-[10px] text-neutral-500 font-medium">
                                  Metode: <span className="font-bold text-neutral-700">{order.payment_type || 'QRIS DANA'}</span>
                                </div>
                              </td>

                              {/* Buyer info */}
                              <td className="p-3.5 align-top space-y-0.5">
                                <div className="font-bold text-black flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <span className="truncate max-w-[160px]">{order.buyer_name || '-'}</span>
                                </div>
                                <div className="text-[11px] text-neutral-600 flex items-center gap-1.5">
                                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  <a href={`mailto:${order.buyer_email}`} className="hover:underline hover:text-[#FF3388] truncate max-w-[160px]">
                                    {order.buyer_email || '-'}
                                  </a>
                                </div>
                                <div className="text-[11px] text-neutral-600 flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                                  {order.buyer_phone ? (
                                    <a
                                      href={`https://wa.me/${order.buyer_phone.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-green-700 font-bold hover:underline"
                                    >
                                      {order.buyer_phone} (WA)
                                    </a>
                                  ) : '-'}
                                </div>
                                {order.pickup_notes && (
                                  <div className="text-[10px] text-neutral-500 italic pt-0.5">
                                    Catatan: "{order.pickup_notes}"
                                  </div>
                                )}
                              </td>

                              {/* Bukti Transfer (Thumbnail click to open Lightbox) */}
                              <td className="p-3.5 align-top text-center">
                                {order.payment_proof_url ? (
                                  <div className="inline-flex flex-col items-center">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewProofUrl(order.payment_proof_url)}
                                      className="relative group border-2 border-black rounded-xl overflow-hidden w-14 h-14 bg-neutral-100 shadow-retro-xs cursor-pointer hover:scale-105 transition-transform"
                                      title="Ketuk untuk melihat foto bukti transfer penuh"
                                    >
                                      <img 
                                        src={order.payment_proof_url} 
                                        alt="Bukti Transfer"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Eye className="w-4 h-4" />
                                      </div>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setPreviewProofUrl(order.payment_proof_url)}
                                      className="text-[10px] text-blue-700 font-bold hover:underline mt-1 block"
                                    >
                                      Lihat Struk
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-neutral-400 italic">
                                    Tidak ada lampiran
                                  </span>
                                )}
                              </td>

                              {/* Status & Aksi Verifikasi Panitia */}
                              <td className="p-3.5 align-top text-center">
                                {isPendingReview ? (
                                  <div className="space-y-1.5 text-center">
                                    <span className="inline-flex items-center gap-1 bg-[#FFE600] text-black text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-black shadow-retro-xs uppercase">
                                      <Clock className="w-3.5 h-3.5" /> Perlu Verifikasi
                                    </span>
                                    <div className="pt-0.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setCheckingOrder(order);
                                          setAdminCheckNotes(order.admin_notes || '');
                                        }}
                                        className="btn-retro-yellow text-xs px-3 py-1.5 font-display font-black flex items-center justify-center gap-1.5 shadow-retro-xs active:scale-95 transition-all cursor-pointer mx-auto"
                                        title="Buka Layar Pengecekan Lengkap"
                                      >
                                        <Search className="w-3.5 h-3.5 text-black" />
                                        <span>Cek Pesanan</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : isSettled ? (
                                  <div className="space-y-1 text-center">
                                    <span className="inline-flex items-center gap-1 bg-[#22C55E] text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-black shadow-retro-xs uppercase">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Lunas Terverifikasi
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCheckingOrder(order);
                                        setAdminCheckNotes(order.admin_notes || '');
                                      }}
                                      className="text-[10px] text-blue-700 font-bold hover:underline block mx-auto cursor-pointer pt-0.5"
                                    >
                                      Lihat Detail & Bukti
                                    </button>
                                    <div className="text-[9px] text-neutral-500 font-mono">
                                      Oleh: {order.verified_by_admin || 'Panitia'}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1 text-center">
                                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-red-300 uppercase">
                                      <AlertTriangle className="w-3.5 h-3.5" /> Ditolak
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCheckingOrder(order);
                                        setAdminCheckNotes(order.admin_notes || '');
                                      }}
                                      className="text-[10px] text-red-700 font-bold hover:underline block mx-auto cursor-pointer pt-0.5"
                                    >
                                      Lihat Rincian
                                    </button>
                                    {order.rejection_reason && (
                                      <div className="text-[9px] text-red-600 italic">
                                        "{order.rejection_reason}"
                                      </div>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Pickup verification */}
                              <td className="p-3.5 align-top text-center">
                                {isSettled ? (
                                  order.is_picked_up ? (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 bg-[#00F0FF] text-black text-[10px] font-black px-2.5 py-1 rounded-lg border border-black shadow-retro-xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-black" /> Sudah Diserahkan
                                      </span>
                                      <div className="text-[9px] text-neutral-500 font-mono">
                                        PIC: {order.picked_up_by_admin || 'Panitia'}
                                      </div>
                                      <button
                                        onClick={() => handleTogglePickup(order.id)}
                                        className="text-[10px] text-neutral-500 underline hover:text-red-600 block mx-auto cursor-pointer"
                                      >
                                        Batal Serah Terima
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleTogglePickup(order.id)}
                                      className="btn-retro-yellow text-[11px] font-display font-black px-3 py-1.5 shadow-retro-xs active:scale-95 cursor-pointer"
                                    >
                                      📦 Serahkan Karya Fisik
                                    </button>
                                  )
                                ) : (
                                  <span className="text-[10px] text-neutral-400 italic">
                                    Verifikasi Lunas Dulu
                                  </span>
                                )}
                              </td>

                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ================= MODAL CEK PESANAN, DATA PEMBELI, BUKTI & KETERSEDIAAN KARYA ================= */}
        {checkingOrder && (
          <div 
            onClick={() => setCheckingOrder(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in overflow-y-auto"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF7EE] border-3 border-black rounded-3xl p-5 sm:p-6 max-w-3xl w-full max-h-[92vh] flex flex-col space-y-4 shadow-retro-xl overflow-y-auto my-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b-3 border-black pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#FFE600] border-2 border-black rounded-xl shadow-retro-xs">
                    <Search className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-base sm:text-lg text-black flex items-center gap-2">
                      <span>Pemeriksaan & Validasi Pesanan</span>
                      <span className="text-xs bg-[#FF3388] text-white px-2 py-0.5 rounded-md border border-black font-mono">
                        {checkingOrder.id}
                      </span>
                    </h3>
                    <p className="text-[11px] text-neutral-600 font-medium">
                      Periksa kecocokan data diri pembeli, ketersediaan karya fisik, dan validitas struk transfer.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCheckingOrder(null)}
                  className="p-1.5 bg-white hover:bg-[#FF3388] hover:text-white border-2 border-black rounded-xl shadow-retro-xs transition-colors cursor-pointer text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Kolom Kiri: Data Diri Pembeli & Ketersediaan Karya */}
                <div className="md:col-span-6 space-y-3.5">
                  
                  {/* Card 1: Data Diri Pembeli */}
                  <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-2.5 shadow-retro-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="text-xs font-display font-black text-black flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#FF3388]" /> 1. Data Diri Pembeli
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {checkingOrder.created_at ? new Date(checkingOrder.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Hari Ini'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start justify-between">
                        <span className="text-neutral-500 text-[11px]">Nama Lengkap:</span>
                        <span className="font-bold text-black text-right">{checkingOrder.buyer_name}</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <span className="text-neutral-500 text-[11px]">Alamat Email:</span>
                        <span className="font-mono text-[11px] text-neutral-800 text-right">{checkingOrder.buyer_email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 text-[11px]">No. WhatsApp:</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-black">{checkingOrder.buyer_phone}</span>
                          {checkingOrder.buyer_phone && (
                            <a
                              href={`https://wa.me/${checkingOrder.buyer_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo Kak ${checkingOrder.buyer_name}, kami dari Panitia Pameran Seni Rupa Polibatam mengenai pesanan karya "${checkingOrder.artwork_title}" (ID: ${checkingOrder.id})...`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-1.5 py-0.5 bg-[#22C55E] hover:bg-green-600 text-white rounded border border-black text-[9px] font-black flex items-center gap-1 shadow-retro-xs"
                              title="Hubungi Pembeli via WhatsApp"
                            >
                              <MessageSquare className="w-2.5 h-2.5" /> WA
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="pt-1 border-t border-dashed border-neutral-200">
                        <span className="text-neutral-500 text-[10px] block">Opsi Serah Terima / Catatan Booth:</span>
                        <span className="font-medium text-black text-[11px] bg-neutral-100 px-2 py-1 rounded block mt-0.5">
                          {checkingOrder.pickup_notes || 'Ambil di Booth Pameran Lt. 3'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Ketersediaan Karya Seni */}
                  {(() => {
                    const art = artworksList.find((a) => a.id === checkingOrder.artwork_id);
                    const isCurrentlySold = art?.saleStatus === 'sold' && checkingOrder.transaction_status !== 'settlement';
                    return (
                      <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-2.5 shadow-retro-xs">
                        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                          <span className="text-xs font-display font-black text-black flex items-center gap-1.5">
                            <ShoppingBag className="w-4 h-4 text-[#00F0FF]" /> 2. Ketersediaan & Info Karya
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border border-black uppercase ${isCurrentlySold ? 'bg-red-200 text-red-900' : 'bg-[#CCFF00] text-black'}`}>
                            {isCurrentlySold ? '⚠️ Sudah Terjual' : '🟢 1-of-1 Tersedia'}
                          </span>
                        </div>

                        <div className="flex gap-3 items-center">
                          {art?.imageUrl || checkingOrder.artwork?.imageUrl ? (
                            <img 
                              src={art?.imageUrl || checkingOrder.artwork?.imageUrl} 
                              alt={checkingOrder.artwork_title}
                              className="w-14 h-14 object-cover rounded-xl border-2 border-black shadow-retro-xs shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-neutral-200 border-2 border-black rounded-xl flex items-center justify-center shrink-0">
                              <ImageIcon className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <h5 className="font-display font-black text-xs sm:text-sm text-black truncate">
                              {checkingOrder.artwork_title}
                            </h5>
                            <div className="text-[10px] text-neutral-600 truncate">
                              Seniman: <strong className="text-black">{art?.artist || 'Divisi Seni Rupa'}</strong>
                            </div>
                            <div className="text-[10px] text-neutral-500 truncate">
                              Lokasi: <span className="font-semibold text-black">{art?.boothName || 'Zona Pameran Lt. 3'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#FAF7EE] border border-black rounded-xl p-2.5 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-neutral-700">Nominal Pas Tagihan:</span>
                          <span className="font-display font-black text-sm sm:text-base text-[#FF3388]">
                            Rp {(checkingOrder.gross_amount || 150000).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Kolom Kanan: Bukti Transfer & Catatan Verifikasi */}
                <div className="md:col-span-6 space-y-3.5">
                  
                  {/* Card 3: Foto Bukti Transfer Struk */}
                  <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-2.5 shadow-retro-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                      <span className="text-xs font-display font-black text-black flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#FFE600]" /> 3. Bukti Struk Pembayaran
                      </span>
                      <span className="text-[10px] text-neutral-500 font-bold">
                        {checkingOrder.payment_type || 'QRIS DANA'}
                      </span>
                    </div>

                    {checkingOrder.payment_proof_url ? (
                      <div className="space-y-2">
                        <div 
                          onClick={() => setPreviewProofUrl(checkingOrder.payment_proof_url)}
                          className="relative group w-full h-44 bg-neutral-900 border-2 border-black rounded-xl overflow-hidden flex items-center justify-center cursor-zoom-in"
                          title="Klik untuk perbesar HD"
                        >
                          <img 
                            src={checkingOrder.payment_proof_url} 
                            alt="Bukti Transfer Pembeli"
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white text-black font-display font-black text-[10px] px-2.5 py-1 rounded-lg border border-black shadow-retro-xs flex items-center gap-1">
                              <Maximize2 className="w-3.5 h-3.5 text-[#FF3388]" /> Perbesar HD
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-neutral-500">
                          <span>Pastikan tanggal transfer dan mutasi DANA sesuai.</span>
                          <button
                            type="button"
                            onClick={() => setPreviewProofUrl(checkingOrder.payment_proof_url)}
                            className="text-blue-700 font-bold hover:underline cursor-pointer"
                          >
                            Buka Ukuran Asli
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-400 space-y-1">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs italic">Tidak ada lampiran bukti transfer</span>
                      </div>
                    )}
                  </div>

                  {/* Card 4: Catatan Panitia & Checklist */}
                  <div className="bg-white border-2 border-black rounded-2xl p-4 space-y-2 shadow-retro-xs">
                    <label className="block text-xs font-display font-black text-black">
                      4. Catatan Verifikasi Panitia (Opsional):
                    </label>
                    <textarea
                      rows={2}
                      value={adminCheckNotes}
                      onChange={(e) => setAdminCheckNotes(e.target.value)}
                      placeholder="Contoh: Mutasi DANA Rp 150.000 atas nama pengirim sudah masuk jam 15:20 WIB."
                      className="w-full text-xs p-2.5 bg-[#FAF7EE] border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                    />
                  </div>

                </div>

              </div>

              {/* Modal Actions Footer */}
              <div className="pt-2 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-2.5">
                
                {/* Status Info */}
                <div className="text-xs">
                  {checkingOrder.transaction_status === 'pending_review' ? (
                    <span className="text-neutral-600 font-medium">
                      Status: <strong className="text-[#FF3388]">Menunggu Konfirmasi Panitia</strong>
                    </span>
                  ) : checkingOrder.transaction_status === 'settlement' ? (
                    <span className="text-green-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Lunas Terverifikasi ({checkingOrder.verified_by_admin || 'Panitia'})
                    </span>
                  ) : (
                    <span className="text-red-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" /> Ditolak ({checkingOrder.rejection_reason || 'Bukti tidak valid'})
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {checkingOrder.transaction_status === 'pending_review' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleRejectOrder(checkingOrder.id)}
                        className="px-3.5 py-2.5 bg-red-100 hover:bg-red-200 text-red-800 border-2 border-red-300 font-display font-bold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Tolak Pesanan
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVerifyOrder(checkingOrder.id, adminCheckNotes)}
                        className="btn-retro-yellow px-5 py-2.5 text-xs font-display font-black shadow-retro-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Terima (Lunas) & Tandai Terjual</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCheckingOrder(null)}
                      className="btn-retro-yellow px-5 py-2 text-xs font-display font-black shadow-retro-xs cursor-pointer"
                    >
                      Tutup Rincian
                    </button>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= MODAL LIGHTBOX BUKTI TRANSFER ================= */}
        {previewProofUrl && (
          <div 
            onClick={() => setPreviewProofUrl(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-3 border-black rounded-2xl p-4 max-w-lg w-full max-h-[90vh] flex flex-col space-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h4 className="font-display font-black text-sm text-black flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#FF3388]" /> Foto Bukti Transfer Pembeli
                </h4>
                <button
                  type="button"
                  onClick={() => setPreviewProofUrl(null)}
                  className="p-1 bg-[#FAF7EE] hover:bg-[#FF3388] hover:text-white border-2 border-black rounded-lg shadow-retro-xs transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center p-2 bg-neutral-900 rounded-xl border-2 border-black">
                <img 
                  src={previewProofUrl} 
                  alt="Bukti Transfer Penuh"
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
                <span>Periksa nama pengirim, nominal, dan tanggal mutasi rekening.</span>
                <button
                  type="button"
                  onClick={() => setPreviewProofUrl(null)}
                  className="btn-retro-yellow px-4 py-1.5 text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL GANTI GAMBAR QRIS PAMERAN ================= */}
        {isQrisModalOpen && (
          <div 
            onClick={() => setIsQrisModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-3 border-black rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h4 className="font-display font-black text-base text-black flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-black" /> Pengaturan QRIS Pameran
                </h4>
                <button
                  type="button"
                  onClick={() => setIsQrisModalOpen(false)}
                  className="p-1 bg-[#FAF7EE] hover:bg-[#FF3388] hover:text-white border-2 border-black rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current QR Image */}
              <div className="text-center space-y-2">
                <div className="relative w-52 h-52 mx-auto bg-white border-2 border-black rounded-2xl p-2.5 shadow-retro-xs flex items-center justify-center overflow-hidden">
                  {isSavingQris ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-8 h-8 text-black animate-spin" />
                      <span className="text-xs font-bold text-black">Menyimpan QRIS...</span>
                    </div>
                  ) : (
                    <img 
                      key={qrisSettings.qris_image_url || 'default'}
                      src={qrisSettings.qris_image_url || '/qris-dana.png'} 
                      alt="QRIS Aktif"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="text-xs font-display font-black text-black">
                  Merchant: <span className="text-[#FF3388]">{qrisSettings.merchant_name}</span>
                </div>
              </div>

              {/* Upload New QRIS Image */}
              <div className="space-y-2 border-t border-neutral-200 pt-3">
                <label className="block text-xs font-bold text-neutral-800">
                  Upload Gambar QRIS DANA / Toko Baru:
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  disabled={isSavingQris}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadQrisImage(file);
                  }}
                  className="block w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-2 file:border-black file:text-xs file:font-bold file:bg-[#FFE600] hover:file:bg-[#FFE600]/80 cursor-pointer disabled:opacity-50"
                />
                <p className="text-[10px] text-neutral-500">
                  Pilih screenshot / file foto QR DANA dari HP atau laptop Anda. Gambar ini akan langsung tampil di layar pembayaran pembeli secara realtime.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsQrisModalOpen(false)}
                  className="btn-retro-yellow px-5 py-2 text-xs font-display font-black shadow-retro-xs cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: QR SCANNER & VALIDATOR ================= */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: QR Scanner Viewfinder */}
            <div className="lg:col-span-6 space-y-6">
              <div className="card-retro p-6 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#FF3388]" />
                    <span>Scanner Kamera Tiket QR</span>
                  </h3>
                  <span className="text-[10px] bg-[#22C55E]/20 text-[#22C55E] border border-black font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
                    READY
                  </span>
                </div>

                <CameraQrScanner
                  onScanSuccess={(code) => {
                    setScanQuery(code);
                    handleVerifyTicket(code);
                  }}
                />

                <form onSubmit={(e) => { e.preventDefault(); handleVerifyTicket(scanQuery); }} className="space-y-2">
                  <label className="block text-xs font-bold text-black">
                    Atau Masukkan Check-in ID / NIM / Nama Peserta Secara Manual:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scanQuery}
                      onChange={(e) => setScanQuery(e.target.value)}
                      placeholder="Contoh: att-1 / 3312401001 / Alifia"
                      className="input-retro text-xs sm:text-sm flex-1"
                    />
                    <button type="submit" className="btn-retro-yellow px-5 py-2 text-xs sm:text-sm shrink-0">
                      Cek Tiket
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Scanned Ticket Details */}
            <div className="lg:col-span-6 space-y-6">
              {scannedTicket ? (
                <div className="card-retro p-6 sm:p-8 bg-white space-y-6 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFE600] px-2 py-0.5 rounded">
                        HASIL VALIDASI TIKET
                      </span>
                      <h3 className="font-display font-black text-2xl text-black mt-1">
                        {scannedTicket.nama_lengkap}
                      </h3>
                      <p className="text-xs text-neutral-600 font-mono font-bold">
                        NIM/ID: {scannedTicket.identifier || '-'} • {scannedTicket.kategori}
                      </p>
                    </div>

                    <div className="text-right">
                      {scannedTicket.isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 bg-[#22C55E] text-white text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-retro-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> SUDAH CHECK-IN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-[#FFE600] text-black text-xs font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-retro-sm">
                          ⏳ BELUM CHECK-IN
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7EE] border-2 border-black rounded-2xl p-4">
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Program Studi</span>
                      <strong className="text-black font-bold">{scannedTicket.jurusan_prodi || 'Polibatam'}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Perangkat & IP Log</span>
                      <strong className="text-black font-mono text-[11px]">{scannedTicket.ip_address}</strong>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Waktu Daftar</span>
                      <span className="text-neutral-700 font-mono">{scannedTicket.waktu_kehadiran}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 font-semibold block text-[10px] uppercase">Status Suvenir</span>
                      <span className={`font-bold text-xs inline-flex items-center gap-1.5 ${scannedTicket.isSouvenirClaimed ? 'text-[#22C55E]' : 'text-neutral-500'}`}>
                        {scannedTicket.isSouvenirClaimed ? (
                          <>
                            <Gift className="w-3.5 h-3.5" />
                            <span>Sudah Diambil</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5" />
                            <span>Belum Diambil</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCheckIn(scannedTicket.id)}
                      className={`w-full py-3 px-4 rounded-xl border-3 border-black font-display font-black text-sm flex items-center justify-center gap-2 shadow-retro transition-all active:scale-95 ${
                        scannedTicket.isCheckedIn
                          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          : 'btn-retro-pink'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span>{scannedTicket.isCheckedIn ? 'Batalkan Status Hadir' : 'Konfirmasi Kehadiran Pengunjung (Check-In)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleSouvenir(scannedTicket.id)}
                      className={`w-full py-3 px-4 rounded-xl border-3 border-black font-display font-black text-sm flex items-center justify-center gap-2 shadow-retro transition-all active:scale-95 ${
                        scannedTicket.isSouvenirClaimed
                          ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          : 'btn-retro-yellow'
                      }`}
                    >
                      <Gift className="w-5 h-5" />
                      <span>{scannedTicket.isSouvenirClaimed ? 'Tandai Suvenir Belum Diambil' : 'Serahkan Sticker Pack & Kupon Photobooth'}</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="card-retro p-8 bg-white text-center space-y-4">
                  <div className="w-16 h-16 bg-[#00F0FF] border-3 border-black rounded-2xl shadow-retro mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-black" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-black text-xl text-black">
                      Menunggu Scan Tiket...
                    </h4>
                    <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                      Scan QR code tiket pengunjung melalui kamera atau gunakan input manual untuk menampilkan data verifikasi.
                    </p>
                  </div>

                  {scanFeedback && (
                    <div className={`p-3 rounded-xl border-2 border-black text-xs font-bold ${
                      scanFeedback.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {scanFeedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 3: KEBUTUHAN & HAK PESERTA ================= */}
        {activeTab === 'participants' && (
          <div className="space-y-6">
            
            {/* Search & Filter bar */}
            <div className="card-retro p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={participantSearch}
                    onChange={(e) => setParticipantSearch(e.target.value)}
                    placeholder="Cari Nama, NIM, atau ID Tiket..."
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                  />
                </div>

                <select
                  value={participantCatFilter}
                  onChange={(e) => setParticipantCatFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 bg-[#FAF7EE] border-2 border-black rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#00F0FF]"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Mahasiswa Baru">Mahasiswa Baru</option>
                  <option value="Mahasiswa Polibatam">Mahasiswa Polibatam</option>
                  <option value="Dosen/Staff">Dosen/Staff</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                <span>Total Terdaftar: <strong className="text-black">{filteredParticipants.length}</strong></span>
              </div>
            </div>

            {/* Participants Needs Table (Scrollable Card) */}
            <div className="card-retro bg-white overflow-hidden flex flex-col">
              <div className="overflow-x-auto overflow-y-auto max-h-[500px] catalogue-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-[#FAF7EE] shadow-sm">
                    <tr className="border-b-2 border-black font-display font-black text-black">
                      <th className="py-3 px-4 bg-[#FAF7EE]">Nama Lengkap</th>
                      <th className="py-3 px-4 bg-[#FAF7EE]">Identitas / NIM</th>
                      <th className="py-3 px-4 bg-[#FAF7EE]">Kategori</th>
                      <th className="py-3 px-4 bg-[#FAF7EE] text-center">Status Kehadiran</th>
                      <th className="py-3 px-4 bg-[#FAF7EE] text-center">Hak Suvenir</th>
                      <th className="py-3 px-4 bg-[#FAF7EE] text-right">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {filteredParticipants.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-black block font-bold">{p.nama_lengkap}</strong>
                          <span className="text-[10px] text-neutral-500">{p.jurusan_prodi || 'Polibatam'}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-neutral-700">
                          {p.identifier || '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#FAF7EE] px-2 py-0.5 rounded border border-black text-[10px] font-bold">
                            {p.kategori}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.isCheckedIn ? (
                            <span className="bg-[#22C55E]/15 text-[#22C55E] border border-black font-black text-[10px] px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> HADIR
                            </span>
                          ) : (
                            <span className="bg-neutral-100 text-neutral-500 font-bold text-[10px] px-2 py-0.5 rounded border border-neutral-300">
                              Belum Check-in
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {p.isSouvenirClaimed ? (
                            <span className="bg-[#FF3388]/15 text-[#FF3388] border border-black font-black text-[10px] px-2 py-0.5 rounded inline-flex items-center gap-1">
                              <Gift className="w-3 h-3" /> SUDAH AMBIL
                            </span>
                          ) : (
                            <span className="bg-[#FFE600]/30 text-black font-bold text-[10px] px-2 py-0.5 rounded border border-black/30">
                              Belum Ambil
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleCheckIn(p.id)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                                p.isCheckedIn
                                  ? 'bg-neutral-200 text-neutral-700 border-neutral-400'
                                  : 'bg-[#22C55E] text-white border-black shadow-retro-sm active:scale-95'
                              }`}
                              title={p.isCheckedIn ? 'Batalkan Check-in' : 'Check-in Pengunjung'}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleSouvenir(p.id)}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                                p.isSouvenirClaimed
                                  ? 'bg-neutral-200 text-neutral-700 border-neutral-400'
                                  : 'bg-[#FFE600] text-black border-black shadow-retro-sm active:scale-95'
                              }`}
                              title={p.isSouvenirClaimed ? 'Batalkan Status Suvenir' : 'Serahkan Suvenir'}
                            >
                              <Gift className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: MONITORING SEMUA ZONA & TUGAS ================= */}
        {activeTab === 'monitoring' && (
          <div className="space-y-8">
            
            {/* Zone Cards Grid */}
            <div className="space-y-4">
              <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF3388]" />
                <span>Monitoring Penempatan Stand & Booth Lantai 3</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BOOTH_ZONES.map((zone) => (
                  <div key={zone.id} className="card-retro p-5 bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded border border-black bg-black text-[#FFE600]">
                        {zone.code}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-500">
                        {zone.location?.split('(')[0]}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-black text-base text-black">{zone.name}</h4>
                      <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{zone.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-200 text-xs">
                      <span className="font-bold text-[11px] text-neutral-700 block">Aktivitas Utama:</span>
                      {zone.activities?.map((act, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-neutral-600 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-[#22C55E] shrink-0" />
                          <span className="truncate">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Checklist */}
            <div className="card-retro p-6 bg-white space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-xl text-black flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#7B2CBF]" />
                  <span>Daftar Checklist Tugas Panitia Lapangan</span>
                </h3>
                <span className="text-xs font-bold text-neutral-500">
                  {tasks.filter(t => t.isCompleted).length} / {tasks.length} Selesai
                </span>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-xl border-2 border-black flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      task.isCompleted ? 'bg-[#FAF7EE] opacity-75' : 'bg-white shadow-retro-sm hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded border border-black ${task.isCompleted ? 'bg-[#22C55E] text-white' : 'bg-white'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className={`font-display font-bold text-sm text-black ${task.isCompleted ? 'line-through text-neutral-500' : ''}`}>
                          {task.title}
                        </h5>
                        <p className="text-xs text-neutral-500 font-semibold">
                          Lokasi: {task.location} • PIC: <strong>{task.assignedTo}</strong>
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-black bg-[#FFE600]">
                      {task.category || 'Logistik'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ======================= POLISHED MODAL 1: FORM CRUD ===================== */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card-retro bg-white w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border-3 border-black">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#FAF7EE] border-b-3 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#FFE600] border-2 border-black rounded-2xl flex items-center justify-center shadow-retro-sm shrink-0">
                  <Palette className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg sm:text-xl text-black">
                      {editingArtId ? 'Edit Data Karya Seni' : 'Tambah Karya Baru ke Katalog'}
                    </h3>
                    <span className="bg-[#FF3388] text-white text-[10px] font-black px-2 py-0.5 rounded border border-black">
                      {editingArtId ? 'MODE EDIT' : 'FORM KURASI'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 font-medium mt-0.5">
                    {editingArtId ? 'Perbarui detail data teknis dan kurasi karya seni.' : 'Lengkapi metadata karya pameran sesuai standar kurasi SenRup.'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { setIsFormOpen(false); setEditingArtId(null); }}
                className="w-9 h-9 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black flex items-center justify-center text-neutral-700 hover:text-black transition-colors shadow-retro-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form id="artwork-crud-form" onSubmit={handleSubmitArtwork} className="p-5 sm:p-7 space-y-6 overflow-y-auto catalogue-scrollbar flex-1">
              
              {/* SECTION 1: IDENTITAS UTAMA KARYA */}
              <div className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/15 pb-2">
                  <FileText className="w-4 h-4 text-[#FF3388]" />
                  <h4 className="font-display font-black text-sm text-black uppercase tracking-wider">
                    1. Identitas Karya & Pencipta
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">
                      Judul Karya Seni <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Harmoni Geometris Pesisir #1"
                      required
                      className="input-retro text-xs sm:text-sm font-bold bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">
                      Nama Seniman / Mahasiswa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.artist}
                      onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                      placeholder="Contoh: Muhammad Rangga"
                      required
                      disabled={formData.isAnonymous}
                      className={`input-retro text-xs sm:text-sm font-bold bg-white ${formData.isAnonymous ? 'bg-neutral-100 text-neutral-400' : ''}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">NIM Mahasiswa</label>
                    <input
                      type="text"
                      value={formData.artistNim}
                      onChange={(e) => setFormData({ ...formData, artistNim: e.target.value })}
                      placeholder="Contoh: 3312101012"
                      className="input-retro text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Angkatan / Status</label>
                    <select
                      value={formData.artistBatch}
                      onChange={(e) => setFormData({ ...formData, artistBatch: e.target.value })}
                      className="input-retro text-xs bg-white font-semibold"
                    >
                      <option value="2024 (Maba)">2024 (Mahasiswa Baru)</option>
                      <option value="2023">2023 (Tingkat 2)</option>
                      <option value="2022">2022 (Tingkat 3)</option>
                      <option value="2021">2021 (Tingkat Akhir)</option>
                      <option value="Alumni / Dosen">Alumni / Dosen Pengajar</option>
                      <option value="Kolektif Divisi">Kolektif Tim Divisi</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold hover:bg-neutral-50 shadow-retro-sm transition-all">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData({
                            ...formData,
                            isAnonymous: checked,
                            artist: checked && (!formData.artist || formData.artist === '') ? 'Pencipta Dirahasiakan' : formData.artist
                          });
                        }}
                        className="w-4 h-4 text-[#7B2CBF] rounded border-black focus:ring-black"
                      />
                      <span className="flex items-center gap-1.5">
                        <EyeOff className="w-4 h-4 text-[#7B2CBF]" /> Karya Anonim
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 2: KATEGORI, ZONA & MEDIA */}
              <div className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/15 pb-2">
                  <Compass className="w-4 h-4 text-[#00F0FF]" />
                  <h4 className="font-display font-black text-sm text-black uppercase tracking-wider">
                    2. Kategori & Penempatan Zona
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">
                      Kategori Pameran <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input-retro text-xs bg-white font-bold text-black"
                    >
                      <option value="Lukis">Lukis (Canvas / Akrilik)</option>
                      <option value="Kerajinan">Kerajinan (Kriya 3D / Resin)</option>
                      <option value="Sketsa & Ilustrasi">Sketsa & Ilustrasi (Pojok Gambar)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Zona Booth (Otomatis)</label>
                    <div className="input-retro text-xs bg-neutral-100 font-bold text-neutral-800 flex items-center justify-between">
                      <span className="truncate">{formData.boothName}</span>
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"></span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Tahun Pembuatan</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2024"
                      className="input-retro text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Medium & Bahan</label>
                    <input
                      type="text"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                      placeholder="Contoh: Acrylic on Canvas / Clay & Resin 3D"
                      className="input-retro text-xs bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Dimensi / Ukuran Fisik</label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="Contoh: 100 x 80 cm / A3 / 30 x 20 x 15 cm"
                      className="input-retro text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Harga & Status Penjualan (Midtrans) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-black/10">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">
                      Harga Jual Karya (IDR) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-500">Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="150000"
                        className="input-retro pl-9 text-xs bg-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">
                      Status Penjualan untuk Kolektor
                    </label>
                    <select
                      value={formData.isForSale ? 'true' : 'false'}
                      onChange={(e) => setFormData({ ...formData, isForSale: e.target.value === 'true' })}
                      className="input-retro text-xs bg-white font-bold text-black"
                    >
                      <option value="true">🟢 Boleh Dibeli / Dikoleksi (Midtrans)</option>
                      <option value="false">⚪ Hanya Pameran (Tidak Dijual)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: MEDIA GAMBAR & STORAGE UPLOAD */}
              <div className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/15 pb-2">
                  <ImageIcon className="w-4 h-4 text-[#FFE600]" />
                  <h4 className="font-display font-black text-sm text-black uppercase tracking-wider">
                    3. Foto Dokumentasi Utama (Supabase Storage)
                  </h4>
                </div>

                <ImageUploadField
                  value={formData.imageUrl}
                  file={formData.imageFile}
                  onChangeFile={(file) => setFormData(prev => ({ ...prev, imageFile: file }))}
                  onChangeUrl={(url) => setFormData(prev => ({ ...prev, imageUrl: url, imageFile: null }))}
                  required={!formData.imageUrl && !formData.imageFile}
                  label="Upload File Foto atau Masukkan Direct URL"
                  maxSizeMB={2}
                />
              </div>

              {/* SECTION 4: FILOSOFI & LABEL */}
              <div className="bg-[#FAF7EE] border-2 border-black rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-black/15 pb-2">
                  <Sparkles className="w-4 h-4 text-[#7B2CBF]" />
                  <h4 className="font-display font-black text-sm text-black uppercase tracking-wider">
                    4. Filosofi & Labeling
                  </h4>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black">
                    Deskripsi & Filosofi Karya <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Jelaskan makna filosofis, inspirasi tema History, dan teknik pembuatan karya..."
                    required
                    className="input-retro text-xs sm:text-sm bg-white resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-black">Tagar / Labels (Pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Retro Pop, History, Masterpiece"
                      className="input-retro text-xs bg-white"
                    />
                  </div>

                  <div className="pt-2 sm:pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-white border-2 border-black p-2.5 rounded-xl text-xs font-bold hover:bg-neutral-50 shadow-retro-sm transition-all">
                      <input
                        type="checkbox"
                        checked={formData.isHighlighted}
                        onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                        className="w-4 h-4 text-[#FF3388] rounded border-black focus:ring-black"
                      />
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-[#FFE600] fill-[#FFE600]" /> Karya Unggulan (Highlight)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

            </form>

            {/* Modal Sticky Footer */}
            <div className="p-4 sm:p-5 bg-[#FAF7EE] border-t-3 border-black flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] font-bold text-neutral-500 hidden sm:inline">
                * Kolom bertanda bintang wajib diisi
              </span>

              <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditingArtId(null); }}
                  className="btn-retro-white text-xs px-4 py-2.5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  form="artwork-crud-form"
                  disabled={isSubmitting}
                  className="btn-retro-pink text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 shadow-retro disabled:opacity-50 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Mengunggah & Menyimpan...' : (editingArtId ? 'Simpan Perubahan' : 'Terbitkan ke Katalog')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================= POLISHED MODAL 2: DELETE CONFIRM ================ */}
      {/* ========================================================================= */}
      {deleteConfirmArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card-retro bg-white w-full max-w-md p-6 sm:p-7 space-y-5 text-center rounded-3xl border-3 border-black shadow-2xl">
            <div className="w-16 h-16 bg-red-100 border-2 border-black rounded-2xl mx-auto flex items-center justify-center shadow-retro-sm">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-xl text-black">
                Hapus Karya Ini?
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Anda yakin ingin menghapus karya <strong className="text-black font-bold">"{deleteConfirmArt.title}"</strong> oleh <strong>{deleteConfirmArt.artist}</strong> dari katalog pameran?
              </p>
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold">
                ⚠️ Data di database dan file gambar di Supabase Storage akan dihapus secara permanen.
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmArt(null)}
                className="btn-retro-white text-xs px-5 py-2.5"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteArtwork}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl border-2 border-black font-display font-black text-xs bg-red-500 text-white hover:bg-red-600 shadow-retro active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus Karya'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ======================= POLISHED MODAL 3: PREVIEW DETAIL ================ */}
      {/* ========================================================================= */}
      {previewArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="card-retro bg-white w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border-3 border-black shadow-2xl">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-[#FAF7EE] border-b-3 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFE600] px-2.5 py-1 rounded-lg border border-black shadow-retro-sm">
                  DETAIL KURASI KARYA
                </span>
                <span className="text-xs font-bold text-neutral-500">ID: {previewArt.id}</span>
              </div>
              <button 
                onClick={() => setPreviewArt(null)} 
                className="w-8 h-8 rounded-xl bg-white hover:bg-neutral-100 border-2 border-black flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto catalogue-scrollbar flex-1">
              
              {/* Image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-black bg-neutral-900 relative shadow-retro-sm">
                <img 
                  src={previewArt.imageUrl || previewArt.foto_utama_url} 
                  alt={previewArt.title} 
                  className="w-full h-full object-cover" 
                />
                <span className="absolute top-3 left-3 bg-[#FFE600] text-black font-mono text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-black shadow-retro-sm">
                  {previewArt.category || previewArt.kategori}
                </span>
              </div>

              {/* Title & Creator */}
              <div className="space-y-1">
                <h3 className="font-display font-black text-2xl text-black">
                  {previewArt.title || previewArt.judul}
                </h3>
                <p className="text-xs text-neutral-700 font-semibold">
                  Oleh: <strong className="text-black font-bold">{previewArt.isAnonymous ? 'Pencipta Dirahasiakan' : (previewArt.artist || previewArt.seniman_nama)}</strong>
                  {previewArt.artistBatch && <span className="text-neutral-500"> • Angkatan {previewArt.artistBatch || previewArt.seniman_angkatan}</span>}
                  {previewArt.artistNim && previewArt.artistNim !== '-' && <span className="text-neutral-500"> • NIM {previewArt.artistNim}</span>}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs bg-[#FAF7EE] p-3.5 rounded-2xl border-2 border-black">
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase">Zona Penempatan</span>
                  <strong className="text-black">{previewArt.boothName || resolveBoothName(resolveBoothId(previewArt))}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase">Tahun Pembuatan</span>
                  <strong className="text-black">{previewArt.year || previewArt.tahun_pembuatan || '2024'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase">Medium & Bahan</span>
                  <strong className="text-black">{previewArt.medium || previewArt.medium_bahan || 'Mixed Media'}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 font-bold block uppercase">Dimensi / Ukuran</span>
                  <strong className="text-black">{previewArt.dimensions || previewArt.dimensi || 'Standar'}</strong>
                </div>
              </div>

              {/* Philosophy */}
              <div className="space-y-1.5 text-xs">
                <span className="font-display font-bold text-black uppercase tracking-wider text-[11px] block">
                  Filosofi & Narasi Karya:
                </span>
                <p className="leading-relaxed bg-neutral-50 p-3.5 rounded-2xl border border-neutral-300 text-neutral-800">
                  {previewArt.description || previewArt.deskripsi_filosofi}
                </p>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-[#FAF7EE] border-t-3 border-black flex items-center justify-end gap-2.5 shrink-0">
              <button
                onClick={() => setPreviewArt(null)}
                className="btn-retro-white text-xs px-4 py-2"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  const artToEdit = previewArt;
                  setPreviewArt(null);
                  handleOpenEditForm(artToEdit);
                }}
                className="btn-retro-yellow text-xs px-5 py-2 flex items-center gap-1.5 shadow-retro-sm"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Karya Ini</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
