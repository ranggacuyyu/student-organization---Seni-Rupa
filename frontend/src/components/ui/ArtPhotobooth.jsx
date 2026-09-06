import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Download,
  Copy,
  Sparkles,
  Palette,
  Check,
  Upload,
  Clock,
  Smile,
  Zap,
  Star,
  Award,
  User,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Import AI Generated Frame Assets
import frameRetroPopArt from '../../assets/frames/frame-retro-popart.jpg';
import frameClassicGold from '../../assets/frames/frame-classic-gold.jpg';
import frameCyberNeon from '../../assets/frames/frame-cyber-neon.jpg';
import framePolaroidArt from '../../assets/frames/frame-polaroid-art.jpg';

// Daftar Bingkai Seni Rupa (AI Generated & Neo-Brutalist Procedural)
const ART_FRAMES = [
  {
    id: 'retro-popart',
    name: 'Neo-Brutalist Pop Art',
    badge: 'AI SPECIAL',
    badgeColor: 'bg-[#FFE600] text-black',
    desc: 'Warna cerah, cipratan cat pop-art, kuas, dan badge Seni Rupa Polibatam 2026.',
    type: 'ai-image',
    imageSrc: frameRetroPopArt,
    innerBounds: { x: 0.198, y: 0.198, width: 0.604, height: 0.604, radius: 10 }
  },
  {
    id: 'classic-gold',
    name: 'Museum Gold Gallery',
    badge: 'LUXURY CLASSIC',
    badgeColor: 'bg-[#FFB703] text-black',
    desc: 'Bingkai ukir emas mewah bernuansa galeri museum seni rupa klasik.',
    type: 'ai-image',
    imageSrc: frameClassicGold,
    innerBounds: { x: 0.288, y: 0.288, width: 0.424, height: 0.424, radius: 4 }
  },
  {
    id: 'cyber-neon',
    name: 'Cyberpunk Neon Art',
    badge: 'SYNTHWAVE GLOW',
    badgeColor: 'bg-[#00F0FF] text-black',
    desc: 'Sentuhan masa depan dengan garis neon menyala dan lorong pameran digital.',
    type: 'ai-image',
    imageSrc: frameCyberNeon,
    innerBounds: { x: 0.252, y: 0.252, width: 0.496, height: 0.496, radius: 14 }
  },
  {
    id: 'polaroid-art',
    name: 'Aesthetic Polaroid & Tape',
    badge: 'WARM RETRO',
    badgeColor: 'bg-[#FF3388] text-white',
    desc: 'Polaroid vintage dengan selotip warna-warni, coretan sketsa, dan sapuan akrilik.',
    type: 'ai-image',
    imageSrc: framePolaroidArt,
    innerBounds: { x: 0.222, y: 0.182, width: 0.556, height: 0.556, radius: 6 }
  },
  {
    id: 'vip-pass',
    name: 'Official VIP Art Pass',
    badge: 'NEO-BRUTALIST',
    badgeColor: 'bg-[#7B2CBF] text-white',
    desc: 'Gaya tiket pameran kontemporer dengan border tebal, barcode, & identitas nama.',
    type: 'procedural-ticket'
  },
  {
    id: 'graffiti-splash',
    name: 'Street Art & Sticker Blast',
    badge: 'URBAN CREATIVE',
    badgeColor: 'bg-[#CCFF00] text-black',
    desc: 'Kombinasi stiker retro, garis serong peringatan seni, dan efek cipratan cat jalanan.',
    type: 'procedural-graffiti'
  }
];

// Pilihan Filter Warna
const COLOR_FILTERS = [
  { id: 'none', name: 'Normal', filterStyle: 'none', canvasFilter: 'none' },
  { id: 'vintage', name: 'Vintage Warm', filterStyle: 'sepia(0.35) contrast(1.1) brightness(1.05) saturate(1.2)', canvasFilter: 'sepia(35%) contrast(110%) brightness(105%) saturate(120%)' },
  { id: 'noir', name: 'B&W Charcoal', filterStyle: 'grayscale(1) contrast(1.3) brightness(0.95)', canvasFilter: 'grayscale(100%) contrast(130%) brightness(95%)' },
  { id: 'pop', name: 'Vivid Pop Art', filterStyle: 'saturate(1.7) contrast(1.2) brightness(1.02)', canvasFilter: 'saturate(170%) contrast(120%) brightness(102%)' },
  { id: 'cyber', name: 'Cyber Blue', filterStyle: 'hue-rotate(185deg) contrast(1.25) saturate(1.3)', canvasFilter: 'hue-rotate(185deg) contrast(125%) saturate(130%)' }
];

