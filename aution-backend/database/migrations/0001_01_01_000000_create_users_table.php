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
        Schema::create('users', function (Blueprint $table) {
            // Your Custom String ID
            $table->string('id')->primary(); 
            
            // Core Identity
            $table->string('username')->unique();
            $table->string('display_name'); // Replaces default 'name'
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password'); // Required for Breeze
            $table->string('avatar_url')->nullable();
            
            // Platform Status
            $table->enum('role', ['admin', 'bidder'])->default('bidder');
            $table->string('status')->default('active');
            
            // Complex objects as JSON
            $table->json('kyc')->nullable(); // tier, status
            
            // Wallet Data
            $table->string('currency')->default('AED');
            $table->decimal('wallet_balance', 20, 2)->default(0);
            $table->decimal('frozen_balance', 20, 2)->default(0);
            $table->decimal('available_balance', 20, 2)->default(0);
            
            $table->rememberToken(); // Required for Breeze
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            
            // CHANGED: This must be a string now to match the new users.id!
            $table->string('user_id')->nullable()->index(); 
            
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};