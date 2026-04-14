<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auction extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'asset_id', 'status', 'currency', 'starting_price', 
        'current_price', 'reserve_price', 'is_reserve_met', 
        'buy_now_price', 'minimum_increment', 'starts_at', 
        'ends_at', 'extended_ends_at'
    ];

    protected $casts = [
        'is_reserve_met' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'extended_ends_at' => 'datetime',
        'starting_price' => 'decimal:2',
        'current_price' => 'decimal:2',
    ];

    public function asset() {
        return $this->belongsTo(Asset::class);
    }

    public function bids() {
        return $this->hasMany(Bid::class)->orderBy('amount', 'desc');
    }
}