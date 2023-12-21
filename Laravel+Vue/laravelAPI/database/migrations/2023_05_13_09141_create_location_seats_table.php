<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_seat_row_id')->constrained('location_seat_rows')->cascadeOnUpdate()->cascadeOnDelete();
            $table->mediumInteger('number')->unique()->index();
            $table->foreignId('reservation_id')->nullable()->constrained('reservations')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('ticket_id')->nullable()->constrained('tickets')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_seats');
    }
};
