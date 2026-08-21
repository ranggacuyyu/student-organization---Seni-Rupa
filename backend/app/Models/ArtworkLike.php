<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtworkLike extends Model
{
    use HasFactory;

    protected $fillable = [
        'artwork_id',
        'ip_address',
        'identifier',
    ];

    public function artwork()
    {
        return $this->belongsTo(Artwork::class, 'artwork_id', 'id');
    }
}
