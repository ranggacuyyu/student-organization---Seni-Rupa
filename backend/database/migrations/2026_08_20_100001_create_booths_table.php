<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('booths', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('nama_zona');
            $table->string('kode_booth')->unique();
            $table->float('koordinat_x')->default(0);
            $table->float('koordinat_y')->default(0);
            $table->text('deskripsi_zona')->nullable();
            $table->integer('kapasitas_display')->default(10);
            $table->string('color')->nullable();
            $table->string('accent')->nullable();
            $table->string('icon')->nullable();
            $table->string('location')->nullable();
            $table->json('activities')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('booths');
    }
};
