<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'artwork_id',
        'artwork_title',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'pickup_notes',
        'gross_amount',
        'payment_type',
        'payment_proof_url',
        'admin_notes',
        'verified_by_admin',
        'verified_at',
        'rejection_reason',
        'transaction_status',
        'snap_token',
        'snap_redirect_url',
        'midtrans_transaction_id',
        'settled_at',
        'expired_at',
        'is_picked_up',
        'picked_up_at',
        'picked_up_by_admin',
        'raw_response',
    ];

    protected $casts = [
        'gross_amount' => 'integer',
        'is_picked_up' => 'boolean',
        'settled_at' => 'datetime',
        'verified_at' => 'datetime',
        'expired_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'raw_response' => 'array',
    ];

    public function artwork()
    {
        return $this->belongsTo(Artwork::class, 'artwork_id', 'id');
    }
}
