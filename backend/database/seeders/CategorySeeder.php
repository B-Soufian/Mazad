<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['id' => 'cat_01', 'slug' => 'motors', 'name' => 'Vehicles & Machinery'],
            ['id' => 'cat_02', 'slug' => 'watches', 'name' => 'Rare Watches'],
            ['id' => 'cat_03', 'slug' => 'real-estate', 'name' => 'Properties'],
            ['id' => 'cat_04', 'slug' => 'art', 'name' => 'Fine Art'],
            ['id' => 'cat_05', 'slug' => 'plates', 'name' => 'Prestigious Numbers'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}