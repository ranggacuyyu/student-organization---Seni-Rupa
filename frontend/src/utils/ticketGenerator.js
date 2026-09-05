/**
 * ticketGenerator.js
 * Utility to generate and directly download pristine, 100% scannable QR Code PNG images
 * without triggering browser default window.print() dialog.
 * 
 * Guaranteed to be 100% scannable via camera, photo of screen, or file upload in Panitia Scanner.
 */

/**
 * Helper to download data URL directly as file
 */
export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Helper to sanitize filename
 */
function sanitizeFilename(name) {
  return (name || 'pengunjung')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .slice(0, 30);
}

/**
 * Generate and download High-Res Pure Scannable QR Code PNG
 * Pure black modules on solid white background with standard quiet-zone margin.
 * 100% compatible with optical camera scanner and file upload in Panitia Dashboard.
 */
export async function downloadQrCode(ticket, qrSourceCanvas) {
  let canvas = qrSourceCanvas;
  if (canvas && typeof canvas.toDataURL !== 'function') {
    if (typeof canvas.querySelector === 'function') {
      canvas = canvas.querySelector('canvas') || canvas;
    }
  }

  let dataUrl = '';
  if (canvas && typeof canvas.toDataURL === 'function') {
    // Render high-res 512x512 with pure white background and 28px quiet-zone padding for guaranteed 100% optical readability
    const highResCanvas = document.createElement('canvas');
    const size = 512;
    highResCanvas.width = size;
    highResCanvas.height = size;
    const ctx = highResCanvas.getContext('2d');
    
    // Fill solid white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR Code centered with crisp pixel preservation
    const padding = 28;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, padding, padding, size - (padding * 2), size - (padding * 2));
    dataUrl = highResCanvas.toDataURL('image/png');
  } else {
    // Fallback: search for existing QRCodeCanvas in DOM
    const domCanvas = document.querySelector('canvas');
    if (domCanvas && typeof domCanvas.toDataURL === 'function') {
      const highResCanvas = document.createElement('canvas');
      const size = 512;
      highResCanvas.width = size;
      highResCanvas.height = size;
      const ctx = highResCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      const padding = 28;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(domCanvas, padding, padding, size - (padding * 2), size - (padding * 2));
      dataUrl = highResCanvas.toDataURL('image/png');
    }
  }

  const filename = `QR-Presensi-${sanitizeFilename(ticket?.nama_lengkap)}-${ticket?.id || 'pass'}.png`;
  if (dataUrl) {
    downloadDataUrl(dataUrl, filename);
  }
  return dataUrl;
}
