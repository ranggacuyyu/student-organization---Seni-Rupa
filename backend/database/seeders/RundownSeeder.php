<?php

namespace Database\Seeders;

use App\Models\Rundown;
use Illuminate\Database\Seeder;

class RundownSeeder extends Seeder
{
    public function run(): void
    {
        $rundowns = [
            [
                'id' => 'run-1',
                'urutan' => 1,
                'time' => '09:00 - 09:30',
                'waktu_mulai' => '09:00',
                'waktu_selesai' => '09:30',
                'sesi_kegiatan' => 'Registrasi Pengunjung & Check-in Presensi',
                'pengisi_acara' => 'Divisi Sekretariat & Registrasi',
                'lokasi_sesi' => 'Zona E - Info Desk Pintu Masuk',
                'category' => 'Administrasi',
                'status' => 'completed',
                'deskripsi' => 'Pengunjung melakukan scan QR absensi atau pengisian presensi digital mandiri dengan pencatatan IP dan identitas mahasiswa.',
                'booth_id' => 'booth-e',
            ],
            [
                'id' => 'run-2',
                'urutan' => 2,
                'time' => '09:30 - 10:30',
                'waktu_mulai' => '09:30',
                'waktu_selesai' => '10:30',
                'sesi_kegiatan' => 'Opening Ceremony & Pengenalan Divisi Seni Rupa',
                'pengisi_acara' => 'Muhammad Rangga (Ketua) & Pembina',
                'lokasi_sesi' => 'Zona D - Panggung Utama',
                'category' => 'Seremonial',
                'status' => 'completed',
                'deskripsi' => 'Sambutan ketua panitia, pemutaran video kilas balik sejarah divisi, dan pembukaan resmi pameran Art Showcase History.',
                'booth_id' => 'booth-d',
            ],
            [
                'id' => 'run-3',
                'urutan' => 3,
                'time' => '10:30 - 12:00',
                'waktu_mulai' => '10:30',
                'waktu_selesai' => '12:00',
                'sesi_kegiatan' => 'Tur Pameran: Eksplorasi Karya Lukis & Kerajinan',
                'pengisi_acara' => 'Kurator Pameran & Seniman Anggota',
                'lokasi_sesi' => 'Zona A & Zona B',
                'category' => 'Pameran',
                'status' => 'ongoing',
                'deskripsi' => 'Sesi tur terpandu mengelilingi display lukisan sejarah dan kriya kerajinan dengan pemaparan makna filosofis oleh masing-masing pembuat karya.',
                'booth_id' => 'booth-a',
            ],
            [
                'id' => 'run-4',
                'urutan' => 4,
                'time' => '13:00 - 14:15',
                'waktu_mulai' => '13:00',
                'waktu_selesai' => '14:15',
                'sesi_kegiatan' => 'Talkshow: Jejak Seni di Kampus Vokasi',
                'pengisi_acara' => 'Narasumber Alumni & Seniman Batam',
                'lokasi_sesi' => 'Zona D - Panggung Utama',
                'category' => 'Talkshow',
                'status' => 'upcoming',
                'deskripsi' => 'Diskusi interaktif seputar kiat berkarya seni rupa, peluang kreatif, dan peran komunitas seni di era digital.',
                'booth_id' => 'booth-d',
            ],
            [
                'id' => 'run-5',
                'urutan' => 5,
                'time' => '14:15 - 15:15',
                'waktu_mulai' => '14:15',
                'waktu_selesai' => '15:15',
                'sesi_kegiatan' => 'Live Painting Action & Pojok Gambar (Buku Sketsa Bersama)',
                'pengisi_acara' => 'Anggota Divisi & Pengunjung',
                'lokasi_sesi' => 'Zona C - Pojok Gambar',
                'category' => 'Interaktif',
                'status' => 'upcoming',
                'deskripsi' => 'Aksi melukis langsung di kanvas raksasa bersamaan dengan pembukaan Pojok Sketsa Bersama di buku arsip kolektif.',
                'booth_id' => 'booth-c',
            ],
            [
                'id' => 'run-6',
                'urutan' => 6,
                'time' => '15:15 - 16:15',
                'waktu_mulai' => '15:15',
                'waktu_selesai' => '16:15',
                'sesi_kegiatan' => 'Random Drawing & Games Interaktif Tebak Gambar',
                'pengisi_acara' => 'Koor Acara & MC',
                'lokasi_sesi' => 'Zona D - Panggung Utama',
                'category' => 'Games & Fun',
                'status' => 'upcoming',
                'deskripsi' => 'Keseruan games tebak sketsa cepat berhadiah merchandise retro edisi terbatas untuk mahasiswa baru dan pengunjung.',
                'booth_id' => 'booth-d',
            ],
            [
                'id' => 'run-7',
                'urutan' => 7,
                'time' => '16:15 - 17:00',
                'waktu_mulai' => '16:15',
                'waktu_selesai' => '17:00',
                'sesi_kegiatan' => 'Kesan Pesan, Pengumuman Karya Terfavorit & Closing',
                'pengisi_acara' => 'Seluruh Panitia & Peserta',
                'lokasi_sesi' => 'Zona D - Panggung Utama',
                'category' => 'Penutupan',
                'status' => 'upcoming',
                'deskripsi' => 'Membaca ulasan buku tamu terbaik, penghargaan karya seni dengan like terbanyak, dan foto bersama seluruh pengunjung.',
                'booth_id' => 'booth-d',
            ],
        ];

        foreach ($rundowns as $run) {
            Rundown::updateOrCreate(['id' => $run['id']], $run);
        }
    }
}
