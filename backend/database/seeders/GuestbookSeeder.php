<?php

namespace Database\Seeders;

use App\Models\Guestbook;
use Illuminate\Database\Seeder;

class GuestbookSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'id' => 'gb-1',
                'nama_pengirim' => 'Alifia Zahra',
                'status_pengirim' => 'Mahasiswa Baru (IF)',
                'pesan' => 'Pamerannya seru banget! Warna-warni retromya bikin betah keliling Student Centre Lt. 3. Sukses terus Divisi Seni Rupa!',
                'stiker_ikon' => 'retro-star',
                'warna_kartu' => 'bg-[#FFE600]',
                'ip_address' => '180.254.88.12',
                'is_moderated' => true,
            ],
            [
                'id' => 'gb-2',
                'nama_pengirim' => 'Dimas Anggara',
                'status_pengirim' => 'Mahasiswa Polibatam (EL)',
                'pesan' => 'Karya totem resin kayu daur ulang sangat berkesan. Makna filosofinya dalem banget. Ditunggu open recruitmentnya!',
                'stiker_ikon' => 'retro-heart',
                'warna_kartu' => 'bg-[#FF3388]',
                'ip_address' => '114.122.34.90',
                'is_moderated' => true,
            ],
            [
                'id' => 'gb-3',
                'nama_pengirim' => 'Clara Salsabila',
                'status_pengirim' => 'Pengunjung Umum',
                'pesan' => 'Live paintingnya keren parah! Sempat nyoba corat-coret di pojok buku sketsa bersama. Seru pol!',
                'stiker_ikon' => 'retro-brush',
                'warna_kartu' => 'bg-[#00F0FF]',
                'ip_address' => '182.1.240.55',
                'is_moderated' => true,
            ],
        ];

        foreach ($messages as $msg) {
            Guestbook::updateOrCreate(['id' => $msg['id']], $msg);
        }
    }
}
