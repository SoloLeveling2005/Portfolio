<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\FlareClient\Api;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('concerts', [ApiController::class, 'get_concerts'])->name('get_concerts');
Route::get('concerts/{concert_id}', [ApiController::class, 'get_concert'])->name('get_concert');
Route::get('concerts/{concert_id}/shows/{show_id}/seating', [ApiController::class, 'show_concert_seating'])->name('show_concert_seating');

Route::post('concerts/{concert_id}/shows/{show_id}/reservation', [ApiController::class, 'add_concert_reservation'])->name('add_concert_reservation');
Route::post('concerts/{concert_id}/shows/{show_id}/booking', [ApiController::class, 'add_concert_booking'])->name('add_concert_booking');
Route::post('tickets', [ApiController::class, 'tickets'])->name('tickets');
Route::post('tickets/{ticket_id}/cancel', [ApiController::class, 'ticket_cancel'])->name('ticket_cancel');
