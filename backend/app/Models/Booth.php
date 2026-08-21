<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booth extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_zona',
        'kode_booth',
        'koordinat_x',
        'koordinat_y',
        'deskripsi_zona',
        'kapasitas_display',
        'color',
        'accent',
        'icon',
        'location',
        'activities',
    ];

    protected $casts = [
        'koordinat_x' => 'float',
        'koordinat_y' => 'float',
        'kapasitas_display' => 'integer',
        'activities' => 'array',
    ];

    public function artworks()
    {
        return $this->hasMany(Artwork::class, 'booth_id', 'id');
    }
}
