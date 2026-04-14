<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index() {
        return response()->json(Transaction::with('user')->get());
    }

    public function store(Request $request) {
        $request->validate([
            'user_id' => 'required',
            'amount' => 'required|numeric',
            'type' => 'required'
        ]);

        $transaction = Transaction::create([
            'id' => uniqid('trx_'),
            'user_id' => $request->user_id,
            'auction_id' => $request->auction_id,
            'type' => $request->type, // 'deposit', 'bid_placed'
            'amount' => $request->amount,
            'status' => 'cleared',
            'description' => $request->description
        ]);

        return response()->json($transaction, 201);
    }

    public function show($id) {
        return response()->json(Transaction::findOrFail($id));
    }

    public function update(Request $request, $id) {
        $transaction = Transaction::findOrFail($id);
        $transaction->update($request->all());
        return response()->json($transaction);
    }

    public function destroy($id) {
        Transaction::destroy($id);
        return response()->json(['message' => 'Transaction deleted']);
    }
}