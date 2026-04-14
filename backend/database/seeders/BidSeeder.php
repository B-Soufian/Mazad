<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Bid;
use App\Models\Auction;

class BidSeeder extends Seeder
{
    public function run()
    {
        // Let's add 5 bids to the first auction
        $auction = Auction::find('auc_001');
        $currentBid = $auction->starting_price;

        for ($i = 1; $i <= 5; $i++) {
            $currentBid += 5000; // Increase by increment
            
            Bid::create([
                'auction_id' => 'auc_001',
                'user_id' => 'usr_00' . rand(2, 5), // Random bidder
                'amount' => $currentBid,
                'status' => 'winning',
                'placed_at' => now()->subMinutes(60 - $i),
            ]);
        }

        // Update the auction's current price to match the final bid
        $auction->update([
            'current_price' => $currentBid,
            'bid_count' => 5
        ]);
    }
}