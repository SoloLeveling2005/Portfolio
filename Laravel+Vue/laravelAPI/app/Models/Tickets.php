<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tickets extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function book()
    {
        return $this->belongsTo(Booking::class, 'booking_id', 'id');
    }

    public function location_seat()
    {
        return $this->belongsTo(Location_seat::class, 'id', 'ticket_id');
    }
}
