<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary(); // ORDER-SR-TIMESTAMP-RANDOM
            $table->string('artwork_id');
            $table->string('artwork_title');
            $table->string('buyer_name');
            $table->string('buyer_email');
            $table->string('buyer_phone');
            $table->text('pickup_notes')->nullable();
            $table->unsignedBigInteger('gross_amount');
            $table->string('payment_type')->nullable(); // qris, bank_transfer, gopay, cstore, etc.
            $table->string('transaction_status')->default('pending'); // pending, settlement, cancel, expire, failure, deny
            $table->text('snap_token')->nullable();
            $table->text('snap_redirect_url')->nullable();
            $table->string('midtrans_transaction_id')->nullable();
            $table->timestamp('settled_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->boolean('is_picked_up')->default(false); // Status serah terima fisik di booth
            $table->timestamp('picked_up_at')->nullable();
            $table->string('picked_up_by_admin')->nullable();
            $table->json('raw_response')->nullable(); // Log status dari Midtrans webhook
            $table->timestamps();

            $table->foreign('artwork_id')->references('id')->on('artworks')->onDelete('cascade');
            $table->index(['artwork_id', 'transaction_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
