-- ==============================================================================
-- 🎨 SUPABASE STORAGE CONFIGURATION & RLS POLICIES (PRODUCTION READY)
-- ==============================================================================
-- Proyek: Student Organization - Seni Rupa (SenRup Showcase)
-- Target: Supabase Cloud PostgreSQL Storage Engine
--
-- CARA MENJALANKAN:
-- 1. Buka Dashboard Supabase Anda (https://supabase.com/dashboard)
-- 2. Pilih menu "SQL Editor" -> Klik "+ New Query"
-- 3. Paste seluruh isi script ini dan klik "Run" (Tombol Hijau)
-- ==============================================================================

-- 1. Buat Storage Bucket 'artworks' jika belum ada
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'artworks',
    'artworks',
    TRUE,
    2097152, -- Batas 2 MB (2 * 1024 * 1024 bytes)
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 2097152,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. (Catatan: storage.objects sudah memiliki RLS aktif secara default oleh Supabase)

-- 3. Hapus policy lama jika ada untuk mencegah konflik nama
DROP POLICY IF EXISTS "Public Access - Anyone can view artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload - Anyone can upload artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update - Anyone can update artwork images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete - Anyone can delete artwork images" ON storage.objects;

-- 4. Policy 1: PUBLIC READ (Siapa saja dapat melihat dan mengakses gambar pameran)
CREATE POLICY "Public Access - Anyone can view artwork images"
ON storage.objects FOR SELECT
USING (bucket_id = 'artworks');

-- 5. Policy 2: PUBLIC / AUTHENTICATED INSERT (Panitia & Admin dapat mengunggah gambar)
CREATE POLICY "Public Upload - Anyone can upload artwork images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artworks');

-- 6. Policy 3: PUBLIC / AUTHENTICATED UPDATE (Mengizinkan pembaruan metadata gambar)
CREATE POLICY "Public Update - Anyone can update artwork images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'artworks')
WITH CHECK (bucket_id = 'artworks');

-- 7. Policy 4: PUBLIC / AUTHENTICATED DELETE (Lifecycle cleanup & rollback saat karya dihapus)
CREATE POLICY "Public Delete - Anyone can delete artwork images"
ON storage.objects FOR DELETE
USING (bucket_id = 'artworks');

-- ==============================================================================
-- SELESAI: Bucket 'artworks' siap digunakan untuk penyimpanan foto serverless!
-- ==============================================================================
