<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function concert()
    {
        return $this->belongsTo(Concert::class, 'concert_id', 'id');
    }

    public function locationSeatRow()
    {
        return $this->hasMany(LocationSeatRow::class, 'show_id', 'id');
    }
}
