<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BidController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\TicketController;

// ─────────────────────────────────────────────────────────────
//  PUBLIC ROUTES — No login required
// ─────────────────────────────────────────────────────────────

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Assets — public read
Route::get('/assets',      [AssetController::class, 'index']);
Route::get('/assets/{id}', [AssetController::class, 'show']);

// Auctions — public read
Route::get('/auctions',      [AuctionController::class, 'index']);
Route::get('/auctions/{id}', [AuctionController::class, 'show']);
Route::get('/auctions/{id}/similar', [AuctionController::class, 'similar']);

// Categories — public read
Route::get('/categories',      [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);


// ─────────────────────────────────────────────────────────────
//  PROTECTED ROUTES — Must be logged in (Bearer Token)
// ─────────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Assets — create, edit, delete (only owner)
    Route::post('/assets',         [AssetController::class, 'store']);
    Route::put('/assets/{id}',     [AssetController::class, 'update']);
    Route::patch('/assets/{id}',   [AssetController::class, 'update']);
    Route::delete('/assets/{id}',  [AssetController::class, 'destroy']);

    // Auctions — create, edit, delete (only owner, only if pending)
    Route::post('/auctions',        [AuctionController::class, 'store']);
    Route::put('/auctions/{id}',    [AuctionController::class, 'update']);
    Route::patch('/auctions/{id}',  [AuctionController::class, 'update']);
    Route::delete('/auctions/{id}', [AuctionController::class, 'destroy']);

    // Bidding
    Route::post('/bids',                        [BidController::class, 'store']);
    Route::post('/auctions/{id}/buy-now',       [BidController::class, 'buyNow']);

    // Wallet
    Route::post('/wallet/deposit',  [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);

    // My Dashboard — what belongs to the logged-in user
    Route::get('/my/assets',       [ProfileController::class, 'myAssets']);
    Route::get('/my/auctions',     [ProfileController::class, 'myAuctions']);
    Route::get('/my/bids',         [ProfileController::class, 'myBids']);
    Route::get('/my/transactions', [ProfileController::class, 'transactions']);
    Route::put('/my/profile',      [ProfileController::class, 'updateProfile']);

    // Support Tickets (users)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);

});


// ─────────────────────────────────────────────────────────────
//  ADMIN ROUTES — Must be logged in AND have role = admin
// ─────────────────────────────────────────────────────────────

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // Dashboard & Ledger
    Route::get('/dashboard/stats', [AdminController::class, 'dashboardStats']);
    Route::get('/ledger',          [AdminController::class, 'ledger']);

    // Users & Search
    Route::get('/global-search', [AdminController::class, 'globalSearch']);
    Route::get('/users', [AdminController::class, 'getUsers']);

    // Tickets (admin management)
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::patch('/tickets/{id}/reply', [TicketController::class, 'reply']);
    Route::patch('/tickets/{id}/close', [TicketController::class, 'close']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);

    // Auction approval
    Route::patch('/auctions/{id}/approve', [AdminController::class, 'approveAuction']);
    Route::patch('/auctions/{id}/reject',  [AdminController::class, 'rejectAuction']);

    // Category management (admin only)
    Route::post('/categories',        [CategoryController::class, 'store']);
    Route::put('/categories/{id}',    [CategoryController::class, 'update']);
    Route::patch('/categories/{id}',  [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

});