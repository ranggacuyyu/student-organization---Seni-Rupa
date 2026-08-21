<?php

namespace Database\Seeders;

use App\Models\PanitiaAnnouncement;
use Illuminate\Database\Seeder;

class PanitiaAnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $announcements = [
            [
                'id' => 'ann-1',
                'title' => 'Briefing Tim Pagi di Lantai 3 Student Centre',
                'content' => 'Seluruh koordinator harap kumpul jam 09.30 WIB untuk cek sound, koneksi scanner QR, dan stok stiker souvenir.',
                'author' => 'Muhammad Rangga (Ketua)',
                'waktu' => '08:45 WIB',
                'is_pinned' => true,
            ],
            [
                'id' => 'ann-2',
                'title' => 'Kupon Photobooth Khusus Mahasiswa Baru',
                'content' => 'Maba yang menunjukkan tiket digital dengan status terverifikasi berhak mendapatkan 1x sesi gratis di Zona E Photobooth.',
                'author' => 'Yurila Ananda (Suvenir)',
                'waktu' => '09:15 WIB',
                'is_pinned' => false,
            ],
        ];

        foreach ($announcements as $ann) {
            PanitiaAnnouncement::updateOrCreate(['id' => $ann['id']], $ann);
        }
    }
}
