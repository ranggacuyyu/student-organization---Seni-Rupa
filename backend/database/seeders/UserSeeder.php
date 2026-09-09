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
                'id' => 'a1000000-0000-4000-8000-000000000001',
                'name' => 'Muhammad Rangga',
                'username' => 'admin_senrupaaja',
                'email' => 'rangga@senrup.polibatam.ac.id',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'divisi' => 'Koordinator Utama & Pameran',
                'assigned_booth' => 'Semua Zona (Lt. 3)',
                'kontak' => '0812-3456-7890',
                'status' => 'active',
                'avatar_bg' => 'bg-[#FF3388]',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(['username' => $user['username']], $user);
        }
    }
}
