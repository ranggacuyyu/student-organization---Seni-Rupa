<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rundowns', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->integer('urutan')->default(1);
            $table->string('sesi_kegiatan', 150);
            $table->text('deskripsi')->nullable();
            $table->string('pengisi_acara', 150)->nullable();
            $table->string('lokasi_sesi', 150)->default('Panggung Utama Student Centre Lt 3');
            $table->string('waktu_mulai', 20)->nullable();
            $table->string('waktu_selesai', 20)->nullable();
            $table->string('time', 50)->nullable();
            $table->string('category', 50)->nullable();
            $table->string('status', 30)->default('upcoming'); // 'upcoming', 'ongoing', 'completed'
            $table->date('tanggal_acara')->nullable();
            $table->string('booth_id')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('urutan');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rundowns');
    }
};
