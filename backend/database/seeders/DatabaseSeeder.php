<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            BoothSeeder::class,
            UserSeeder::class,
            ArtworkSeeder::class,
            RundownSeeder::class,
            AttendanceSeeder::class,
            GuestbookSeeder::class,
            PanitiaTaskSeeder::class,
            PanitiaAnnouncementSeeder::class,
        ]);
    }
}
