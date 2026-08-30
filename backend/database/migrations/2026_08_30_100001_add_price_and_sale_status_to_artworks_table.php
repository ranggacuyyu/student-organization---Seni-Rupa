<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artworks', function (Blueprint $table) {
            $table->unsignedBigInteger('price')->default(150000)->after('dimensi'); // Harga karya dalam Rupiah
            $table->boolean('is_for_sale')->default(true)->after('price'); // Apakah karya ini dijual
            $table->string('sale_status')->default('available')->after('is_for_sale'); // available, booked, sold
            $table->string('buyer_name')->nullable()->after('sale_status');
            $table->string('buyer_email')->nullable()->after('buyer_name');
            $table->string('buyer_phone')->nullable()->after('buyer_email');
            $table->string('current_order_id')->nullable()->after('buyer_phone');
            $table->timestamp('booked_until')->nullable()->after('current_order_id');
        });
    }

    public function down(): void
    {
        Schema::table('artworks', function (Blueprint $table) {
            $table->dropColumn([
                'price',
                'is_for_sale',
                'sale_status',
                'buyer_name',
                'buyer_email',
                'buyer_phone',
                'current_order_id',
                'booked_until',
            ]);
        });
    }
};
