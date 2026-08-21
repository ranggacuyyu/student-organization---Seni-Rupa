<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artworks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('judul');
            $table->string('slug')->unique();
            $table->string('seniman_nama');
            $table->string('seniman_nim')->nullable();
            $table->string('seniman_angkatan')->nullable();
            $table->string('kategori');
            $table->text('deskripsi_filosofi');
            $table->string('medium_bahan')->nullable();
            $table->string('dimensi')->nullable();
            $table->string('tahun_pembuatan')->default('2024');
            $table->text('foto_utama_url');
            $table->json('foto_tambahan_urls')->nullable();
            $table->string('booth_id')->nullable();
            $table->string('booth_name')->nullable();
            $table->boolean('is_highlighted')->default(false);
            $table->integer('likes_count')->default(0);
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->index('kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artworks');
    }
};
