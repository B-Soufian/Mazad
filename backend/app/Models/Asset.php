<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'owner_id', 'category_id', 'lot_number', 'title', 
        'condition_status', 'media', 'marketing', 'specifications'
    ];

    protected $casts = [
        'media' => 'array',
        'marketing' => 'array',
        'specifications' => 'array',
    ];

    public function owner() {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function auctions() {
        return $this->hasMany(Auction::class);
    }
}