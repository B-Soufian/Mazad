<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AuctionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum', except: ['index', 'show']),
        ];
    }

    // GET /api/auctions (Public)
    public function index(Request $request)
    {
        $query = Auction::with(['asset.category', 'asset.owner']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('asset', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('lot_number', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $categorySlug = $request->category;
            $query->whereHas('asset.category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('current_price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('current_price', '<=', $request->max_price);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $auctions = $query->paginate(15);
        return response()->json($auctions, 200);
    }

    // POST /api/auctions (Protected)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'asset_id'          => 'required|exists:assets,id',
            'starting_price'    => 'required|numeric|min:0',
            'reserve_price'     => 'required|numeric|min:0',
            'buy_now_price'     => 'nullable|numeric|min:0',
            'minimum_increment' => 'nullable|numeric|min:0',
            'starts_at'         => 'required|date|after:now',
            'ends_at'           => 'required|date|after:starts_at',
        ]);

        $asset = Asset::findOrFail($validated['asset_id']);
        if ($asset->owner_id !== auth()->id()) {
            return response()->json([
                'message' => 'You can only create an auction for assets you own.'
            ], 403);
        }

        // Prevent duplicate active/pending auctions for the same asset
        $existingAuction = Auction::where('asset_id', $asset->id)
            ->whereIn('status', ['pending', 'live'])
            ->first();

        if ($existingAuction) {
            return response()->json([
                'message' => 'This asset already has a pending or live auction.'
            ], 422);
        }

        $auction = Auction::create([
            'asset_id' => $validated['asset_id'],
            'status' => 'pending', 
            'starting_price' => $validated['starting_price'],
            'current_price' => $validated['starting_price'], 
            'reserve_price' => $validated['reserve_price'],
            'buy_now_price' => $validated['buy_now_price'] ?? null,
            'minimum_increment' => $validated['minimum_increment'] ?? 5000,
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
        ]);

        return response()->json([
            'message' => 'Auction created successfully and is pending approval.',
            'auction' => $auction
        ], 201);
    }

    // GET /api/auctions/{id} (Public)
    public function show($id)
    {
        $auction = Auction::with(['asset.category', 'asset.owner', 'bids'])->findOrFail($id);
        $auction->increment('view_count');
        return response()->json($auction, 200);
    }

    // PUT/PATCH /api/auctions/{id}
    public function update(Request $request, $id)
    {
        $auction = Auction::with('asset')->findOrFail($id);

        if ($auction->asset->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($auction->status !== 'pending') {
            return response()->json(['message' => 'You cannot modify an active or closed auction.'], 422);
        }

        $validated = $request->validate([
            'starting_price'    => 'sometimes|numeric|min:0',
            'reserve_price'     => 'sometimes|numeric|min:0',
            'buy_now_price'     => 'nullable|numeric|min:0',
            'minimum_increment' => 'sometimes|numeric|min:0',
            'starts_at'         => 'sometimes|date|after:now',
            'ends_at'           => 'sometimes|date|after:starts_at',
        ]);

        $auction->update($validated);

        return response()->json(['message' => 'Auction updated successfully', 'auction' => $auction]);
    }

    // GET /api/auctions/{id}/similar (Public)
    public function similar($id)
    {
        $auction = Auction::with('asset')->findOrFail($id);
        $categoryId = $auction->asset->category_id;

        $similar = Auction::whereHas('asset', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->where('id', '!=', $id)
            ->with(['asset.category', 'asset.owner'])
            ->latest()
            ->limit(6)
            ->get();

        return response()->json($similar, 200);
    }

    // DELETE /api/auctions/{id}
    public function destroy($id)
    {
        $auction = Auction::with('asset')->findOrFail($id);

        if ($auction->asset->owner_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($auction->status !== 'pending') {
            return response()->json(['message' => 'You cannot delete an active auction.'], 422);
        }

        $auction->delete();
        return response()->json(['message' => 'Auction deleted successfully']);
    }
}