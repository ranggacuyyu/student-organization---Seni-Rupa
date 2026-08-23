-- ==============================================================================
-- 🎨 PROKER DIVISI SENI RUPA - ART SHOW CASE "HISTORY"
-- SEED DATA KARYA SENI BULK (160+ Karya Dummy Berkualitas Tinggi)
-- ==============================================================================
-- 📌 PETUNJUK PENGGUNAAN:
--    1. Buka Supabase Dashboard → SQL Editor
--    2. Paste seluruh isi file ini
--    3. Klik "Run" untuk mengeksekusi
--    4. Refresh halaman katalog di frontend
--
-- ⚠️  PERINGATAN: Script ini akan menambahkan data dummy baru.
--    Jika ingin reset total, uncomment DELETE di bawah.
-- ==============================================================================

-- Hapus data artworks lama (opsional, uncomment jika ingin reset total)
-- DELETE FROM artwork_likes;
-- DELETE FROM artworks;

-- ==============================================================================
-- PASTIKAN BOOTH ZONES SUDAH ADA
-- ==============================================================================
INSERT INTO booths (id, nama_zona, kode_booth, koordinat_x, koordinat_y, deskripsi_zona, kapasitas_display) VALUES
('b0000000-0000-4000-8000-000000000001', 'Zona A - Galeri Lukis Sejarah', 'booth-a', 22.5, 45.0, 'Eksibisi lukisan sejarah.', 8),
('b0000000-0000-4000-8000-000000000002', 'Zona B - Galeri Kerajinan & Kriya Tangan', 'booth-b', 50.0, 30.0, 'Koleksi kerajinan 3D.', 10),
('b0000000-0000-4000-8000-000000000003', 'Zona C - Pojok Gambar & Live Painting', 'booth-c', 78.0, 45.0, 'Area interaktif sketsa.', 6)
ON CONFLICT (kode_booth) DO NOTHING;

-- ==============================================================================
-- PERLEBAR KOLOM seniman_angkatan (default VARCHAR(10) terlalu kecil)
-- ==============================================================================
ALTER TABLE artworks ALTER COLUMN seniman_angkatan TYPE VARCHAR(30);

