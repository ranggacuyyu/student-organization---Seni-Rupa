<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_lengkap',
        'identifier',
        'kategori',
        'jurusan_prodi',
        'ip_address',
        'user_agent',
        'device_type',
        'waktu_kehadiran',
        'catatan',
        'is_checked_in',
        'is_souvenir_claimed',
    ];

    protected $casts = [
        'is_checked_in' => 'boolean',
        'is_souvenir_claimed' => 'boolean',
        'waktu_kehadiran' => 'datetime',
    ];
}
