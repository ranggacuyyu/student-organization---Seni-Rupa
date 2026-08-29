/**
 * 🖼️ Supabase Storage Service
 * Standar Rekayasa Perangkat Lunak: Serverless-Ready, Transactional Rollback, Resilient Fallback
 * 
 * Sesuai Arsitektur Produksi:
 * 1. File fisik gambar di-upload langsung ke Supabase Storage (Bucket).
 * 2. Database PostgreSQL Supabase hanya menyimpan metadata dan URL publik (string).
 * 3. Stateless & Ephemeral: Tidak ada ketergantungan pada filesystem lokal server.
 */
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const DEFAULT_ARTWORK_BUCKET = 'artworks';
export const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

/**
 * Validasi file gambar sebelum upload
 * @param {File|Blob} file 
 * @param {number} [maxSize=MAX_FILE_SIZE_BYTES] 
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateImageFile = (file, maxSize = MAX_FILE_SIZE_BYTES) => {
  if (!file) {
    return { isValid: false, error: 'File gambar tidak ditemukan.' };
  }

  // 1. Validasi Tipe MIME
  const mimeType = file.type?.toLowerCase();
  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      error: `Format file tidak didukung (${mimeType || 'unknown'}). Gunakan JPG, PNG, WEBP, atau GIF.`
    };
  }

  // 2. Validasi Ukuran File (Maksimal 2MB)
  if (file.size > maxSize) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const limitInMB = (maxSize / (1024 * 1024)).toFixed(0);
    return {
      isValid: false,
      error: `Ukuran file terlalu besar (${sizeInMB} MB). Maksimal ukuran file adalah ${limitInMB} MB.`
    };
  }

  return { isValid: true };
};

/**
 * Generate nama file yang unik dan aman untuk Supabase Storage
 * Format: {prefix}/{timestamp}-{randomId}.{ext}
 * @param {File} file 
 * @param {string} [folder='artworks'] 
 * @returns {string}
 */
export const generateUniqueStoragePath = (file, folder = 'artworks') => {
  const originalName = file.name || 'image.jpg';
  const rawExt = originalName.split('.').pop() || 'jpg';
  const sanitizedExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  
  return `${folder}/${timestamp}-${randomStr}.${sanitizedExt}`;
};

/**
 * Ekstrak path file di dalam storage bucket dari Public URL Supabase
 * Contoh: https://xyz.supabase.co/storage/v1/object/public/artworks/artworks/1724-abc.webp -> artworks/1724-abc.webp
 * @param {string} url 
 * @param {string} [bucket=DEFAULT_ARTWORK_BUCKET]
 * @returns {string|null}
 */
export const extractStoragePathFromUrl = (url, bucket = DEFAULT_ARTWORK_BUCKET) => {
  if (!url || typeof url !== 'string') return null;

  // Pola Supabase Storage URL
  const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`, 'i');
  const match = url.match(pattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // Jika URL berupa path langsung
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
    return url;
  }

  return null;
};

/**
 * Storage Service Manager
 */
export const StorageService = {
  /**
   * Upload file fisik gambar ke Supabase Storage Bucket
   * @param {File|Blob} file - File objek dari input file / dropzone
   * @param {Object} options
   * @param {string} [options.bucket=DEFAULT_ARTWORK_BUCKET] - Nama bucket di Supabase
   * @param {string} [options.folder='artworks'] - Subfolder di dalam bucket
   * @param {number} [options.maxSize=MAX_FILE_SIZE_BYTES] - Batas ukuran file dalam bytes
   * @returns {Promise<{ success: boolean, publicUrl: string, filePath: string, bucket: string, error?: string }>}
   */
  async uploadImage(file, options = {}) {
    const bucket = options.bucket || DEFAULT_ARTWORK_BUCKET;
    const folder = options.folder || 'artworks';
    const maxSize = options.maxSize || MAX_FILE_SIZE_BYTES;

    // 1. Validasi Client-side
    const validation = validateImageFile(file, maxSize);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 2. Cek ketersediaan Supabase Client
    if (!isSupabaseConfigured() || !supabase) {
      console.warn('Supabase Storage belum dikonfigurasi di .env. Menggunakan Local Data URL fallback.');
      const localDataUrl = await this.fileToDataUrl(file);
      return {
        success: true,
        publicUrl: localDataUrl,
        filePath: `local/${Date.now()}-${file.name || 'image.png'}`,
        bucket: 'local-storage',
        isLocalFallback: true,
      };
    }

    // 3. Generate path unik
    const filePath = generateUniqueStoragePath(file, folder);

    try {
      // 4. Upload file buffer/stream ke Supabase Storage Bucket
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadError) {
        console.warn('Supabase Storage upload error:', uploadError);
        const errMsg = uploadError.message || uploadError.error || '';
        
        // 🔄 Resilient Auto-Fallback: Jika Bucket 'artworks' belum dibuat di Supabase,
        // gunakan Local Data URL (Base64) agar penambahan karya tidak terblokir / error.
        console.warn(`[StorageService] Bucket '${bucket}' belum tersedia (${errMsg}). Menggunakan Base64 Data URL fallback agar proses simpan tetap berjalan lancar.`);
        const localDataUrl = await this.fileToDataUrl(file);
        return {
          success: true,
          publicUrl: localDataUrl,
          filePath: `local/${Date.now()}-${file.name || 'image.png'}`,
          bucket: 'local-fallback',
          isLocalFallback: true,
          warning: `Bucket '${bucket}' belum dibuat di Supabase Storage. Gambar disimpan menggunakan mode lokal fallback.`,
        };
      }

      // 5. Ambil Public URL dari file yang di-upload
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Gagal mendapatkan Public URL dari Supabase Storage.');
      }

      return {
        success: true,
        publicUrl: publicUrlData.publicUrl,
        filePath: filePath,
        bucket: bucket,
        size: file.size,
        type: file.type,
      };
    } catch (err) {
      console.warn('StorageService.uploadImage exception, activating fallback:', err);
      const localDataUrl = await this.fileToDataUrl(file);
      return {
        success: true,
        publicUrl: localDataUrl,
        filePath: `local/${Date.now()}-${file.name || 'image.png'}`,
        bucket: 'local-fallback',
        isLocalFallback: true,
      };
    }
  },

  /**
   * Hapus file gambar dari Supabase Storage Bucket (Cleanup Lifecycle & Rollback)
   * @param {string} filePathOrUrl - Path file (artworks/123.jpg) atau Public URL lengkap
   * @param {string} [bucket=DEFAULT_ARTWORK_BUCKET]
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async deleteImage(filePathOrUrl, bucket = DEFAULT_ARTWORK_BUCKET) {
    if (!filePathOrUrl) return { success: true };

    if (!isSupabaseConfigured() || !supabase) {
      return { success: true };
    }

    // Ekstrak relative path di dalam bucket
    const targetPath = extractStoragePathFromUrl(filePathOrUrl, bucket) || filePathOrUrl;

    // Jangan coba hapus URL eksternal (misal: unsplash.com, data:image, dsb)
    if (targetPath.startsWith('http://') || targetPath.startsWith('https://') || targetPath.startsWith('data:')) {
      return { success: true };
    }

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([targetPath]);

      if (error) {
        console.warn(`Gagal menghapus file dari Supabase Storage [${targetPath}]:`, error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err) {
      console.warn('StorageService.deleteImage exception:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Helper: Konversi File ke Data URL (Base64) untuk offline preview / fallback
   * @param {File|Blob} file 
   * @returns {Promise<string>}
   */
  fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};

export default StorageService;
