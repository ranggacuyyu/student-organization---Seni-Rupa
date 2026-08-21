<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guestbooks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama_pengirim', 150);
            $table->string('status_pengirim', 50)->default('Pengunjung Pameran');
            $table->text('pesan');
            $table->string('stiker_ikon', 50)->default('retro-star');
            $table->string('warna_kartu', 50)->default('bg-[#FFE600]');
            $table->string('ip_address', 45)->nullable();
            $table->boolean('is_moderated')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guestbooks');
    }
};
