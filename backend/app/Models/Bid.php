<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bid extends Model
{
    protected $fillable = ['auction_id', 'user_id', 'amount', 'status', 'placed_at'];

    protected $casts = [
        'amount' => 'decimal:2',
        'placed_at' => 'datetime',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function auction() {
        return $this->belongsTo(Auction::class);
    }
}