/**
 * Mock Data Master untuk ART SHOW CASE - Divisi Seni Rupa Polibatam
 * Tema: History | Lokasi: Student Centre Lantai 3
 */

export const EVENT_INFO = {
  title: "ART SHOW CASE",
  theme: "History",
  subTheme: "Jejak Langkah, Karya & Sejarah Divisi Seni Rupa",
  organizer: "Kumpulan Anak Seni - Divisi Seni Rupa Politeknik Negeri Batam",
  targetAudience: "Mahasiswa Baru & Civitas Akademika Polibatam",
  venue: "Student Centre Lantai 3, Politeknik Negeri Batam",
  venueSpecs: "Sirkulasi Udara Terbuka, Pencahayaan Alami & Spot Art Gallery",
  date: "2026-09-12",
  timeRange: "10:00 - 17:00 WIB",
  paletteTheme: "Retro (Pop Colors & Geometric Accents)",
  heroBadge: "PROKER RESMI DIVISI SENI RUPA",
  committee: {
    ketua       : "Rangga",
    bendahara   : "Yurila",
    sekretaris  : "Samuel",
    koorAcara   : "Aiko",
    koorDokum   : "Naris",
    koorPerkap  : "Ibra",
  }
};

export const INITIAL_ARTWORKS = [
  {
    id: "art-1",
    slug: "kronik-nostalgia-kanvas",
    title: "Kronik Nostalgia: Rekam Jejak 2020",
    artist: "Muhammad Rangga",
    artistNim: "3312101012",
    artistBatch: "2021",
    category: "Lukis",
    medium: "Acrylic & Oil Pastel on Canvas",
    dimensions: "120 x 90 cm",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    description: "Karya ini menggambarkan metamorfosis ruang dan waktu perjalanan awal berdirinya Divisi Seni Rupa. Perpaduan warna kontras melambangkan keberagaman latar belakang anggota yang bersatu membentuk ekosistem seni rupa di lingkungan kampus vokasi.",
    boothId: "booth-a",
    boothName: "Zona A - Galeri Lukis Sejarah",
    likesCount: 142,
    isHighlighted: true,
    tags: ["Retro Pop", "Acrylic", "History", "Featured"]
  },
  
  {
    id: "art-2",
    slug: "harmoni-geometris-batam",
    title: "Harmoni Geometris Pesisir Batam",
    artist: "Siti Nurhaliza & Tim Divisi",
    artistNim: "3312201088",
    artistBatch: "2022",
    category: "Lukis",
    medium: "Mixed Media & Collage on Canvas",
    dimensions: "100 x 100 cm",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
    description: "Eksplorasi garis-garis tegas Memphis dipadukan dengan siluet pesisir pulau Batam. Simbol industri dan seni berpadu secara dinamis dalam sapuan kuas bergradasi neon.",
    boothId: "booth-a",
    boothName: "Zona A - Galeri Lukis Sejarah",
    likesCount: 98,
    isHighlighted: true,
    tags: ["Memphis", "Landscape", "Neo-Retro"]
  },
  {
    id: "art-3",
    slug: "kriya-resin-daur-ulang-arsip",
    title: "Kriya Totem Arsip: Resin & Kayu Daur Ulang",
    artist: "Rian Aditya",
    artistNim: "3312301044",
    artistBatch: "2023",
    category: "Kerajinan",
    medium: "Bio-Resin, Reclaimed Teak Wood & Akrilik",
    dimensions: "40 x 30 x 60 cm",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    description: "Karya kerajinan tiga dimensi yang mengabadikan serpihan sketsa arsip lama anggota ke dalam lapisan resin bening yang disangga kayu jati bekas palet kampus.",
    boothId: "booth-b",
    boothName: "Zona B - Galeri Kerajinan & Kriya Tangan",
    likesCount: 115,
    isHighlighted: true,
    tags: ["3D Craft", "Resin", "Eco-Art", "Sculpture"]
  },
  {
    id: "art-4",
    slug: "kerajinan-terracotta-pop",
    title: "Terracotta Retro: Varian Wadah Ekspresi",
    artist: "Dina Amanda",
    artistNim: "3312201015",
    artistBatch: "2022",
    category: "Kerajinan",
    medium: "Tanah Liat Terracotta, Glaze Enamel & Stiker Sablon",
    dimensions: "Set of 4 (Diameter 18 cm)",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
    description: "Koleksi keramik fungsional bertekstur tanah bakar dengan sentuhan aksen warna kuning lemon dan magenta. Merefleksikan eksplorasi bentuk kriya modern di tangan mahasiswa.",
    boothId: "booth-b",
    boothName: "Zona B - Galeri Kerajinan & Kriya Tangan",
    likesCount: 87,
    isHighlighted: false,
    tags: ["Ceramic", "Handmade", "Retro Colors"]
  },
  {
    id: "art-5",
    slug: "sketsa-buku-bersama-vol-1",
    title: "Buku Sketsa Kolektif: Jejak Garis Anggota",
    artist: "Kolektif Anggota Seni Rupa",
    artistNim: "Kolektif Divisi",
    artistBatch: "2021-2024",
    category: "Sketsa & Ilustrasi",
    medium: "Ink, Marker & Charcoal on Canson Paper",
    dimensions: "A3 Hardcover Journal",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
    description: "Kompilasi sketsa spontan, doodle, dan catatan visual yang dibuat secara bergiliran oleh seluruh anggota divisi selama 3 tahun terakhir. Menjadi pondasi dari tema 'History'.",
    boothId: "booth-c",
    boothName: "Zona C - Pojok Gambar & Live Painting",
    likesCount: 160,
    isHighlighted: true,
    tags: ["Sketchbook", "Doodle", "History", "Interactive"]
  },
  {
    id: "art-6",
    slug: "abstraksi-spektrum-kehidupan",
    title: "Spektrum Jiwa: Dinamika Mahasiswa Baru",
    artist: "Kevin Pratama",
    artistNim: "3312401002",
    artistBatch: "2024 (Maba)",
    category: "Lukis",
    medium: "Spray Paint & Acrylic on Board",
    dimensions: "90 x 120 cm",
    year: "2024",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80",
    description: "Karya sambutan dari mahasiswa baru yang merefleksikan rasa ingin tahu, semangat eksplorasi seni, dan warna-warni kehidupan perkuliahan di Politeknik Negeri Batam.",
    boothId: "booth-a",
    boothName: "Zona A - Galeri Lukis Sejarah",
    likesCount: 79,
    isHighlighted: false,
    tags: ["Spray Paint", "Abstract", "Maba"]
  }
];

