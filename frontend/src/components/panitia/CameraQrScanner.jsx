import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  CameraOff, 
  SwitchCamera, 
  Upload, 
  Zap, 
  ZapOff, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Loader2,
  Video,
  Settings2,
  Info
} from 'lucide-react';

/**
 * 📷 Live Device Camera QR Scanner (High Reliability & Multi-device Support)
 * Menggunakan HTML5 Camera API & html5-qrcode
 * Mendukung kamera HP belakang (environment), depan (user), webcam PC/Laptop,
 * serta multi-pass scan untuk file foto dari galeri.
 */
export default function CameraQrScanner({ onScanSuccess, isScanningActive = true }) {
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [isInsecureHttp, setIsInsecureHttp] = useState(false);

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMountedRef = useRef(true);

  // Check Secure Context on mount
  useEffect(() => {
    isMountedRef.current = true;
    const isLocalhost = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '::1';
    
    if (!window.isSecureContext && !isLocalhost) {
      setIsInsecureHttp(true);
    }

    // Try enumerating cameras if supported
    if (navigator.mediaDevices && typeof navigator.mediaDevices.enumerateDevices === 'function') {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (!isMountedRef.current) return;
          if (devices && devices.length > 0) {
            setCameras(devices);
            const backCamera = devices.find((d) =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear') ||
              d.label.toLowerCase().includes('environment')
            );
            setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
          }
        })
        .catch((err) => {
          console.warn('Initial camera enumeration notice:', err);
        });
    }

    return () => {
      isMountedRef.current = false;
      stopCamera();
    };
  }, []);

  // Synthesize pleasant retro success beep with Web Audio API
  const playSuccessBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // AudioContext might be restricted until user gesture, safe to ignore
    }
  };

  // Safe camera stopper
  const stopCamera = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      } finally {
        html5QrCodeRef.current = null;
        if (isMountedRef.current) {
          setIsCameraRunning(false);
          setIsStarting(false);
          setIsTorchOn(false);
        }
      }
    } else if (isMountedRef.current) {
      setIsCameraRunning(false);
      setIsStarting(false);
    }
  }, []);

  // Start Camera with Intelligent Fallback Cascade
  const startCamera = async (cameraIdToUse = selectedCameraId) => {
    setErrorMessage('');
    setIsStarting(true);

    // 1. Check browser mediaDevices support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsStarting(false);
      if (isInsecureHttp) {
        setErrorMessage(
          'Browser memblokir akses kamera pada koneksi HTTP biasa. Gunakan HTTPS, akses via http://localhost:5173, atau gunakan tombol "Scan dari Foto / Galeri" di bawah.'
        );
      } else {
        setErrorMessage('Browser atau perangkat ini tidak mendukung akses kamera (MediaDevices API).');
      }
      return;
    }

    try {
      // Ensure previous session is fully cleaned up
      if (html5QrCodeRef.current) {
        await stopCamera();
      }

      // Re-verify DOM element is available
      const containerEl = document.getElementById('qr-reader-container');
      if (!containerEl) {
        throw new Error('Elemen kamera tidak ditemukan di halaman.');
      }

      const html5QrCode = new Html5Qrcode('qr-reader-container', {
        verbose: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      });
      html5QrCodeRef.current = html5QrCode;

      const scanConfig = {
        fps: 15,
        qrbox: (viewfinderWidth, viewfinderHeight) => {
          const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
          const size = Math.floor(minEdge * 0.72);
          return {
            width: Math.max(140, Math.min(size, 280)),
            height: Math.max(140, Math.min(size, 280)),
          };
        },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      const handleScanSuccess = (decodedText) => {
        playSuccessBeep();
        if (isMountedRef.current) {
          setLastScannedCode(decodedText);
        }
        if (onScanSuccess) {
          onScanSuccess(decodedText);
        }
      };

      const handleScanError = () => {
        // Scanning frame noise, ignore
      };

      // Cascade strategies for best cross-platform compatibility:
      // Strategy 1: Specific camera ID (if chosen)
      // Strategy 2: Rear / environment camera (ideal for mobile phone scanning)
      // Strategy 3: Front / user camera (fallback for laptops / single-cam PCs)
      // Strategy 4: Any available video device constraint
      let startSuccess = false;

      // Strategy 1: User specified camera ID
      if (cameraIdToUse) {
        try {
          await html5QrCode.start(
            cameraIdToUse,
            scanConfig,
            handleScanSuccess,
            handleScanError
          );
          startSuccess = true;
        } catch (e1) {
          console.warn('Direct cameraId start failed, attempting facingMode: environment fallback...', e1);
        }
      }

      // Strategy 2: Environment / Rear camera
      if (!startSuccess) {
        try {
          await html5QrCode.start(
            { facingMode: 'environment' },
            scanConfig,
            handleScanSuccess,
            handleScanError
          );
          startSuccess = true;
        } catch (e2) {
          console.warn('facingMode environment start failed, attempting facingMode: user fallback...', e2);
        }
      }

      // Strategy 3: User / Front camera (laptops / webcams)
      if (!startSuccess) {
        try {
          await html5QrCode.start(
            { facingMode: 'user' },
            scanConfig,
            handleScanSuccess,
            handleScanError
          );
          startSuccess = true;
        } catch (e3) {
          console.warn('facingMode user start failed, attempting default device fallback...', e3);
        }
      }

      // Strategy 4: Default video stream fallback
      if (!startSuccess) {
        await html5QrCode.start(
          {},
          scanConfig,
          handleScanSuccess,
          handleScanError
        );
        startSuccess = true;
      }

      if (isMountedRef.current) {
        setIsCameraRunning(true);
        setIsStarting(false);

        // Check Torch capability
        try {
          const capabilities = html5QrCode.getRunningTrackCapabilities();
          if (capabilities && capabilities.torch) {
            setHasTorch(true);
          } else {
            setHasTorch(false);
          }
        } catch (e) {
          setHasTorch(false);
        }

        // Refresh camera device list now that permissions are guaranteed
        Html5Qrcode.getCameras()
          .then((devices) => {
            if (isMountedRef.current && devices && devices.length > 0) {
              setCameras(devices);
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error('All camera start attempts failed:', err);
      if (isMountedRef.current) {
        setIsCameraRunning(false);
        setIsStarting(false);

        const errorStr = String(err).toLowerCase();
        if (err.name === 'NotAllowedError' || errorStr.includes('permission')) {
          setErrorMessage('Izin kamera ditolak. Silakan klik ikon gembok/kamera di address bar browser Anda dan pilih "Allow / Izinkan".');
        } else if (err.name === 'NotFoundError' || errorStr.includes('notfound') || errorStr.includes('device')) {
          setErrorMessage('Tidak ada kamera yang ditemukan pada perangkat ini. Anda dapat menggunakan opsi "Scan dari Foto / Galeri".');
        } else if (err.name === 'NotReadableError' || errorStr.includes('already in use') || errorStr.includes('busy')) {
          setErrorMessage('Kamera sedang digunakan oleh aplikasi lain (seperti Zoom/Meet). Tutup aplikasi tersebut lalu coba lagi.');
        } else if (isInsecureHttp) {
          setErrorMessage('Kamera gagal terbuka karena browser membatasi WebRTC di jaringan HTTP. Silakan gunakan opsi "Scan dari Foto / Galeri".');
        } else {
          setErrorMessage(`Gagal membuka kamera: ${err.message || err}. Silakan gunakan opsi "Scan dari Foto / Galeri".`);
        }
      }
    }
  };

  // Toggle Torch (Flashlight)
  const toggleTorch = async () => {
    if (!html5QrCodeRef.current || !isCameraRunning || !hasTorch) return;
    try {
      const nextState = !isTorchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsTorchOn(nextState);
    } catch (e) {
      console.warn('Torch toggle failed:', e);
    }
  };

  // Handle Switch Camera
  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamera = cameras[nextIndex];
    setSelectedCameraId(nextCamera.id);
    if (isCameraRunning) {
      await startCamera(nextCamera.id);
    }
  };

  // Helper to process uploaded image for multi-pass QR scanning
  const processImageToBlob = (file, { scale = 1, cropCenter = false } = {}) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (cropCenter) {
          sx = img.width * 0.12;
          sy = img.height * 0.12;
          sw = img.width * 0.76;
          sh = img.height * 0.76;
        }
        let targetW = Math.min(900, Math.round(sw * scale));
        let targetH = Math.round((sh / sw) * targetW);
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], 'processed.png', { type: 'image/png' }));
          else reject(new Error('Canvas blob conversion failed'));
        }, 'image/png');
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Handle File / Image Upload Scan (Multi-Pass Robust Decoding)
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    setErrorMessage('');

    try {
      if (isCameraRunning) {
        await stopCamera();
      }

      let qrCodeInstance = html5QrCodeRef.current;
      if (!qrCodeInstance) {
        qrCodeInstance = new Html5Qrcode('qr-reader-container', { verbose: false });
        html5QrCodeRef.current = qrCodeInstance;
      }

      let decodedText = null;

      // Pass 1: Direct in-memory scan
      try {
        decodedText = await qrCodeInstance.scanFile(file, false);
      } catch (err1) {
        console.warn('Scan pass 1 failed, trying optimized pass 2...');
      }

      // Pass 2: Rescaled standard resolution (for high-DPI camera photos)
      if (!decodedText) {
        try {
          const processedFile = await processImageToBlob(file, { scale: 1, cropCenter: false });
          decodedText = await qrCodeInstance.scanFile(processedFile, false);
        } catch (err2) {
          console.warn('Scan pass 2 failed, trying center crop pass 3...');
        }
      }

      // Pass 3: Center crop (for photo of screen/paper)
      if (!decodedText) {
        try {
          const croppedFile = await processImageToBlob(file, { scale: 1, cropCenter: true });
          decodedText = await qrCodeInstance.scanFile(croppedFile, false);
        } catch (err3) {
          console.warn('Scan pass 3 failed:', err3);
        }
      }

      if (decodedText) {
        playSuccessBeep();
        setLastScannedCode(decodedText);
        if (onScanSuccess) {
          onScanSuccess(decodedText);
        }
      } else {
        setErrorMessage('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan foto QR cukup terang dan tidak buram.');
      }
    } catch (err) {
      console.error('File scan error:', err);
      setErrorMessage('Gagal membaca file gambar. Pastikan format file PNG atau JPG yang valid.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Custom Styles for Embedded Video Element */}
      <style>{`
        #qr-reader-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 1rem;
        }
        #qr-reader-container {
          border: none !important;
        }
        #qr-reader-container img[alt="Info icon"],
        #qr-reader-container > div:not([id*="scan_region"]):not([id*="video"]) {
          display: none !important;
        }
      `}</style>

      {/* Viewfinder & Video Box Container */}
      <div className="relative aspect-square sm:aspect-4/3 bg-neutral-900 border-3 border-black rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center text-white shadow-retro">
        
        {/* HTML5 QR Code Video Target Container - ALWAYS in DOM to prevent 0x0 size errors */}
        <div
          id="qr-reader-container"
          ref={scannerRef}
          className={`w-full h-full absolute inset-0 transition-opacity duration-300 ${
            isCameraRunning ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Standby Viewfinder when Camera is OFF */}
        {!isCameraRunning && !isStarting && (
          <div className="relative z-20 p-6 space-y-4 flex flex-col items-center justify-center w-full max-w-sm">
            <div className="w-20 h-20 bg-neutral-800 border-3 border-dashed border-[#00F0FF] rounded-3xl flex items-center justify-center shadow-retro-sm transition-transform hover:scale-105">
              <Camera className="w-10 h-10 text-[#00F0FF]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-lg text-white">
                Scanner Kamera Perangkat
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Gunakan kamera HP, laptop, atau webcam untuk memindai tiket pengunjung secara langsung.
              </p>
            </div>

            <div className="flex flex-col w-full gap-2 pt-1">
              <button
                type="button"
                onClick={() => startCamera()}
                className="btn-retro-yellow text-xs sm:text-sm py-2.5 px-5 flex items-center justify-center gap-2 shadow-retro hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Camera className="w-4 h-4 text-black" />
                <span>Buka Kamera Sekarang</span>
              </button>

              {cameras.length > 1 && (
                <div className="flex items-center gap-2 bg-neutral-800/80 px-3 py-1.5 rounded-xl border border-neutral-700 text-left">
                  <Video className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <select
                    value={selectedCameraId}
                    onChange={(e) => {
                      setSelectedCameraId(e.target.value);
                    }}
                    className="bg-transparent text-xs text-white focus:outline-none w-full cursor-pointer truncate"
                  >
                    {cameras.map((c, idx) => (
                      <option key={c.id || idx} value={c.id} className="bg-neutral-900 text-white">
                        {c.label || `Kamera ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner when Camera is Starting */}
        {isStarting && (
          <div className="relative z-20 p-6 flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 bg-[#FFE600] rounded-2xl border-3 border-black flex items-center justify-center shadow-retro animate-bounce">
              <Loader2 className="w-7 h-7 text-black animate-spin" />
            </div>
            <div className="space-y-1 text-center">
              <p className="font-display font-black text-sm text-white">
                Mempersiapkan Kamera...
              </p>
              <p className="text-[11px] text-neutral-400 max-w-xs">
                Izinkan akses kamera jika browser Anda memunculkan pop-up izin.
              </p>
            </div>
          </div>
        )}

        {/* Scanning Laser Overlay when Camera is ON */}
        {isCameraRunning && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {/* Viewfinder Target Box */}
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 border-2 border-dashed border-[#00F0FF] rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.45)]">
              {/* Laser Animation */}
              <div className="absolute left-0 right-0 h-1 bg-[#FF3388] shadow-[0_0_15px_#FF3388] animate-bounce" />
              {/* Retro Viewfinder Corners */}
              <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-[#FFE600]" />
              <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-[#FFE600]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-[#FFE600]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-[#FFE600]" />
            </div>
          </div>
        )}

        {/* Top Control Bar Overlay when Camera is ON */}
        {isCameraRunning && (
          <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between z-30 pointer-events-auto">
            <span className="bg-black/85 text-[#22C55E] border-2 border-black text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-retro-sm">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22C55E] animate-ping" />
              KAMERA AKTIF
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`p-1.5 sm:p-2 rounded-xl border-2 border-black font-bold text-xs shadow-retro-sm transition-all ${
                    isTorchOn ? 'bg-[#FFE600] text-black' : 'bg-black/80 text-white hover:bg-neutral-800'
                  }`}
                  title={isTorchOn ? 'Matikan Lampu Flash' : 'Nyalakan Lampu Flash'}
                >
                  {isTorchOn ? <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ZapOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              )}

              {cameras.length > 1 && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-1.5 sm:p-2 bg-black/80 hover:bg-neutral-800 text-white border-2 border-black rounded-xl font-bold text-xs shadow-retro-sm transition-transform active:scale-95"
                  title="Ganti Kamera (Depan / Belakang)"
                >
                  <SwitchCamera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={stopCamera}
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-xl font-bold text-xs shadow-retro-sm flex items-center gap-1 transition-transform active:scale-95"
              >
                <CameraOff className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Tutup</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error / Alert Message */}
      {errorMessage && (
        <div className="bg-red-50 border-2 border-red-500 text-red-900 p-3 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <p>{errorMessage}</p>
            <p className="text-[11px] text-red-700 font-normal">
              Tips: Anda juga dapat menggunakan tombol <strong>"Scan dari Foto / Galeri"</strong> di bawah untuk memindai tangkapan layar tiket secara instan.
            </p>
          </div>
        </div>
      )}

      {/* Insecure Context Warning Notice */}
      {isInsecureHttp && !errorMessage && (
        <div className="bg-amber-50 border-2 border-amber-400 text-amber-900 p-2.5 rounded-xl text-[11px] flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Membuka dari HP via IP lokal? Jika browser memblokir kamera di HTTP, gunakan tombol <strong>Scan dari Foto</strong> di bawah.
          </span>
        </div>
      )}

      {/* Camera & File Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {!isCameraRunning ? (
          <button
            type="button"
            onClick={() => startCamera()}
            disabled={isStarting}
            className="flex-1 btn-retro-yellow text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isStarting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            <span>{isStarting ? 'Membuka Kamera...' : 'Aktifkan Scanner Kamera HP'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="flex-1 btn-retro-white text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 text-red-600 active:scale-95 font-bold"
          >
            <CameraOff className="w-4 h-4" />
            <span>Matikan Kamera</span>
          </button>
        )}

        {/* Upload File / Screenshot QR Fallback */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          disabled={isProcessingFile}
          className="btn-retro-cyan text-xs sm:text-sm px-4 py-2.5 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          title="Scan dari foto QR di galeri / WhatsApp / screenshot"
        >
          {isProcessingFile ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{isProcessingFile ? 'Memindai Gambar...' : 'Scan dari Foto / Galeri'}</span>
        </button>
      </div>

      {lastScannedCode && (
        <div className="bg-green-50 border-2 border-green-500 text-green-900 p-2.5 rounded-xl text-xs flex items-center justify-between shadow-retro-sm">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            QR Terdeteksi: <strong className="font-mono">{lastScannedCode}</strong>
          </span>
          <span className="text-[10px] bg-green-200 px-2 py-0.5 rounded font-black text-green-800 uppercase">
            Terverifikasi
          </span>
        </div>
      )}
    </div>
  );
}
