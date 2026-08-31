import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  QrCode,
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  Info,
  Clock,
  ArrowRight,
  ZoomIn,
  Download,
  Maximize2
} from 'lucide-react';
import { OrderService } from '../../services/api';

export default function PurchaseModal({ 
  artwork, 
  isOpen, 
  onClose, 
  onPurchaseSuccess 
}) {
  const modalBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    pickupNotes: 'Ambil di Booth Pameran Lantai 3 Polibatam',
  });

  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isQrisZoomOpen, setIsQrisZoomOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [qrisSettings, setQrisSettings] = useState({
    merchant_name: 'CHARMY LUCK ART OFFICIAL',
    qris_image_url: '/qris-dana.png',
    dana_number: 'NMID: ID1025452455724',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // GSAP Modal Entrance & Load QRIS Settings
  useEffect(() => {
    if (isOpen && modalBoxRef.current) {
      setErrorMsg('');
      setSuccessOrder(null);
      setProofFile(null);
      setProofPreview(null);
      setIsQrisZoomOpen(false);
      
      OrderService.getQrisSettings().then((data) => {
        if (data) setQrisSettings(data);
      });

      gsap.fromTo(
        modalBoxRef.current,
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.6)' }
      );
    }
  }, [isOpen, artwork?.id]);

  if (!isOpen || !artwork) return null;

  const price = artwork.price ?? 150000;
  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Ukuran file bukti transfer maksimal 10MB.');
        return;
      }
      setProofFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
      setErrorMsg('');
    }
  };

  // Unduh Gambar QRIS ke HP / Laptop Pengunjung
  const handleDownloadQris = async () => {
    try {
      setIsDownloading(true);
      const imageUrl = qrisSettings.qris_image_url || '/qris-dana.png';
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `QRIS_Pembayaran_${(qrisSettings.merchant_name || 'SenRup').replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Direct blob download failed, fallback to standard link:', err);
      const link = document.createElement('a');
      link.href = qrisSettings.qris_image_url || '/qris-dana.png';
      link.download = 'QRIS_Pembayaran_Seni_Rupa.png';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.buyerName.trim()) {
      setErrorMsg('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!formData.buyerEmail.trim() || !formData.buyerEmail.includes('@')) {
      setErrorMsg('Mohon masukkan alamat email yang valid.');
      return;
    }
    if (!formData.buyerPhone.trim() || formData.buyerPhone.length < 8) {
      setErrorMsg('Mohon masukkan nomor WhatsApp yang aktif.');
      return;
    }
    if (!proofFile && !proofPreview) {
      setErrorMsg('Mohon unggah foto / screenshot bukti transfer pembayaran.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await OrderService.submitOrderWithProof({
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        artworkArtist: artwork.artist,
        artworkCategory: artwork.category,
        artworkImage: artwork.imageUrl,
        price: price,
        buyerName: formData.buyerName.trim(),
        buyerEmail: formData.buyerEmail.trim(),
        buyerPhone: formData.buyerPhone.trim(),
        pickupNotes: formData.pickupNotes.trim(),
        paymentProofFile: proofFile,
        paymentProofUrl: proofPreview,
        paymentType: 'QRIS (DANA / Bank / E-Wallet)',
      });

      setIsLoading(false);

      const settledData = {
        orderId: res.order_id || `ORDER-SR-${Date.now()}`,
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        grossAmount: price,
        buyerName: formData.buyerName,
        paymentType: 'QRIS (DANA / Bank / E-Wallet)',
      };

      setSuccessOrder(settledData);
      onPurchaseSuccess?.(settledData);
    } catch (err) {
      console.error('Submit Order Error:', err);
      setIsLoading(false);
      setErrorMsg(err.message || 'Terjadi kendala saat mengirim bukti pesanan.');
    }
  };

  const qrisDisplayUrl = qrisSettings.qris_image_url || '/qris-dana.png';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        ref={modalBoxRef}
        className="relative w-full max-w-2xl my-auto bg-[#FAF7EE] border-3 border-black rounded-2xl sm:rounded-3xl shadow-retro-xl overflow-hidden flex flex-col max-h-[94vh]"
      >
        
        {/* Top Header */}
        <div className="bg-[#FFE600] border-b-3 border-black px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#FF3388] text-white rounded-lg border-2 border-black shadow-retro-xs">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
                Pemesanan Karya Seni (1-of-1)
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white border-2 border-black rounded-xl hover:bg-[#FF3388] hover:text-white active:translate-x-0.5 active:translate-y-0.5 shadow-retro-xs transition-all text-black cursor-pointer"
            title="Tutup (ESC)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* ========================================================= */}
          {/* SUCCESS STATE */}
          {/* ========================================================= */}
          {successOrder ? (
            <div className="text-center py-6 px-4 space-y-4 bg-white border-3 border-black rounded-2xl shadow-retro">
              <div className="w-16 h-16 bg-[#CCFF00] border-3 border-black rounded-full mx-auto flex items-center justify-center shadow-retro-sm animate-bounce">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <div>
                <span className="bg-[#FFE600] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black uppercase tracking-wider">
                  Bukti Pembayaran Terkirim
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-black mt-1.5">
                  Pesanan Berhasil Dicatat!
                </h3>
                <p className="text-xs text-neutral-600 font-medium max-w-md mx-auto mt-1">
                  Bukti transfer Anda telah masuk ke sistem. Panitia akan memverifikasi mutasi pembayaran dan menandai karya resmi milik Anda.
                </p>
              </div>

              <div className="bg-[#FAF7EE] border-2 border-black rounded-xl p-3.5 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>ID Pesanan:</span>
                  <strong className="text-black">{successOrder.orderId}</strong>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Karya Seni:</span>
                  <strong className="text-black truncate max-w-[200px]">{successOrder.artworkTitle}</strong>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Atas Nama Pembeli:</span>
                  <strong className="text-black">{successOrder.buyerName}</strong>
                </div>
                <div className="flex justify-between text-neutral-600 pt-1.5 border-t border-black/20">
                  <span>Total Ditransfer:</span>
                  <strong className="text-[#FF3388] text-sm font-black">{priceFormatted}</strong>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 border-2 border-cyan-800 rounded-xl text-[11px] text-cyan-950 text-left flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-800 shrink-0 mt-0.5" />
                <div>
                  <strong>Serah Terima Karya Fisik:</strong>
                  <p>Tunjukkan ID Pesanan <strong>{successOrder.orderId}</strong> kepada panitia di <strong>{artwork.boothName || 'Student Centre Lt. 3'}</strong> saat pameran berakhir.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="btn-retro-yellow w-full py-3 text-sm font-display font-black cursor-pointer"
              >
                Selesai & Tutup
              </button>
            </div>
          ) : (
            <>
              {/* Artwork Preview Card */}
              <div className="bg-white border-2 border-black rounded-2xl p-3.5 flex items-center gap-3.5 shadow-retro-xs">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border-2 border-black shadow-retro-xs shrink-0 bg-neutral-900"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#FF3388] text-white text-[9px] font-black px-2 py-0.2 rounded border border-black uppercase">
                      {artwork.category || 'Seni Rupa'}
                    </span>
                    <span className="bg-[#CCFF00] text-black text-[9px] font-black px-2 py-0.2 rounded border border-black uppercase">
                      Karya Asli (1-of-1)
                    </span>
                  </div>
                  <h4 className="font-display font-black text-sm sm:text-base text-black truncate">
                    {artwork.title}
                  </h4>
                  <div className="text-[11px] text-neutral-600 font-medium truncate">
                    Karya oleh: <span className="font-bold text-black">{artwork.artist}</span>
                  </div>
                  <div className="text-sm sm:text-base font-display font-black text-[#FF3388]">
                    {priceFormatted}
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* KOTAK QRIS RESMI (BISA DI-ZOOM & DI-DOWNLOAD) */}
              {/* ========================================================= */}
              <div className="bg-white border-3 border-black rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-retro">
                <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base text-red-600 tracking-wider">QRIS</span>
                    <span className="text-[10px] text-neutral-500 font-bold">DANA / Semua Bank & E-Wallet</span>
                  </div>
                  <span className="bg-[#CCFF00] text-black text-[9px] font-black px-2 py-0.5 rounded border border-black uppercase">
                    Merchant Resmi
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  
                  {/* Gambar QRIS dengan tombol Zoom & Unduh */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center space-y-2">
                    
                    {/* Klik Gambar untuk Zoom HD */}
                    <div 
                      onClick={() => setIsQrisZoomOpen(true)}
                      className="relative group w-48 h-48 sm:w-52 sm:h-52 bg-white border-2 border-black rounded-2xl p-2 shadow-retro-xs flex items-center justify-center overflow-hidden cursor-zoom-in hover:scale-[1.02] transition-transform"
                      title="Klik untuk memperbesar QRIS layar penuh"
                    >
                      <img 
                        src={qrisDisplayUrl} 
                        alt="QRIS Panitia Seni Rupa" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/qris-dana.png';
                        }}
                        className="w-full h-full object-contain"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white text-black font-display font-black text-[10px] px-2.5 py-1 rounded-lg border border-black shadow-retro-xs flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-[#FF3388]" /> Perbesar HD
                        </span>
                      </div>
                    </div>

                    {/* Tombol Interaktif: Zoom & Unduh */}
                    <div className="flex items-center gap-1.5 w-full justify-center">
                      <button
                        type="button"
                        onClick={() => setIsQrisZoomOpen(true)}
                        className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-black rounded-lg text-[10px] font-bold text-black flex items-center gap-1 shadow-retro-xs cursor-pointer active:scale-95 transition-transform"
                      >
                        <ZoomIn className="w-3 h-3 text-[#FF3388]" />
                        <span>Perbesar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadQris}
                        disabled={isDownloading}
                        className="px-2.5 py-1 bg-[#00F0FF] hover:bg-[#33F3FF] border border-black rounded-lg text-[10px] font-bold text-black flex items-center gap-1 shadow-retro-xs cursor-pointer active:scale-95 transition-transform"
                        title="Unduh QRIS untuk bayar dari galeri HP"
                      >
                        {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3 text-black" />}
                        <span>Unduh QR</span>
                      </button>
                    </div>

                  </div>

                  {/* Nominal & Petunjuk */}
                  <div className="sm:col-span-7 space-y-2.5 text-left">
                    <div className="bg-[#FAF7EE] border-2 border-black rounded-xl p-3 space-y-1">
                      <div className="text-[11px] font-bold text-neutral-600">Merchant Panitia:</div>
                      <div className="font-display font-black text-sm text-black uppercase">{qrisSettings.merchant_name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">NMID: ID1025452455724 (A01)</div>
                      
                      <div className="text-[11px] text-neutral-500 pt-1.5 border-t border-black/10">Nominal Pas yang Harus Ditransfer:</div>
                      <div className="font-display font-black text-xl text-[#FF3388]">{priceFormatted}</div>
                    </div>

                    <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 text-[10px] text-neutral-700 leading-snug space-y-1">
                      <div className="font-bold text-black flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF3388]" /> Cara Pembayaran:
                      </div>
                      <p>1. <strong>Scan langsung</strong> atau klik <strong>"Unduh QR"</strong> lalu bayar dari galeri.</p>
                      <p>2. Transfer tepat nominal <strong>{priceFormatted}</strong>.</p>
                      <p>3. Upload <strong>screenshot / struk pembayaran</strong> di bawah.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-100 border-2 border-red-800 text-red-950 p-3 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span className="font-semibold">{errorMsg}</span>
                </div>
              )}

              {/* ========================================================= */}
              {/* FORM DATA PEMBELI & UPLOAD BUKTI TRANSFER */}
              {/* ========================================================= */}
              <form onSubmit={handleSubmitOrder} className="space-y-3.5">
                <div className="text-xs font-display font-black uppercase text-black flex items-center gap-1.5 pt-1">
                  <User className="w-3.5 h-3.5 text-[#FF3388]" /> Formulir Pemesan & Bukti Transfer
                </div>

                {/* Nama */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-700">
                    Nama Lengkap Pembeli <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="buyerName"
                      value={formData.buyerName}
                      onChange={handleInputChange}
                      placeholder="Contoh: Budi Santoso"
                      required
                      className="input-retro pl-9 py-2 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Email & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">
                      Email (Untuk Bukti Invoice) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        name="buyerEmail"
                        value={formData.buyerEmail}
                        onChange={handleInputChange}
                        placeholder="nama@email.com"
                        required
                        className="input-retro pl-9 py-2 text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">
                      No. WhatsApp / HP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="buyerPhone"
                        value={formData.buyerPhone}
                        onChange={handleInputChange}
                        placeholder="081234567890"
                        required
                        className="input-retro pl-9 py-2 text-xs sm:text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Catatan Pengambilan */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-700">
                    Opsi Serah Terima / Catatan Tambahan
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="pickupNotes"
                      value={formData.pickupNotes}
                      onChange={handleInputChange}
                      placeholder="Ambil di Booth Pameran Lt. 3"
                      className="input-retro pl-9 py-2 text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Upload Bukti Transfer Box */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[11px] font-bold text-neutral-800 flex items-center justify-between">
                    <span>Upload Foto / Screenshot Bukti Transfer <span className="text-red-500">*</span></span>
                    <span className="text-[10px] text-neutral-500 font-mono">Format: JPG, PNG, WEBP</span>
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                  />

                  {proofPreview ? (
                    <div className="bg-white border-2 border-black rounded-2xl p-3 flex items-center justify-between gap-3 shadow-retro-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={proofPreview} 
                          alt="Pratinjau Bukti" 
                          className="w-14 h-14 object-cover rounded-xl border border-black shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-black truncate">
                            {proofFile?.name || 'Bukti_Pembayaran.png'}
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-300 mt-1">
                            <Check className="w-3 h-3" /> Siap Dikirim
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-[#FAF7EE] hover:bg-[#FFE600] border-2 border-black rounded-xl text-xs font-bold shrink-0 transition-colors shadow-retro-xs cursor-pointer"
                      >
                        Ganti Foto
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-black bg-white hover:bg-[#FFE600]/10 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-colors space-y-1.5 shadow-retro-xs"
                    >
                      <div className="w-10 h-10 bg-[#FAF7EE] border border-black rounded-xl mx-auto flex items-center justify-center text-neutral-600">
                        <Upload className="w-5 h-5 text-black" />
                      </div>
                      <div className="text-xs font-bold text-black">
                        Ketuk di sini untuk Unggah Bukti Transfer
                      </div>
                      <p className="text-[10px] text-neutral-500">
                        Ambil screenshot struk pembayaran DANA / M-Banking Anda lalu pilih di sini
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-retro-yellow w-full py-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-display font-black shadow-retro hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Mengirim Pesanan & Bukti Transfer...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Kirim Pesanan & Bukti Pembayaran • {priceFormatted}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL LIGHTBOX QRIS HD (LAYAR PENUH & DOWNLOAD) */}
      {/* ========================================================= */}
      {isQrisZoomOpen && (
        <div 
          onClick={() => setIsQrisZoomOpen(false)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-3 border-black rounded-3xl p-4 sm:p-6 max-w-md w-full max-h-[92vh] flex flex-col space-y-4 shadow-retro-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
              <div>
                <h4 className="font-display font-black text-sm sm:text-base text-black flex items-center gap-1.5">
                  <QrCode className="w-5 h-5 text-[#FF3388]" /> QRIS Pembayaran Resmi
                </h4>
                <p className="text-[10px] text-neutral-600 font-bold">{qrisSettings.merchant_name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrisZoomOpen(false)}
                className="p-1.5 bg-[#FAF7EE] hover:bg-[#FF3388] hover:text-white border-2 border-black rounded-xl shadow-retro-xs transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Image Big Display */}
            <div className="flex-1 min-h-0 overflow-auto flex items-center justify-center p-2 bg-white rounded-2xl border-2 border-black shadow-inner">
              <img 
                src={qrisDisplayUrl} 
                alt="QRIS HD"
                className="max-h-[58vh] w-full object-contain rounded-xl"
              />
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="text-[11px] font-display font-black text-[#FF3388]">
                Nominal: {priceFormatted}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQris}
                  disabled={isDownloading}
                  className="btn-retro-cyan px-4 py-2 text-xs font-display font-black flex items-center gap-1.5 shadow-retro-xs cursor-pointer active:scale-95"
                >
                  {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Unduh Gambar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsQrisZoomOpen(false)}
                  className="btn-retro-yellow px-4 py-2 text-xs font-display font-black shadow-retro-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