export const BOOTH_ZONES = [
  {
    id: "booth-a",
    name: "Zona A - Galeri Karya Lukis",
    code: "ZONA-A",
    color: "#FFE600",
    accent: "bg-[#FFE600]",
    icon: "Palette",
    description: "Pameran karya lukisan kanvas, akrilik, dan mixed media karya anggota divisi sejak awal berdiri hingga angkatan terbaru.",
    featuredCount: 12,
    location: "Sisi Utara Student Centre Lt. 3 (Dekat Pencahayaan Jendela Kaca)",
    activities: ["Display Lukisan Masterpiece", "Kurasi Sejarah Karya", "Sesi Diskusi Seniman"]
  },
  {
    id: "booth-b",
    name: "Zona B - Galeri Kerajinan & Kriya Tangan",
    code: "ZONA-B",
    color: "#FF3388",
    accent: "bg-[#FF3388]",
    icon: "Hammer",
    description: "Display produk kriya tiga dimensi, resin craft, terracotta modern, makrame, dan kerajinan tangan hasil workshop anggota.",
    featuredCount: 8,
    location: "Sisi Timur Student Centre Lt. 3",
    activities: ["Showcase Karya 3D", "Mini Merchandise Display", "Eksplorasi Material Bahan"]
  },
  {
    id: "booth-c",
    name: "Zona C - Pojok Gambar & Live Painting",
    code: "ZONA-C",
    color: "#00F0FF",
    accent: "bg-[#00F0FF]",
    icon: "Brush",
    description: "Area terbuka interaktif! Peserta dan pengunjung dapat membuat sketsa di Buku Bersama dan menyaksikan aksi Live Painting anggota.",
    featuredCount: 4,
    location: "Pusat Tengah Student Centre Lt. 3",
    activities: ["Buku Sketsa Bersama (Pojok Gambar)", "Live Painting Action", "Random Drawing Session"]
  },
  {
    id: "booth-d",
    name: "Zona D - Panggung Utama (Talkshow & Seminar)",
    code: "ZONA-D",
    color: "#7B2CBF",
    accent: "bg-[#7B2CBF]",
    icon: "Mic2",
    description: "Panggung pembukaan, seminar seni rupa, sharing session jejak divisi seni rupa, games tebak gambar, dan seremonial penutupan.",
    featuredCount: 6,
    location: "Sisi Barat Student Centre Lt. 3",
    activities: ["Opening Ceremony", "Talkshow Jejak Seni", "Seminar Seni", "Games Tebak Gambar", "Closing"]
  },
  {
    id: "booth-e",
    name: "Zona E - Photobooth Retro & Info Desk",
    code: "ZONA-E",
    color: "#FF6B35",
    accent: "bg-[#FF6B35]",
    icon: "Camera",
    description: "Spot foto berlatar Memphis Pop Art 90s, registrasi ulang presensi mandiri, stiker pack resmi divisi, dan penyerahan suvenir.",
    featuredCount: 2,
    location: "Pintu Masuk Student Centre Lt. 3",
    activities: ["Scan Presensi QR", "Photobooth Props Retro", "Pengisian Pesan Kesan Digital"]
  }
];

