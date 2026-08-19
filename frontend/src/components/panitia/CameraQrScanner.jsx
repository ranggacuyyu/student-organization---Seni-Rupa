import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';

/**
 * 📷 Live Device Camera QR Scanner
 * Menggunakan HTML5 Camera API & html5-qrcode
 * Mendukung kamera HP belakang (environment), depan, dan scan file gambar galeri
 */
export default function CameraQrScanner({ onScanSuccess, isScanningActive = true }) {
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState('');

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

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

  // Get available video devices
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Prefer back/rear camera on mobile
          const backCamera = devices.find((d) =>
            d.label.toLowerCase().includes('back') ||
            d.label.toLowerCase().includes('rear') ||
            d.label.toLowerCase().includes('environment')
          );
          setSelectedCameraId(backCamera ? backCamera.id : devices[0].id);
        }
      })
      .catch((err) => {
        console.warn('Could not enumerate cameras:', err);
      });

    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async (cameraIdToUse = selectedCameraId) => {
    setErrorMessage('');
    if (!scannerRef.current) return;

    try {
      if (html5QrCodeRef.current && isCameraRunning) {
        await stopCamera();
      }

      const html5QrCode = new Html5Qrcode('qr-reader-container');
      html5QrCodeRef.current = html5QrCode;

      const cameraConfig = cameraIdToUse
        ? { deviceId: { exact: cameraIdToUse } }
        : { facingMode: 'environment' };

      await html5QrCode.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Success callback
          playSuccessBeep();
          setLastScannedCode(decodedText);
          onScanSuccess && onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Scanning frame error (ignore continuous scan noise)
        }
      );

      setIsCameraRunning(true);

      // Check if torch/flashlight is supported
      try {
        const capabilities = html5QrCode.getRunningTrackCapabilities();
        if (capabilities && capabilities.torch) {
          setHasTorch(true);
        }
      } catch (e) {
        setHasTorch(false);
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      setIsCameraRunning(false);
      if (err.name === 'NotAllowedError' || String(err).includes('Permission')) {
        setErrorMessage('Izin akses kamera ditolak. Silakan berikan izin kamera pada browser Anda.');
      } else if (err.name === 'NotFoundError' || String(err).includes('No device')) {
        setErrorMessage('Tidak ada kamera yang terdeteksi pada perangkat ini.');
      } else {
        setErrorMessage(`Gagal membuka kamera: ${err.message || err}`);
      }
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (html5QrCodeRef.current && isCameraRunning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      } finally {
        setIsCameraRunning(false);
        setIsTorchOn(false);
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

  // Handle File / Image Upload Scan
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    setErrorMessage('');

    try {
      let qrCodeInstance = html5QrCodeRef.current;
      if (!qrCodeInstance) {
        qrCodeInstance = new Html5Qrcode('qr-reader-container');
        html5QrCodeRef.current = qrCodeInstance;
      }

      // If camera is running, stop it first before scanning file
      if (isCameraRunning) {
        await stopCamera();
      }

      const decodedText = await qrCodeInstance.scanFile(file, true);
      playSuccessBeep();
      setLastScannedCode(decodedText);
      onScanSuccess && onScanSuccess(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      setErrorMessage('QR Code tidak terdeteksi pada gambar yang diunggah. Pastikan foto QR jelas & tajam.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Viewfinder & Video Box */}
      <div className="relative aspect-square sm:aspect-4/3 bg-neutral-900 border-3 border-black rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center text-white shadow-retro">
        
        {/* HTML5 QR Code Video Target Container */}
        <div
          id="qr-reader-container"
          ref={scannerRef}
          className={`w-full h-full ${isCameraRunning ? 'block' : 'hidden'}`}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Standby Viewfinder when Camera is OFF */}
        {!isCameraRunning && (
          <div className="p-6 space-y-4 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-neutral-800 border-3 border-dashed border-[#00F0FF] rounded-3xl flex items-center justify-center shadow-retro-sm">
              <Camera className="w-10 h-10 text-[#00F0FF]" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-black text-lg text-white">
                Scanner Kamera Perangkat
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                Gunakan kamera HP atau laptop Anda untuk memindai QR Code tiket pengunjung secara langsung tanpa alat tambahan.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startCamera()}
              className="btn-retro-yellow text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2"
            >
              <Camera className="w-4 h-4 text-black" />
              <span>Buka Kamera Sekarang</span>
            </button>
          </div>
        )}

        {/* Scanning Laser Overlay when Camera is ON */}
        {isCameraRunning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Viewfinder Target Box */}
            <div className="relative w-56 h-56 border-2 border-dashed border-[#00F0FF] rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              {/* Laser Animation */}
              <div className="absolute left-0 right-0 h-1 bg-[#FF3388] shadow-[0_0_15px_#FF3388] animate-bounce" />
              {/* Retro Viewfinder Corners */}
              <div className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-4 border-l-4 border-[#FFE600]" />
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-4 border-r-4 border-[#FFE600]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-4 border-l-4 border-[#FFE600]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-4 border-r-4 border-[#FFE600]" />
            </div>
          </div>
        )}

        {/* Top Control Bar Overlay when Camera is ON */}
        {isCameraRunning && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
            <span className="bg-black/80 text-[#22C55E] border border-black text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
              KAMERA AKTIF
            </span>

            <div className="flex items-center gap-2">
              {hasTorch && (
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`p-2 rounded-xl border-2 border-black font-bold text-xs shadow-retro-sm transition-all ${
                    isTorchOn ? 'bg-[#FFE600] text-black' : 'bg-black/80 text-white'
                  }`}
                  title={isTorchOn ? 'Matikan Lampu Flash' : 'Nyalakan Lampu Flash'}
                >
                  {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>
              )}

              {cameras.length > 1 && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="p-2 bg-black/80 hover:bg-neutral-800 text-white border-2 border-black rounded-xl font-bold text-xs shadow-retro-sm"
                  title="Ganti Kamera (Depan / Belakang)"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={stopCamera}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white border-2 border-black rounded-xl font-bold text-xs shadow-retro-sm flex items-center gap-1"
              >
                <CameraOff className="w-3.5 h-3.5" />
                <span>Tutup</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error / Alert Message */}
      {errorMessage && (
        <div className="bg-red-100 border-2 border-red-500 text-red-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Camera & File Action Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {!isCameraRunning ? (
          <button
            type="button"
            onClick={() => startCamera()}
            className="flex-1 btn-retro-yellow text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>Aktifkan Scanner Kamera HP</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopCamera}
            className="flex-1 btn-retro-white text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 text-red-600"
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
          className="btn-retro-cyan text-xs sm:text-sm px-4 py-2.5 flex items-center gap-2"
          title="Scan dari foto QR di galeri / WhatsApp"
        >
          {isProcessingFile ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          <span>{isProcessingFile ? 'Memindai...' : 'Scan dari Foto / Galeri'}</span>
        </button>
      </div>

      {lastScannedCode && (
        <div className="bg-green-50 border-2 border-green-500 text-green-900 p-2.5 rounded-xl text-xs flex items-center justify-between">
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
