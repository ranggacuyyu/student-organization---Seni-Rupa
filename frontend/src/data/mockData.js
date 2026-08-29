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

// ================= MASTER GENERATOR & DUMMY DATA KARYA SENI =================
// Setiap pencipta memiliki 10 hingga 20 karya unik berkualitas tinggi
const CREATORS_BLUEPRINT = [
  {
    name: "Muhammad Rangga",
    nim: "3312101012",
    batch: "2021",
    isAnonymous: false,
    specialty: "Lukis & Kriya Sejarah",
    targetCount: 15,
    counts: { Lukis: 7, Kerajinan: 4, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Siti Nurhaliza",
    nim: "3312201088",
    batch: "2022",
    isAnonymous: false,
    specialty: "Lukis & Kolase Geometris",
    targetCount: 14,
    counts: { Lukis: 6, Kerajinan: 4, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Rian Aditya",
    nim: "3312301044",
    batch: "2023",
    isAnonymous: false,
    specialty: "Kriya Resin & 3D Craft",
    targetCount: 15,
    counts: { Lukis: 4, Kerajinan: 7, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Dina Amanda",
    nim: "3312201015",
    batch: "2022",
    isAnonymous: false,
    specialty: "Terracotta & Keramik Retro",
    targetCount: 13,
    counts: { Lukis: 3, Kerajinan: 6, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Kevin Pratama",
    nim: "3312401002",
    batch: "2024 (Maba)",
    isAnonymous: false,
    specialty: "Spray Paint & Street Art",
    targetCount: 12,
    counts: { Lukis: 5, Kerajinan: 3, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Samuel Christian",
    nim: "3312201067",
    batch: "2022",
    isAnonymous: false,
    specialty: "Lukis Mixed Media & Kriya Metal",
    targetCount: 14,
    counts: { Lukis: 5, Kerajinan: 4, "Sketsa & Ilustrasi": 5 }
  },
  {
    name: "Aiko Senja",
    nim: "3312301091",
    batch: "2023",
    isAnonymous: false,
    specialty: "Ilustrasi Karakter & Doodle",
    targetCount: 15,
    counts: { Lukis: 4, Kerajinan: 4, "Sketsa & Ilustrasi": 7 }
  },
  {
    name: "Naris Wibowo",
    nim: "3312201033",
    batch: "2022",
    isAnonymous: false,
    specialty: "Dokumentasi Visual & Sketsa Arsitektur",
    targetCount: 12,
    counts: { Lukis: 3, Kerajinan: 3, "Sketsa & Ilustrasi": 6 }
  },
  {
    name: "Ibra Maulana",
    nim: "3312101050",
    batch: "2021",
    isAnonymous: false,
    specialty: "Instalasi Kayu & Kriya Daur Ulang",
    targetCount: 13,
    counts: { Lukis: 3, Kerajinan: 7, "Sketsa & Ilustrasi": 3 }
  },
  {
    name: "Yurila Kartika",
    nim: "3312201009",
    batch: "2022",
    isAnonymous: false,
    specialty: "Cat Air & Kriya Kertas Lipat",
    targetCount: 14,
    counts: { Lukis: 6, Kerajinan: 4, "Sketsa & Ilustrasi": 4 }
  },
  {
    name: "Kolektif Anggota Seni Rupa",
    nim: "Kolektif Divisi",
    batch: "2021-2024",
    isAnonymous: false,
    specialty: "Karya Kolaborasi & Mural Bersama",
    targetCount: 16,
    counts: { Lukis: 5, Kerajinan: 4, "Sketsa & Ilustrasi": 7 }
  },
  {
    name: "Pencipta Dirahasiakan",
    nim: "Identitas Dirahasiakan",
    batch: "Rahasia",
    isAnonymous: true,
    specialty: "Eksplorasi Misterius Tanpa Batas",
    targetCount: 18,
    counts: { Lukis: 7, Kerajinan: 5, "Sketsa & Ilustrasi": 6 }
  }
];

const LUKIS_POOL = [
  {
    title: "Kronik Nostalgia: Rekam Jejak 2020",
    medium: "Acrylic & Oil Pastel on Canvas",
    dimensions: "120 x 90 cm",
    img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    desc: "Karya kanvas menggambarkan metamorfosis ruang dan waktu perjalanan awal berdirinya Divisi Seni Rupa di lingkungan kampus vokasi.",
    tags: ["Retro Pop", "Acrylic", "History", "Featured"]
  },
  {
    title: "Harmoni Geometris Pesisir Batam",
    medium: "Mixed Media & Collage on Canvas",
    dimensions: "100 x 100 cm",
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
    desc: "Eksplorasi garis tegas Memphis dipadukan dengan siluet pesisir pulau Batam dan gradasi warna cerah.",
    tags: ["Memphis", "Landscape", "Neo-Retro"]
  },
  {
    title: "Spektrum Jiwa: Dinamika Mahasiswa Baru",
    medium: "Spray Paint & Acrylic on Board",
    dimensions: "90 x 120 cm",
    img: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80",
    desc: "Refleksi rasa ingin tahu, semangat eksplorasi seni, dan warna-warni kehidupan perkuliahan di Politeknik Negeri Batam.",
    tags: ["Spray Paint", "Abstract", "Maba"]
  },
  {
    title: "Siluet Senja Kampus Hang Nadim",
    medium: "Oil on Linen Canvas & Gold Leaf",
    dimensions: "110 x 85 cm",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80",
    desc: "Sapuan cat minyak bertekstur tebal dengan aksen daun emas yang menangkap cahaya senja di atas gedung rektorat.",
    tags: ["Sunset", "Oil Painting", "Gold Leaf"]
  },
  {
    title: "Garis Memori: Lorong Studio Seni",
    medium: "Acrylic & Charcoal on Raw Canvas",
    dimensions: "130 x 95 cm",
    img: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80",
    desc: "Komposisi monokromatik dengan sentuhan cipratan kuning lemon yang menggambarkan ingatan hangat saat berkumpul di studio.",
    tags: ["Expressive", "Charcoal", "Studio"]
  },
  {
    title: "Simfoni Kanvas: Nafas Sejarah Vokasi",
    medium: "Oil on Stretched Canvas",
    dimensions: "140 x 100 cm",
    img: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1000&q=80",
    desc: "Lukisan figuratif abstrak yang merangkum dinamika berkarya mahasiswa teknik dalam melestarikan nilai estetika seni.",
    tags: ["History", "Canvas", "Dynamic"]
  },
  {
    title: "Retrospeksi Gelombang Biru Selat",
    medium: "Acrylic, Sand Texture & Resin Glaze",
    dimensions: "80 x 120 cm",
    img: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80",
    desc: "Tekstur pasir pantai yang dipadatkan dengan cat akrilik biru kobalt dan hijau toska, merefleksikan arus laut Kepulauan Riau.",
    tags: ["Texture", "Ocean", "Marine Art"]
  },
  {
    title: "Evolusi Kuas: Dialog Ruang & Warna",
    medium: "Mixed Media on Wooden Panel",
    dimensions: "95 x 95 cm",
    img: "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=1000&q=80",
    desc: "Eksperimen warna kontras dengan blok geometris berirama yang memikat pandangan pengunjung.",
    tags: ["Geometric", "Palette", "Contemporary"]
  },
  {
    title: "Pendar Neon di Malam Sejarah",
    medium: "Fluorescent Acrylic & UV Varnish",
    dimensions: "100 x 80 cm",
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
    desc: "Lukisan bercahaya di bawah lampu temaram yang menyimbolkan ide kreatif yang terus menyala di malam hari.",
    tags: ["Neon", "Glow", "Night Art"]
  },
  {
    title: "Cakrawala Abstrak: Fajar Kreativitas",
    medium: "Oil on Belgian Linen",
    dimensions: "115 x 85 cm",
    img: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80",
    desc: "Gradasi fajar dari ungu tua menuju kuning cerah melambangkan kebangkitan semangat seni rupa kampus.",
    tags: ["Horizon", "Dawn", "Modern Art"]
  }
];

const KERAJINAN_POOL = [
  {
    title: "Kriya Totem Arsip: Resin & Kayu Daur Ulang",
    medium: "Bio-Resin, Reclaimed Teak Wood & Akrilik",
    dimensions: "40 x 30 x 60 cm",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    desc: "Karya kerajinan tiga dimensi yang mengabadikan serpihan sketsa arsip lama anggota ke dalam lapisan resin bening yang disangga kayu jati bekas palet kampus.",
    tags: ["3D Craft", "Resin", "Eco-Art", "Sculpture"]
  },
  {
    title: "Terracotta Retro: Varian Wadah Ekspresi",
    medium: "Tanah Liat Terracotta, Glaze Enamel & Stiker Sablon",
    dimensions: "Set of 4 (Diameter 18 cm)",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
    desc: "Koleksi keramik fungsional bertekstur tanah bakar dengan sentuhan aksen warna kuning lemon dan magenta.",
    tags: ["Ceramic", "Handmade", "Retro Colors"]
  },
  {
    title: "Enigma Kristal: Kotak Pandora Waktu",
    medium: "Cast Resin, Iron Wire & Copper Dust",
    dimensions: "35 x 35 x 45 cm",
    img: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1000&q=80",
    desc: "Kriya tiga dimensi unik yang menggabungkan resin tembus pandang dengan kawat tembaga berpilin secara mandiri.",
    tags: ["Sculpture", "Anonymous", "Resin", "Copper"]
  },
  {
    title: "Relik Geometris: Logam & Akrilik Neon",
    medium: "Aluminium Sheet, Neon Acrylic & Rivet",
    dimensions: "50 x 25 x 70 cm",
    img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80",
    desc: "Konstruksi logam ringan berpola kisi retro dengan sisipan lembaran akrilik transparan berdaya pantul tinggi.",
    tags: ["Metal Craft", "Industrial", "Futuristic"]
  },
  {
    title: "Vessel Tanah Liat: Jejak Tangan Seniman",
    medium: "Stoneware Clay, Ash Glaze & Oxide Pigment",
    dimensions: "30 x 30 x 40 cm",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
    desc: "Guci keramik berpola spiral asimetris hasil putaran tangan spontan dalam sesi workshop kriya keramik.",
    tags: ["Pottery", "Stoneware", "Handcrafted"]
  },
  {
    title: "Instalasi Palet Kayu: Rumah Sejarah",
    medium: "Recycled Pine Wood, Rope & LED Filament",
    dimensions: "60 x 60 x 85 cm",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80",
    desc: "Miniatur panggung arsitektural yang dibuat dari potongan kayu palet dengan pencahayaan hangat lampu filamen.",
    tags: ["Woodwork", "Installation", "Eco Craft"]
  },
  {
    title: "Skulptur Kawat Tembaga: Siluet Penari",
    medium: "Twisted Copper Wire & Marble Base",
    dimensions: "25 x 25 x 55 cm",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    desc: "Pilinan kawat tembaga fleksibel yang membentuk figur manusia sedang melukis di udara.",
    tags: ["Wire Art", "Sculpture", "Marble Base"]
  },
  {
    title: "Makrame Tekstil: Anyaman Tali Retro",
    medium: "Cotton Cord, Wooden Dowel & Indigo Dye",
    dimensions: "75 x 110 cm",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80",
    desc: "Kriya tekstil bermotif simpul simetris dengan celupan warna nila alami bernuansa etnik kontemporer.",
    tags: ["Macrame", "Textile", "Handmade"]
  }
];

const SKETSA_POOL = [
  {
    title: "Buku Sketsa Kolektif: Jejak Garis Anggota",
    medium: "Ink, Marker & Charcoal on Canson Paper",
    dimensions: "A3 Hardcover Journal",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
    desc: "Kompilasi sketsa spontan, doodle, dan catatan visual yang dibuat secara bergiliran oleh seluruh anggota divisi selama 3 tahun terakhir.",
    tags: ["Sketchbook", "Doodle", "History", "Interactive"]
  },
  {
    title: "Jejak Pena Tengah Malam: Manifesto Visual",
    medium: "Pigment Ink on Acid-Free Paper",
    dimensions: "50 x 70 cm",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
    desc: "Ilustrasi hitam-putih ultra detail yang memuat ratusan mikro-simbol dan teka-teki visual mengenai perjalanan seni rupa di Polibatam.",
    tags: ["Line Art", "Anonymous", "Illustration", "Midnight Sketch"]
  },
  {
    title: "Doodle Spontan: Atmosfer Student Centre",
    medium: "Technical Pen & Waterbrush on Kraft",
    dimensions: "40 x 60 cm",
    img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80",
    desc: "Sketsa cepat live-sketching yang merekam hiruk-pikuk persiapan pameran seni di lantai 3 gedung kampus.",
    tags: ["Live Sketch", "Urban Sketching", "Campus Life"]
  },
  {
    title: "Studi Anatomi & Gestur Gerak Spontan",
    medium: "Charcoal Stick & Sepia Conte on Textured Paper",
    dimensions: "65 x 50 cm",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
    desc: "Kajian garis ekspresif yang menangkap gerakan tangan seniman ketika memegang kuas dan alat pahat.",
    tags: ["Anatomy", "Charcoal", "Gesture"]
  },
  {
    title: "Perspektif Garis: Lorong Arsitektur Kampus",
    medium: "Fineliner 0.1 & Grey Copic Marker",
    dimensions: "42 x 29.7 cm (A3)",
    img: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80",
    desc: "Gambar perspektif dua titik hilang dengan presisi garis arsitektural yang menampilkan fasad modern Polibatam.",
    tags: ["Architecture", "Perspective", "Fineliner"]
  },
  {
    title: "Ilustrasi Karakter Maskot: Senrup Retro",
    medium: "Digital Line Art Printed on Art Paper 310gsm",
    dimensions: "45 x 60 cm",
    img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    desc: "Desain maskot retro 90an dengan palet warna cerah yang merepresentasikan keceriaan dan energi anggota muda divisi seni.",
    tags: ["Mascot", "Character Design", "Pop Art"]
  },
  {
    title: "Storyboard Animasi: Perjalanan Sang Kuas",
    medium: "Graphite & Tinta Cina on Bristol Board",
    dimensions: "60 x 40 cm",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80",
    desc: "Rangkaian 9 panel sketsa yang menceritakan perjalanan sebatang kuas dari tangan pendiri hingga generasi penerus.",
    tags: ["Storyboard", "Narrative", "Comic Strip"]
  },
  {
    title: "Eksplorasi Tipografi Retro: Sejarah Seni",
    medium: "Calligraphy Ink, Gouache & Stencil",
    dimensions: "50 x 70 cm",
    img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
    desc: "Karya lettering buatan tangan memadukan gaya font Grotesk retro dengan ornamen geometris dinamis.",
    tags: ["Typography", "Lettering", "Handmade"]
  }
];

/**
 * Helper Generator untuk Memproduksi Koleksi Dummy Artworks Berkualitas Tinggi
 * @param {Object} options Konfigurasi kustom jika ingin menambah jumlah karya
 * @returns {Array} Daftar lengkap karya seni (10-20 karya per pencipta)
 */
export function generateMockArtworks(options = {}) {
  const artworksList = [];
  let globalIdCounter = 1;

  CREATORS_BLUEPRINT.forEach((creator, cIndex) => {
    const creatorCounts = creator.counts || { Lukis: 5, Kerajinan: 4, "Sketsa & Ilustrasi": 4 };
    
    // 1. Generate Lukis
    for (let i = 0; i < creatorCounts.Lukis; i++) {
      const template = LUKIS_POOL[(cIndex + i) % LUKIS_POOL.length];
      artworksList.push({
        id: `art-${globalIdCounter++}`,
        slug: `${creator.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-lukis-${i + 1}`,
        title: `${template.title} #${i + 1}`,
        artist: creator.name,
        artistNim: creator.nim,
        artistBatch: creator.batch,
        isAnonymous: creator.isAnonymous,
        category: "Lukis",
        medium: template.medium,
        dimensions: template.dimensions,
        year: `${2021 + ((cIndex + i) % 4)}`,
        imageUrl: template.img,
        description: `${template.desc} Diciptakan oleh ${creator.name} (${creator.specialty}) untuk memperkaya pameran Art Showcase bertema History.`,
        boothId: "booth-a",
        boothName: "Zona A - Galeri Lukis Sejarah",
        likesCount: 65 + ((cIndex * 13 + i * 19) % 150),
        isHighlighted: i === 0,
        tags: template.tags
      });
    }

    // 2. Generate Kerajinan
    for (let i = 0; i < creatorCounts.Kerajinan; i++) {
      const template = KERAJINAN_POOL[(cIndex + i) % KERAJINAN_POOL.length];
      artworksList.push({
        id: `art-${globalIdCounter++}`,
        slug: `${creator.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-kerajinan-${i + 1}`,
        title: `${template.title} #${i + 1}`,
        artist: creator.name,
        artistNim: creator.nim,
        artistBatch: creator.batch,
        isAnonymous: creator.isAnonymous,
        category: "Kerajinan",
        medium: template.medium,
        dimensions: template.dimensions,
        year: `${2022 + ((cIndex + i) % 3)}`,
        imageUrl: template.img,
        description: `${template.desc} Karya kriya orisinal persembahan ${creator.name} dalam eksplorasi material 3 dimensi.`,
        boothId: "booth-b",
        boothName: "Zona B - Galeri Kerajinan & Kriya Tangan",
        likesCount: 50 + ((cIndex * 17 + i * 23) % 140),
        isHighlighted: i === 0,
        tags: template.tags
      });
    }

    // 3. Generate Sketsa & Ilustrasi
    for (let i = 0; i < creatorCounts["Sketsa & Ilustrasi"]; i++) {
      const template = SKETSA_POOL[(cIndex + i) % SKETSA_POOL.length];
      artworksList.push({
        id: `art-${globalIdCounter++}`,
        slug: `${creator.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-sketsa-${i + 1}`,
        title: `${template.title} #${i + 1}`,
        artist: creator.name,
        artistNim: creator.nim,
        artistBatch: creator.batch,
        isAnonymous: creator.isAnonymous,
        category: "Sketsa & Ilustrasi",
        medium: template.medium,
        dimensions: template.dimensions,
        year: "2024",
        imageUrl: template.img,
        description: `${template.desc} Rekaman visual karya ${creator.name} yang merefleksikan tema History dalam goresan tinta spontan.`,
        boothId: "booth-c",
        boothName: "Zona C - Pojok Gambar & Live Painting",
        likesCount: 75 + ((cIndex * 11 + i * 29) % 160),
        isHighlighted: i === 0,
        tags: template.tags
      });
    }
  });

  return artworksList;
}

// Master Data Karya Pameran (Kosong secara default - Hanya menggunakan data dari Supabase)
export const INITIAL_ARTWORKS = [];

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

