<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    protected $fillable = [
        'auction_id',
        'user_id',
        'amount',
        'status'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Relationships
    public function auction() { return $this->belongsTo(Auction::class); }
    public function user() { return $this->belongsTo(User::class); }
}