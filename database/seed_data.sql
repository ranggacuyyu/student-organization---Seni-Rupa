-- ==============================================================================
-- 🎨 PROKER DIVISI SENI RUPA - ART SHOW CASE "HISTORY"
-- SEED DATA MASTER SCRIPT (Fixed: All IDs use valid UUID hex characters only)
-- UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (0-9, a-f only)
-- ==============================================================================

-- 1. SEED BOOTHS / ZONA
INSERT INTO booths (id, nama_zona, kode_booth, koordinat_x, koordinat_y, deskripsi_zona, kapasitas_display) VALUES
('b0000000-0000-4000-8000-000000000001', 'Zona A - Galeri Lukis Sejarah', 'booth-a', 22.5, 45.0, 'Eksibisi lukisan sejarah berdirinya divisi seni rupa dan perjalanan karya anggota.', 8),
('b0000000-0000-4000-8000-000000000002', 'Zona B - Galeri Kerajinan & Kriya Tangan', 'booth-b', 50.0, 30.0, 'Koleksi kerajinan 3D, resin, keramik terracotta, dan karya olah bahan daur ulang.', 10),
('b0000000-0000-4000-8000-000000000003', 'Zona C - Pojok Gambar & Live Painting', 'booth-c', 78.0, 45.0, 'Area interaktif buku sketsa bersama dan kanvas live painting langsung oleh pengunjung.', 6),
('b0000000-0000-4000-8000-000000000004', 'Zona D - Panggung Utama & Talkshow', 'booth-d', 50.0, 75.0, 'Pusat talkshow seni, seminar singkat, dan pembagian penghargaan karya favorit.', 12),
('b0000000-0000-4000-8000-000000000005', 'Zona E - Photobooth Retro & Souvenir', 'booth-e', 85.0, 80.0, 'Spot foto neon bernuansa Memphis 80s dan penukaran tiket digital dengan suvenir stiker.', 5)
ON CONFLICT (kode_booth) DO NOTHING;

-- 2. SEED USERS / PANITIA & ADMIN
INSERT INTO users (id, name, username, email, password, role, divisi, assigned_booth, kontak, status, avatar_bg) VALUES
('a1000000-0000-4000-8000-000000000001', 'Muhammad Rangga', 'admin_senrup', 'rangga@senrup.polibatam.ac.id', 'admin123', 'admin', 'Koordinator Utama & Pameran', 'Semua Zona (Lt. 3)', '0812-3456-7890', 'active', 'bg-[#FF3388]'),
('a1000000-0000-4000-8000-000000000002', 'Samuel Siregar', 'panitia_registrasi', 'samuel@senrup.polibatam.ac.id', 'panitia123', 'panitia', 'Divisi Registrasi & Presensi', 'Pintu Masuk (Lobby Lt. 3)', '0813-8899-1122', 'active', 'bg-[#FFE600]'),
('a1000000-0000-4000-8000-000000000003', 'Aiko Valerie', 'panitia_acara', 'aiko@senrup.polibatam.ac.id', 'panitia123', 'panitia', 'Divisi Acara & Rundown', 'Zona D - Panggung Utama', '0821-4455-6677', 'active', 'bg-[#00F0FF]'),
('a1000000-0000-4000-8000-000000000004', 'Ibra Pratama', 'panitia_galeri', 'ibra@senrup.polibatam.ac.id', 'panitia123', 'panitia', 'Divisi Perlengkapan & Display', 'Zona A & Zona B (Galeri)', '0856-7788-9900', 'active', 'bg-[#7B2CBF]'),
('a1000000-0000-4000-8000-000000000005', 'Yurila Ananda', 'panitia_souvenir', 'yurila@senrup.polibatam.ac.id', 'panitia123', 'panitia', 'Divisi Suvenir & Photobooth', 'Zona E - Photobooth Retro', '0877-1122-3344', 'active', 'bg-[#22C55E]')
ON CONFLICT (username) DO NOTHING;

