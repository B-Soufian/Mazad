<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CloseExpiredAuctions extends Command
{
    protected $signature = 'auctions:close';

    protected $description = 'Close all auctions that have passed their end time, settle payments, and mark the winner.';

    public function handle(): void
    {
  
        $expiredAuctions = Auction::where('status', 'live')
            ->where(function ($query) {
                $query
                    ->where(function ($q) {
                        $q->whereNull('extended_ends_at')
                          ->where('ends_at', '<=', now());
                    })
                    ->orWhere(function ($q) {
                        $q->whereNotNull('extended_ends_at')
                          ->where('extended_ends_at', '<=', now());
                    });
            })
            ->get();

        if ($expiredAuctions->isEmpty()) {
            $this->info('No expired auctions found.');
            return;
        }

        foreach ($expiredAuctions as $auction) {
            DB::transaction(function () use ($auction) {

                $winningBid = Bid::where('auction_id', $auction->id)
                    ->where('status', 'winning')
                    ->first();

                if ($winningBid) {
                    $winner = $winningBid->user;

                    if ($auction->is_reserve_met) {
                        // ─── RESERVE MET: AUCTION IS WON ─────────────────────

                        $winningBid->update(['status' => 'won']);

                        // Calculate 5% Platform Fee
                        $platformFee    = $winningBid->amount * 0.05;
                        $sellerRevenue  = $winningBid->amount - $platformFee;

                        // Charge the buyer (deduct wallet + unfreeze)
                        $winner->chargeWallet($winningBid->amount, 'commission', $auction->id, "Payment settled for winning auction #{$auction->id}");
                        $winner->decrement('frozen_balance', $winningBid->amount);

                        // Pay the seller (minus 5%)
                        $seller = $auction->asset->owner;
                        $seller->creditWallet($sellerRevenue, 'deposit', $auction->id, "Revenue from winning bid on auction #{$auction->id} (after 5% platform fee)");

                        // Transfer 5% fee to the platform admin
                        $admin = User::where('role', 'admin')->first();
                        if ($admin) {
                            $admin->creditWallet($platformFee, 'deposit', $auction->id, "5% Platform Fee from winning auction #{$auction->id}");
                        }

                        $this->info("Auction #{$auction->id} won by User #{$winner->id}. Seller paid {$sellerRevenue} MAD. Platform Fee: {$platformFee} MAD.");

                    } else {
                        // ─── RESERVE NOT MET: AUCTION FAILED ─────────────────

                        $winningBid->update(['status' => 'outbid']);

                        // Refund buyer (unfreeze)
                        $winner->unfreezeBalance($winningBid->amount, $auction->id, "Refunded: Reserve price not met on auction #{$auction->id}");

                        $this->info("Auction #{$auction->id} failed. Reserve not met.");
                    }
                } else {
                    $this->info("Auction #{$auction->id} closed with no bids.");
                }

                $auction->update(['status' => 'closed']);
            });
        }

        $this->info('Done. Total auctions closed: ' . $expiredAuctions->count());
    }
}