-- ==============================================================================
-- FUNGSI PL/pgSQL UNTUK GENERATE BULK ARTWORKS
-- ==============================================================================
DO $$
DECLARE
  TYPE_LUKIS TEXT := 'Lukis';
  TYPE_KERAJINAN TEXT := 'Kerajinan';
  TYPE_SKETSA TEXT := 'Sketsa & Ilustrasi';

  BOOTH_A UUID := 'b0000000-0000-4000-8000-000000000001';
  BOOTH_B UUID := 'b0000000-0000-4000-8000-000000000002';
  BOOTH_C UUID := 'b0000000-0000-4000-8000-000000000003';

  lukis_imgs TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
  ];

  kerajinan_imgs TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
  ];

  sketsa_imgs TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
  ];

  lukis_titles TEXT[] := ARRAY[
    'Kronik Nostalgia: Rekam Jejak',
    'Harmoni Geometris Pesisir Batam',
    'Spektrum Jiwa: Dinamika Eksplorasi',
    'Siluet Senja Kampus Hang Nadim',
    'Garis Memori: Lorong Studio Seni',
    'Simfoni Kanvas: Nafas Sejarah',
    'Retrospeksi Gelombang Biru Selat',
    'Evolusi Kuas: Dialog Ruang dan Warna',
    'Pendar Neon di Malam Sejarah',
    'Cakrawala Abstrak: Fajar Kreativitas'
  ];

  kerajinan_titles TEXT[] := ARRAY[
    'Kriya Totem Arsip: Resin dan Kayu',
    'Terracotta Retro: Wadah Ekspresi',
    'Enigma Kristal: Kotak Pandora',
    'Relik Geometris: Logam dan Neon',
    'Vessel Tanah Liat: Jejak Tangan',
    'Instalasi Palet Kayu: Rumah Sejarah',
    'Skulptur Kawat Tembaga: Siluet Penari',
    'Makrame Tekstil: Anyaman Retro'
  ];

  sketsa_titles TEXT[] := ARRAY[
    'Buku Sketsa Kolektif: Jejak Garis',
    'Jejak Pena: Manifesto Visual',
    'Doodle Spontan: Atmosfer Kampus',
    'Studi Anatomi dan Gestur Spontan',
    'Perspektif Garis: Lorong Arsitektur',
    'Ilustrasi Maskot: Senrup Retro',
    'Storyboard: Perjalanan Sang Kuas',
    'Tipografi Retro: Eksplorasi Huruf'
  ];

  lukis_mediums TEXT[] := ARRAY[
    'Acrylic dan Oil Pastel on Canvas',
    'Mixed Media dan Collage on Canvas',
    'Spray Paint dan Acrylic on Board',
    'Oil on Linen Canvas dan Gold Leaf',
    'Acrylic dan Charcoal on Raw Canvas',
    'Oil on Stretched Canvas',
    'Acrylic, Sand Texture dan Resin Glaze',
    'Mixed Media on Wooden Panel'
  ];

  kerajinan_mediums TEXT[] := ARRAY[
    'Bio-Resin, Reclaimed Teak Wood',
    'Tanah Liat Terracotta, Glaze Enamel',
    'Cast Resin, Iron Wire dan Copper Dust',
    'Aluminium Sheet, Neon Acrylic',
    'Stoneware Clay, Ash Glaze dan Oxide',
    'Recycled Pine Wood, Rope dan LED',
    'Twisted Copper Wire dan Marble Base',
    'Cotton Cord, Wooden Dowel dan Indigo'
  ];

  sketsa_mediums TEXT[] := ARRAY[
    'Ink, Marker dan Charcoal on Canson Paper',
    'Pigment Ink on Acid-Free Paper',
    'Technical Pen dan Waterbrush on Kraft',
    'Charcoal Stick dan Sepia Conte',
    'Fineliner 0.1 dan Grey Copic Marker',
    'Digital Line Art on Art Paper 310gsm',
    'Graphite dan Tinta Cina on Bristol Board',
    'Calligraphy Ink, Gouache dan Stencil'
  ];

  -- Creators data: name, nim, batch, is_anonymous, n_lukis, n_kerajinan, n_sketsa
  c_names TEXT[] := ARRAY['Muhammad Rangga','Siti Nurhaliza','Rian Aditya','Dina Amanda','Kevin Pratama','Samuel Christian','Aiko Senja','Naris Wibowo','Ibra Maulana','Yurila Kartika','Kolektif Anggota Seni Rupa','Pencipta Dirahasiakan'];
  c_nims TEXT[] := ARRAY['3312101012','3312201088','3312301044','3312201015','3312401002','3312201067','3312301091','3312201033','3312101050','3312201009','Kolektif','Rahasia'];
  c_batches TEXT[] := ARRAY['2021','2022','2023','2022','2024 (Maba)','2022','2023','2022','2021','2022','2021-2024','Rahasia'];
  c_nlukis INT[] := ARRAY[7,6,4,3,5,5,4,3,3,6,5,7];
  c_nkerajinan INT[] := ARRAY[4,4,7,6,3,4,4,3,7,4,4,5];
  c_nsketsa INT[] := ARRAY[4,4,4,4,4,5,7,6,3,4,7,6];

  ci INT;
  i INT;
  slug_base TEXT;
  art_slug TEXT;
  art_title TEXT;
  art_desc TEXT;
  likes_val INT;
  year_val TEXT;

  lukis_dims TEXT[] := ARRAY['120 x 90 cm','100 x 100 cm','90 x 120 cm','110 x 85 cm','130 x 95 cm','140 x 100 cm','80 x 120 cm','95 x 95 cm'];
  kerajinan_dims TEXT[] := ARRAY['40x30x60 cm','Set of 4','35x35x45 cm','50x25x70 cm','30x30x40 cm','60x60x85 cm','25x25x55 cm','75x110 cm'];
  sketsa_dims TEXT[] := ARRAY['A3 Journal','50 x 70 cm','40 x 60 cm','65 x 50 cm','A3 (42x29.7cm)','45 x 60 cm','60 x 40 cm','50 x 70 cm'];

