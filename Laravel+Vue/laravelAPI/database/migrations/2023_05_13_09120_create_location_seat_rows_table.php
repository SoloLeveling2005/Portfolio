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
        Schema::create('location_seat_rows', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique()->index();
            $table->unsignedMediumInteger('order')->unique()->index();
            $table->foreignId('show_id')->constrained('shows')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_seat_rows');
    }
};
