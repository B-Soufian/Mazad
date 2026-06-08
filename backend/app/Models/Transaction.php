<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'auction_id',
        'type',
        'amount',
        'description'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    // Relationships
    public function user() { return $this->belongsTo(User::class); }
    public function auction() { return $this->belongsTo(Auction::class); }
}