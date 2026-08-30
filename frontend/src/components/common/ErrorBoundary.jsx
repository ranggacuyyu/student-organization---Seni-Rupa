import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.removeItem('senrup_active_tab');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF7EE] flex items-center justify-center p-4">
          <div className="bg-white border-3 border-black rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-4 shadow-retro-xl">
            <div className="w-16 h-16 bg-[#FFE600] border-3 border-black rounded-2xl mx-auto flex items-center justify-center shadow-retro-sm">
              <AlertTriangle className="w-8 h-8 text-black" />
            </div>

            <div>
              <span className="bg-[#FF3388] text-white text-[10px] font-black px-3 py-1 rounded-full border border-black uppercase tracking-wider">
                Pemulihan Sistem
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-black mt-2">
                Terjadi Kendala Memuat Halaman
              </h2>
              <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
                Sistem mendeteksi galat sesi peramban. Klik tombol di bawah untuk memuat ulang dan membersihkan sesi.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-neutral-100 border-2 border-black rounded-xl p-3 text-left overflow-auto max-h-32 text-[11px] font-mono text-neutral-800">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-retro-yellow py-2.5 px-4 text-xs font-display font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Muat Ulang Halaman</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="btn-retro-white py-2.5 px-4 text-xs font-display font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
