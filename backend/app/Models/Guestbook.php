<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guestbook extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nama_pengirim',
        'status_pengirim',
        'pesan',
        'stiker_ikon',
        'warna_kartu',
        'ip_address',
        'is_moderated',
    ];

    protected $casts = [
        'is_moderated' => 'boolean',
    ];
}
