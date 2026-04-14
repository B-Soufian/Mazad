<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    
    public $incrementing = false; // Because we use usr_...
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id', 'username', 'display_name', 'email', 'password', 'avatar_url', 
        'role', 'status', 'kyc', 'currency', 'wallet_balance', 
        'frozen_balance', 'available_balance'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        // <-- Combined all your casts here!
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'kyc' => 'array',
            'wallet_balance' => 'decimal:2',
            'frozen_balance' => 'decimal:2',
            'available_balance' => 'decimal:2',
        ];
    }

    /**
     * Automatically generate the custom ID when a user registers
     */
    protected static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = uniqid('usr_'); // Generates e.g., usr_65a4b3...
            }
        });
    }

    // --- Relationships ---

    public function assets(): HasMany 
    {
        return $this->hasMany(Asset::class, 'owner_id');
    }

    public function bids(): HasMany 
    {
        return $this->hasMany(Bid::class);
    }
}