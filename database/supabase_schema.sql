-- ==============================================================================
-- 🎨 PROKER DIVISI SENI RUPA - ART SHOW CASE "HISTORY"
-- SUPABASE POSTGRESQL DATABASE MIGRATION SCRIPT
-- ==============================================================================

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. TABEL USERS & PANITIA (Authentication & Authorization)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'panitia' CHECK (role IN ('admin', 'panitia', 'superadmin')),
    divisi VARCHAR(100) DEFAULT 'Divisi Pelaksana',
    assigned_booth VARCHAR(150) DEFAULT 'Student Centre Lt. 3',
    kontak VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    avatar_bg VARCHAR(50) DEFAULT 'bg-[#FFE600]',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. TABEL ABSENSI (ATTENDANCES & CLIENT IP LOGGING)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_lengkap VARCHAR(150) NOT NULL,
    identifier VARCHAR(50) NOT NULL, -- NIM Mahasiswa atau No. Identitas
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Mahasiswa Baru', 'Mahasiswa Polibatam', 'Dosen/Staff', 'Tamu Umum', 'Umum')),
    jurusan_prodi VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL, -- IPv4 / IPv6
    user_agent TEXT,                -- Browser & Device information
    device_type VARCHAR(50) DEFAULT 'Desktop',
    waktu_kehadiran TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. TABEL BOOTH / ZONA LAYOUT (Student Centre Lantai 3)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS booths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_zona VARCHAR(100) NOT NULL,
    kode_booth VARCHAR(20) UNIQUE NOT NULL, -- e.g. "booth-a", "booth-b"
    koordinat_x FLOAT DEFAULT 0,            -- Posisi horizontal (%)
    koordinat_y FLOAT DEFAULT 0,            -- Posisi vertikal (%)
    deskripsi_zona TEXT,
    kapasitas_display INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. TABEL KATALOG KARYA (ARTWORKS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    seniman_nama VARCHAR(150) NOT NULL,
    seniman_nim VARCHAR(50),
    seniman_angkatan VARCHAR(10),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Lukis', 'Kerajinan', 'Sketsa & Ilustrasi', 'Seni Media Baru', 'Lainnya')),
    deskripsi_filosofi TEXT NOT NULL,
    medium_bahan VARCHAR(150),
    dimensi VARCHAR(50),
    tahun_pembuatan VARCHAR(10) DEFAULT '2024',
    foto_utama_url TEXT NOT NULL,
    foto_tambahan_urls JSONB DEFAULT '[]'::jsonb,
    booth_id UUID REFERENCES booths(id) ON DELETE SET NULL,
    booth_name VARCHAR(150),
    is_highlighted BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    tags TEXT[] DEFAULT ARRAY['Retro Pop', 'History'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. TABEL LIKE KARYA (Proteksi 1 Like per IP per Karya)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS artwork_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    identifier VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_like_per_ip UNIQUE (artwork_id, ip_address)
);

-- ==============================================================================
-- 7. TABEL RUNDOWN & JADWAL ACARA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS rundowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    urutan INT NOT NULL DEFAULT 1,
    sesi_kegiatan VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    pengisi_acara VARCHAR(150),
    lokasi_sesi VARCHAR(100) DEFAULT 'Student Centre Lantai 3',
    waktu_mulai VARCHAR(20) NOT NULL,
    waktu_selesai VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    tanggal_acara DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 8. TABEL BUKU TAMU / KESAN & PESAN (DIGITAL GUESTBOOK)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS guestbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_pengirim VARCHAR(150) NOT NULL,
    status_pengirim VARCHAR(50) DEFAULT 'Mahasiswa Baru',
    pesan TEXT NOT NULL,
    stiker_ikon VARCHAR(50) DEFAULT 'retro-star',
    warna_kartu VARCHAR(50) DEFAULT 'bg-[#FFE600]',
    ip_address VARCHAR(45),
    is_moderated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. TABEL CHECKLIST TUGAS & LOGISTIK PANITIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS panitia_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    location VARCHAR(150) NOT NULL,
    assigned_to VARCHAR(150) NOT NULL,
    priority VARCHAR(50) DEFAULT 'Sedang' CHECK (priority IN ('Tinggi', 'Sedang', 'Rendah')),
    is_completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(100) DEFAULT 'Logistik',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 10. TABEL PENGUMUMAN INTERNAL PANITIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS panitia_announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    waktu VARCHAR(50),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 11. INDEKS PERFORMA & OPTIMASI QUERY
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_attendances_ip ON attendances(ip_address);
CREATE INDEX IF NOT EXISTS idx_attendances_kategori ON attendances(kategori);
CREATE INDEX IF NOT EXISTS idx_artworks_kategori ON artworks(kategori);
CREATE INDEX IF NOT EXISTS idx_artworks_slug ON artworks(slug);
CREATE INDEX IF NOT EXISTS idx_rundowns_status ON rundowns(status);
CREATE INDEX IF NOT EXISTS idx_guestbooks_created_at ON guestbooks(created_at DESC);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rundowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE panitia_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE panitia_announcements ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public can view artworks" ON artworks FOR SELECT USING (true);
CREATE POLICY "Public can view booths" ON booths FOR SELECT USING (true);
CREATE POLICY "Public can view rundowns" ON rundowns FOR SELECT USING (true);
CREATE POLICY "Public can view guestbooks" ON guestbooks FOR SELECT USING (is_moderated = true);
CREATE POLICY "Public can insert attendance" ON attendances FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert guestbook" ON guestbooks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert artwork_likes" ON artwork_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read users" ON users FOR SELECT USING (true);

-- Authenticated Panitia/Admin Full Access Policies
CREATE POLICY "Panitia can manage attendances" ON attendances FOR ALL USING (true);
CREATE POLICY "Panitia can manage artworks" ON artworks FOR ALL USING (true);
CREATE POLICY "Panitia can manage rundowns" ON rundowns FOR ALL USING (true);
CREATE POLICY "Panitia can manage tasks" ON panitia_tasks FOR ALL USING (true);
CREATE POLICY "Panitia can manage announcements" ON panitia_announcements FOR ALL USING (true);
CREATE POLICY "Admin can manage users" ON users FOR ALL USING (true);
