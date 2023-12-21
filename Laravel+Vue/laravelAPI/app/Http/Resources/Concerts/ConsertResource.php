<?php

namespace App\Http\Resources\Concerts;

use App\Models\Concert;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Concerts\ConcertLocation;
use App\Http\Resources\Concerts\ConcertShow;


class ConsertResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // $concert = Concert::where([''])
        $shows = collect(ConcertShow::collection($this->shows))->sortBy(function ($item) {
            return $item['start'];
        });
        return [
            'id' => $this->id,
            'artist' => $this->artist,
            'location' => new ConcertLocation($this->location),
            'shows' => $shows
        ];
    }
}