export const RUNDOWN_SCHEDULE = [
  {
    id: "run-1",
    time: "09:00 - 09:30",
    title: "Registrasi Pengunjung & Check-in Presensi",
    speaker: "Divisi Sekretariat & Registrasi",
    location: "Zona E - Info Desk Pintu Masuk",
    category: "Administrasi",
    status: "completed",
    description: "Pengunjung melakukan scan QR absensi atau pengisian presensi digital mandiri dengan pencatatan IP dan identitas mahasiswa."
  },
  {
    id: "run-2",
    time: "09:30 - 10:30",
    title: "Opening Ceremony & Pengenalan Divisi Seni Rupa",
    speaker: "Muhammad Rangga (Ketua) & Pembina",
    location: "Zona D - Panggung Utama",
    category: "Seremonial",
    status: "completed",
    description: "Sambutan ketua panitia, pemutaran video kilas balik sejarah divisi, dan pembukaan resmi pameran Art Showcase 'History'."
  },
  {
    id: "run-3",
    time: "10:30 - 12:00",
    title: "Tur Pameran: Eksplorasi Karya Lukis & Kerajinan",
    speaker: "Kurator Pameran & Seniman Anggota",
    location: "Zona A & Zona B",
    category: "Pameran",
    status: "ongoing", // Realtime LIVE NOW badge!
    description: "Sesi tur terpandu mengelilingi display lukisan sejarah dan kriya kerajinan dengan pemaparan makna filosofis oleh masing-masing pembuat karya."
  },
  {
    id: "run-4",
    time: "13:00 - 14:15",
    title: "Talkshow: 'Jejak Seni di Kampus Vokasi'",
    speaker: "Narasumber Alumni & Seniman Batam",
    location: "Zona D - Panggung Utama",
    category: "Talkshow",
    status: "upcoming",
    description: "Diskusi interaktif seputar kiat berkarya seni rupa, peluang kreatif, dan peran komunitas seni di era digital."
  },
  {
    id: "run-5",
    time: "14:15 - 15:15",
    title: "Live Painting Action & Pojok Gambar (Buku Sketsa Bersama)",
    speaker: "Anggota Divisi & Pengunjung",
    location: "Zona C - Pojok Gambar",
    category: "Interaktif",
    status: "upcoming",
    description: "Aksi melukis langsung di kanvas raksasa bersamaan dengan pembukaan Pojok Sketsa Bersama di buku arsip kolektif."
  },
  {
    id: "run-6",
    time: "15:15 - 16:15",
    title: "Random Drawing & Games Interaktif 'Tebak Gambar'",
    speaker: "Koor Acara & MC",
    location: "Zona D - Panggung Utama",
    category: "Games & Fun",
    status: "upcoming",
    description: "Keseruan games tebak sketsa cepat berhadiah merchandise retro edisi terbatas untuk mahasiswa baru dan pengunjung."
  },
  {
    id: "run-7",
    time: "16:15 - 17:00",
    title: "Kesan Pesan, Pengumuman Karya Terfavorit & Closing",
    speaker: "Seluruh Panitia & Peserta",
    location: "Zona D - Panggung Utama",
    category: "Penutupan",
    status: "upcoming",
    description: "Membaca ulasan buku tamu terbaik, penghargaan karya seni dengan like terbanyak, dan foto bersama seluruh pengunjung."
  }
];

