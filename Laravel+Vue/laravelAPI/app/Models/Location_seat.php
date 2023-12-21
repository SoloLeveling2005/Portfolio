<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location_seat extends Model
{
    use HasFactory;

    protected $guarded = [];

    public $timestamps = false;


    public function location_seat_row()
    {
        return $this->belongsTo(Location_seatRow::class, 'location_seat_row_id', 'id');
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'id');
    }
}
