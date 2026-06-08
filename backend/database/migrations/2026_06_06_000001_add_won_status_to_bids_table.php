<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // MySQL does not allow ALTER COLUMN on ENUM directly.
        // We change the column definition using a raw SQL statement.
        DB::statement("ALTER TABLE bids MODIFY COLUMN status ENUM('winning', 'outbid', 'won') NOT NULL DEFAULT 'winning'");
    }

    public function down(): void
    {
        // Revert back to original two statuses
        DB::statement("ALTER TABLE bids MODIFY COLUMN status ENUM('winning', 'outbid') NOT NULL DEFAULT 'winning'");
    }
};