// Pilihan Stiker / Cap Seni
const ART_STICKERS = [
  { id: 'none', label: 'Tanpa Stiker' },
  { id: 'senrup', label: '🎨 SENRUP 2026' },
  { id: 'artist', label: '✨ ART ENTHUSIAST' },
  { id: 'masterpiece', label: '🖌️ MASTERPIECE' },
  { id: 'vip', label: '🏆 OFFICIAL VIP' },
  { id: 'creative', label: '⭐ POLIBATAM CREATIVE' }
];

export default function ArtPhotobooth({ currentUser, myTicket, onNavigate }) {
  // State Kamera & Capture
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' atau 'environment'
  const [isMirrored, setIsMirrored] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [timerDuration, setTimerDuration] = useState(3); // 0, 3, atau 5 detik
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // State Kustomisasi
  const [selectedFrameId, setSelectedFrameId] = useState('retro-popart');
  const [selectedFilterId, setSelectedFilterId] = useState('none');
  const [selectedStickerId, setSelectedStickerId] = useState('senrup');
  const [visitorName, setVisitorName] = useState(() => {
    return currentUser?.name || myTicket?.nama_lengkap || myTicket?.nama || 'Pengunjung Seni Rupa';
  });
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [loadedFrameImages, setLoadedFrameImages] = useState({});

  // Refs
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const activeFrame = ART_FRAMES.find(f => f.id === selectedFrameId) || ART_FRAMES[0];
  const activeFilter = COLOR_FILTERS.find(f => f.id === selectedFilterId) || COLOR_FILTERS[0];

  // Preload Image Frames untuk rendering canvas
  useEffect(() => {
    const loaded = {};
    ART_FRAMES.forEach(frame => {
      if (frame.type === 'ai-image' && frame.imageSrc) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = frame.imageSrc;
        img.onload = () => {
          loaded[frame.id] = img;
          setLoadedFrameImages(prev => ({ ...prev, [frame.id]: img }));
        };
      }
    });
  }, []);

  // Update nama jika tiket/user berubah
  useEffect(() => {
    if (currentUser?.name) {
      setVisitorName(currentUser.name);
    } else if (myTicket?.nama_lengkap || myTicket?.nama) {
      setVisitorName(myTicket.nama_lengkap || myTicket.nama);
    }
  }, [currentUser, myTicket]);

  // Audio Beep Effect Synthesizer
  const playBeep = useCallback((freq = 880, duration = 0.1, type = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio playback opsional
    }
  }, []);

  // Pasang stream ke elemen video
  const attachStreamToVideo = useCallback(() => {
    if (videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Sinkronkan video stream saat frame atau status berubah
  useEffect(() => {
    if (isCameraActive && !capturedImage) {
      attachStreamToVideo();
    }
  }, [isCameraActive, selectedFrameId, capturedImage, attachStreamToVideo]);

  // Mulai Stream Kamera
  const startCamera = useCallback(async (facing = cameraFacing) => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 1280 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      setIsCameraActive(true);
      setCameraFacing(facing);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Gagal mengakses kamera:', err);
      let errorMsg = 'Izin akses kamera belum diberikan atau kamera tidak tersedia.';
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Akses kamera ditolak. Silakan izinkan browser mengakses kamera Anda.';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'Perangkat kamera tidak ditemukan.';
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  }, [cameraFacing]);

  // Matikan Stream Kamera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Ganti Kamera Depan / Belakang
  const toggleFacingMode = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setIsMirrored(nextFacing === 'user');
    startCamera(nextFacing);
  };

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [stopCamera]);

  // Tangkap Foto dari Feed Video ke Image Data
  const captureRawPhoto = useCallback(() => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0) return null;

    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (isMirrored) {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [isMirrored]);

  // Trigger Hitung Mundur & Foto
  const handleTriggerCapture = () => {
    if (isCapturing) return;

    if (timerDuration === 0) {
      executeShutter();
      return;
    }

    setIsCapturing(true);
    let count = timerDuration;
    setCountdown(count);
    playBeep(700, 0.1);

    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playBeep(700, 0.1);
      } else {
        clearInterval(countdownIntervalRef.current);
        setCountdown(null);
        executeShutter();
      }
    }, 1000);
  };

  // Eksekusi Shutter Flash & Pengambilan Foto
  const executeShutter = () => {
    playBeep(1200, 0.25, 'triangle');
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 280);

    const rawData = captureRawPhoto();
    if (rawData) {
      setCapturedImage(rawData);
      stopCamera();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFE600', '#FF3388', '#00F0FF', '#7B2CBF']
      });
    }
    setIsCapturing(false);
  };

  // Upload Foto dari File Perangkat (Fallback)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
        stopCamera();
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  };

  // Helper untuk Menggambar Bingkai Procedural Neo-Brutalist Ticket
  const drawProceduralTicketFrame = (ctx, width, height) => {
    const margin = width * 0.08;
    const photoSize = width - margin * 2;
    const photoY = height * 0.12;

    ctx.fillStyle = '#FAF7EE';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(18, 18, 18, 0.06)';
    const dotSpacing = 24;
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#FFE600';
    ctx.fillRect(margin, margin * 0.5, photoSize, 48);
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, margin * 0.5, photoSize, 48);

    ctx.fillStyle = '#121212';
    ctx.font = 'bold 20px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ SENI RUPA POLIBATAM', margin + 16, margin * 0.5 + 24);

    ctx.font = 'bold 13px "Courier Prime", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ART SHOWCASE 2026', margin + photoSize - 16, margin * 0.5 + 24);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(margin - 4, photoY - 4, photoSize + 8, photoSize + 8);
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 6;
    ctx.strokeRect(margin - 4, photoY - 4, photoSize + 8, photoSize + 8);

    const footerY = photoY + photoSize + 16;
    const footerHeight = height - footerY - margin * 0.5;

    ctx.fillStyle = '#121212';
    ctx.fillRect(margin, footerY, photoSize, footerHeight);
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 4;
    ctx.strokeRect(margin, footerY, photoSize, footerHeight);

    ctx.fillStyle = '#FFE600';
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const cleanName = visitorName || 'Pengunjung Seni Rupa';
    ctx.fillText(cleanName.toUpperCase(), margin + 18, footerY + 14);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Official Art Explorer • Student Centre LT. 3 Polibatam', margin + 18, footerY + 44);

    const barcodeX = margin + photoSize - 140;
    const barcodeY = footerY + 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(barcodeX - 8, barcodeY - 4, 136, 48);

    ctx.fillStyle = '#121212';
    const barWidths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3];
    let curX = barcodeX;
    barWidths.forEach(w => {
      ctx.fillRect(curX, barcodeY, w, 32);
      curX += w + 2;
    });

    ctx.fillStyle = '#555555';
    ctx.font = '9px "Courier Prime", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SR-2026-VIP', barcodeX + 60, barcodeY + 40);

    ctx.fillStyle = '#FF3388';
    ctx.beginPath();
    ctx.arc(margin, footerY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(margin + photoSize, footerY, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  // Helper untuk Menggambar Bingkai Procedural Graffiti & Street Art
  const drawProceduralGraffitiFrame = (ctx, width, height) => {
    const borderWidth = 32;

    ctx.save();
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FAF7EE';
    ctx.fillRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    ctx.fillStyle = '#FFE600';
    for (let x = -height; x < width * 2; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 18, 0);
      ctx.lineTo(x + 18 - borderWidth, borderWidth);
      ctx.lineTo(x - borderWidth, borderWidth);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, height - borderWidth);
      ctx.lineTo(x + 18, height - borderWidth);
      ctx.lineTo(x + 18 - borderWidth, height);
      ctx.lineTo(x - borderWidth, height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 6;
    ctx.strokeRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);

    ctx.save();
    ctx.translate(width - 90, 45);
    ctx.rotate((6 * Math.PI) / 180);
    ctx.fillStyle = '#FF3388';
    ctx.fillRect(-60, -18, 120, 36);
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 3;
    ctx.strokeRect(-60, -18, 120, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('LIVE ART ★', 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(110, height - 45);
    ctx.rotate((-4 * Math.PI) / 180);
    ctx.fillStyle = '#00F0FF';
    ctx.fillRect(-80, -18, 160, 36);
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 3;
    ctx.strokeRect(-80, -18, 160, 36);
    ctx.fillStyle = '#121212';
    ctx.font = 'black 13px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('POLIBATAM ART 2026', 0, 0);
    ctx.restore();
  };

  // Render Final Composite Canvas (HQ 1080x1080)
  const renderCompositeCanvas = useCallback((sourceImgSrc) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const size = 1080;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      const photo = new Image();
      photo.crossOrigin = 'anonymous';
      photo.onload = () => {
        ctx.save();

        if (activeFrame.type === 'ai-image') {
          const bounds = activeFrame.innerBounds;
          const px = bounds.x * size;
          const py = bounds.y * size;
          const pw = bounds.width * size;
          const ph = bounds.height * size;
          const pr = (bounds.radius || 0) * (size / 1024);

          const frameImg = loadedFrameImages[activeFrame.id];
          if (frameImg) {
            ctx.drawImage(frameImg, 0, 0, size, size);
          } else {
            ctx.fillStyle = '#121212';
            ctx.fillRect(0, 0, size, size);
          }

          // Gambar photo di dalam aperture bounds
          ctx.save();
          ctx.beginPath();
          if (pr > 0 && ctx.roundRect) {
            ctx.roundRect(px, py, pw, ph, pr);
          } else {
            ctx.rect(px, py, pw, ph);
          }
          ctx.clip();

          if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
            ctx.filter = activeFilter.canvasFilter;
          }
          ctx.drawImage(photo, px, py, pw, ph);
          ctx.restore();

          // Subtle inner border
          ctx.save();
          ctx.strokeStyle = 'rgba(18, 18, 18, 0.4)';
          ctx.lineWidth = 3;
          if (pr > 0 && ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(px, py, pw, ph, pr);
            ctx.stroke();
          } else {
            ctx.strokeRect(px, py, pw, ph);
          }
          ctx.restore();

          // Khusus Pop Art Frame: Redraw 2 Lingkaran Badge di Atas Foto agar TIDAK TERPOTONG & TANPA KOTAK-KOTAK
          if (activeFrame.id === 'retro-popart' && frameImg) {
            // 1. Bottom-Left Badge: SENI RUPA POLIBATAM (Circle)
            ctx.save();
            ctx.beginPath();
            const cx1 = (226.5 / 1024) * size;
            const cy1 = (830 / 1024) * size;
            const r1 = (121 / 1024) * size; // Presisi tepat di pinggir putih stiker
            ctx.arc(cx1, cy1, r1, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(frameImg, 0, 0, size, size);
            ctx.restore();

            // Pinggiran putih bersih stiker
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx1, cy1, r1, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();

            // 2. Bottom-Right Badge: ART SHOWCASE 2026 (Circle)
            ctx.save();
            ctx.beginPath();
            const cx2 = (828 / 1024) * size;
            const cy2 = (837 / 1024) * size;
            const r2 = (109 / 1024) * size; // Presisi tepat di pinggir putih stiker
            ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(frameImg, 0, 0, size, size);
            ctx.restore();

            // Pinggiran putih bersih stiker
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx2, cy2, r2, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.restore();
          }

        } else if (activeFrame.id === 'vip-pass') {
          const margin = size * 0.08;
          const photoSize = size - margin * 2;
          const photoY = size * 0.12;

          drawProceduralTicketFrame(ctx, size, size);

          ctx.save();
          ctx.beginPath();
          ctx.rect(margin, photoY, photoSize, photoSize);
          ctx.clip();
          if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
            ctx.filter = activeFilter.canvasFilter;
          }
          ctx.drawImage(photo, margin, photoY, photoSize, photoSize);
          ctx.restore();

        } else if (activeFrame.id === 'graffiti-splash') {
          const borderWidth = 32;
          const photoSize = size - borderWidth * 2;

          ctx.save();
          if (activeFilter.canvasFilter && activeFilter.canvasFilter !== 'none') {
            ctx.filter = activeFilter.canvasFilter;
          }
          ctx.drawImage(photo, borderWidth, borderWidth, photoSize, photoSize);
          ctx.restore();

          drawProceduralGraffitiFrame(ctx, size, size);
        }

        if (selectedStickerId !== 'none') {
          const sticker = ART_STICKERS.find(s => s.id === selectedStickerId);
          if (sticker) {
            ctx.save();
            ctx.translate(size - 180, size - 70);
            ctx.rotate((-3 * Math.PI) / 180);
            ctx.fillStyle = '#FFE600';
            ctx.fillRect(-10, -18, 180, 36);
            ctx.strokeStyle = '#121212';
            ctx.lineWidth = 3;
            ctx.strokeRect(-10, -18, 180, 36);
            ctx.fillStyle = '#121212';
            ctx.font = 'bold 15px "Space Grotesk", sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(sticker.label, 0, 0);
            ctx.restore();
          }
        }

        ctx.restore();
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      photo.src = sourceImgSrc;
    });
  }, [activeFrame, activeFilter, selectedStickerId, visitorName, loadedFrameImages]);

  // Download File PNG
  const handleDownload = async () => {
    if (!capturedImage) return;

    try {
      const finalImageURL = await renderCompositeCanvas(capturedImage);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      const safeName = (visitorName || 'visitor').toLowerCase().replace(/[^a-z0-9]/g, '-');
      link.download = `SenRup-Photobooth-${safeName}-${timestamp}.png`;
      link.href = finalImageURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFE600', '#FF3388', '#00F0FF', '#7B2CBF', '#CCFF00']
      });
    } catch (err) {
      console.error('Gagal mengunduh foto:', err);
    }
  };

  // Salin Gambar ke Clipboard
  const handleCopyToClipboard = async () => {
    if (!capturedImage) return;

    try {
      const finalImageURL = await renderCompositeCanvas(capturedImage);
      const res = await fetch(finalImageURL);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2500);
    } catch (err) {
      console.warn('Clipboard image write not supported:', err);
      handleDownload();
    }
  };

  // Foto Ulang (Retake)
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(cameraFacing);
  };

  return (
    <section id="section-photobooth" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
      <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-10 shadow-retro-xl relative overflow-hidden">
        
        {/* Header Photobooth */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-3 border-black">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#FF6B35] text-white text-xs font-black px-3 py-1 border-2 border-black rounded-lg shadow-retro-sm uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Zona E: Art Photobooth
              </span>
              <span className="bg-[#CCFF00] text-black text-xs font-bold px-2.5 py-1 border-2 border-black rounded-lg shadow-retro-sm">
                AI Powered Frames
              </span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-black">
              Kamera & Bingkai Tematik Seni Rupa
            </h2>
            <p className="text-neutral-600 text-xs sm:text-sm max-w-xl font-medium">
              Abadikan momen spesialmu di Pameran Seni Rupa Polibatam 2026. Pilih bingkai estetik AI, pasang filter warna, dan unduh kartu kenanganmu!
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isCameraActive && (
              <button
                onClick={toggleFacingMode}
                className="btn-retro-white text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5"
                title="Ganti kamera depan / belakang"
              >
                <RefreshCw className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">Balik Kamera</span>
              </button>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-retro-cyan text-xs sm:text-sm px-3.5 py-2 flex items-center gap-1.5"
              title="Unggah foto dari galeri/perangkat"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>Upload Foto</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Grid 2 Kolom: Viewfinder Kamera & Pengaturan Bingkai */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* ================= KOLOM KIRI: KAMERA / VIEWFINDER ================= */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Frame Viewfinder Box Persegi */}
            <div className="w-full max-w-md aspect-square bg-[#121212] border-3 border-black rounded-2xl shadow-retro relative overflow-hidden flex items-center justify-center group">
              
              {/* Flash Efek Putih */}
              {isFlashActive && (
                <div className="absolute inset-0 bg-white z-50 animate-pulse pointer-events-none transition-opacity duration-200" />
              )}

              {/* Countdown Timer Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <div className="w-24 h-24 rounded-full bg-[#FFE600] text-black border-4 border-black flex items-center justify-center font-display font-black text-5xl shadow-retro animate-bounce">
                    {countdown}
                  </div>
                  <p className="font-display font-black text-sm uppercase mt-4 text-[#FFE600] tracking-widest flex items-center gap-1">
                    <Smile className="w-4 h-4" /> Siap-siap Senyum!
                  </p>
                </div>
              )}

              {/* STATE 1: SUDAH MENGAMBIL FOTO (PREVIEW HASIL FOTO) */}
              {capturedImage ? (
                <div className="relative w-full h-full bg-[#FAF7EE] flex items-center justify-center overflow-hidden">
                  
                  {/* AI Frame Image Texture */}
                  {activeFrame.type === 'ai-image' && (
                    <div className="relative w-full h-full">
                      {/* Background AI Frame */}
                      <img
                        src={activeFrame.imageSrc}
                        alt={activeFrame.name}
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                      />
                      {/* User Captured Photo Inside Aperture */}
                      <div
                        className="absolute z-10 overflow-hidden bg-neutral-900 border-2 border-black/30 shadow-inner"
                        style={{
                          left: `${activeFrame.innerBounds.x * 100}%`,
                          top: `${activeFrame.innerBounds.y * 100}%`,
                          width: `${activeFrame.innerBounds.width * 100}%`,
                          height: `${activeFrame.innerBounds.height * 100}%`,
                          borderRadius: `${activeFrame.innerBounds.radius || 4}px`
                        }}
                      >
                        <img
                          src={capturedImage}
                          alt="Captured portrait"
                          className="w-full h-full object-cover"
                          style={{ filter: activeFilter.filterStyle }}
                        />
                      </div>

                      {/* Lingkaran Bulat Pop Art Berada Di Atas Foto Tanpa Terpotong & Tanpa Kotak-Kotak */}
                      {activeFrame.id === 'retro-popart' && (
                        <>
                          {/* Badge Kiri: SENI RUPA POLIBATAM */}
                          <div
                            className="absolute z-20 pointer-events-none select-none rounded-full overflow-hidden ring-2 ring-white shadow-md bg-white"
                            style={{
                              left: '10.35%',
                              top: '69.25%',
                              width: '23.6%',
                              height: '23.6%'
                            }}
                          >
                            <img
                              src={activeFrame.imageSrc}
                              alt="Seni Rupa Polibatam Badge"
                              className="absolute max-w-none pointer-events-none select-none"
                              style={{
                                width: '423.73%',
                                height: '423.73%',
                                left: '-43.86%',
                                top: '-293.43%'
                              }}
                            />
                          </div>

                          {/* Badge Kanan: ART SHOWCASE 2026 */}
                          <div
                            className="absolute z-20 pointer-events-none select-none rounded-full overflow-hidden ring-2 ring-white shadow-md bg-white"
                            style={{
                              left: '70.15%',
                              top: '71.05%',
                              width: '21.4%',
                              height: '21.4%'
                            }}
                          >
                            <img
                              src={activeFrame.imageSrc}
                              alt="Art Showcase Badge"
                              className="absolute max-w-none pointer-events-none select-none"
                              style={{
                                width: '467.29%',
                                height: '467.29%',
                                left: '-327.80%',
                                top: '-332.01%'
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Procedural VIP Ticket Frame Preview */}
                  {activeFrame.id === 'vip-pass' && (
                    <div className="w-full h-full p-4 bg-[#FAF7EE] flex flex-col justify-between relative bg-retro-dots">
                      <div className="bg-[#FFE600] border-2 border-black px-3 py-1 flex justify-between items-center text-[10px] font-black">
                        <span>★ SENI RUPA POLIBATAM</span>
                        <span className="font-mono">ART SHOWCASE 2026</span>
                      </div>
                      <div className="w-full aspect-square border-3 border-black bg-white overflow-hidden my-2">
                        <img
                          src={capturedImage}
                          alt="Captured portrait"
                          className="w-full h-full object-cover"
                          style={{ filter: activeFilter.filterStyle }}
                        />
                      </div>
                      <div className="bg-[#121212] text-white border-2 border-black p-2 flex justify-between items-center">
                        <div>
                          <p className="font-display font-black text-xs text-[#FFE600] truncate max-w-[180px]">
                            {visitorName.toUpperCase()}
                          </p>
                          <p className="text-[9px] text-neutral-400">Official Art Explorer</p>
                        </div>
                        <span className="font-mono text-[9px] bg-white text-black px-1.5 py-0.5 font-bold border border-black">
                          SR-VIP
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Procedural Graffiti Frame Preview */}
                  {activeFrame.id === 'graffiti-splash' && (
                    <div className="w-full h-full p-3 bg-[#121212] relative overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full border-3 border-black overflow-hidden relative">
                        <img
                          src={capturedImage}
                          alt="Captured portrait"
                          className="w-full h-full object-cover"
                          style={{ filter: activeFilter.filterStyle }}
                        />
                        <div className="absolute top-2 right-2 bg-[#FF3388] text-white text-[10px] font-black px-2 py-0.5 border-2 border-black rotate-6 shadow-retro-sm">
                          LIVE ART ★
                        </div>
                        <div className="absolute bottom-2 left-2 bg-[#00F0FF] text-black text-[10px] font-black px-2 py-0.5 border-2 border-black -rotate-3 shadow-retro-sm">
                          POLIBATAM 2026
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stiker Tambahan Preview */}
                  {selectedStickerId !== 'none' && (
                    <div className="absolute bottom-3 right-3 z-30 bg-[#FFE600] text-black text-[10px] font-black px-2.5 py-1 border-2 border-black rounded shadow-retro-sm -rotate-2">
                      {ART_STICKERS.find(s => s.id === selectedStickerId)?.label}
                    </div>
                  )}
                </div>
              ) : isCameraActive ? (
                /* STATE 2: KAMERA AKTIF DENGAN LIVE STREAM & LIVE FRAME */
                <div className="relative w-full h-full bg-[#FAF7EE] overflow-hidden flex items-center justify-center">
                  
                  {/* AI Frame Image Texture */}
                  {activeFrame.type === 'ai-image' && (
                    <div className="relative w-full h-full">
                      {/* Background AI Frame */}
                      <img
                        src={activeFrame.imageSrc}
                        alt={activeFrame.name}
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
                      />
                      {/* Live Video Feed Positioned Inside Aperture (100% Bright, No Shadows) */}
                      <div
                        className="absolute z-10 overflow-hidden bg-neutral-950 border-2 border-black/30 shadow-inner"
                        style={{
                          left: `${activeFrame.innerBounds.x * 100}%`,
                          top: `${activeFrame.innerBounds.y * 100}%`,
                          width: `${activeFrame.innerBounds.width * 100}%`,
                          height: `${activeFrame.innerBounds.height * 100}%`,
                          borderRadius: `${activeFrame.innerBounds.radius || 4}px`
                        }}
                      >
                        <video
                          ref={videoRef}
                          playsInline
                          muted
                          autoPlay
                          className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                          style={{ filter: activeFilter.filterStyle }}
                        />
                      </div>

                      {/* Lingkaran Bulat Pop Art Berada Di Atas Kamera Live Tanpa Terpotong & Tanpa Kotak-Kotak */}
                      {activeFrame.id === 'retro-popart' && (
                        <>
                          {/* Badge Kiri: SENI RUPA POLIBATAM */}
                          <div
                            className="absolute z-20 pointer-events-none select-none rounded-full overflow-hidden ring-2 ring-white shadow-md bg-white"
                            style={{
                              left: '10.35%',
                              top: '69.25%',
                              width: '23.6%',
                              height: '23.6%'
                            }}
                          >
                            <img
                              src={activeFrame.imageSrc}
                              alt="Seni Rupa Polibatam Badge"
                              className="absolute max-w-none pointer-events-none select-none"
                              style={{
                                width: '423.73%',
                                height: '423.73%',
                                left: '-43.86%',
                                top: '-293.43%'
                              }}
                            />
                          </div>

                          {/* Badge Kanan: ART SHOWCASE 2026 */}
                          <div
                            className="absolute z-20 pointer-events-none select-none rounded-full overflow-hidden ring-2 ring-white shadow-md bg-white"
                            style={{
                              left: '70.15%',
                              top: '71.05%',
                              width: '21.4%',
                              height: '21.4%'
                            }}
                          >
                            <img
                              src={activeFrame.imageSrc}
                              alt="Art Showcase Badge"
                              className="absolute max-w-none pointer-events-none select-none"
                              style={{
                                width: '467.29%',
                                height: '467.29%',
                                left: '-327.80%',
                                top: '-332.01%'
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Procedural VIP Ticket Live Preview */}
                  {activeFrame.id === 'vip-pass' && (
                    <div className="w-full h-full p-4 bg-[#FAF7EE] flex flex-col justify-between relative bg-retro-dots">
                      <div className="bg-[#FFE600] border-2 border-black px-3 py-1 flex justify-between items-center text-[10px] font-black">
                        <span>★ SENI RUPA POLIBATAM</span>
                        <span className="font-mono">ART SHOWCASE 2026</span>
                      </div>
                      <div className="w-full aspect-square border-3 border-black bg-neutral-950 overflow-hidden my-2 relative">
                        <video
                          ref={videoRef}
                          playsInline
                          muted
                          autoPlay
                          className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                          style={{ filter: activeFilter.filterStyle }}
                        />
                      </div>
                      <div className="bg-[#121212] text-white border-2 border-black p-2 flex justify-between items-center">
                        <div>
                          <p className="font-display font-black text-xs text-[#FFE600] truncate max-w-[180px]">
                            {(visitorName || 'Pengunjung').toUpperCase()}
                          </p>
                          <p className="text-[9px] text-neutral-400">Official Art Explorer</p>
                        </div>
                        <span className="font-mono text-[9px] bg-white text-black px-1.5 py-0.5 font-bold border border-black">
                          SR-VIP
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Procedural Graffiti Live Preview */}
                  {activeFrame.id === 'graffiti-splash' && (
                    <div className="w-full h-full p-3 bg-[#121212] relative overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full border-3 border-black overflow-hidden relative bg-neutral-950">
                        <video
                          ref={videoRef}
                          playsInline
                          muted
                          autoPlay
                          className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                          style={{ filter: activeFilter.filterStyle }}
                        />
                        <div className="absolute top-2 right-2 bg-[#FF3388] text-white text-[10px] font-black px-2 py-0.5 border-2 border-black rotate-6 shadow-retro-sm pointer-events-none z-20">
                          LIVE ART ★
                        </div>
                        <div className="absolute bottom-2 left-2 bg-[#00F0FF] text-black text-[10px] font-black px-2 py-0.5 border-2 border-black -rotate-3 shadow-retro-sm pointer-events-none z-20">
                          POLIBATAM 2026
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Indicators on Top */}
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/40 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="tracking-wide">LIVE CAM</span>
                  </div>

                  <button
                    onClick={() => setIsMirrored(prev => !prev)}
                    className="absolute top-3 right-3 z-30 bg-black/75 hover:bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/30 backdrop-blur-md transition-all active:scale-95 shadow-md"
                    title="Mirror / Balik Kaca"
                  >
                    {isMirrored ? '🪞 Mirror: On' : '📐 Mirror: Off'}
                  </button>
                </div>
              ) : (
                /* STATE 3: KAMERA BELUM DINYALAKAN (STANDBY) */
                <div className="p-6 text-center space-y-4 max-w-xs text-white z-10">
                  <div className="w-16 h-16 mx-auto bg-[#FFE600] text-black border-3 border-black rounded-2xl flex items-center justify-center shadow-retro">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg text-white">Kamera Photobooth</h3>
                    <p className="text-neutral-400 text-xs mt-1">
                      Klik tombol di bawah untuk menyalakan webcam atau upload foto selfie Anda.
                    </p>
                  </div>

                  {cameraError && (
                    <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-2.5 text-xs text-red-200">
                      {cameraError}
                    </div>
                  )}

                  <button
                    onClick={() => startCamera('user')}
                    className="btn-retro-yellow text-xs sm:text-sm px-5 py-2.5 w-full flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Nyalakan Kamera</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tombol Kontrol Bawah Viewfinder */}
            <div className="w-full max-w-md mt-4 flex flex-col gap-3">
              {capturedImage ? (
                /* ACTION BUTTONS SETELAH FOTO DITANGKAP */
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownload}
                      className="btn-retro-yellow text-sm sm:text-base py-3 px-4 flex items-center justify-center gap-2 active:scale-95 shadow-retro"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      <span className="font-black">Unduh Foto</span>
                    </button>
                    <button
                      onClick={handleRetake}
                      className="btn-retro-white text-sm sm:text-base py-3 px-4 flex items-center justify-center gap-2 active:scale-95 shadow-retro"
                    >
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                      <span className="font-black">Foto Ulang</span>
                    </button>
                  </div>

                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 border-2 border-black rounded-xl text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
                        <span className="text-green-700 font-black">Berhasil Disalin ke Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Gambar untuk WhatsApp / Medsos</span>
                      </>
                    )}
                  </button>
                </div>
              ) : isCameraActive ? (
                /* ACTION BUTTONS SAAT LIVE STREAM */
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 bg-neutral-100 border-2 border-black rounded-xl p-1.5 text-xs">
                    <span className="font-bold pl-2 text-neutral-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Timer:
                    </span>
                    <div className="flex gap-1">
                      {[
                        { val: 0, label: '0s' },
                        { val: 3, label: '3s' },
                        { val: 5, label: '5s' }
                      ].map(t => (
                        <button
                          key={t.val}
                          onClick={() => setTimerDuration(t.val)}
                          className={`px-3 py-1 rounded-lg font-black transition-all ${
                            timerDuration === t.val
                              ? 'bg-[#121212] text-white'
                              : 'bg-white text-black border border-black hover:bg-neutral-200'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTriggerCapture}
                      disabled={isCapturing}
                      className="btn-retro-pink flex-1 text-base sm:text-lg py-3 flex items-center justify-center gap-2 active:scale-95 shadow-retro"
                    >
                      <Camera className="w-5 h-5 stroke-[2.5]" />
                      <span className="font-black">
                        {isCapturing ? 'Memotret...' : 'Jepret Foto Sekarang!'}
                      </span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="p-3 bg-neutral-200 hover:bg-neutral-300 border-3 border-black rounded-xl"
                      title="Matikan Kamera"
                    >
                      <CameraOff className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

          </div>

          {/* ================= KOLOM KANAN: KUSTOMISASI BINGKAI & FILTER ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Section 1: Pemilihan Bingkai Seni Rupa */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-display font-black text-sm uppercase text-black flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#FF3388]" /> 1. Pilih Bingkai Tematik
                </label>
                <span className="text-[11px] font-bold text-neutral-500">
                  {ART_FRAMES.length} Pilihan Bingkai
                </span>
              </div>

              {/* Grid Kartu Bingkai */}
              <div className="grid grid-cols-2 gap-2.5">
                {ART_FRAMES.map((frame) => {
                  const isSelected = frame.id === selectedFrameId;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrameId(frame.id)}
                      className={`p-2.5 rounded-xl border-3 text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'border-black bg-[#FFE600]/20 shadow-retro-sm -translate-y-0.5'
                          : 'border-neutral-300 bg-white hover:border-black hover:bg-neutral-50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#121212] text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <div>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border border-black uppercase inline-block mb-1 ${frame.badgeColor}`}>
                          {frame.badge}
                        </span>
                        <p className="font-display font-black text-xs text-black leading-tight">
                          {frame.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-neutral-600 line-clamp-2 mt-1.5">
                        {frame.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Pemilihan Filter Warna Artistik */}
            <div className="space-y-3">
              <label className="font-display font-black text-sm uppercase text-black flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#00F0FF]" /> 2. Filter Suasana Warna
              </label>
              
              <div className="flex flex-wrap gap-2">
                {COLOR_FILTERS.map((filter) => {
                  const isSelected = filter.id === selectedFilterId;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilterId(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#121212] text-white border-black shadow-retro-sm -translate-y-0.5'
                          : 'bg-white text-black border-black hover:bg-neutral-100'
                      }`}
                    >
                      {isSelected && <Sparkles className="w-3 h-3 text-[#FFE600]" />}
                      <span>{filter.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Label Nama & Sticker Tambahan */}
            <div className="space-y-3 p-4 bg-[#FAF7EE] border-2 border-black rounded-2xl">
              <label className="font-display font-black text-xs uppercase text-black flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7B2CBF]" /> 3. Identitas & Stiker Pameran
              </label>

              <div className="space-y-2">
                <div>
                  <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                    Nama pada Kartu Foto:
                  </span>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    maxLength={30}
                    placeholder="Masukkan nama Anda..."
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                  />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                    Stiker Tambahan:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ART_STICKERS.map((stk) => (
                      <button
                        key={stk.id}
                        onClick={() => setSelectedStickerId(stk.id)}
                        className={`text-left px-2 py-1 rounded text-[11px] font-bold border transition-colors truncate ${
                          selectedStickerId === stk.id
                            ? 'bg-[#FFE600] text-black border-black'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                        }`}
                      >
                        {stk.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box Apresiasi */}
            <div className="bg-[#00F0FF]/10 border-2 border-[#00F0FF] rounded-2xl p-3.5 text-xs text-neutral-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black">
                <Sparkles className="w-4 h-4 text-[#FF3388]" />
                <span>Tips Foto Estetik:</span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Wajah Anda akan tampil jernih di dalam bingkai seni rupa. Setelah memotret, Anda bebas mengganti tema bingkai dan filter warna tanpa perlu mengulang jepretan!
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
