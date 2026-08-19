import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  ShieldCheck, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Palette, 
  Lock, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { AuthService } from '../../services/api';
import senrupLogo from '../../assets/SENRUP.png';

export default function LoginPage({ onLoginSuccess, onNavigateHome }) {
  const cardRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.9, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.6)' }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(username, password);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(result.message || 'Username atau password salah.');
      }
    }, 400);
  };

  // Quick Demo Login Helper
  const handleQuickLogin = (demoUsername, demoPassword) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(demoUsername, demoPassword);
      setIsLoading(false);
      if (result.success) {
        onLoginSuccess(result.user);
      }
    }, 300);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-retro-dots">
      <div 
        ref={cardRef}
        className="w-full max-w-md bg-white border-3 border-black rounded-3xl shadow-retro-xl overflow-hidden"
      >
        {/* Header Ribbon */}
        <div className="bg-[#FFE600] border-b-3 border-black p-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#FF3388] text-white border-2 border-black text-xs font-black px-3 py-0.5 rounded-lg mb-2 shadow-retro-sm">
            <Lock className="w-3.5 h-3.5" /> PORTAL PETUGAS
          </div>
          <div className="flex items-center justify-center gap-3">
            <img src={senrupLogo} alt="Logo" className="w-10 h-10 object-contain drop-shadow" />
            <h1 className="font-display font-black text-2xl text-black">
              ART SHOWCASE
            </h1>
          </div>
          <p className="text-xs font-semibold text-neutral-800 mt-1">
            Portal Akses Khusus Panitia & Super Admin
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {errorMessage && (
            <div className="bg-[#FF3388]/10 border-2 border-[#FF3388] text-[#FF3388] p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Username Petugas
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: admin_senrup / panitia_registrasi"
                  required
                  className="input-retro pl-10 text-sm bg-[#FAF7EE]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  required
                  className="input-retro pl-10 pr-10 text-sm bg-[#FAF7EE]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-black p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-retro-pink py-3 text-sm flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t-2 border-dashed border-neutral-300 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-neutral-600 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FF3388]" />
              <span>Login Cepat untuk Pengujian (1-Klik):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin_senrup', 'admin123')}
                className="p-2.5 bg-[#FF3388]/10 hover:bg-[#FF3388]/20 border-2 border-black rounded-xl text-left transition-all active:scale-95 group shadow-retro-sm"
              >
                <div className="flex items-center justify-between text-xs font-black text-black">
                  <span>👑 Super Admin</span>
                  <span className="text-[10px] bg-black text-[#FFE600] px-1.5 rounded">Rangga</span>
                </div>
                <span className="text-[10px] text-neutral-600 block mt-0.5">Kelola Akun & Master Data</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('panitia_registrasi', 'panitia123')}
                className="p-2.5 bg-[#FFE600]/20 hover:bg-[#FFE600]/30 border-2 border-black rounded-xl text-left transition-all active:scale-95 group shadow-retro-sm"
              >
                <div className="flex items-center justify-between text-xs font-black text-black">
                  <span>📷 Panitia QR</span>
                  <span className="text-[10px] bg-black text-[#FFE600] px-1.5 rounded">Samuel</span>
                </div>
                <span className="text-[10px] text-neutral-600 block mt-0.5">Scan QR & Kebutuhan Peserta</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('panitia_acara', 'panitia123')}
                className="p-2.5 bg-[#00F0FF]/20 hover:bg-[#00F0FF]/30 border-2 border-black rounded-xl text-left transition-all active:scale-95 group shadow-retro-sm"
              >
                <div className="flex items-center justify-between text-xs font-black text-black">
                  <span>🎭 Panitia Acara</span>
                  <span className="text-[10px] bg-black text-[#00F0FF] px-1.5 rounded">Aiko</span>
                </div>
                <span className="text-[10px] text-neutral-600 block mt-0.5">Rundown & Monitoring</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('panitia_souvenir', 'panitia123')}
                className="p-2.5 bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border-2 border-black rounded-xl text-left transition-all active:scale-95 group shadow-retro-sm"
              >
                <div className="flex items-center justify-between text-xs font-black text-black">
                  <span>🎁 Panitia Suvenir</span>
                  <span className="text-[10px] bg-black text-[#22C55E] px-1.5 rounded">Yurila</span>
                </div>
                <span className="text-[10px] text-neutral-600 block mt-0.5">Klaim Suvenir Photobooth</span>
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Pengunjung Pameran</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
