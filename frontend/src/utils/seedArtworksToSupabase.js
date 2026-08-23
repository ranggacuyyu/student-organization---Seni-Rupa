/**
 * 🎨 Supabase Artwork Seeder Utility
 * ====================================
 * Script untuk mengisi data dummy karya seni ke Supabase secara langsung
 * dari browser console atau admin panel.
 *
 * 📌 CARA PENGGUNAAN:
 *
 * === OPSI 1: Via Supabase Dashboard (SQL Editor) ===
 *   1. Buka https://supabase.com/dashboard/project/xqvooyjrejyzgczyijrg/sql
 *   2. Copy-paste isi file `database/seed_artworks_bulk.sql`
 *   3. Klik tombol "Run"
 *   4. Refresh halaman frontend (#katalog)
 *
 * === OPSI 2: Via Browser Console (JavaScript) ===
 *   1. Buka frontend di browser: http://localhost:5173
 *   2. Buka DevTools → Console (F12)
 *   3. Jalankan:
 *      import('/src/utils/seedArtworksToSupabase.js').then(m => m.seedArtworksToSupabase())
 *   4. Tunggu proses selesai, refresh halaman
 *
 * === OPSI 3: Via Tombol di Admin Panel ===
 *   Sudah terintegrasi di halaman Admin Dashboard → tab "Master Data"
 *   Klik tombol "🌱 Seed Dummy Artworks ke Supabase"
 */

import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { generateMockArtworks } from '../data/mockData';

/**
 * Seed semua data dummy artworks ke tabel `artworks` di Supabase
 * @param {Object} options
 * @param {boolean} options.clearExisting - Hapus data lama sebelum seed (default: false)
 * @param {Function} options.onProgress - Callback progress (current, total, message)
 * @returns {Promise<{success: boolean, inserted: number, errors: number, message: string}>}
 */
export async function seedArtworksToSupabase(options = {}) {
  const { clearExisting = false, onProgress = null } = options;

  // 1. Validasi koneksi Supabase
  if (!isSupabaseConfigured() || !supabase) {
    const msg = '❌ Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi di file .env';
    console.error(msg);
    return { success: false, inserted: 0, errors: 0, message: msg };
  }

  console.log('🎨 Memulai seed data dummy artworks ke Supabase...');
  onProgress?.(0, 0, 'Menghubungkan ke Supabase...');

  // 2. Opsional: Hapus data lama
  if (clearExisting) {
    console.log('🗑️ Menghapus data artworks lama...');
    onProgress?.(0, 0, 'Menghapus data lama...');

    try {
      await supabase.from('artwork_likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('artworks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      console.log('✅ Data lama berhasil dihapus.');
    } catch (err) {
      console.warn('⚠️ Gagal menghapus data lama:', err.message);
    }
  }

  // 3. Generate dummy data dari mockData generator
  const allArtworks = generateMockArtworks();
  const total = allArtworks.length;
  console.log(`📦 Total karya yang akan di-seed: ${total}`);
  onProgress?.(0, total, `Mempersiapkan ${total} karya...`);

  // 4. Transform ke format kolom Supabase
  const supabaseRows = allArtworks.map((art) => ({
    judul: art.title,
    slug: art.slug,
    seniman_nama: art.artist,
    seniman_nim: art.artistNim || '-',
    seniman_angkatan: art.artistBatch || '2024',
    kategori: art.category,
    deskripsi_filosofi: art.description,
    medium_bahan: art.medium,
    dimensi: art.dimensions,
    tahun_pembuatan: art.year || '2024',
    foto_utama_url: art.imageUrl,
    booth_name: art.boothName,
    is_highlighted: art.isHighlighted || false,
    likes_count: art.likesCount || 0,
    tags: art.tags || ['History', 'Retro Pop'],
  }));

  // 5. Batch insert (50 rows per batch untuk menghindari timeout)
  const BATCH_SIZE = 50;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < supabaseRows.length; i += BATCH_SIZE) {
    const batch = supabaseRows.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(supabaseRows.length / BATCH_SIZE);

    console.log(`📤 Mengirim batch ${batchNum}/${totalBatches} (${batch.length} karya)...`);
    onProgress?.(inserted, total, `Batch ${batchNum}/${totalBatches}...`);

    try {
      const { data, error } = await supabase
        .from('artworks')
        .upsert(batch, { onConflict: 'slug' })
        .select('id');

      if (error) {
        console.error(`❌ Error batch ${batchNum}:`, error.message);
        errors += batch.length;
      } else {
        const count = data?.length || batch.length;
        inserted += count;
        console.log(`✅ Batch ${batchNum}: ${count} karya berhasil.`);
      }
    } catch (err) {
      console.error(`❌ Exception batch ${batchNum}:`, err.message);
      errors += batch.length;
    }
  }

  // 6. Hasil akhir
  const resultMsg = `🎉 Selesai! ${inserted} karya berhasil di-seed, ${errors} gagal. Total: ${total}`;
  console.log(resultMsg);
  onProgress?.(inserted, total, resultMsg);

  return {
    success: errors === 0,
    inserted,
    errors,
    message: resultMsg,
  };
}

/**
 * Hitung jumlah karya yang sudah ada di Supabase
 * @returns {Promise<{total: number, byCategory: Object, byCreator: Object}>}
 */
export async function countSupabaseArtworks() {
  if (!isSupabaseConfigured() || !supabase) {
    return { total: 0, byCategory: {}, byCreator: {} };
  }

  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('id, kategori, seniman_nama');

    if (error || !data) return { total: 0, byCategory: {}, byCreator: {} };

    const byCategory = {};
    const byCreator = {};

    data.forEach((art) => {
      byCategory[art.kategori] = (byCategory[art.kategori] || 0) + 1;
      byCreator[art.seniman_nama] = (byCreator[art.seniman_nama] || 0) + 1;
    });

    return { total: data.length, byCategory, byCreator };
  } catch {
    return { total: 0, byCategory: {}, byCreator: {} };
  }
}

/**
 * Hapus SEMUA data artworks di Supabase (gunakan dengan hati-hati!)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function clearAllSupabaseArtworks() {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: 'Supabase belum dikonfigurasi.' };
  }

  try {
    await supabase.from('artwork_likes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('artworks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    return { success: true, message: '✅ Semua data artworks berhasil dihapus dari Supabase.' };
  } catch (err) {
    return { success: false, message: `❌ Gagal menghapus: ${err.message}` };
  }
}
