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
        Schema::create('assets', function (Blueprint $table) {
            $table->string('id')->primary(); // ast_...
            $table->string('owner_id');
            $table->string('category_id');
            $table->string('lot_number');
            $table->string('title');
            $table->string('condition_status');
            
            // Nested JSON structures
            $table->json('media'); // thumbnail, gallery
            $table->json('marketing'); // isHot, highlights
            $table->json('specifications'); // array of group/label/value
            
            $table->foreign('owner_id')->references('id')->on('users');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