export const INITIAL_ATTENDANCES = [
  {
    id: "att-1",
    nama_lengkap: "Fajar Nugraha",
    identifier: "3312401032",
    kategori: "Mahasiswa Baru",
    jurusan_prodi: "D4 Teknik Informatika",
    ip_address: "180.254.68.12",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0",
    device_type: "Desktop (Windows)",
    waktu_kehadiran: "2024-10-28 09:12:45",
    catatan: "Sangat kagum dengan karya lukis retro di Zona A!"
  },
  {
    id: "att-2",
    nama_lengkap: "Nadia Putri Lestari",
    identifier: "3312401089",
    kategori: "Mahasiswa Baru",
    jurusan_prodi: "D4 Animasi & Desain Grafis",
    ip_address: "114.122.34.90",
    user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/605.1",
    device_type: "Mobile (iPhone)",
    waktu_kehadiran: "2024-10-28 09:18:22",
    catatan: "Tertarik ikut live painting dan join divisi seni rupa."
  },
  {
    id: "att-3",
    nama_lengkap: "Bayu Pratama",
    identifier: "3312201011",
    kategori: "Mahasiswa Polibatam",
    jurusan_prodi: "D3 Teknik Mesin",
    ip_address: "182.1.240.55",
    user_agent: "Mozilla/5.0 (Linux; Android 14; Pixel 7) Mobile Chrome/127.0",
    device_type: "Mobile (Android)",
    waktu_kehadiran: "2024-10-28 09:25:04",
    catatan: "Keren sekali kriya resin tiga dimensinya."
  },
  {
    id: "att-4",
    nama_lengkap: "Dr. Ir. Hendra Prasetyo, M.T.",
    identifier: "198204152008121002",
    kategori: "Dosen/Staff",
    jurusan_prodi: "Teknik Informatika Polibatam",
    ip_address: "103.111.201.5",
    user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0",
    device_type: "Desktop (macOS)",
    waktu_kehadiran: "2024-10-28 09:40:11",
    catatan: "Apresiasi tinggi untuk kreativitas mahasiswa divisi seni rupa!"
  },
  {
    id: "att-5",
    nama_lengkap: "Riska Septiani",
    identifier: "3312301055",
    kategori: "Mahasiswa Polibatam",
    jurusan_prodi: "D4 Rekayasa Keamanan Siber",
    ip_address: "180.254.70.88",
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/129.0",
    device_type: "Desktop (Windows)",
    waktu_kehadiran: "2024-10-28 10:05:30",
    catatan: "Konsep website dan pamerannya sangat futuristik tapi retro!"
  }
];

export const INITIAL_GUESTBOOKS = [
  {
    id: "gb-1",
    name: "Alifia Zahra",
    role: "Mahasiswa Baru (IF)",
    message: "Pamerannya seru banget! Warna-warni retromya bikin betah keliling Student Centre Lt. 3. Sukses terus Divisi Seni Rupa!",
    sticker: "retro-star",
    color: "bg-[#FFE600]",
    createdAt: "10:15 WIB"
  },
  {
    id: "gb-2",
    name: "Dimas Anggara",
    role: "Mahasiswa Polibatam (EL)",
    message: "Karya totem resin kayu daur ulang sangat berkesan. Makna filosofinya dalem banget. Ditunggu open recruitmentnya!",
    sticker: "retro-heart",
    color: "bg-[#FF3388]",
    textColor: "text-white",
    createdAt: "10:24 WIB"
  },
  {
    id: "gb-3",
    name: "Clara Salsabila",
    role: "Pengunjung Umum",
    message: "Live paintingnya keren parah! Sempat nyoba corat-coret di pojok buku sketsa bersama. Seru pol!",
    sticker: "retro-brush",
    color: "bg-[#00F0FF]",
    createdAt: "10:48 WIB"
  }
];

// ================= AKUN MASTER: ADMIN & PANITIA =================
export const INITIAL_PANITIA_ACCOUNTS = [
  {
    id: "user-admin-1",
    username: "admin_senrup",
    password: "admin123",
    nama: "Muhammad Rangga",
    role: "admin", // 'admin' | 'panitia'
    divisi: "Koordinator Utama & Pameran",
    assignedBooth: "Semua Zona (Lt. 3)",
    kontak: "0812-3456-7890",
    status: "active",
    avatarBg: "bg-[#FF3388]"
  },
  {
    id: "user-panitia-1",
    username: "panitia_registrasi",
    password: "panitia123",
    nama: "Samuel Siregar",
    role: "panitia",
    divisi: "Divisi Registrasi & Presensi",
    assignedBooth: "Pintu Masuk (Lobby Lt. 3)",
    kontak: "0813-8899-1122",
    status: "active",
    avatarBg: "bg-[#FFE600]"
  },
  {
    id: "user-panitia-2",
    username: "panitia_acara",
    password: "panitia123",
    nama: "Aiko Valerie",
    role: "panitia",
    divisi: "Divisi Acara & Rundown",
    assignedBooth: "Zona D - Panggung Utama",
    kontak: "0821-4455-6677",
    status: "active",
    avatarBg: "bg-[#00F0FF]"
  },
  {
    id: "user-panitia-3",
    username: "panitia_galeri",
    password: "panitia123",
    nama: "Ibra Pratama",
    role: "panitia",
    divisi: "Divisi Perlengkapan & Display",
    assignedBooth: "Zona A & Zona B (Galeri)",
    kontak: "0856-7788-9900",
    status: "active",
    avatarBg: "bg-[#7B2CBF]"
  },
  {
    id: "user-panitia-4",
    username: "panitia_souvenir",
    password: "panitia123",
    nama: "Yurila Ananda",
    role: "panitia",
    divisi: "Divisi Suvenir & Photobooth",
    assignedBooth: "Zona E - Photobooth Retro",
    kontak: "0877-1122-3344",
    status: "active",
    avatarBg: "bg-[#22C55E]"
  }
];

