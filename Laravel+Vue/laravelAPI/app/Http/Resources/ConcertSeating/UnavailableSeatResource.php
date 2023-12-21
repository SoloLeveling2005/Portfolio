<?php

namespace App\Http\Resources\ConcertSeating;

use Illuminate\Http\Resources\Json\JsonResource;

class UnavailableSeatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->number;
    }
}
