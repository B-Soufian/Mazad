<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    // Relationship: A category has many assets
    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}