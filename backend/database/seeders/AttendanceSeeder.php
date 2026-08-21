<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $attendances = [
            [
                'id' => 'att-1',
                'nama_lengkap' => 'Fajar Nugraha',
                'identifier' => '3312401032',
                'kategori' => 'Mahasiswa Baru',
                'jurusan_prodi' => 'D4 Teknik Informatika',
                'ip_address' => '180.254.68.12',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
                'device_type' => 'Desktop (Windows)',
                'waktu_kehadiran' => '2024-10-28 09:12:45',
                'catatan' => 'Sangat kagum dengan karya lukis retro di Zona A!',
                'is_checked_in' => true,
                'is_souvenir_claimed' => true,
            ],
            [
                'id' => 'att-2',
                'nama_lengkap' => 'Nadia Putri Lestari',
                'identifier' => '3312401089',
                'kategori' => 'Mahasiswa Baru',
                'jurusan_prodi' => 'D4 Animasi & Desain Grafis',
                'ip_address' => '114.122.34.90',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Safari/605.1',
                'device_type' => 'Mobile (iPhone)',
                'waktu_kehadiran' => '2024-10-28 09:18:22',
                'catatan' => 'Tertarik ikut live painting dan join divisi seni rupa.',
                'is_checked_in' => true,
                'is_souvenir_claimed' => false,
            ],
            [
                'id' => 'att-3',
                'nama_lengkap' => 'Bayu Pratama',
                'identifier' => '3312201011',
                'kategori' => 'Mahasiswa Polibatam',
                'jurusan_prodi' => 'D3 Teknik Mesin',
                'ip_address' => '182.1.240.55',
                'user_agent' => 'Mozilla/5.0 (Linux; Android 14; Pixel 7) Mobile Chrome/127.0',
                'device_type' => 'Mobile (Android)',
                'waktu_kehadiran' => '2024-10-28 09:25:04',
                'catatan' => 'Keren sekali kriya resin tiga dimensinya.',
                'is_checked_in' => false,
                'is_souvenir_claimed' => false,
            ],
            [
                'id' => 'att-4',
                'nama_lengkap' => 'Dr. Ir. Hendra Prasetyo, M.T.',
                'identifier' => '198204152008121002',
                'kategori' => 'Dosen/Staff',
                'jurusan_prodi' => 'Teknik Informatika Polibatam',
                'ip_address' => '103.111.201.5',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/128.0',
                'device_type' => 'Desktop (macOS)',
                'waktu_kehadiran' => '2024-10-28 09:40:11',
                'catatan' => 'Apresiasi tinggi untuk kreativitas mahasiswa divisi seni rupa!',
                'is_checked_in' => true,
                'is_souvenir_claimed' => true,
            ],
            [
                'id' => 'att-5',
                'nama_lengkap' => 'Riska Septiani',
                'identifier' => '3312301055',
                'kategori' => 'Mahasiswa Polibatam',
                'jurusan_prodi' => 'D4 Rekayasa Keamanan Siber',
                'ip_address' => '180.254.70.88',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/129.0',
                'device_type' => 'Desktop (Windows)',
                'waktu_kehadiran' => '2024-10-28 10:05:30',
                'catatan' => 'Konsep website dan pamerannya sangat futuristik tapi retro!',
                'is_checked_in' => false,
                'is_souvenir_claimed' => false,
            ],
        ];

        foreach ($attendances as $att) {
            Attendance::updateOrCreate(['id' => $att['id']], $att);
        }
    }
}
