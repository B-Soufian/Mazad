<?php

namespace App\Http\Controllers;

use App\Models\Auction;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class AdminController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
            new Middleware('admin'),
        ];
    }
    public function getUsers(Request $request)
    {
        $query = User::withCount('bids')->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('display_name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(15);
        $users->getCollection()->transform(fn($u) => [
            'id'              => $u->id,
            'display_name'    => $u->display_name,
            'username'        => $u->username,
            'email'           => $u->email,
            'role'            => $u->role,
            'wallet_balance'  => $u->wallet_balance,
            'frozen_balance'  => $u->frozen_balance,
            'bids_count'      => $u->bids_count,
            'created_at'      => $u->created_at,
        ]);

        return response()->json($users);
    }

    public function globalSearch(Request $request)
    {
        $search = $request->search;

        if (!$search) {
            return response()->json(['users' => [], 'auctions' => [], 'categories' => []]);
        }

        $users = User::where('display_name', 'like', "%{$search}%")
            ->orWhere('username', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->limit(5)
            ->get(['id', 'display_name', 'email', 'role']);

        $auctions = Auction::with(['asset.category'])
            ->whereHas('asset', function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('lot_number', 'like', "%{$search}%");
            })
            ->limit(5)
            ->get(['id', 'asset_id', 'status', 'current_price']);

        $categories = \App\Models\Category::where('name', 'like', "%{$search}%")
            ->limit(5)
            ->get(['id', 'name', 'slug']);

        return response()->json([
            'users' => $users,
            'auctions' => $auctions,
            'categories' => $categories
        ]);
    }

    public function approveAuction($id)
    {
        $auction = Auction::findOrFail($id);

        if ($auction->status !== 'pending') {
            return response()->json(['message' => 'Only pending auctions can be approved.'], 422);
        }

        if ($auction->ends_at->isPast()) {
            return response()->json(['message' => 'Cannot approve an auction that has already ended.'], 422);
        }

        $auction->update(['status' => 'live']);

        return response()->json([
            'message' => 'Auction approved and is now live!',
            'auction' => $auction
        ]);
    }

    public function rejectAuction(Request $request, $id)
    {
        $auction = Auction::findOrFail($id);

        if ($auction->status !== 'pending') {
            return response()->json(['message' => 'Only pending auctions can be rejected.'], 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $auction->update([
            'status' => 'cancelled',
            'rejection_reason' => $request->reason,
        ]);

        return response()->json([
            'message' => 'Auction rejected.',
            'reason'  => $auction->rejection_reason ?? 'No reason provided.',
            'auction' => $auction
        ]);
    }

    public function dashboardStats()
    {
        // Summary Cards
        $totalRevenue       = Transaction::where('type', 'deposit')->sum('amount');
        $activeAuctions     = Auction::where('status', 'live')->count();
        $totalUsers         = User::count();
        $pendingCount       = Auction::where('status', 'pending')->count();

        // Last 5 pending auctions
        $recentPending = Auction::with(['asset.category', 'asset.owner'])
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($a) => [
                'id'         => $a->id,
                'title'      => $a->asset->title ?? 'N/A',
                'owner'      => $a->asset->owner->display_name ?? 'Unknown',
                'created_at' => $a->created_at,
                'starts_at'  => $a->starts_at,
            ]);

        // Last 5 deposits
        $recentDeposits = Transaction::with('user')
            ->where('type', 'deposit')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($t) => [
                'id'         => $t->id,
                'user'       => $t->user->display_name ?? 'Unknown',
                'amount'     => $t->amount,
                'created_at' => $t->created_at,
                'description'=> $t->description,
            ]);

        return response()->json([
            'stats' => [
                'total_revenue'    => $totalRevenue,
                'active_auctions'  => $activeAuctions,
                'total_users'      => $totalUsers,
                'pending_approvals'=> $pendingCount,
            ],
            'recent_pending'  => $recentPending,
            'recent_deposits' => $recentDeposits,
        ]);
    }

    public function ledger(Request $request)
    {
        // Platform admin (assuming current user is the admin since they are authenticated and passed middleware)
        $admin = $request->user();

        // 1. Calculate Stats
        $platformFees = $admin->wallet_balance; // Admin's available balance is the platform revenue
        
        // Sum of all regular users' available balances + platform fees
        $stripeWallet = User::where('role', 'user')->sum('wallet_balance') + $platformFees;
        
        // Sum of all frozen balances (Cold Storage)
        $coldStorage = User::sum('frozen_balance');
        $frozenFunds = $coldStorage; // Cold Storage is the frozen funds
        
        $totalLiquidity = $stripeWallet + $coldStorage;

        // Arbitration / Escrow assets count (auctions that are live or ended but not yet settled, simplified to active auctions for now)
        $arbitrationAssetsCount = Auction::whereIn('status', ['live', 'completed'])->count();

        // 2. Fetch Transactions
        $transactions = Transaction::with(['user', 'auction.asset'])
            ->latest()
            ->paginate(15);

        // Map transactions for the frontend
        $mappedTransactions = collect($transactions->items())->map(function($t) {
            $typeMap = [
                'deposit'    => 'DEPOSIT',
                'withdrawal' => 'WITHDRAWAL',
                'commission' => 'DEDUCTION',
                'bid_placed' => 'FROZEN',
                'refund'     => 'REFUND'
            ];

            $sourceMap = [
                'deposit'    => 'Stripe Wallet',
                'withdrawal' => 'Bank Transfer',
                'commission' => 'Platform Reserve',
                'bid_placed' => 'Escrow Hold',
                'refund'     => 'Escrow Hold'
            ];

            $statusMap = [
                'deposit'    => 'CLEARED',
                'withdrawal' => 'CLEARED',
                'commission' => 'SETTLED',
                'bid_placed' => 'PENDING DISPUTE', // Simplified to match UI design escrow vibes
                'refund'     => 'SETTLED'
            ];

            return [
                'id'            => $t->id,
                'transaction_id'=> 'TRX-' . str_pad($t->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(substr(md5($t->id), 0, 1)),
                'asset_title'   => $t->auction->asset->title ?? ($t->description ?? 'Platform Transaction'),
                'asset_subtitle'=> $t->auction ? "Auction #{$t->auction->id}" : 'Wallet Operation',
                'type'          => $typeMap[$t->type] ?? strtoupper($t->type),
                'source'        => $sourceMap[$t->type] ?? 'System',
                'amount'        => in_array($t->type, ['deposit', 'refund']) ? $t->amount : -$t->amount,
                'status'        => $statusMap[$t->type] ?? 'COMPLETED',
                'created_at'    => $t->created_at,
            ];
        });

        return response()->json([
            'stats' => [
                'total_liquidity' => $totalLiquidity,
                'stripe_wallet'   => $stripeWallet,
                'cold_storage'    => $coldStorage,
                'frozen_funds'    => $frozenFunds,
                'platform_fees'   => $platformFees,
                'arbitration_count'=> $arbitrationAssetsCount,
            ],
            'transactions' => [
                'data' => $mappedTransactions,
                'current_page' => $transactions->currentPage(),
                'last_page'    => $transactions->lastPage(),
                'total'        => $transactions->total(),
            ]
        ]);
    }
}