// ================= CHECKLIST KEBUTUHAN & LOGISTIK PANITIA =================
export const INITIAL_PANITIA_TASKS = [
  {
    id: "task-1",
    title: "Cek Sound System & Mic Panggung Utama",
    location: "Zona D - Panggung",
    assignedTo: "Aiko Valerie",
    priority: "Tinggi",
    isCompleted: true,
    category: "Peralatan"
  },
  {
    id: "task-2",
    title: "Setup Standby QR Scanner Pintu Masuk",
    location: "Lobby Pintu Masuk Lt. 3",
    assignedTo: "Samuel Siregar",
    priority: "Tinggi",
    isCompleted: true,
    category: "Registrasi"
  },
  {
    id: "task-3",
    title: "Pemeriksaan Pencahayaan Spotlight Zona Lukis",
    location: "Zona A - Galeri Lukis",
    assignedTo: "Ibra Pratama",
    priority: "Sedang",
    isCompleted: false,
    category: "Display Seni"
  },
  {
    id: "task-4",
    title: "Restock Suvenir Sticker Pack & Digital Pass",
    location: "Zona E - Photobooth",
    assignedTo: "Yurila Ananda",
    priority: "Tinggi",
    isCompleted: false,
    category: "Logistik Peserta"
  },
  {
    id: "task-5",
    title: "Siapkan Cat Akrilik & Kanvas Kosong Live Painting",
    location: "Zona C - Live Painting",
    assignedTo: "Ibra Pratama",
    priority: "Sedang",
    isCompleted: true,
    category: "Display Seni"
  }
];

// ================= JADWAL SHIFT PANITIA =================
export const INITIAL_PANITIA_SHIFTS = [
  {
    id: "shift-1",
    waktu: "10:00 - 12:30 WIB",
    namaShift: "Sesi Pagi (Opening & Registrasi Maba)",
    petugas: [
      { nama: "Samuel Siregar", role: "QR Scanner Gate 1" },
      { nama: "Ibra Pratama", role: "Pengawas Galeri Zona A-B" },
      { nama: "Aiko Valerie", role: "Operator Rundown Panggung" }
    ]
  },
  {
    id: "shift-2",
    waktu: "12:30 - 15:00 WIB",
    namaShift: "Sesi Siang (Live Painting & Workshop)",
    petugas: [
      { nama: "Yurila Ananda", role: "Klaim Suvenir Photobooth" },
      { nama: "Samuel Siregar", role: "QR Scanner Gate 2" },
      { nama: "Muhammad Rangga", role: "Supervisi Keseluruhan" }
    ]
  },
  {
    id: "shift-3",
    waktu: "15:00 - 17:30 WIB",
    namaShift: "Sesi Sore (Closing & Awarding Karya Favorit)",
    petugas: [
      { nama: "Aiko Valerie", role: "MC & Pemandu Awarding" },
      { nama: "Ibra Pratama", role: "Perapihan Display Karya" },
      { nama: "Yurila Ananda", role: "Rekapitulasi Suvenir & Tamu" }
    ]
  }
];

// ================= PENGUMUMAN INTERNAL PANITIA =================
export const INITIAL_PANITIA_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Briefing Tim Pagi di Lantai 3 Student Centre",
    content: "Seluruh koordinator harap kumpul jam 09.30 WIB untuk cek sound, koneksi scanner QR, dan stok stiker souvenir.",
    author: "Muhammad Rangga (Ketua)",
    waktu: "08:45 WIB",
    isPinned: true
  },
  {
    id: "ann-2",
    title: "Kupon Photobooth Khusus Mahasiswa Baru",
    content: "Maba yang menunjukkan tiket digital dengan status terverifikasi berhak mendapatkan 1x sesi gratis di Zona E Photobooth.",
    author: "Yurila Ananda (Suvenir)",
    waktu: "09:15 WIB",
    isPinned: false
  }
];

