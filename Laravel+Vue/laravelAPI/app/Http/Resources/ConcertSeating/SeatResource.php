<?php

namespace App\Http\Resources\ConcertSeating;

use App\Models\Location_seat;
use Illuminate\Http\Resources\Json\JsonResource;

class SeatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $seats = Location_seat::where(['location_seat_row_id' => $this->id])->get();
        $total = count($seats);
        $unavailable = $seats->filter(function ($seat) {

            if (!$seat->reservation_id and !$seat->ticket_id) {
                return true;
            }

            return false;
        });
        return [
            'total' => $total,
            'unavailable' => UnavailableSeatResource::collection($unavailable),
        ];
    }
}
