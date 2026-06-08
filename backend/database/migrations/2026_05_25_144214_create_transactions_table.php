<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            
            // auction_id peut être null (ex: dépôt d'argent externe, retrait)
            $table->foreignId('auction_id')->nullable()->constrained('auctions')->nullOnDelete();
            
            $table->enum('type', ['deposit', 'bid_placed', 'refund', 'withdrawal', 'commission']);
            $table->decimal('amount', 15, 2);
            $table->string('description')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
