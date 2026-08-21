<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rundown extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'urutan',
        'sesi_kegiatan',
        'deskripsi',
        'pengisi_acara',
        'lokasi_sesi',
        'waktu_mulai',
        'waktu_selesai',
        'time',
        'category',
        'status',
        'tanggal_acara',
        'booth_id',
    ];

    protected $casts = [
        'urutan' => 'integer',
        'tanggal_acara' => 'date',
    ];
}