BEGIN
  FOR ci IN 1..array_length(c_names, 1) LOOP
    slug_base := lower(regexp_replace(c_names[ci], '[^a-zA-Z0-9]', '-', 'g'));

    -- LUKIS
    FOR i IN 1..c_nlukis[ci] LOOP
      art_slug := slug_base || '-lukis-' || i;
      art_title := lukis_titles[((ci + i - 2) % array_length(lukis_titles, 1)) + 1] || ' #' || i;
      likes_val := 65 + ((ci * 13 + i * 19) % 150);
      year_val := (2021 + ((ci + i) % 4))::TEXT;
      art_desc := 'Karya lukis yang mengeksplorasi tema sejarah dan identitas divisi seni rupa. Diciptakan oleh ' || c_names[ci] || ' untuk pameran Art Showcase bertema History.';

      INSERT INTO artworks (judul, slug, seniman_nama, seniman_nim, seniman_angkatan, kategori, deskripsi_filosofi, medium_bahan, dimensi, tahun_pembuatan, foto_utama_url, booth_id, booth_name, is_highlighted, likes_count, tags)
      VALUES (
        art_title, art_slug, c_names[ci], c_nims[ci], c_batches[ci], TYPE_LUKIS,
        art_desc,
        lukis_mediums[((ci + i - 2) % array_length(lukis_mediums, 1)) + 1],
        lukis_dims[((ci + i - 2) % array_length(lukis_dims, 1)) + 1],
        year_val,
        lukis_imgs[((ci + i - 2) % array_length(lukis_imgs, 1)) + 1],
        BOOTH_A, 'Zona A - Galeri Lukis Sejarah',
        (i = 1), likes_val,
        ARRAY['History', 'Lukis', 'Retro Pop']
      )
      ON CONFLICT (slug) DO NOTHING;
    END LOOP;

    -- KERAJINAN
    FOR i IN 1..c_nkerajinan[ci] LOOP
      art_slug := slug_base || '-kerajinan-' || i;
      art_title := kerajinan_titles[((ci + i - 2) % array_length(kerajinan_titles, 1)) + 1] || ' #' || i;
      likes_val := 50 + ((ci * 17 + i * 23) % 140);
      year_val := (2022 + ((ci + i) % 3))::TEXT;
      art_desc := 'Karya kerajinan tiga dimensi dari material daur ulang dan teknik kriya modern. Persembahan ' || c_names[ci] || ' dalam pameran Art Showcase.';

      INSERT INTO artworks (judul, slug, seniman_nama, seniman_nim, seniman_angkatan, kategori, deskripsi_filosofi, medium_bahan, dimensi, tahun_pembuatan, foto_utama_url, booth_id, booth_name, is_highlighted, likes_count, tags)
      VALUES (
        art_title, art_slug, c_names[ci], c_nims[ci], c_batches[ci], TYPE_KERAJINAN,
        art_desc,
        kerajinan_mediums[((ci + i - 2) % array_length(kerajinan_mediums, 1)) + 1],
        kerajinan_dims[((ci + i - 2) % array_length(kerajinan_dims, 1)) + 1],
        year_val,
        kerajinan_imgs[((ci + i - 2) % array_length(kerajinan_imgs, 1)) + 1],
        BOOTH_B, 'Zona B - Galeri Kerajinan dan Kriya Tangan',
        (i = 1), likes_val,
        ARRAY['Craft', 'Kerajinan', '3D Art']
      )
      ON CONFLICT (slug) DO NOTHING;
    END LOOP;

    -- SKETSA
    FOR i IN 1..c_nsketsa[ci] LOOP
      art_slug := slug_base || '-sketsa-' || i;
      art_title := sketsa_titles[((ci + i - 2) % array_length(sketsa_titles, 1)) + 1] || ' #' || i;
      likes_val := 75 + ((ci * 11 + i * 29) % 160);
      art_desc := 'Sketsa dan ilustrasi bertema History dalam goresan tinta spontan. Rekaman visual karya ' || c_names[ci] || '.';

      INSERT INTO artworks (judul, slug, seniman_nama, seniman_nim, seniman_angkatan, kategori, deskripsi_filosofi, medium_bahan, dimensi, tahun_pembuatan, foto_utama_url, booth_id, booth_name, is_highlighted, likes_count, tags)
      VALUES (
        art_title, art_slug, c_names[ci], c_nims[ci], c_batches[ci], TYPE_SKETSA,
        art_desc,
        sketsa_mediums[((ci + i - 2) % array_length(sketsa_mediums, 1)) + 1],
        sketsa_dims[((ci + i - 2) % array_length(sketsa_dims, 1)) + 1],
        '2024',
        sketsa_imgs[((ci + i - 2) % array_length(sketsa_imgs, 1)) + 1],
        BOOTH_C, 'Zona C - Pojok Gambar dan Live Painting',
        (i = 1), likes_val,
        ARRAY['Sketch', 'Ilustrasi', 'History']
      )
      ON CONFLICT (slug) DO NOTHING;
    END LOOP;

  END LOOP;

  RAISE NOTICE 'Selesai! Karya dummy berhasil di-seed ke tabel artworks.';
END $$;

-- ==============================================================================
-- VERIFIKASI HASIL SEED
-- ==============================================================================
SELECT
  seniman_nama AS "Pencipta",
  kategori AS "Kategori",
  COUNT(*) AS "Jumlah Karya"
FROM artworks
GROUP BY seniman_nama, kategori
ORDER BY seniman_nama, kategori;

SELECT
  'TOTAL KARYA' AS "Label",
  COUNT(*) AS "Jumlah"
FROM artworks;
