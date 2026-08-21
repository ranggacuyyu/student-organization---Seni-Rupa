<?php

namespace Database\Seeders;

use App\Models\PanitiaTask;
use Illuminate\Database\Seeder;

class PanitiaTaskSeeder extends Seeder
{
    public function run(): void
    {
        $tasks = [
            [
                'id' => 'task-1',
                'title' => 'Cek Sound System & Mic Panggung Utama',
                'location' => 'Zona D - Panggung',
                'assigned_to' => 'Aiko Valerie',
                'priority' => 'Tinggi',
                'is_completed' => true,
                'category' => 'Peralatan',
            ],
            [
                'id' => 'task-2',
                'title' => 'Setup Standby QR Scanner Pintu Masuk',
                'location' => 'Lobby Pintu Masuk Lt. 3',
                'assigned_to' => 'Samuel Siregar',
                'priority' => 'Tinggi',
                'is_completed' => true,
                'category' => 'Registrasi',
            ],
            [
                'id' => 'task-3',
                'title' => 'Pemeriksaan Pencahayaan Spotlight Zona Lukis',
                'location' => 'Zona A - Galeri Lukis',
                'assigned_to' => 'Ibra Pratama',
                'priority' => 'Sedang',
                'is_completed' => false,
                'category' => 'Display Seni',
            ],
            [
                'id' => 'task-4',
                'title' => 'Restock Suvenir Sticker Pack & Digital Pass',
                'location' => 'Zona E - Photobooth',
                'assigned_to' => 'Yurila Ananda',
                'priority' => 'Tinggi',
                'is_completed' => false,
                'category' => 'Logistik Peserta',
            ],
            [
                'id' => 'task-5',
                'title' => 'Siapkan Cat Akrilik & Kanvas Kosong Live Painting',
                'location' => 'Zona C - Live Painting',
                'assigned_to' => 'Ibra Pratama',
                'priority' => 'Sedang',
                'is_completed' => true,
                'category' => 'Display Seni',
            ],
        ];

        foreach ($tasks as $task) {
            PanitiaTask::updateOrCreate(['id' => $task['id']], $task);
        }
    }
}
