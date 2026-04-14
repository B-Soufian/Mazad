<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Auction;
use Carbon\Carbon;

class AuctionSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 5; $i++) {
            Auction::create([
                'id' => 'auc_00' . $i,
                'asset_id' => 'ast_00' . $i,
                'status' => 'live',
                'currency' => 'AED',
                'starting_price' => 100000 * $i,
                'current_price' => 100000 * $i,
                'reserve_price' => 150000 * $i,
                'minimum_increment' => 5000,
                'starts_at' => Carbon::now()->subDays(1), // Started yesterday
                'ends_at' => Carbon::now()->addDays(5),   // Ends in 5 days
            ]);
        }
    }
}