<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['id', 'slug', 'name'];

    public function assets() {
        return $this->hasMany(Asset::class);
    }
}