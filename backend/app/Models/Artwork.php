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
        'is_highlighted' => 'boolean',
        'likes_count' => 'integer',
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
}
