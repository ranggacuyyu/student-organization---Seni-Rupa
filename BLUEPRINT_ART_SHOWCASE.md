# 🎨 PROKER DIVISI SENI RUPA - ART SHOW CASE
## System Architecture & Technical Specification Blueprint
**Tema Acara:** *History* (Mengenalkan jejak karya dan kegiatan Divisi Seni Rupa)  
**Target Pengunjung:** Mahasiswa Baru & Seluruh Mahasiswa Politeknik Negeri Batam  
**Lokasi:** Student Centre Lantai 3, Politeknik Negeri Batam  
**Tech Stack:** **React (Frontend)** + **Laravel 11 (Backend REST API)** + **Supabase (PostgreSQL & Object Storage)**  
**Desain Tema Visual:** **Retro / Memphis Art 80s-90s (Neo-Brutalism & Vivid Pop Colors)**

---

## 📌 DAFTAR ISI
1. [Ringkasan Proyek & Kebutuhan Sistem](#1-ringkasan-proyek--kebutuhan-sistem)
2. [Arsitektur Sistem & Tech Stack](#2-arsitektur-sistem--tech-stack)
3. [Peran Pengguna & Hak Akses (RBAC)](#3-peran-pengguna--hak-akses-rbac)
4. [Skema Database & ERD (Supabase / PostgreSQL)](#4-skema-database--erd-supabase--postgresql)
5. [Desain API Endpoint (Laravel 11 REST API)](#5-desain-api-endpoint-laravel-11-rest-api)
6. [Struktur & Fitur Aplikasi Frontend (React)](#6-struktur--fitur-aplikasi-frontend-react)
7. [Design System & Retro Visual Aesthetics](#7-design-system--retro-visual-aesthetics)
8. [Panduan Langkah Implementasi (Step-by-Step)](#8-panduan-langkah-implementasi-step-by-step)
9. [Struktur Direktori Proyek](#9-struktur-direktori-proyek)

---

## 1. Ringkasan Proyek & Kebutuhan Sistem

Website aplikasi **Art Show Case "History"** dirancang sebagai portal pameran seni interaktif berbasis web untuk memfasilitasi kebutuhan panitia dan peserta:

```
                          ┌────────────────────────┐
                          │   PENGUNJUNG / MABA    │
                          └───────────┬────────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           ▼                          ▼                          ▼
   📝 Presensi & IP Tracker    🖼️ Katalog Karya Interaktif  🗺️ Layout & Rundown
   (Nama, NIM, IP, Status)     (Lukis, Kerajinan, Detail)   (Peta Lt 3 & Timeline)
           ▲                          ▲                          ▲
           └──────────────────────────┼──────────────────────────┘
                                      │
                          ┌───────────┴────────────┐
                          │    PANITIA / ADMIN     │
                          │ (Monitoring, CRUD, Log)│
                          └────────────────────────┘
```

### Fitur Utama:
1. **Presensi Digital & Deteksi IP (Attendance & IP Logging)**
   - Form absensi pengunjung (Mahasiswa Baru, Mahasiswa Aktif, Tamu/Umum).
   - Pencatatan otomatis: IP Address pengunjung, User-Agent (browser/device), timestamp check-in.
   - Panel monitoring kehadiran panitia dengan filter real-time, pencarian nama/IP, dan tombol ekspor data (Excel/CSV).
2. **Katalog Karya Seni (Art Exhibition Gallery)**
   - Showcase karya anggota divisi seni rupa (Kategori: Karya Lukis, Kerajinan Tangan, Sketsa/Ilustrasi).
   - Modal detail karya: Judul, Pembuat/Artist, Tahun/Edisi, Deskripsi/Makna Filosofi, Medium/Bahan, Ukuran/Dimensi, Foto HD.
   - Fitur apresiasi: Tombol Like / Favorit karya & Buku Tamu (Kesan & Pesan).
3. **Interaktif Floor Plan & Layout Pameran (Interactive Venue Map)**
   - Peta visual interaktif Student Centre Lantai 3 (Zona Booth Lukis, Kerajinan, Live Painting, Pojok Gambar, Panggung Talkshow/Seminar, Photobooth).
   - Klik area booth pada peta untuk melihat daftar karya di booth tersebut.
4. **Live Rundown & Timeline Acara**
   - Jadwal dinamis kegiatan (Opening, Talkshow, Live Painting, Pojok Gambar, Games Tebak Gambar, Kesan Pesan, Closing).
   - Indikator status kegiatan realtime: `SELESAI`, `SEDANG BERLANGSUNG (LIVE)`, `AKAN DATANG`.
5. **Dashboard Panitia (Admin Portal)**
   - Manajemen karya (CRUD artwork & upload gambar ke Supabase Storage).
   - Manajemen jadwal rundown & status sesi.
   - Log absensi & statistik total pengunjung per kategori/jam.

---

## 2. Arsitektur Sistem & Tech Stack

```
 ┌───────────────────────────────────────────────────────────┐
 │                      FRONTEND (React)                     │
 │  - React 18 + Vite                                        │
 │  - Tailwind CSS + Retro Memphis/Neo-Brutalism Style       │
 │  - Lucide React (Icons), Framer Motion (Animasi)          │
 │  - Axios / TanStack Query (Data Fetching)                 │
 └─────────────────────────────┬─────────────────────────────┘
                               │ JSON REST API
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │                   BACKEND (Laravel 11)                    │
 │  - Laravel REST API Controllers & Form Requests           │
 │  - Laravel Sanctum (Autentikasi Panitia)                  │
 │  - Client IP Resolver ($request->ip(), $request->header())│
 │  - Supabase Storage Client (Upload artwork images)        │
 └─────────────────────────────┬─────────────────────────────┘
                               │ PostgreSQL Connection / Supabase SDK
                               ▼
 ┌───────────────────────────────────────────────────────────┐
 │                  DATABASE & STORAGE (Supabase)            │
 │  - Supabase PostgreSQL (Tabel Relasional)                 │
 │  - Supabase Storage (Bucket: `artworks`, `documents`)     │
 │  - Row Level Security (RLS) & Automated Backups           │
 └───────────────────────────────────────────────────────────┘
```

| Layer | Komponen | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Single Page Application (SPA) cepat, modular, dan responsif. |
| **Styling** | Tailwind CSS + Custom Retro Tokens | Neo-brutalist retro borders, palet warna cerah (cyan, pink, yellow, purple). |
| **Backend** | Laravel 11 | RESTful API tangguh, validasi request, keamanan Sanctum, deteksi IP. |
| **Database** | Supabase (PostgreSQL) | Database cloud relasional berkecepatan tinggi dengan integrasi SQL. |
| **Storage** | Supabase Storage | Penyimpanan cloud file gambar karya seni beresolusi tinggi. |

---

## 3. Peran Pengguna & Hak Akses (RBAC)

| Fitur / Modul | Pengunjung / Peserta (Maba & Mahasiswa) | Panitia (Divisi Acara/Dokum/Sekre) | Super Admin (Ketua / Rangga) |
| :--- | :---: | :---: | :---: |
| **Pengisian Absensi (Check-in)** | ✅ Ya | ✅ Ya | ✅ Ya |
| **Melihat Log Absensi & IP Pengunjung** | ❌ Tidak | ✅ Ya (Read-only / Export) | ✅ Penuh (CRUD + Export) |
| **Melihat Katalog Karya & Detail** | ✅ Ya | ✅ Ya | ✅ Ya |
| **Upload / Edit / Hapus Karya Seni** | ❌ Tidak | ✅ Ya (Koor Acara / Dokum) | ✅ Ya |
| **Memberikan Like & Pesan Kesan** | ✅ Ya | ✅ Ya | ✅ Ya |
| **Melihat Denah Layout & Rundown** | ✅ Ya (Live Status) | ✅ Ya | ✅ Ya |
| **Mengubah Status Rundown / Jadwal** | ❌ Tidak | ✅ Ya (Koor Acara) | ✅ Ya |
| **Manajemen Akun Panitia** | ❌ Tidak | ❌ Tidak | ✅ Ya |

---

## 4. Skema Database & ERD (Supabase / PostgreSQL)

### 4.1. Entity Relationship Overview
```
 [ users (panitia) ] ──────────────< [ artworks ]
                                            │
 [ booths (layout) ] ──────────────<────────┤
                                            │
 [ attendees / visitors ] ─────────< [ artwork_likes ]
         │
         ├─────────────────────────< [ attendances (log IP) ]
         │
         └─────────────────────────< [ guestbooks (kesan pesan) ]

 [ rundowns (jadwal acara) ]
```

### 4.2. SQL Migration Script (Supabase / PostgreSQL)

```sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PANITIA / USERS (Authentication Admin)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'panitia' CHECK (role IN ('superadmin', 'panitia', 'koor_acara', 'sekre', 'bendahara')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL ABSENSI (ATTENDANCES & IP TRACKER)
CREATE TABLE attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_lengkap VARCHAR(150) NOT NULL,
    identifier VARCHAR(50) NOT NULL, -- NIM Mahasiswa atau No. Identitas
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Mahasiswa Baru', 'Mahasiswa Polibatam', 'Dosen/Staff', 'Tamu Umum')),
    jurusan_prodi VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL, -- Mendukung IPv4 dan IPv6
    user_agent TEXT,                -- Browser & Device info
    device_type VARCHAR(50),        -- 'Mobile', 'Tablet', 'Desktop'
    waktu_kehadiran TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL BOOTH / ZONA LAYOUT (Student Centre Lt 3)
CREATE TABLE booths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_zona VARCHAR(100) NOT NULL, -- e.g. "Zona A - Lukisan Sejarah", "Zona B - Kerajinan"
    kode_booth VARCHAR(20) UNIQUE NOT NULL, -- e.g. "BOOTH-A1", "BOOTH-B2"
    koordinat_x FLOAT DEFAULT 0,    -- Persentase posisi X pada peta denah
    koordinat_y FLOAT DEFAULT 0,    -- Persentase posisi Y pada peta denah
    deskripsi_zona TEXT,
    kapasitas_display INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL KATALOG KARYA (ARTWORKS)
CREATE TABLE artworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    judul VARCHAR(200) NOT NULL,
    slug VARCHAR(250) UNIQUE NOT NULL,
    seniman_nama VARCHAR(150) NOT NULL,
    seniman_nim VARCHAR(50),
    seniman_angkatan VARCHAR(10),
    kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Lukis', 'Kerajinan', 'Sketsa & Ilustrasi', 'Seni Media Baru', 'Lainnya')),
    deskripsi_filosofi TEXT NOT NULL,
    medium_bahan VARCHAR(150),       -- e.g. "Acrylic on Canvas", "Resin & Kayu Daur Ulang"
    dimensi VARCHAR(50),            -- e.g. "120 x 80 cm"
    tahun_pembuatan VARCHAR(10) DEFAULT '2024',
    foto_utama_url TEXT NOT NULL,
    foto_tambahan_urls JSONB DEFAULT '[]'::jsonb,
    booth_id UUID REFERENCES booths(id) ON DELETE SET NULL,
    is_highlighted BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL LIKE KARYA (Mencegah spam like berbasis IP / Token)
CREATE TABLE artwork_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    ip_address VARCHAR(45) NOT NULL,
    identifier VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_like_per_ip UNIQUE (artwork_id, ip_address)
);

-- 7. TABEL RUNDOWN & JADWAL ACARA
CREATE TABLE rundowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    urutan INT NOT NULL,
    sesi_kegiatan VARCHAR(150) NOT NULL, -- e.g. "Talkshow: Jejak Seni", "Live Painting"
    deskripsi TEXT,
    pengisi_acara VARCHAR(150),          -- e.g. "Komunitas Seni & Anggota Seni Rupa"
    lokasi_sesi VARCHAR(100) DEFAULT 'Panggung Utama Student Centre Lt 3',
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    tanggal_acara DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABEL KESAN & PESAN (DIGITAL GUESTBOOK)
CREATE TABLE guestbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_pengirim VARCHAR(150) NOT NULL,
    status_pengirim VARCHAR(50) DEFAULT 'Mahasiswa Baru',
    pesan TEXT NOT NULL,
    stiker_ikon VARCHAR(50) DEFAULT 'retro-star', -- e.g. 'retro-heart', 'retro-brush'
    ip_address VARCHAR(45),
    is_moderated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. INDEKS PERFORMA
CREATE INDEX idx_attendances_ip ON attendances(ip_address);
CREATE INDEX idx_attendances_kategori ON attendances(kategori);
CREATE INDEX idx_artworks_kategori ON artworks(kategori);
CREATE INDEX idx_rundowns_status ON rundowns(status);
```

---

## 5. Desain API Endpoint (Laravel 11 REST API)

### 5.1. Authentication (Panitia Portal)
- `POST /api/auth/login` - Login panitia (mengembalikan Laravel Sanctum Token).
- `POST /api/auth/logout` - Logout dan revoke token.
- `GET /api/auth/me` - Ambil profil panitia aktif.

### 5.2. Modul Presensi & IP Tracking (`/api/attendance`)
- `POST /api/attendance`
  - **Akses:** Publik (Pengunjung scan QR / buka link absensi).
  - **Body:** `{ "nama_lengkap": "Rian Pratama", "identifier": "3312301045", "kategori": "Mahasiswa Baru", "jurusan_prodi": "Teknik Informatika", "catatan": "Tertarik dengan lukisan retro" }`
  - **Backend Logic:**
    ```php
    $clientIp = $request->ip(); // Otomatis membaca IP asli client (termasuk reverse proxy header)
    $userAgent = $request->header('User-Agent');
    $deviceType = BrowserHelper::detectDevice($userAgent); // Mobile/Desktop
    ```
- `GET /api/admin/attendances`
  - **Akses:** Panitia / Admin (Bearer Token).
  - **Query Params:** `?page=1&kategori=Mahasiswa+Baru&search=Rian&ip=192.168.1.10`
  - **Response:** Paginated list absensi lengkap dengan IP, waktu, device.
- `GET /api/admin/attendances/export`
  - **Akses:** Panitia / Admin.
  - **Output:** Download file Excel/CSV data kehadiran untuk laporan LPJ divisi.
- `GET /api/admin/attendances/stats`
  - **Output:** Total pengunjung hari ini, grafik lonjakan per jam, breakdown kategori (Maba vs Mahasiswa).

### 5.3. Modul Katalog Karya Seni (`/api/artworks`)
- `GET /api/artworks` - Daftar semua karya seni (filter by `kategori`, `booth_id`, search query).
- `GET /api/artworks/{slug}` - Detail lengkap karya seni & filosofinya.
- `POST /api/artworks/{id}/like` - Kirim like karya (dibatasi 1 like per IP per karya).
- `POST /api/admin/artworks` - Panitia menambah karya baru (upload gambar ke Supabase Storage via backend).
- `PUT /api/admin/artworks/{id}` - Update data karya.
- `DELETE /api/admin/artworks/{id}` - Hapus karya.

### 5.4. Modul Layout & Floor Plan (`/api/layout`)
- `GET /api/layout/booths` - Mengambil peta titik booth koordinat (X, Y) beserta karya di dalamnya.
- `POST /api/admin/layout/booths` - Panitia mengatur posisi titik booth pada peta Student Centre Lt 3.

### 5.5. Modul Rundown Acara (`/api/rundown`)
- `GET /api/rundown` - Daftar timeline kegiatan hari H.
- `PATCH /api/admin/rundown/{id}/status` - Panitia mengubah status (`upcoming` -> `ongoing` -> `completed`).

### 5.6. Modul Buku Tamu (Guestbook) (`/api/guestbook`)
- `GET /api/guestbook` - Menampilkan kartu kesan & pesan peserta.
- `POST /api/guestbook` - Peserta mengirimkan pesan kesan.

---

## 6. Struktur & Fitur Aplikasi Frontend (React)

### 6.1. Halaman & Tampilan Utama (User / Pengunjung)
1. **Homepage (Hero Banner Retro 'History')**:
   - Judul pameran bergaya Memphis pop font dengan animasi marquee bergerak.
   - Quick Action: **"Presensi Sekarang"**, **"Jelajahi Karya"**, **"Peta Booth"**, **"Rundown Hari Ini"**.
   - Countdown timer menuju acara & live visitor counter.
2. **Halaman Presensi (Attendance Portal)**:
   - Form cepat & ramah mobile untuk pengunjung.
   - Kartu notifikasi: Menampilkan IP terdeteksi (`IP Anda: 180.254.xx.xx`) dan badge sukses setelah check-in.
   - Opsi share bukti kehadiran kartu digital bergaya retro ticket!
3. **Halaman Katalog Karya (Exhibition Gallery)**:
   - Filter pill buttons: *Semua*, *Karya Lukis*, *Kerajinan Tangan*, *Sketsa & Ilustrasi*.
   - Kartu karya dengan style Neo-Brutalist (thick black border, drop shadow 4px, pop color badges).
   - Modal detail interaktif: Zoom gambar, narasi filosofi karya, profil seniman, dan tombol love.
4. **Halaman Layout Interaktif (Floor Plan Student Centre Lt. 3)**:
   - Denah visual lantai 3 Student Centre Polibatam.
   - Titik interaktif (pin):
     - 🎨 *Zona A (Pameran Lukis)*
     - 🏺 *Zona B (Pameran Kerajinan)*
     - 🖌️ *Zona C (Live Painting & Pojok Gambar Bersama)*
     - 🎤 *Zona D (Panggung Talkshow & Seminar)*
     - 📸 *Zona E (Photobooth Retro)*
   - Klik titik untuk melihat thumbnail karya atau kegiatan di spot tersebut.
5. **Halaman Rundown Acara (Live Schedule)**:
   - Timeline vertikal dinamis.
   - Tag berkedip **"🔴 LIVE NOW"** pada sesi yang sedang berjalan.
6. **Halaman Kesan & Pesan (Pojok Ekspresi Digital)**:
   - Sticky notes board bernuansa retro untuk ucapan dan ulasan dari Maba/pengunjung.

### 6.2. Halaman Dashboard Admin / Panitia (`/admin`)
1. **Overview Dashboard**:
   - Kartu Metrik: Total Kehadiran, Total Karya, Sesi Aktif Saat Ini, Total Like.
2. **Attendance Manager & Realtime IP Monitor**:
   - Tabel responsif data kehadiran pengunjung: Waktu, Nama, Identitas/NIM, Kategori, IP Address, Device.
   - Filter pencarian instan + Tombol Export XLS.
3. **Artwork Manager**:
   - Form upload karya, drag-and-drop foto langsung ke Supabase Storage, penentuan lokasi booth.
4. **Rundown Controller**:
   - Toggle switch untuk mengaktifkan sesi yang sedang berlangsung secara real-time.

---

## 7. Design System & Retro Visual Aesthetics

Untuk merepresentasikan tema **"Retro"** pada Art Showcase Divisi Seni Rupa, digunakan prinsip desain **Memphis Design + Neo-Brutalism**:

```
      ╔═══════════════════════════════════════════════════╗
      ║  ★ ART SHOWCASE : HISTORY ★                       ║
      ║  ╔═════════════════════╗  ┌─────────────────────┐  ║
      ║  ║   RETRO ART CARD    ║  │  NEON BADGE: LUKIS  │  ║
      ║  ║  [Image with thick  ║  └─────────────────────┘  ║
      ║  ║   black border]     ║  ┌─────────────────────┐  ║
      ║  ║  Judul: "Nirmana"   ║  │ [●] LIVE ON STAGE   │  ║
      ║  ║  Artist: Rangga     ║  └─────────────────────┘  ║
      ║  ╚═════════════════════╝                           ║
      ╚═══════════════════════════════════════════════════╝
```

### 7.1. Color Palette (Retro Pop Memphis)
```css
:root {
  --retro-yellow: #FFE600;      /* Kuning pop cerah */
  --retro-pink: #FF3388;        /* Neon bubblegum pink */
  --retro-cyan: #00F0FF;        /* Electric cyan */
  --retro-purple: #7B2CBF;      /* Deep retro purple */
  --retro-orange: #FF6B35;      /* Vintage orange */
  --retro-bg: #FFFDF7;          /* Vintage warm cream paper */
  --retro-dark: #121212;        /* Dark contrast border & text */
  --retro-card-shadow: 5px 5px 0px #121212; /* Neo-brutalist shadow */
}
```

### 7.2. Elemen Visual & Tipografi
- **Border & Shadow:** `border-3 border-black shadow-[5px_5px_0px_0px_#121212]`
- **Font Headings:** Google Font **'Space Grotesk'** atau **'Syne'** (bold, edgy, geometric).
- **Font Body:** **'Plus Jakarta Sans'** atau **'Inter'** (clean, mudah dibaca).
- **Aksen Grafis:** Pola grid checkerboard, ikon bintang 8-sudut retro (starbursts), zigzag lines, geometris pastel.

---

## 8. Panduan Langkah Implementasi (Step-by-Step)

### Langkah 1: Konfigurasi Supabase
1. Buat proyek baru di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor**, salin dan jalankan seluruh script SQL dari Bagian 4.
3. Masuk ke menu **Storage**:
   - Buat public bucket baru: `artworks`
   - Berikan policy public read access agar gambar karya dapat diakses oleh browser pengunjung.
4. Salin kredensial Database URL & Supabase API Key dari menu **Project Settings -> Database / API**.

### Langkah 2: Setup Backend Laravel 11
```bash
# 1. Masuk ke folder backend
cd backend

# 2. Buat proyek Laravel baru
composer create-project laravel/laravel .

# 3. Install package yang dibutuhkan
composer require laravel/sanctum
composer require maatwebsite/excel

# 4. Konfigurasi .env koneksi ke PostgreSQL Supabase
DB_CONNECTION=pgsql
DB_HOST=aws-0-[region].pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.[project-ref]
DB_PASSWORD=[YOUR-SUPABASE-DB-PASSWORD]

# 5. Jalankan migrasi tabel
php artisan migrate

# 6. Jalankan server Laravel
php artisan serve --port=8000
```

### Langkah 3: Setup Frontend React + Vite
```bash
# 1. Masuk ke folder frontend
cd ../frontend

# 2. Inisialisasi React Vite
npm create vite@latest . -- --template react

# 3. Install dependencies
npm install
npm install tailwindcss postcss autoprefixer axios lucide-react framer-motion clsx tailwind-merge canvas-confetti

# 4. Inisialisasi Tailwind
npx tailwindcss init -p

# 5. Jalankan development server
npm run dev
```

---

## 9. Struktur Direktori Proyek

```
SenRup-Profile/
│
├── BLUEPRINT_ART_SHOWCASE.md         # Dokumen master spesifikasi ini
├── README.md                         # Petunjuk cepat proyek
│
├── backend/                          # Laravel 11 Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AttendanceController.php  # Handle absensi + capture IP
│   │   │   │   ├── ArtworkController.php     # Handle katalog karya
│   │   │   │   ├── LayoutController.php      # Handle booth peta Lt 3
│   │   │   │   ├── RundownController.php     # Handle jadwal acara
│   │   │   │   └── GuestbookController.php   # Handle pesan kesan
│   │   │   └── Requests/
│   │   │       ├── StoreAttendanceRequest.php
│   │   │       └── StoreArtworkRequest.php
│   │   └── Models/
│   │       ├── Attendance.php
│   │       ├── Artwork.php
│   │       ├── Booth.php
│   │       ├── Rundown.php
│   │       └── Guestbook.php
│   ├── database/
│   │   └── migrations/               # Migrasi database Laravel
│   └── routes/
│       └── api.php                   # Definisi REST API endpoints
│
└── frontend/                         # React 18 SPA
    ├── src/
    │   ├── assets/                   # Gambar retro, pattern, denah Lt 3
    │   ├── components/
    │   │   ├── navbar/Navbar.jsx
    │   │   ├── footer/Footer.jsx
    │   │   ├── ui/                   # Neo-brutalist button, card, badge
    │   │   └── modal/ArtworkDetailModal.jsx
    │   ├── pages/
    │   │   ├── Home.jsx              # Landing page retro hero
    │   │   ├── AttendancePage.jsx    # Form absensi + deteksi IP
    │   │   ├── CataloguePage.jsx     # Galeri karya seni (lukis/kerajinan)
    │   │   ├── VenueLayoutPage.jsx   # Peta denah interaktif Lt 3
    │   │   ├── RundownPage.jsx       # Jadwal acara & live status
    │   │   ├── GuestbookPage.jsx     # Kesan & pesan pengunjung
    │   │   └── admin/                # Dashboard panitia
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AttendanceLog.jsx # Tabel log IP & download data
    │   │       └── ArtworkManage.jsx # Upload karya & kelola booth
    │   ├── services/
    │   │   ├── api.js                # Axios client instance
    │   │   └── attendanceService.js
    │   └── App.jsx
    └── tailwind.config.js            # Konfigurasi palet warna retro
```

---
*Dibuat khusus untuk Divisi Seni Rupa Politeknik Negeri Batam — Proker Art Showcase.*
