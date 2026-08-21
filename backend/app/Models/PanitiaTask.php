<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PanitiaTask extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'location',
        'assigned_to',
        'priority',
        'is_completed',
        'category',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
    ];
}
