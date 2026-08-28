<?php

namespace Database\Seeders;

use App\Models\Artwork;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArtworkSeeder extends Seeder
{
    public function run(): void
    {
        $creators = [
            [
                'name' => 'Muhammad Rangga',
                'nim' => '3312101012',
                'batch' => '2021',
                'isAnonymous' => false,
                'specialty' => 'Lukis & Kriya Sejarah',
                'counts' => ['Lukis' => 7, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Siti Nurhaliza',
                'nim' => '3312201088',
                'batch' => '2022',
                'isAnonymous' => false,
                'specialty' => 'Lukis & Kolase Geometris',
                'counts' => ['Lukis' => 6, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Rian Aditya',
                'nim' => '3312301044',
                'batch' => '2023',
                'isAnonymous' => false,
                'specialty' => 'Kriya Resin & 3D Craft',
                'counts' => ['Lukis' => 4, 'Kerajinan' => 7, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Dina Amanda',
                'nim' => '3312201015',
                'batch' => '2022',
                'isAnonymous' => false,
                'specialty' => 'Terracotta & Keramik Retro',
                'counts' => ['Lukis' => 3, 'Kerajinan' => 6, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Kevin Pratama',
                'nim' => '3312401002',
                'batch' => '2024 (Maba)',
                'isAnonymous' => false,
                'specialty' => 'Spray Paint & Street Art',
                'counts' => ['Lukis' => 5, 'Kerajinan' => 3, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Samuel Christian',
                'nim' => '3312201067',
                'batch' => '2022',
                'isAnonymous' => false,
                'specialty' => 'Lukis Mixed Media & Kriya Metal',
                'counts' => ['Lukis' => 5, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 5]
            ],
            [
                'name' => 'Aiko Senja',
                'nim' => '3312301091',
                'batch' => '2023',
                'isAnonymous' => false,
                'specialty' => 'Ilustrasi Karakter & Doodle',
                'counts' => ['Lukis' => 4, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 7]
            ],
            [
                'name' => 'Naris Wibowo',
                'nim' => '3312201033',
                'batch' => '2022',
                'isAnonymous' => false,
                'specialty' => 'Dokumentasi Visual & Sketsa Arsitektur',
                'counts' => ['Lukis' => 3, 'Kerajinan' => 3, 'Sketsa & Ilustrasi' => 6]
            ],
            [
                'name' => 'Ibra Maulana',
                'nim' => '3312101050',
                'batch' => '2021',
                'isAnonymous' => false,
                'specialty' => 'Instalasi Kayu & Kriya Daur Ulang',
                'counts' => ['Lukis' => 3, 'Kerajinan' => 7, 'Sketsa & Ilustrasi' => 3]
            ],
            [
                'name' => 'Yurila Kartika',
                'nim' => '3312201009',
                'batch' => '2022',
                'isAnonymous' => false,
                'specialty' => 'Cat Air & Kriya Kertas Lipat',
                'counts' => ['Lukis' => 6, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 4]
            ],
            [
                'name' => 'Kolektif Anggota Seni Rupa',
                'nim' => 'Kolektif Divisi',
                'batch' => '2021-2024',
                'isAnonymous' => false,
                'specialty' => 'Karya Kolaborasi & Mural Bersama',
                'counts' => ['Lukis' => 5, 'Kerajinan' => 4, 'Sketsa & Ilustrasi' => 7]
            ],
            [
                'name' => 'Pencipta Dirahasiakan',
                'nim' => 'Identitas Dirahasiakan',
                'batch' => 'Rahasia',
                'isAnonymous' => true,
                'specialty' => 'Eksplorasi Misterius Tanpa Batas',
                'counts' => ['Lukis' => 7, 'Kerajinan' => 5, 'Sketsa & Ilustrasi' => 6]
            ]
        ];

        $lukisPool = [
            [
                'title' => 'Kronik Nostalgia: Rekam Jejak 2020',
                'medium' => 'Acrylic & Oil Pastel on Canvas',
                'dimensions' => '120 x 90 cm',
                'img' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Karya kanvas menggambarkan metamorfosis ruang dan waktu perjalanan awal berdirinya Divisi Seni Rupa di lingkungan kampus vokasi.',
                'tags' => ['Retro Pop', 'Acrylic', 'History', 'Featured']
            ],
            [
                'title' => 'Harmoni Geometris Pesisir Batam',
                'medium' => 'Mixed Media & Collage on Canvas',
                'dimensions' => '100 x 100 cm',
                'img' => 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Eksplorasi garis tegas Memphis dipadukan dengan siluet pesisir pulau Batam dan gradasi warna cerah.',
                'tags' => ['Memphis', 'Landscape', 'Neo-Retro']
            ],
            [
                'title' => 'Spektrum Jiwa: Dinamika Mahasiswa Baru',
                'medium' => 'Spray Paint & Acrylic on Board',
                'dimensions' => '90 x 120 cm',
                'img' => 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Refleksi rasa ingin tahu, semangat eksplorasi seni, dan warna-warni kehidupan perkuliahan di Politeknik Negeri Batam.',
                'tags' => ['Spray Paint', 'Abstract', 'Maba']
            ],
            [
                'title' => 'Siluet Senja Kampus Hang Nadim',
                'medium' => 'Oil on Linen Canvas & Gold Leaf',
                'dimensions' => '110 x 85 cm',
                'img' => 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Sapuan cat minyak bertekstur tebal dengan aksen daun emas yang menangkap cahaya senja di atas gedung rektorat.',
                'tags' => ['Sunset', 'Oil Painting', 'Gold Leaf']
            ],
            [
                'title' => 'Garis Memori: Lorong Studio Seni',
                'medium' => 'Acrylic & Charcoal on Raw Canvas',
                'dimensions' => '130 x 95 cm',
                'img' => 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Komposisi monokromatik dengan sentuhan cipratan kuning lemon yang menggambarkan ingatan hangat saat berkumpul di studio.',
                'tags' => ['Expressive', 'Charcoal', 'Studio']
            ],
            [
                'title' => 'Simfoni Kanvas: Nafas Sejarah Vokasi',
                'medium' => 'Oil on Stretched Canvas',
                'dimensions' => '140 x 100 cm',
                'img' => 'https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Lukisan figuratif abstrak yang merangkum dinamika berkarya mahasiswa teknik dalam melestarikan nilai estetika seni.',
                'tags' => ['History', 'Canvas', 'Dynamic']
            ],
            [
                'title' => 'Retrospeksi Gelombang Biru Selat',
                'medium' => 'Acrylic, Sand Texture & Resin Glaze',
                'dimensions' => '80 x 120 cm',
                'img' => 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Tekstur pasir pantai yang dipadatkan dengan cat akrilik biru kobalt dan hijau toska, merefleksikan arus laut Kepulauan Riau.',
                'tags' => ['Texture', 'Ocean', 'Marine Art']
            ],
            [
                'title' => 'Evolusi Kuas: Dialog Ruang & Warna',
                'medium' => 'Mixed Media on Wooden Panel',
                'dimensions' => '95 x 95 cm',
                'img' => 'https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Eksperimen warna kontras dengan blok geometris berirama yang memikat pandangan pengunjung.',
                'tags' => ['Geometric', 'Palette', 'Contemporary']
            ],
            [
                'title' => 'Pendar Neon di Malam Sejarah',
                'medium' => 'Fluorescent Acrylic & UV Varnish',
                'dimensions' => '100 x 80 cm',
                'img' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Lukisan bercahaya di bawah lampu temaram yang menyimbolkan ide kreatif yang terus menyala di malam hari.',
                'tags' => ['Neon', 'Glow', 'Night Art']
            ],
            [
                'title' => 'Cakrawala Abstrak: Fajar Kreativitas',
                'medium' => 'Oil on Belgian Linen',
                'dimensions' => '115 x 85 cm',
                'img' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Gradasi fajar dari ungu tua menuju kuning cerah melambangkan kebangkitan semangat seni rupa kampus.',
                'tags' => ['Horizon', 'Dawn', 'Modern Art']
            ]
        ];

        $kerajinanPool = [
            [
                'title' => 'Kriya Totem Arsip: Resin & Kayu Daur Ulang',
                'medium' => 'Bio-Resin, Reclaimed Teak Wood & Akrilik',
                'dimensions' => '40 x 30 x 60 cm',
                'img' => 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Karya kerajinan tiga dimensi yang mengabadikan serpihan sketsa arsip lama anggota ke dalam lapisan resin bening yang disangga kayu jati bekas palet kampus.',
                'tags' => ['3D Craft', 'Resin', 'Eco-Art', 'Sculpture']
            ],
            [
                'title' => 'Terracotta Retro: Varian Wadah Ekspresi',
                'medium' => 'Tanah Liat Terracotta, Glaze Enamel & Stiker Sablon',
                'dimensions' => 'Set of 4 (Diameter 18 cm)',
                'img' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Koleksi keramik fungsional bertekstur tanah bakar dengan sentuhan aksen warna kuning lemon dan magenta.',
                'tags' => ['Ceramic', 'Handmade', 'Retro Colors']
            ],
            [
                'title' => 'Enigma Kristal: Kotak Pandora Waktu',
                'medium' => 'Cast Resin, Iron Wire & Copper Dust',
                'dimensions' => '35 x 35 x 45 cm',
                'img' => 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Kriya tiga dimensi unik yang menggabungkan resin tembus pandang dengan kawat tembaga berpilin secara mandiri.',
                'tags' => ['Sculpture', 'Anonymous', 'Resin', 'Copper']
            ],
            [
                'title' => 'Relik Geometris: Logam & Akrilik Neon',
                'medium' => 'Aluminium Sheet, Neon Acrylic & Rivet',
                'dimensions' => '50 x 25 x 70 cm',
                'img' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Konstruksi logam ringan berpola kisi retro dengan sisipan lembaran akrilik transparan berdaya pantul tinggi.',
                'tags' => ['Metal Craft', 'Industrial', 'Futuristic']
            ],
            [
                'title' => 'Vessel Tanah Liat: Jejak Tangan Seniman',
                'medium' => 'Stoneware Clay, Ash Glaze & Oxide Pigment',
                'dimensions' => '30 x 30 x 40 cm',
                'img' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Guci keramik berpola spiral asimetris hasil putaran tangan spontan dalam sesi workshop kriya keramik.',
                'tags' => ['Pottery', 'Stoneware', 'Handcrafted']
            ],
            [
                'title' => 'Instalasi Palet Kayu: Rumah Sejarah',
                'medium' => 'Recycled Pine Wood, Rope & LED Filament',
                'dimensions' => '60 x 60 x 85 cm',
                'img' => 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Miniatur panggung arsitektural yang dibuat dari potongan kayu palet dengan pencahayaan hangat lampu filamen.',
                'tags' => ['Woodwork', 'Installation', 'Eco Craft']
            ],
            [
                'title' => 'Skulptur Kawat Tembaga: Siluet Penari',
                'medium' => 'Twisted Copper Wire & Marble Base',
                'dimensions' => '25 x 25 x 55 cm',
                'img' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Pilinan kawat tembaga fleksibel yang membentuk figur manusia sedang melukis di udara.',
                'tags' => ['Wire Art', 'Sculpture', 'Marble Base']
            ],
            [
                'title' => 'Makrame Tekstil: Anyaman Tali Retro',
                'medium' => 'Cotton Cord, Wooden Dowel & Indigo Dye',
                'dimensions' => '75 x 110 cm',
                'img' => 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Kriya tekstil bermotif simpul simetris dengan celupan warna nila alami bernuansa etnik kontemporer.',
                'tags' => ['Macrame', 'Textile', 'Handmade']
            ]
        ];

        $sketsaPool = [
            [
                'title' => 'Buku Sketsa Kolektif: Jejak Garis Anggota',
                'medium' => 'Ink, Marker & Charcoal on Canson Paper',
                'dimensions' => 'A3 Hardcover Journal',
                'img' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Kompilasi sketsa spontan, doodle, dan catatan visual yang dibuat secara bergiliran oleh seluruh anggota divisi selama 3 tahun terakhir.',
                'tags' => ['Sketchbook', 'Doodle', 'History', 'Interactive']
            ],
            [
                'title' => 'Jejak Pena Tengah Malam: Manifesto Visual',
                'medium' => 'Pigment Ink on Acid-Free Paper',
                'dimensions' => '50 x 70 cm',
                'img' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Ilustrasi hitam-putih ultra detail yang memuat ratusan mikro-simbol dan teka-teki visual mengenai perjalanan seni rupa di Polibatam.',
                'tags' => ['Line Art', 'Anonymous', 'Illustration', 'Midnight Sketch']
            ],
            [
                'title' => 'Doodle Spontan: Atmosfer Student Centre',
                'medium' => 'Technical Pen & Waterbrush on Kraft',
                'dimensions' => '40 x 60 cm',
                'img' => 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Sketsa cepat live-sketching yang merekam hiruk-pikuk persiapan pameran seni di lantai 3 gedung kampus.',
                'tags' => ['Live Sketch', 'Urban Sketching', 'Campus Life']
            ],
            [
                'title' => 'Studi Anatomi & Gestur Gerak Spontan',
                'medium' => 'Charcoal Stick & Sepia Conte on Textured Paper',
                'dimensions' => '65 x 50 cm',
                'img' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Kajian garis ekspresif yang menangkap gerakan tangan seniman ketika memegang kuas dan alat pahat.',
                'tags' => ['Anatomy', 'Charcoal', 'Gesture']
            ],
            [
                'title' => 'Perspektif Garis: Lorong Arsitektur Kampus',
                'medium' => 'Fineliner 0.1 & Grey Copic Marker',
                'dimensions' => '42 x 29.7 cm (A3)',
                'img' => 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Gambar perspektif dua titik hilang dengan presisi garis arsitektural yang menampilkan fasad modern Polibatam.',
                'tags' => ['Architecture', 'Perspective', 'Fineliner']
            ],
            [
                'title' => 'Ilustrasi Karakter Maskot: Senrup Retro',
                'medium' => 'Digital Line Art Printed on Art Paper 310gsm',
                'dimensions' => '45 x 60 cm',
                'img' => 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Desain maskot retro 90an dengan palet warna cerah yang merepresentasikan keceriaan dan energi anggota muda divisi seni.',
                'tags' => ['Mascot', 'Character Design', 'Pop Art']
            ],
            [
                'title' => 'Storyboard Animasi: Perjalanan Sang Kuas',
                'medium' => 'Graphite & Tinta Cina on Bristol Board',
                'dimensions' => '60 x 40 cm',
                'img' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Rangkaian 9 panel sketsa yang menceritakan perjalanan sebatang kuas dari tangan pendiri hingga generasi penerus.',
                'tags' => ['Storyboard', 'Narrative', 'Comic Strip']
            ],
            [
                'title' => 'Eksplorasi Tipografi Retro: Sejarah Seni',
                'medium' => 'Calligraphy Ink, Gouache & Stencil',
                'dimensions' => '50 x 70 cm',
                'img' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
                'desc' => 'Karya lettering buatan tangan memadukan gaya font Grotesk retro dengan ornamen geometris dinamis.',
                'tags' => ['Typography', 'Lettering', 'Handmade']
            ]
        ];

        Artwork::query()->delete();

        $artworksToInsert = [];
        $globalId = 1;

        foreach ($creators as $cIndex => $creator) {
            $creatorCounts = $creator['counts'];
            $creatorSlug = Str::slug($creator['name']);

            // 1. Lukis
            for ($i = 0; $i < $creatorCounts['Lukis']; $i++) {
                $tpl = $lukisPool[($cIndex + $i) % count($lukisPool)];
                $artworksToInsert[] = [
                    'id' => 'art-' . $globalId++,
                    'slug' => "{$creatorSlug}-lukis-" . ($i + 1),
                    'judul' => "{$tpl['title']} #" . ($i + 1),
                    'seniman_nama' => $creator['name'],
                    'seniman_nim' => $creator['nim'],
                    'seniman_angkatan' => $creator['batch'],
                    'kategori' => 'Lukis',
                    'medium_bahan' => $tpl['medium'],
                    'dimensi' => $tpl['dimensions'],
                    'tahun_pembuatan' => (string)(2021 + (($cIndex + $i) % 4)),
                    'foto_utama_url' => $tpl['img'],
                    'deskripsi_filosofi' => "{$tpl['desc']} Diciptakan oleh {$creator['name']} ({$creator['specialty']}) untuk memperkaya pameran Art Showcase bertema History.",
                    'booth_id' => 'booth-a',
                    'booth_name' => 'Zona A - Galeri Lukis Sejarah',
                    'likes_count' => 65 + (($cIndex * 13 + $i * 19) % 150),
                    'is_highlighted' => $i === 0,
                    'tags' => json_encode($tpl['tags']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 2. Kerajinan
            for ($i = 0; $i < $creatorCounts['Kerajinan']; $i++) {
                $tpl = $kerajinanPool[($cIndex + $i) % count($kerajinanPool)];
                $artworksToInsert[] = [
                    'id' => 'art-' . $globalId++,
                    'slug' => "{$creatorSlug}-kerajinan-" . ($i + 1),
                    'judul' => "{$tpl['title']} #" . ($i + 1),
                    'seniman_nama' => $creator['name'],
                    'seniman_nim' => $creator['nim'],
                    'seniman_angkatan' => $creator['batch'],
                    'kategori' => 'Kerajinan',
                    'medium_bahan' => $tpl['medium'],
                    'dimensi' => $tpl['dimensions'],
                    'tahun_pembuatan' => (string)(2022 + (($cIndex + $i) % 3)),
                    'foto_utama_url' => $tpl['img'],
                    'deskripsi_filosofi' => "{$tpl['desc']} Karya kriya orisinal persembahan {$creator['name']} dalam eksplorasi material 3 dimensi.",
                    'booth_id' => 'booth-b',
                    'booth_name' => 'Zona B - Galeri Kerajinan & Kriya Tangan',
                    'likes_count' => 50 + (($cIndex * 17 + $i * 23) % 140),
                    'is_highlighted' => $i === 0,
                    'tags' => json_encode($tpl['tags']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // 3. Sketsa & Ilustrasi
            for ($i = 0; $i < $creatorCounts['Sketsa & Ilustrasi']; $i++) {
                $tpl = $sketsaPool[($cIndex + $i) % count($sketsaPool)];
                $artworksToInsert[] = [
                    'id' => 'art-' . $globalId++,
                    'slug' => "{$creatorSlug}-sketsa-" . ($i + 1),
                    'judul' => "{$tpl['title']} #" . ($i + 1),
                    'seniman_nama' => $creator['name'],
                    'seniman_nim' => $creator['nim'],
                    'seniman_angkatan' => $creator['batch'],
                    'kategori' => 'Sketsa & Ilustrasi',
                    'medium_bahan' => $tpl['medium'],
                    'dimensi' => $tpl['dimensions'],
                    'tahun_pembuatan' => '2024',
                    'foto_utama_url' => $tpl['img'],
                    'deskripsi_filosofi' => "{$tpl['desc']} Rekaman visual karya {$creator['name']} yang merefleksikan tema History dalam goresan tinta spontan.",
                    'booth_id' => 'booth-c',
                    'booth_name' => 'Zona C - Pojok Gambar & Live Painting',
                    'likes_count' => 75 + (($cIndex * 11 + $i * 29) % 160),
                    'is_highlighted' => $i === 0,
                    'tags' => json_encode($tpl['tags']),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        foreach (array_chunk($artworksToInsert, 50) as $chunk) {
            Artwork::insert($chunk);
        }
    }
}
