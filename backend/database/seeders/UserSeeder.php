<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'id' => 'user-admin-1',
                'name' => 'Muhammad Rangga',
                'username' => 'admin_senrup',
                'email' => 'rangga@senrup.polibatam.ac.id',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'divisi' => 'Koordinator Utama & Pameran',
                'assigned_booth' => 'Semua Zona (Lt. 3)',
                'kontak' => '0812-3456-7890',
                'status' => 'active',
                'avatar_bg' => 'bg-[#FF3388]',
            ],
            [
                'id' => 'user-panitia-1',
                'name' => 'Samuel Siregar',
                'username' => 'panitia_registrasi',
                'email' => 'samuel@senrup.polibatam.ac.id',
                'password' => Hash::make('panitia123'),
                'role' => 'panitia',
                'divisi' => 'Divisi Registrasi & Presensi',
                'assigned_booth' => 'Pintu Masuk (Lobby Lt. 3)',
                'kontak' => '0813-8899-1122',
                'status' => 'active',
                'avatar_bg' => 'bg-[#FFE600]',
            ],
            [
                'id' => 'user-panitia-2',
                'name' => 'Aiko Valerie',
                'username' => 'panitia_acara',
                'email' => 'aiko@senrup.polibatam.ac.id',
                'password' => Hash::make('panitia123'),
                'role' => 'panitia',
                'divisi' => 'Divisi Acara & Rundown',
                'assigned_booth' => 'Zona D - Panggung Utama',
                'kontak' => '0821-4455-6677',
                'status' => 'active',
                'avatar_bg' => 'bg-[#00F0FF]',
            ],
            [
                'id' => 'user-panitia-3',
                'name' => 'Ibra Pratama',
                'username' => 'panitia_galeri',
                'email' => 'ibra@senrup.polibatam.ac.id',
                'password' => Hash::make('panitia123'),
                'role' => 'panitia',
                'divisi' => 'Divisi Perlengkapan & Display',
                'assigned_booth' => 'Zona A & Zona B (Galeri)',
                'kontak' => '0856-7788-9900',
                'status' => 'active',
                'avatar_bg' => 'bg-[#7B2CBF]',
            ],
            [
                'id' => 'user-panitia-4',
                'name' => 'Yurila Ananda',
                'username' => 'panitia_souvenir',
                'email' => 'yurila@senrup.polibatam.ac.id',
                'password' => Hash::make('panitia123'),
                'role' => 'panitia',
                'divisi' => 'Divisi Suvenir & Photobooth',
                'assigned_booth' => 'Zona E - Photobooth Retro',
                'kontak' => '0877-1122-3344',
                'status' => 'active',
                'avatar_bg' => 'bg-[#22C55E]',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['username' => $user['username']], $user);
        }
    }
}
