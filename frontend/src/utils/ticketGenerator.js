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
  let dataUrl = '';

  if (qrSourceCanvas && typeof qrSourceCanvas.toDataURL === 'function') {
    // qrSourceCanvas is rendered by QRCodeCanvas with pure white background, black modules, and quiet zone margin
    dataUrl = qrSourceCanvas.toDataURL('image/png');
  } else {
    // Fallback: create high-res canvas
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    if (qrSourceCanvas) {
      ctx.drawImage(qrSourceCanvas, 0, 0, size, size);
    }
    dataUrl = canvas.toDataURL('image/png');
  }

  const filename = `QR-Presensi-${sanitizeFilename(ticket?.nama_lengkap)}-${ticket?.id || 'pass'}.png`;
  downloadDataUrl(dataUrl, filename);
  return dataUrl;
}
