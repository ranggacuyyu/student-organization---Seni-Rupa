<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama_lengkap', 150);
            $table->string('identifier', 50);
            $table->string('kategori', 50);
            $table->string('jurusan_prodi', 100)->nullable();
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();
            $table->string('device_type', 50)->nullable();
            $table->timestamp('waktu_kehadiran')->useCurrent();
            $table->text('catatan')->nullable();
            $table->boolean('is_checked_in')->default(false);
            $table->boolean('is_souvenir_claimed')->default(false);
            $table->timestamps();

            $table->index('ip_address');
            $table->index('kategori');
            $table->index('identifier');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
