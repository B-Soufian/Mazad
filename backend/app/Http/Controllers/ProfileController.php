<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Auction;
use App\Models\Bid;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class ProfileController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [new Middleware('auth:sanctum')];
    }

    
    public function transactions()
    {
        $history = Transaction::where('user_id', auth()->id())
                              ->orderBy('created_at', 'desc')
                              ->paginate(20); 

        return response()->json($history);
    }

    // GET /api/my/assets
    public function myAssets()
    {
        $assets = Asset::with('category')
                       ->where('owner_id', auth()->id())
                       ->orderBy('created_at', 'desc')
                       ->paginate(15);

        return response()->json($assets);
    }

    // GET /api/my/auctions
    public function myAuctions(Request $request)
    {
        $query = Auction::with(['asset.category'])
            ->whereHas('asset', function ($query) {
                $query->where('owner_id', auth()->id());
            })
            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('asset', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('lot_number', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(15));
    }

    // GET /api/my/bids
    public function myBids()
    {
        $bids = Bid::with(['auction.asset'])
                   ->where('user_id', auth()->id())
                   ->orderBy('created_at', 'desc')
                   ->paginate(15);

        return response()->json($bids);
    }

    // PUT /api/my/profile
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'display_name' => 'sometimes|required|string|max:255',
            'username'     => 'sometimes|required|string|max:255|unique:users,username,' . $user->id,
            'email'        => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
            'phone'        => 'nullable|string|max:20',
            'password'     => 'nullable|string|min:6',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user
        ]);
    }
}