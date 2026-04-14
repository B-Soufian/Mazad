<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuctionController extends Controller
{
    public function index() {
        return response()->json(Auction::with('asset')->get());
    }

    public function store(Request $request) {
        // Validate the incoming data
        $request->validate([
            'asset_id' => 'required',
            'starting_price' => 'required|numeric',
            'starts_at' => 'required',
            'ends_at' => 'required'
        ]);

        // Create the Auction
        $auction = Auction::create([
            'id' => uniqid('auc_'),
            'asset_id' => $request->asset_id,
            'status' => $request->status ?? 'pending',
            'currency' => $request->currency ?? 'AED',
            'starting_price' => $request->starting_price,
            'current_price' => $request->starting_price, // Current starts at starting price
            'reserve_price' => $request->reserve_price ?? 0,
            'buy_now_price' => $request->buy_now_price,
            'minimum_increment' => $request->minimum_increment ?? 5000,
            'starts_at' => $request->starts_at,
            'ends_at' => $request->ends_at,
        ]);

        return response()->json($auction, 201);
    }

    public function show($id) {
        return response()->json(Auction::with('asset', 'bids')->findOrFail($id));
    }

    public function update(Request $request, $id) {
        $auction = Auction::findOrFail($id);
        $auction->update($request->all());
        return response()->json($auction);
    }

    public function destroy($id) {
        Auction::destroy($id);
        return response()->json(['message' => 'Auction deleted']);
    }
}