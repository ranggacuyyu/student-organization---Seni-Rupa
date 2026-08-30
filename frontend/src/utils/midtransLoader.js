/**
 * 🎨 Midtrans Snap Dynamic Script Loader
 * Memuat Midtrans Snap SDK secara aman dan asinkron tanpa membebani initial page load.
 */

const MIDTRANS_SNAP_SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/snap.js';
const MIDTRANS_SNAP_PRODUCTION_URL = 'https://app.midtrans.com/snap/snap.js';

let snapPromise = null;

export const loadMidtransSnap = (clientKey, isProduction = false) => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  // Jika snap sudah tersedia di window global
  if (window.snap && window.snap.pay) {
    return Promise.resolve(window.snap);
  }

  if (snapPromise) {
    return snapPromise;
  }

  snapPromise = new Promise((resolve, reject) => {
    const snapUrl = isProduction ? MIDTRANS_SNAP_PRODUCTION_URL : MIDTRANS_SNAP_SANDBOX_URL;
    const existingScript = document.querySelector(`script[src*="midtrans.com/snap/snap.js"]`);

    if (existingScript) {
      existingScript.onload = () => resolve(window.snap);
      existingScript.onerror = (err) => reject(err);
      return;
    }

    const script = document.createElement('script');
    script.src = snapUrl;
    script.type = 'text/javascript';
    if (clientKey) {
      script.setAttribute('data-client-key', clientKey);
    }
    script.async = true;

    script.onload = () => {
      if (window.snap) {
        resolve(window.snap);
      } else {
        reject(new Error('Midtrans Snap SDK loaded but window.snap not found.'));
      }
    };

    script.onerror = (err) => {
      console.error('Gagal memuat Midtrans Snap SDK:', err);
      snapPromise = null;
      reject(new Error('Gagal memuat Midtrans Payment Gateway script. Periksa koneksi internet Anda.'));
    };

    document.head.appendChild(script);
  });

  return snapPromise;
};
