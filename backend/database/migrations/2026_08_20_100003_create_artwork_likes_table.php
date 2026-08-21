<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artwork_likes', function (Blueprint $table) {
            $table->id();
            $table->string('artwork_id');
            $table->string('ip_address', 45);
            $table->string('identifier', 50)->nullable();
            $table->timestamps();

            $table->unique(['artwork_id', 'ip_address']);
            $table->foreign('artwork_id')->references('id')->on('artworks')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artwork_likes');
    }
};
