<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bids', function (Blueprint $table) {
            $table->id(); 
            $table->string('auction_id');
            $table->string('user_id');
            $table->decimal('amount', 20, 2);
            $table->string('status'); // winning, outbid, etc.
            $table->timestamp('placed_at');
            $table->timestamps(); // Adds created_at and updated_at

            $table->foreign('auction_id')->references('id')->on('auctions');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
