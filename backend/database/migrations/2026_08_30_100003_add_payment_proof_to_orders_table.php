<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'payment_proof_url')) {
                $table->text('payment_proof_url')->nullable()->after('payment_type');
            }
            if (!Schema::hasColumn('orders', 'admin_notes')) {
                $table->text('admin_notes')->nullable()->after('payment_proof_url');
            }
            if (!Schema::hasColumn('orders', 'verified_by_admin')) {
                $table->string('verified_by_admin')->nullable()->after('admin_notes');
            }
            if (!Schema::hasColumn('orders', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('verified_by_admin');
            }
            if (!Schema::hasColumn('orders', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('verified_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'payment_proof_url',
                'admin_notes',
                'verified_by_admin',
                'verified_at',
                'rejection_reason',
            ]);
        });
    }
};
