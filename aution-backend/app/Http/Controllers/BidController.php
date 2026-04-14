<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Auction;
use Illuminate\Http\Request;

class BidController extends Controller
{
    public function index() {
        return response()->json(Bid::with('user', 'auction')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'auction_id' => 'required',
            'user_id' => 'required',
            'amount' => 'required|numeric'
        ]);

        $auction = Auction::findOrFail($request->auction_id);

        // Simple Logic: Don't allow low bids
        if ($request->amount <= $auction->current_price) {
            return response()->json(['message' => 'Bid too low'], 400);
        }

        $bid = Bid::create([
            'auction_id' => $request->auction_id,
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'status' => 'winning',
            'placed_at' => now(),
        ]);

        // Update the auction price
        $auction->update(['current_price' => $request->amount]);

        return response()->json($bid, 201);
    }

    public function show($id) {
        return response()->json(Bid::findOrFail($id));
    }

    // Bids usually aren't updated, but here for completeness
    public function update(Request $request, $id) {
        $bid = Bid::findOrFail($id);
        $bid->update($request->all());
        return response()->json($bid);
    }

    public function destroy($id) {
        Bid::destroy($id);
        return response()->json(['message' => 'Bid deleted']);
    }
}