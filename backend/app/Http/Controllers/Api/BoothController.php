<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booth;
use Illuminate\Http\Request;

class BoothController extends Controller
{
    private function getDefaultBooths(): array
    {
        return [
            [
                'id' => 'booth-a',
                'name' => 'Zona A - Galeri Karya Lukis',
                'code' => 'ZONA-A',
                'x' => 22.5,
                'y' => 45.0,
                'description' => 'Pameran karya lukisan kanvas, akrilik, dan mixed media karya anggota divisi sejak awal berdiri hingga angkatan terbaru.',
                'featuredCount' => 12,
                'color' => '#FFE600',
                'accent' => 'bg-[#FFE600]',
                'icon' => 'Palette',
                'location' => 'Sisi Utara Student Centre Lt. 3 (Dekat Pencahayaan Jendela Kaca)',
                'activities' => ['Display Lukisan Masterpiece', 'Kurasi Sejarah Karya', 'Sesi Diskusi Seniman'],
            ],
            [
                'id' => 'booth-b',
                'name' => 'Zona B - Galeri Kerajinan & Kriya Tangan',
                'code' => 'ZONA-B',
                'x' => 50.0,
                'y' => 30.0,
                'description' => 'Display produk kriya tiga dimensi, resin craft, terracotta modern, makrame, dan kerajinan tangan hasil workshop anggota.',
                'featuredCount' => 8,
                'color' => '#FF3388',
                'accent' => 'bg-[#FF3388]',
                'icon' => 'Hammer',
                'location' => 'Sisi Timur Student Centre Lt. 3',
                'activities' => ['Showcase Karya 3D', 'Mini Merchandise Display', 'Eksplorasi Material Bahan'],
            ],
            [
                'id' => 'booth-c',
                'name' => 'Zona C - Pojok Gambar & Live Painting',
                'code' => 'ZONA-C',
                'x' => 78.0,
                'y' => 45.0,
                'description' => 'Area terbuka interaktif! Peserta dan pengunjung dapat membuat sketsa di Buku Bersama dan menyaksikan aksi Live Painting anggota.',
                'featuredCount' => 6,
                'color' => '#00F0FF',
                'accent' => 'bg-[#00F0FF]',
                'icon' => 'Brush',
                'location' => 'Pusat Tengah Student Centre Lt. 3',
                'activities' => ['Buku Sketsa Bersama (Pojok Gambar)', 'Live Painting Action', 'Random Drawing Session'],
            ],
            [
                'id' => 'booth-d',
                'name' => 'Zona D - Panggung Utama (Talkshow & Seminar)',
                'code' => 'ZONA-D',
                'x' => 50.0,
                'y' => 75.0,
                'description' => 'Panggung pembukaan, seminar seni rupa, sharing session jejak divisi seni rupa, games tebak gambar, dan seremonial penutupan.',
                'featuredCount' => 12,
                'color' => '#7B2CBF',
                'accent' => 'bg-[#7B2CBF]',
                'icon' => 'Mic2',
                'location' => 'Sisi Barat Student Centre Lt. 3',
                'activities' => ['Opening Ceremony', 'Talkshow Jejak Seni', 'Seminar Seni', 'Games Tebak Gambar', 'Closing'],
            ],
            [
                'id' => 'booth-e',
                'name' => 'Zona E - Photobooth Retro & Info Desk',
                'code' => 'ZONA-E',
                'x' => 85.0,
                'y' => 80.0,
                'description' => 'Spot foto berlatar Memphis Pop Art 90s, registrasi ulang presensi mandiri, stiker pack resmi divisi, dan penyerahan suvenir.',
                'featuredCount' => 5,
                'color' => '#FF6B35',
                'accent' => 'bg-[#FF6B35]',
                'icon' => 'Camera',
                'location' => 'Pintu Masuk Student Centre Lt. 3',
                'activities' => ['Scan Presensi QR', 'Photobooth Props Retro', 'Pengisian Pesan Kesan Digital'],
            ],
        ];
    }

    private function formatBooth(Booth $b): array
    {
        return [
            'id' => $b->id,
            'name' => $b->nama_zona,
            'code' => $b->kode_booth ?: strtoupper(str_replace('-', '', $b->id)),
            'x' => $b->koordinat_x,
            'y' => $b->koordinat_y,
            'description' => $b->deskripsi_zona,
            'featuredCount' => $b->kapasitas_display,
            'color' => $b->color ?: '#FFE600',
            'accent' => $b->accent ?: 'bg-[#FFE600]',
            'icon' => $b->icon ?: 'Palette',
            'location' => $b->location,
            'activities' => $b->activities ?? [],
        ];
    }

    public function index()
    {
        $booths = Booth::all();

        if ($booths->isEmpty()) {
            $defaults = $this->getDefaultBooths();
            try {
                foreach ($defaults as $def) {
                    Booth::create([
                        'id' => $def['id'],
                        'nama_zona' => $def['name'],
                        'kode_booth' => $def['code'],
                        'koordinat_x' => $def['x'],
                        'koordinat_y' => $def['y'],
                        'deskripsi_zona' => $def['description'],
                        'kapasitas_display' => $def['featuredCount'],
                        'color' => $def['color'],
                        'accent' => $def['accent'],
                        'icon' => $def['icon'],
                        'location' => $def['location'],
                        'activities' => $def['activities'],
                    ]);
                }
            } catch (\Exception $e) {
                // Return defaults if database creation fails
            }
            return response()->json([
                'success' => true,
                'data' => $defaults,
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $booths->map(fn($b) => $this->formatBooth($b)),
        ]);
    }

    public function show($id)
    {
        $booth = Booth::where('id', $id)->orWhere('kode_booth', $id)->first();
        if (!$booth) {
            $default = collect($this->getDefaultBooths())->firstWhere('id', $id);
            if ($default) {
                return response()->json(['success' => true, 'data' => $default]);
            }
            return response()->json(['success' => false, 'message' => 'Booth tidak ditemukan.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatBooth($booth),
        ]);
    }
}
