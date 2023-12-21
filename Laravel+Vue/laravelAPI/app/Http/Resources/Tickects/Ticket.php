<?php

namespace App\Http\Resources\Tickects;

use App\Models\Location;
use App\Models\Location_seat;
use App\Models\Location_seatRow;
use App\Models\Show;
use Illuminate\Http\Resources\Json\JsonResource;

class Ticket extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $location_seat = Location_seat::where(['ticket_id' => $this->id])->first();
        $location_seat_row = Location_seatRow::where(['id' => $location_seat->location_seat_row_id])->first();
        $show = Show::with(['concert'])->where(['id' => $location_seat_row->show_id])->first();
        $concert = $show->concert;
        $location = Location::where(['id' => $concert->location_id])->first();
        return [
            'id' => $this->id,
            'code' => $this->code,
            'created_at' => $this->created_at,
            'row' => [
                'id' => $location_seat_row->id,
                'name' => $location_seat_row->name
            ],
            'seat' => $location_seat->number,
            'show' => [
                'id' => $show->id,
                'start' => $show->start,
                'end' => $show->end,
                'concert' => [
                    'id' => $concert->id,
                    'artist' => $concert->artist,
                    'location' => $location
                ]
            ]
        ];
    }
}
