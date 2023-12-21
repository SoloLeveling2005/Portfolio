<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationSeatRow extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function show()
    {
        return $this->belongsTo(Show::class, 'show_id', 'id');
    }

    public function seats()
    {
        return $this->hasMany(Location_seat::class, 'location_seat_row_id', 'id');
    }
}
