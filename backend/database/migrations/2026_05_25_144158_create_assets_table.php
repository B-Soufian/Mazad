<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            
            $table->string('lot_number')->unique();
            $table->string('title');
            
            $table->enum('condition_status', ['new', 'excellent', 'good', 'fair']);
            
            $table->json('media')->nullable();
            $table->json('marketing')->nullable();
            $table->json('specifications')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
