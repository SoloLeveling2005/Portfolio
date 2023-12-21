<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Concert;
use App\Models\Location_seat;
use App\Models\Tickets;
use Illuminate\Http\Request;
use App\Http\Resources\Concerts\ConsertResource;
use App\Http\Resources\ConcertSeating\RowResource;
use App\Http\Resources\Tickects\Ticket;
use App\Models\Location;
use App\Models\Location_seatRow;
use App\Models\Reservation;
use App\Models\Show;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ApiController extends Controller
{
    public function get_concerts(Request $request)
    {
        $concerts = Concert::with(['location', 'shows'])->get();
        $concerts = collect(ConsertResource::collection($concerts))->sortBy(function ($item) {
            return $item['artist'];
        });
        return response()->json($concerts, 200);
    }
    public function get_concert(Request $request, $concert_id)
    {
        $concert = Concert::with(['location', 'shows'])->where(['id' => $concert_id])->first();
        if ($concert) {
            return response()->json(new ConsertResource($concert), 200);
        }
        return response()->json(['error' => 'A concert with this ID does not exist'], 404);
    }
    public function show_concert_seating(Request $request, $concert_id, $show_id)
    {
        $show = Show::with(['location_seat_rows'])->where(['id' => $show_id, 'concert_id' => $concert_id])->first();
        if (!$show) {
            return response()->json(["error" => "A concert or show with this ID does not exist"], 404);
        }
        $show = collect($show->location_seat_rows)->sortBy(function ($item) {
            return $item['order'];
        });
        return response()->json(['rows' => RowResource::collection($show)], 200);
    }
    public function add_concert_reservation(Request $request, $concert_id, $show_id)
    {
        // $valid_data = $request->validate([
        //     'reservations.row' => ['required'],
        //     'reservations.seat' => ['required'],
        //     'duration' => ['required'],
        // ]);

        $show = Show::with(['locationSeatRow'])->where(['id' => $show_id, 'concert_id' => $concert_id])->first();
        return response()->json('xi', 200);

        if (!$show) {
            return response()->json(["error" => "A concert or show with this ID does not exist"], 404);
        }

        if (!$request->get('reservation_token')) {
            // Добавляем места.
            $valid_data = $request->validate([
                'reservations' => ['required'],
                'reservations.*.row' => ['required'],
                'reservations.*.seat' => ['required'],
                'duration' => ['required'],
            ]);
            foreach ($valid_data['reservations'] as $reservation) {
                $row = $reservation['row'];
                $duration = $valid_data['duration'];
                $seat = $reservation['seat'];

                $location_seat_row = Location_seat::where([
                    'location_seat_row_id' => $row,
                    'number' => $seat,
                ])->first();
                if ($location_seat_row->reservation_id or $location_seat_row->ticket_id) {
                    return response()->json([
                        "error" => "Validation failed",
                        "fields" => [
                            "reservations" => "Seat $seat in row $row is already token.",
                        ]
                    ], 422);
                }
                if ((int) $duration > 300 or (int) $duration < 1) {
                    return response()->json([
                        "error" => "Validation failed",
                        "fields" => [
                            "duration" => "The duration must be between 1 and 300.",
                        ]
                    ], 422);
                };
            }
            $time = Carbon::now();
            $currentTime = $time->addSecond(300);

            $reservation = Reservation::create([
                'token' => Str::random(32),
                'expires_at' => $currentTime
            ]);

            $location_seat_row->reservation_id = $reservation->id;
            $location_seat_row->save();

            return response()->json([
                "reserved" => true,
                "reservation_token" => $reservation->token,
                "reserved_until" => $reservation->expires_at
            ]);
        }

        $reservation = Reservation::where(['token' => $request->get('reservation_token')])->first();
        if (!$reservation) {
            return response()->json(["error" => "Invalid reservation token"], 403);
        }

        // Заменяем места.
        $reservations = collect(Location_seat::where(['reservation_id' => $reservation->id])->get())->map(function ($item) {
            $i = Location_seat::where(['id' => $item->id])->first();
            $i->reservation_id = null;
            $i->save();
            return;
        });
        $new_reservations = $request->get('reservations');
        if ($new_reservations) {
            $valid_data = $request->validate([
                'reservations' => ['required'],
                'reservations.*.row' => ['required'],
                'reservations.*.seat' => ['required'],
                'duration' => ['required'],
            ]);
            foreach ($valid_data['reservations'] as $reservation) {
                $row = $reservation['row'];
                $duration = $valid_data['duration'];
                $seat = $reservation['seat'];

                $location_seat_row = Location_seat::where([
                    'location_seat_row_id' => $row,
                    'number' => $seat,
                ])->first();
                if ($location_seat_row->reservation_id or $location_seat_row->ticket_id) {
                    return response()->json([
                        "error" => "Validation failed",
                        "fields" => [
                            "reservations" => "Seat $seat in row $row is already token.",
                        ]
                    ], 422);
                }
                if ((int) $duration > 300 or (int) $duration < 1) {
                    return response()->json([
                        "error" => "Validation failed",
                        "fields" => [
                            "duration" => "The duration must be between 1 and 300.",
                        ]
                    ], 422);
                }
            }
            $time = Carbon::now();
            $currentTime = $time->addSecond(300);

            $reservation = Reservation::create([
                'token' => Str::random(32),
                'expires_at' => $currentTime
            ]);

            $location_seat_row->reservation_id = $reservation->id;
            $location_seat_row->save();

            return response()->json([
                "reserved" => true,
                "reservation_token" => $reservation->token,
                "reserved_until" => $reservation->expires_at
            ]);
        } else {

            $reservation->delete();
            return response()->json([
                "reserved" => false,
            ]);
        }
    }
    public function add_concert_booking(Request $request, $concert_id, $show_id)
    {
    }
    public function tickets(Request $request)
    {
        $valid_data = $this->validate($request, [
            'code' => ['required', 'exists:tickets,code'],
            'name' => ['required']
        ]);
        if (!$valid_data) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }
        $ticket = Tickets::with(['book', 'location_seat'])->where(['code' => $valid_data['code']])->first();
        $book_id = $ticket->book->id;
        // TODO Не реализованно фильтрация по order в таблице location_seat_rows
        $tickets = collect(Tickets::where(['booking_id' => $book_id])->get())->sortBy(function ($item) {
            return $item['location_seat']['number'];
        });


        return response()->json(Ticket::collection($tickets), 200);
    }
    public function ticket_cancel(Request $request, $ticket_id)
    {
        $valid_data = $this->validate($request, [
            'code' => ['required', 'exists:tickets,code'],
            'name' => ['required']
        ]);
        if (!$valid_data) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }
        $ticket = Tickets::find($ticket_id);
        if (!$ticket) {
            return response()->json(["error" => "A ticket with this ID does not exist"], 404);
        }

        Tickets::where(['id' => $ticket_id, 'code' => $valid_data['code']])->delete();

        return response()->json([], 204);
    }
}
