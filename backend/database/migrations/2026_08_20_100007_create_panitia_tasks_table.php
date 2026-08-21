<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('panitia_tasks', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('location')->nullable();
            $table->string('assigned_to')->nullable();
            $table->string('priority')->default('Sedang'); // 'Tinggi', 'Sedang', 'Rendah'
            $table->boolean('is_completed')->default(false);
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('panitia_tasks');
    }
};