-- 3. SEED ARTWORKS
INSERT INTO artworks (id, judul, slug, seniman_nama, seniman_nim, seniman_angkatan, kategori, deskripsi_filosofi, medium_bahan, dimensi, tahun_pembuatan, foto_utama_url, booth_id, booth_name, is_highlighted, likes_count, tags) VALUES
('c2000000-0000-4000-8000-000000000001', 'Kronik Nostalgia: Rekam Jejak 2020', 'kronik-nostalgia-kanvas', 'Muhammad Rangga', '3312101012', '2021', 'Lukis', 'Karya ini menggambarkan metamorfosis ruang dan waktu perjalanan awal berdirinya Divisi Seni Rupa. Perpaduan warna kontras melambangkan keberagaman latar belakang anggota yang bersatu membentuk ekosistem seni rupa di lingkungan kampus vokasi.', 'Acrylic & Oil Pastel on Canvas', '120 x 90 cm', '2024', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000001', 'Zona A - Galeri Lukis Sejarah', true, 142, ARRAY['Retro Pop', 'Acrylic', 'History', 'Featured']),
('c2000000-0000-4000-8000-000000000002', 'Harmoni Geometris Pesisir Batam', 'harmoni-geometris-batam', 'Siti Nurhaliza & Tim Divisi', '3312201088', '2022', 'Lukis', 'Eksplorasi garis-garis tegas Memphis dipadukan dengan siluet pesisir pulau Batam. Simbol industri dan seni berpadu secara dinamis dalam sapuan kuas bergradasi neon.', 'Mixed Media & Collage on Canvas', '100 x 100 cm', '2024', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000001', 'Zona A - Galeri Lukis Sejarah', true, 98, ARRAY['Memphis', 'Landscape', 'Neo-Retro']),
('c2000000-0000-4000-8000-000000000003', 'Kriya Totem Arsip: Resin & Kayu Daur Ulang', 'kriya-resin-daur-ulang-arsip', 'Rian Aditya', '3312301044', '2023', 'Kerajinan', 'Karya kerajinan tiga dimensi yang mengabadikan serpihan sketsa arsip lama anggota ke dalam lapisan resin bening yang disangga kayu jati bekas palet kampus.', 'Bio-Resin, Reclaimed Teak Wood & Akrilik', '40 x 30 x 60 cm', '2024', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000002', 'Zona B - Galeri Kerajinan & Kriya Tangan', true, 115, ARRAY['3D Craft', 'Resin', 'Eco-Art', 'Sculpture']),
('c2000000-0000-4000-8000-000000000004', 'Terracotta Retro: Varian Wadah Ekspresi', 'kerajinan-terracotta-pop', 'Dina Amanda', '3312201015', '2022', 'Kerajinan', 'Koleksi keramik fungsional bertekstur tanah bakar dengan sentuhan aksen warna kuning lemon dan magenta. Merefleksikan eksplorasi bentuk kriya modern di tangan mahasiswa.', 'Tanah Liat Terracotta, Glaze Enamel & Stiker Sablon', 'Set of 4 (Diameter 18 cm)', '2024', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000002', 'Zona B - Galeri Kerajinan & Kriya Tangan', false, 87, ARRAY['Ceramic', 'Handmade', 'Retro Colors']),
('c2000000-0000-4000-8000-000000000005', 'Buku Sketsa Kolektif: Jejak Garis Anggota', 'sketsa-buku-bersama-vol-1', 'Kolektif Anggota Seni Rupa', 'Kolektif Divisi', '2021-2024', 'Sketsa & Ilustrasi', 'Kompilasi sketsa spontan, doodle, dan catatan visual yang dibuat secara bergiliran oleh seluruh anggota divisi selama 3 tahun terakhir. Menjadi pondasi dari tema History.', 'Ink, Marker & Charcoal on Canson Paper', 'A3 Hardcover Journal', '2024', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000003', 'Zona C - Pojok Gambar & Live Painting', true, 160, ARRAY['Sketchbook', 'Collective Art', 'History Foundation']),
('c2000000-0000-4000-8000-000000000006', 'Poster Digital: Manifestasi Estetika Kampus', 'poster-manifesto-senrup-2024', 'Fajar Pratama', '3312301019', '2023', 'Sketsa & Ilustrasi', 'Karya ilustrasi digital bergaya poster retro Swiss Style dengan tipografi tegas, memuat nilai-nilai inklusivitas divisi seni rupa.', 'Digital Print on Fine Art Archival Paper', 'A2 (42 x 59.4 cm)', '2024', 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80', 'b0000000-0000-4000-8000-000000000003', 'Zona C - Pojok Gambar & Live Painting', false, 74, ARRAY['Digital Art', 'Typography', 'Swiss Style'])
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED RUNDOWNS
INSERT INTO rundowns (id, urutan, sesi_kegiatan, deskripsi, pengisi_acara, lokasi_sesi, waktu_mulai, waktu_selesai, status) VALUES
('d3000000-0000-4000-8000-000000000001', 1, 'Opening Ceremony & Sambutan Pembina', 'Pembukaan resmi Art Show Case History oleh Pembina Divisi Seni Rupa dan Pembantu Direktur III Polibatam.', 'Pembina & Ketua Divisi', 'Panggung Utama (Zona D)', '10:00', '10:45', 'completed'),
('d3000000-0000-4000-8000-000000000002', 2, 'Curator Tour & Bedah Karya Lukis', 'Sesi tur keliling galeri bersama kurator membedah latar belakang filosofi setiap karya lukis dan kriya.', 'Kurator & Seniman Anggota', 'Zona A & B Galeri Seni', '10:45', '12:00', 'ongoing'),
('d3000000-0000-4000-8000-000000000003', 3, 'Live Painting Session & Mural Corner', 'Pertunjukan melukis langsung di atas kanvas besar 2x1 meter oleh tim divisi bersama pengunjung.', 'Divisi Seni Rupa & Pengunjung', 'Zona C - Pojok Gambar', '13:00', '14:30', 'upcoming'),
('d3000000-0000-4000-8000-000000000004', 4, 'Talkshow: Seni & Kreativitas di Kampus Vokasi', 'Bincang santai mengenai peluang industri kreatif, desain grafis, dan seni visual bagi mahasiswa teknik.', 'Praktisi Seni Batam & Alumni', 'Panggung Utama (Zona D)', '14:30', '15:45', 'upcoming'),
('d3000000-0000-4000-8000-000000000005', 5, 'Awarding Karya Favorit & Closing Jamming', 'Penyerahan penghargaan apresiasi karya terfavorit pilihan pengunjung dan jamming musik akustik penutup.', 'Seluruh Panitia & Peserta', 'Panggung Utama (Zona D)', '16:00', '17:00', 'upcoming')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED GUESTBOOKS
INSERT INTO guestbooks (id, nama_pengirim, status_pengirim, pesan, stiker_ikon, warna_kartu, ip_address) VALUES
('e4000000-0000-4000-8000-000000000001', 'Alifia Zahra', 'Mahasiswa Baru (IF)', 'Pamerannya seru banget! Warna-warni retromya bikin betah keliling Student Centre Lt. 3. Sukses terus Divisi Seni Rupa!', 'retro-star', 'bg-[#FFE600]', '180.254.88.12'),
('e4000000-0000-4000-8000-000000000002', 'Dimas Anggara', 'Mahasiswa Polibatam (EL)', 'Karya totem resin kayu daur ulang sangat berkesan. Makna filosofinya dalem banget. Ditunggu open recruitmentnya!', 'retro-heart', 'bg-[#FF3388]', '114.122.34.90'),
('e4000000-0000-4000-8000-000000000003', 'Clara Salsabila', 'Pengunjung Umum', 'Live paintingnya keren parah! Sempat nyoba corat-coret di pojok buku sketsa bersama. Seru pol!', 'retro-brush', 'bg-[#00F0FF]', '182.1.240.55')
ON CONFLICT (id) DO NOTHING;
