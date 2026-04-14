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
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('id')->primary(); // trx_...
            $table->string('user_id');
            $table->string('auction_id')->nullable();
            $table->string('type'); // deposit, bid_placed, refund
            $table->decimal('amount', 20, 2);
            $table->string('currency')->default('AED');
            $table->string('status'); // frozen, cleared
            $table->string('description');
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
