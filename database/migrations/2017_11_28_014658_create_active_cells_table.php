<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActiveCellsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('active_cells', function (Blueprint $table) {
            $table->increments('id');
            $table->string('game_id');
            $table->string('leftCell');
            $table->string('rightCell');
            $table->string('allowed_left');
            $table->string('allowed_right');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('active_cells');
    }
}
