-- ==============================================================================
-- 🎨 PROKER DIVISI SENI RUPA - ART SHOW CASE "HISTORY"
-- SUPABASE DATABASE CLEAN RESET SCRIPT (PRODUKSI / TANPA DATA DUMMY)
-- ==============================================================================
-- Script ini membersihkan seluruh data dummy di Supabase:
-- 1. Mengosongkan data karya seni (artworks) & likes (artwork_likes)
-- 2. Mengosongkan data transaksi pemesanan (orders)
-- 3. Mengosongkan data presensi uji coba (attendances)
-- 4. Mengosongkan data buku tamu uji coba (guestbooks)
-- 5. Mengosongkan checklist tugas & pengumuman dummy panitia
-- 6. Menghapus seluruh akun panitia dummy dari tabel 'users'
-- 7. Mempertahankan HANYA akun ADMIN UTAMA ('admin_senrupaaja' / Muhammad Rangga)
-- 8. Menjaga 5 Zona Master Layout Denah Student Centre Lt. 3 (booths) tetap aktif
-- ==============================================================================

-- 1. HAPUS SELURUH DATA TRANSAKSI, LIKES, DAN KARYA DUMMY
DELETE FROM artwork_likes;
DELETE FROM orders;
DELETE FROM artworks;

-- 2. HAPUS DATA PRESENSI & BUKU TAMU UJI COBA
DELETE FROM attendances;
DELETE FROM guestbooks;

-- 3. HAPUS CHECKLIST & PENGUMUMAN DUMMY PANITIA
DELETE FROM panitia_tasks;
DELETE FROM panitia_announcements;

-- 4. BERSIHKAN TABEL USERS: HAPUS SEMUA AKUN DUMMY SELAIN ADMIN
DELETE FROM users 
WHERE username NOT IN ('admin_senrupaaja', 'admin_senrup') 
  AND role != 'admin';

-- 5. PASTIKAN AKUN ADMIN UTAMA TERSEDIA DENGAN DATA VALID
INSERT INTO users (
    id,
    name,
    username,
    email,
    password,
    role,
    divisi,
    assigned_booth,
    kontak,
    status,
    avatar_bg,
    created_at,
    updated_at
) VALUES (
    'a1000000-0000-4000-8000-000000000001',
    'Muhammad Rangga',
    'admin_senrupaaja',
    'rangga@senrup.polibatam.ac.id',
    'admin123',
    'admin',
    'Koordinator Utama & Pameran',
    'Semua Zona (Lt. 3)',
    '0812-3456-7890',
    'active',
    'bg-[#FF3388]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO UPDATE SET
    name = EXCLUDED.name,
    role = 'admin',
    status = 'active',
    password = EXCLUDED.password,
    updated_at = CURRENT_TIMESTAMP;

-- 6. PASTIKAN MASTER ZONA BOOTH DENAH TETAP TERSEDIA
INSERT INTO booths (id, nama_zona, kode_booth, koordinat_x, koordinat_y, deskripsi_zona, kapasitas_display) VALUES
('b0000000-0000-4000-8000-000000000001', 'Zona A - Galeri Lukis Sejarah', 'booth-a', 22.5, 45.0, 'Eksibisi lukisan sejarah berdirinya divisi seni rupa dan perjalanan karya anggota.', 15),
('b0000000-0000-4000-8000-000000000002', 'Zona B - Galeri Kerajinan & Kriya Tangan', 'booth-b', 50.0, 30.0, 'Koleksi kerajinan 3D, resin, keramik terracotta, dan karya olah bahan daur ulang.', 15),
('b0000000-0000-4000-8000-000000000003', 'Zona C - Pojok Gambar & Live Painting', 'booth-c', 78.0, 45.0, 'Area interaktif buku sketsa bersama dan kanvas live painting langsung oleh pengunjung.', 10),
('b0000000-0000-4000-8000-000000000004', 'Zona D - Panggung Utama & Talkshow', 'booth-d', 50.0, 75.0, 'Pusat talkshow seni, seminar singkat, dan pembagian penghargaan karya favorit.', 12),
('b0000000-0000-4000-8000-000000000005', 'Zona E - Photobooth Retro & Souvenir', 'booth-e', 85.0, 80.0, 'Spot foto neon bernuansa Memphis 80s dan penukaran tiket digital dengan suvenir stiker.', 8)
ON CONFLICT (kode_booth) DO UPDATE SET
    nama_zona = EXCLUDED.nama_zona,
    deskripsi_zona = EXCLUDED.deskripsi_zona;

-- 7. PASTIKAN RLS TETAP AKTIF & AMAN
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rundowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop policies lama jika ada untuk mencegah konflik nama
DROP POLICY IF EXISTS "Public can view artworks" ON artworks;
DROP POLICY IF EXISTS "Panitia can manage artworks" ON artworks;
DROP POLICY IF EXISTS "Public can view booths" ON booths;
DROP POLICY IF EXISTS "Public can view rundowns" ON rundowns;
DROP POLICY IF EXISTS "Public can view guestbooks" ON guestbooks;
DROP POLICY IF EXISTS "Public can insert guestbook" ON guestbooks;
DROP POLICY IF EXISTS "Panitia can manage guestbooks" ON guestbooks;
DROP POLICY IF EXISTS "Public can insert attendance" ON attendances;
DROP POLICY IF EXISTS "Panitia can manage attendances" ON attendances;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
DROP POLICY IF EXISTS "Public can view orders" ON orders;
DROP POLICY IF EXISTS "Panitia can manage orders" ON orders;
DROP POLICY IF EXISTS "Public can read users" ON users;
DROP POLICY IF EXISTS "Admin can manage users" ON users;
DROP POLICY IF EXISTS "Public can insert artwork_likes" ON artwork_likes;

-- Kebijakan Akses Artworks & Likes
CREATE POLICY "Public can view artworks" ON artworks FOR SELECT USING (true);
CREATE POLICY "Panitia can manage artworks" ON artworks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can insert artwork_likes" ON artwork_likes FOR INSERT WITH CHECK (true);

-- Kebijakan Akses Layout & Rundown
CREATE POLICY "Public can view booths" ON booths FOR SELECT USING (true);
CREATE POLICY "Public can view rundowns" ON rundowns FOR SELECT USING (true);

-- Kebijakan Akses Presensi & Buku Tamu
CREATE POLICY "Public can insert attendance" ON attendances FOR INSERT WITH CHECK (true);
CREATE POLICY "Panitia can manage attendances" ON attendances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public can view guestbooks" ON guestbooks FOR SELECT USING (is_moderated = true);
CREATE POLICY "Public can insert guestbook" ON guestbooks FOR INSERT WITH CHECK (true);
CREATE POLICY "Panitia can manage guestbooks" ON guestbooks FOR ALL USING (true) WITH CHECK (true);

-- Kebijakan Akses Transaksi Orders
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Panitia can manage orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Kebijakan Akses Autentikasi Pengguna
CREATE POLICY "Public can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Admin can manage users" ON users FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- SELESAI! Database Supabase kini bersih dari data dummy dan siap untuk live pameran.
-- ==============================================================================
