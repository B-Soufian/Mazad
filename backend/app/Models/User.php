<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'display_name',
        'username',
        'email',
        'phone',
        'password',
        'role',
       
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'wallet_balance' => 'decimal:2',
        'frozen_balance' => 'decimal:2',
    ];

    protected $appends = ['available_balance'];

    public function getAvailableBalanceAttribute()
    {
        return $this->wallet_balance - $this->frozen_balance;
    }

    // ── Wallet Helpers (
    public function chargeWallet(float $amount, string $type, ?int $auctionId = null, string $description = '')
    {
        $this->decrement('wallet_balance', $amount);

        return Transaction::create([
            'user_id'     => $this->id,
            'auction_id'  => $auctionId,
            'type'        => $type,
            'amount'      => $amount,
            'description' => $description,
        ]);
    }

 
    public function creditWallet(float $amount, string $type, ?int $auctionId = null, string $description = '')
    {
        $this->increment('wallet_balance', $amount);

        return Transaction::create([
            'user_id'     => $this->id,
            'auction_id'  => $auctionId,
            'type'        => $type,
            'amount'      => $amount,
            'description' => $description,
        ]);
    }

    public function freezeBalance(float $amount, ?int $auctionId = null, string $description = '')
    {
        $this->increment('frozen_balance', $amount);

        return Transaction::create([
            'user_id'     => $this->id,
            'auction_id'  => $auctionId,
            'type'        => 'bid_placed',
            'amount'      => $amount,
            'description' => $description,
        ]);
    }

    public function unfreezeBalance(float $amount, ?int $auctionId = null, string $description = '')
    {
        $this->decrement('frozen_balance', $amount);

        return Transaction::create([
            'user_id'     => $this->id,
            'auction_id'  => $auctionId,
            'type'        => 'refund',
            'amount'      => $amount,
            'description' => $description,
        ]);
    }

    public function assets() { return $this->hasMany(Asset::class, 'owner_id'); }
    public function bids() { return $this->hasMany(Bid::class); }
    public function transactions() { return $this->hasMany(Transaction::class); }
    public function tickets() { return $this->hasMany(Ticket::class); }
}