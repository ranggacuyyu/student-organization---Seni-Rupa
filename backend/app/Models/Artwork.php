<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'judul',
        'slug',
        'seniman_nama',
        'seniman_nim',
        'seniman_angkatan',
        'kategori',
        'deskripsi_filosofi',
        'medium_bahan',
        'dimensi',
        'price',
        'is_for_sale',
        'sale_status',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'current_order_id',
        'booked_until',
        'tahun_pembuatan',
        'foto_utama_url',
        'foto_tambahan_urls',
        'booth_id',
        'booth_name',
        'is_highlighted',
        'likes_count',
        'tags',
    ];

    protected $casts = [
        'price' => 'integer',
        'is_for_sale' => 'boolean',
        'is_highlighted' => 'boolean',
        'likes_count' => 'integer',
        'booked_until' => 'datetime',
        'foto_tambahan_urls' => 'array',
        'tags' => 'array',
    ];

    public function booth()
    {
        return $this->belongsTo(Booth::class, 'booth_id', 'id');
    }

    public function likes()
    {
        return $this->hasMany(ArtworkLike::class, 'artwork_id', 'id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'artwork_id', 'id');
    }
}
