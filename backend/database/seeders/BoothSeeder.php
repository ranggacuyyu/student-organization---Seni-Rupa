<?php

namespace Database\Seeders;

use App\Models\Booth;
use Illuminate\Database\Seeder;

class BoothSeeder extends Seeder
{
    public function run(): void
    {
        $booths = [
            [
                'id' => 'booth-a',
                'nama_zona' => 'Zona A - Galeri Karya Lukis',
                'kode_booth' => 'booth-a',
                'koordinat_x' => 22.5,
                'koordinat_y' => 45.0,
                'deskripsi_zona' => 'Pameran karya lukisan kanvas, akrilik, dan mixed media karya anggota divisi sejak awal berdiri hingga angkatan terbaru.',
                'kapasitas_display' => 12,
                'color' => '#FFE600',
                'accent' => 'bg-[#FFE600]',
                'icon' => 'Palette',
                'location' => 'Sisi Utara Student Centre Lt. 3 (Dekat Pencahayaan Jendela Kaca)',
                'activities' => ['Display Lukisan Masterpiece', 'Kurasi Sejarah Karya', 'Sesi Diskusi Seniman'],
            ],
            [
                'id' => 'booth-b',
                'nama_zona' => 'Zona B - Galeri Kerajinan & Kriya Tangan',
                'kode_booth' => 'booth-b',
                'koordinat_x' => 50.0,
                'koordinat_y' => 30.0,
                'deskripsi_zona' => 'Display produk kriya tiga dimensi, resin craft, terracotta modern, makrame, dan kerajinan tangan hasil workshop anggota.',
                'kapasitas_display' => 8,
                'color' => '#FF3388',
                'accent' => 'bg-[#FF3388]',
                'icon' => 'Hammer',
                'location' => 'Sisi Timur Student Centre Lt. 3',
                'activities' => ['Showcase Karya 3D', 'Mini Merchandise Display', 'Eksplorasi Material Bahan'],
            ],
            [
                'id' => 'booth-c',
                'nama_zona' => 'Zona C - Pojok Gambar & Live Painting',
                'kode_booth' => 'booth-c',
                'koordinat_x' => 78.0,
                'koordinat_y' => 45.0,
                'deskripsi_zona' => 'Area terbuka interaktif! Peserta dan pengunjung dapat membuat sketsa di Buku Bersama dan menyaksikan aksi Live Painting anggota.',
                'kapasitas_display' => 6,
                'color' => '#00F0FF',
                'accent' => 'bg-[#00F0FF]',
                'icon' => 'Brush',
                'location' => 'Pusat Tengah Student Centre Lt. 3',
                'activities' => ['Buku Sketsa Bersama (Pojok Gambar)', 'Live Painting Action', 'Random Drawing Session'],
            ],
            [
                'id' => 'booth-d',
                'nama_zona' => 'Zona D - Panggung Utama (Talkshow & Seminar)',
                'kode_booth' => 'booth-d',
                'koordinat_x' => 50.0,
                'koordinat_y' => 75.0,
                'deskripsi_zona' => 'Panggung pembukaan, seminar seni rupa, sharing session jejak divisi seni rupa, games tebak gambar, dan seremonial penutupan.',
                'kapasitas_display' => 12,
                'color' => '#7B2CBF',
                'accent' => 'bg-[#7B2CBF]',
                'icon' => 'Mic2',
                'location' => 'Sisi Barat Student Centre Lt. 3',
                'activities' => ['Opening Ceremony', 'Talkshow Jejak Seni', 'Seminar Seni', 'Games Tebak Gambar', 'Closing'],
            ],
            [
                'id' => 'booth-e',
                'nama_zona' => 'Zona E - Photobooth Retro & Info Desk',
                'kode_booth' => 'booth-e',
                'koordinat_x' => 85.0,
                'koordinat_y' => 80.0,
                'deskripsi_zona' => 'Spot foto berlatar Memphis Pop Art 90s, registrasi ulang presensi mandiri, stiker pack resmi divisi, dan penyerahan suvenir.',
                'kapasitas_display' => 5,
                'color' => '#FF6B35',
                'accent' => 'bg-[#FF6B35]',
                'icon' => 'Camera',
                'location' => 'Pintu Masuk Student Centre Lt. 3',
                'activities' => ['Scan Presensi QR', 'Photobooth Props Retro', 'Pengisian Pesan Kesan Digital'],
            ],
        ];

        foreach ($booths as $booth) {
            Booth::updateOrCreate(['id' => $booth['id']], $booth);
        }
    }
}
