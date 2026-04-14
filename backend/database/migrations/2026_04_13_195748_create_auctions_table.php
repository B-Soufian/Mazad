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
        Schema::create('auctions', function (Blueprint $table) {
            $table->string('id')->primary(); // auc_...
            $table->string('asset_id');
            $table->string('status')->default('pending'); // pending, live, closed
            
            // Pricing
            $table->string('currency')->default('AED');
            $table->decimal('starting_price', 20, 2);
            $table->decimal('current_price', 20, 2);
            $table->decimal('reserve_price', 20, 2);
            $table->boolean('is_reserve_met')->default(false);
            $table->decimal('buy_now_price', 20, 2)->nullable();
            $table->decimal('minimum_increment', 20, 2);
            
            // Timeline
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('extended_ends_at')->nullable();
            
            // Metrics
            $table->integer('bid_count')->default(0);
            $table->integer('view_count')->default(0);

            $table->foreign('asset_id')->references('id')->on('assets')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};
