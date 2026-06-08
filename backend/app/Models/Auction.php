<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    protected $fillable = [
        'asset_id',
        'status',
        'rejection_reason',
        // NOTE: 'currency' intentionally removed — it defaults to 'MAD' at DB level.
        // Never allow the user to set the currency through the API.
        'starting_price',
        'current_price',
        'reserve_price',
        'is_reserve_met',
        'buy_now_price',
        'minimum_increment',
        'starts_at',
        'ends_at',
        'extended_ends_at',
        'bid_count',
        'view_count'
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'extended_ends_at' => 'datetime',
        'is_reserve_met' => 'boolean',
        'starting_price' => 'decimal:2',
        'current_price' => 'decimal:2',
        'reserve_price' => 'decimal:2',
        'buy_now_price' => 'decimal:2',
    ];

    protected $hidden = ['reserve_price'];

    // Relationships
    public function asset() { return $this->belongsTo(Asset::class); }
    public function bids() { return $this->hasMany(Bid::class); }
}