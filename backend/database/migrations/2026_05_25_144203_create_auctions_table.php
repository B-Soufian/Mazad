<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            
            $table->enum('status', ['pending', 'live', 'closed', 'cancelled'])->default('pending');
            $table->string('currency', 3)->default('MAD');
            
            $table->decimal('starting_price', 15, 2);
            $table->decimal('current_price', 15, 2)->default(0);
            $table->decimal('reserve_price', 15, 2);
            $table->boolean('is_reserve_met')->default(false);
            $table->decimal('buy_now_price', 15, 2)->nullable();
            $table->decimal('minimum_increment', 15, 2)->default(5000);
            
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->dateTime('extended_ends_at')->nullable();
            
            $table->unsignedInteger('bid_count')->default(0);
            $table->unsignedInteger('view_count')->default(0);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};
