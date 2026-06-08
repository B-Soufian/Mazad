<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class WalletController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth:sanctum'),
        ];
    }

    public function deposit(Request $request)
    {
        $request->validate(['amount' => 'required|numeric|min:1']);

        $user = auth()->user();

        DB::transaction(function () use ($user, $request) {
            $user->creditWallet($request->amount, 'deposit', null, 'Wallet deposit via API');
        });

        $user->refresh();

        return response()->json(['message' => 'Deposit successful', 'new_balance' => $user->wallet_balance]);
    }

    public function withdraw(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'amount' => ['required', 'numeric', 'min:1',
                function ($attribute, $value, $fail) use ($user) {
                    if ($value > $user->available_balance) {
                        $fail('You cannot withdraw frozen funds or more than your available balance.');
                    }
                }
            ]
        ]);

        DB::transaction(function () use ($user, $request) {
            $user->chargeWallet($request->amount, 'withdrawal', null, 'Wallet withdrawal');
        });

        $user->refresh();

        return response()->json(['message' => 'Withdrawal successful', 'new_balance' => $user->wallet_balance]);
    }
}