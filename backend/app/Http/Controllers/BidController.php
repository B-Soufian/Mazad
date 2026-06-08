<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\Bid;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class BidController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    public function store(Request $request)
    {
        $request->validate([
            'auction_id' => 'required|exists:auctions,id',
            'amount'     => 'required|numeric|min:0',
        ]);

        $user    = auth()->user();
        $auction = Auction::with('asset')->lockForUpdate()->findOrFail($request->auction_id);
        $amount  = $request->amount;

        if ($auction->status !== 'live') {
            return response()->json(['message' => 'This auction is not open for bidding.'], 422);
        }

        if ($auction->asset->owner_id === $user->id) {
            return response()->json(['message' => 'You cannot bid on your own auction.'], 403);
        }

        $minRequiredBid = $auction->current_price + $auction->minimum_increment;
        if ($amount < $minRequiredBid) {
            return response()->json([
                'errors' => ['amount' => ["The bid must be at least {$minRequiredBid} MAD."]]
            ], 422);
        }

        if ($user->available_balance < $amount) {
            return response()->json([
                'errors' => ['amount' => ['Insufficient funds in your wallet portfolio.']]
            ], 422);
        }

        return DB::transaction(function () use ($user, $auction, $amount) {

            // If someone else was winning, refund their freeze
            $previousWinningBid = Bid::where('auction_id', $auction->id)
                                    ->where('status', 'winning')
                                    ->first();

            if ($previousWinningBid) {
                $previousWinningBid->update(['status' => 'outbid']);
                $previousWinningBid->user->unfreezeBalance(
                    $previousWinningBid->amount,
                    $auction->id,
                    "Refunded outbid amount on auction #{$auction->id}"
                );
            }

            // Create the new winning bid
            $newBid = Bid::create([
                'auction_id' => $auction->id,
                'user_id'    => $user->id,
                'amount'     => $amount,
                'status'     => 'winning',
            ]);

            $auction->update([
                'current_price'  => $amount,
                'bid_count'      => $auction->bid_count + 1,
                'is_reserve_met' => $amount >= $auction->getRawOriginal('reserve_price'),
            ]);

            // Freeze the new bidder's funds
            $user->freezeBalance($amount, $auction->id, "Placed winning bid on auction #{$auction->id}");

            // Anti-snipe: extend auction if bid placed in last 5 minutes
            $effectiveEndTime = $auction->extended_ends_at ?? $auction->ends_at;
            $fiveMinutesBeforeEnd = $effectiveEndTime->copy()->subMinutes(5);

            if (now()->greaterThanOrEqualTo($fiveMinutesBeforeEnd)) {
                $newEndTime = $effectiveEndTime->copy()->addMinutes(5);
                $auction->update(['extended_ends_at' => $newEndTime]);
            }

            // Dispatch the WebSockets Event!
            \App\Events\BidPlaced::dispatch($auction->fresh(), $newBid);

            return response()->json([
                'message' => 'Bid placed successfully!',
                'bid'     => $newBid,
                'auction' => $auction->fresh(), 
            ], 201);
        });
    }

    // POST /api/auctions/{id}/buy-now
    public function buyNow(Request $request, $id)
    {
        $user    = auth()->user();
        $auction = Auction::with('asset')->findOrFail($id);

        if ($auction->status !== 'live') {
            return response()->json(['message' => 'This auction is not open.'], 422);
        }

        if ($auction->asset->owner_id === $user->id) {
            return response()->json(['message' => 'You cannot buy your own auction.'], 403);
        }

        if (is_null($auction->buy_now_price)) {
            return response()->json(['message' => 'This auction does not have a Buy Now option.'], 422);
        }

        $price = $auction->buy_now_price;

        if ($user->available_balance < $price) {
            return response()->json(['message' => 'Insufficient funds. Please deposit more to use Buy Now.'], 422);
        }

        return DB::transaction(function () use ($user, $auction, $price) {

            // Refund the current highest bidder if any
            $currentWinningBid = Bid::where('auction_id', $auction->id)
                ->where('status', 'winning')
                ->first();

            if ($currentWinningBid) {
                $currentWinningBid->update(['status' => 'outbid']);
                $currentWinningBid->user->unfreezeBalance(
                    $currentWinningBid->amount,
                    $auction->id,
                    "Refunded after Buy Now on auction #{$auction->id}"
                );
            }

            // Create the winning bid
            $newBid = Bid::create([
                'auction_id' => $auction->id,
                'user_id'    => $user->id,
                'amount'     => $price,
                'status'     => 'won', 
            ]);

            // Calculate 5% Platform Fee
            $platformFee    = $price * 0.05;
            $sellerRevenue  = $price - $platformFee;

            // Charge the buyer
            $user->chargeWallet($price, 'commission', $auction->id, "Buy Now purchase on auction #{$auction->id}");

            // Pay the seller (minus 5%)
            $seller = $auction->asset->owner;
            $seller->creditWallet($sellerRevenue, 'deposit', $auction->id, "Revenue from Buy Now on auction #{$auction->id} (after 5% platform fee)");

            // Transfer 5% fee to the platform admin
            $admin = User::where('role', 'admin')->first();
            if ($admin) {
                $admin->creditWallet($platformFee, 'deposit', $auction->id, "5% Platform Fee from Buy Now on auction #{$auction->id}");
            }

            // Close the auction
            $auction->update([
                'status'        => 'closed',
                'current_price' => $price,
            ]);

            // Dispatch the WebSockets Event!
            \App\Events\BidPlaced::dispatch($auction->fresh(), $newBid);

            return response()->json([
                'message' => 'Purchase successful! You won this auction.',
            ], 201);
        });
    }
}