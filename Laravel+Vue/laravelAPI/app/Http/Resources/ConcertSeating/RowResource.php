<?php

namespace App\Http\Resources\ConcertSeating;

use App\Models\Location_seat;
use App\Models\Location_seatRow;
use Illuminate\Http\Resources\Json\JsonResource;

class RowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $rows = Location_seatRow::where(['show_id' => $this->id])->get();
        return [

            'id' => $this->id,
            'name' => $this->name,
            'seats' => SeatResource::collection($rows)

        ];
    }
}
