<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanitiaAnnouncement extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'content',
        'author',
        'waktu',
        'is_pinned',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
    ];
}
