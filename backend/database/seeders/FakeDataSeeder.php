<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Asset;
use App\Models\Auction;
use App\Models\User;
use Carbon\Carbon;

class FakeDataSeeder extends Seeder
{
    public function run()
    {
        $testUser = User::where('email', 'test@example.com')->first();
        if (!$testUser) {
            // Create fallback user if not exists
            $testUser = User::first();
        }

        // Create Categories
        $motors = Category::firstOrCreate(['name' => 'Motors'], ['slug' => 'motors']);
        $watches = Category::firstOrCreate(['name' => 'Watches'], ['slug' => 'watches']);

        // Data array
        $items = [
            [
                'title' => '1967 Ferrari 275 GTB/4',
                'category_id' => $motors->id,
                'thumbnail' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
                'specs' => [
                    ['label' => 'Mileage', 'value' => '12,500 km'],
                    ['label' => 'Body Type', 'value' => 'Coupe'],
                    ['label' => 'Specs', 'value' => 'GCC']
                ],
                'price' => 2500000,
            ],
            [
                'title' => 'Rolex Daytona 116500LN',
                'category_id' => $watches->id,
                'thumbnail' => 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
                'specs' => [
                    ['label' => 'Condition', 'value' => 'Brand New'],
                    ['label' => 'Material', 'value' => 'Oystersteel'],
                    ['label' => 'Specs', 'value' => 'Swiss']
                ],
                'price' => 120000,
            ],
            [
                'title' => 'Porsche 911 GT3 RS',
                'category_id' => $motors->id,
                'thumbnail' => 'https://images.unsplash.com/photo-1503376760367-1bf7fbd6ff65?q=80&w=1964&auto=format&fit=crop',
                'specs' => [
                    ['label' => 'Mileage', 'value' => '2,300 km'],
                    ['label' => 'Exterior Color', 'value' => 'Lizard Green'],
                    ['label' => 'Specs', 'value' => 'GCC']
                ],
                'price' => 850000,
            ],
            [
                'title' => 'Patek Philippe Nautilus 5711',
                'category_id' => $watches->id,
                'thumbnail' => 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974&auto=format&fit=crop',
                'specs' => [
                    ['label' => 'Condition', 'value' => 'Mint'],
                    ['label' => 'Material', 'value' => 'Steel'],
                    ['label' => 'Specs', 'value' => 'Swiss']
                ],
                'price' => 450000,
            ],
            [
                'title' => 'Mercedes-Benz G63 AMG',
                'category_id' => $motors->id,
                'thumbnail' => 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1974&auto=format&fit=crop',
                'specs' => [
                    ['label' => 'Mileage', 'value' => '5,000 km'],
                    ['label' => 'Exterior Color', 'value' => 'Matte Black'],
                    ['label' => 'Specs', 'value' => 'GCC']
                ],
                'price' => 700000,
            ]
        ];

        foreach ($items as $index => $item) {
            $asset = Asset::create([
                'owner_id' => $testUser->id,
                'category_id' => $item['category_id'],
                'lot_number' => 'LOT-' . (1000 + $index),
                'title' => $item['title'],
                'condition_status' => 'new',
                'media' => [
                    'thumbnail' => $item['thumbnail'],
                    'gallery' => [
                        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop', // generic car interior
                        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1966&auto=format&fit=crop', // generic car details
                        'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop', // generic engine
                        'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop'  // generic wheel
                    ]
                ],
                'marketing' => [
                    'isHot' => $index === 0 || $index === 3,
                    'highlights' => ['Verified Seller', 'Inspection Passed']
                ],
                'specifications' => $item['specs'],
            ]);

            Auction::create([
                'asset_id' => $asset->id,
                'status' => 'live',
                'starting_price' => $item['price'] * 0.8,
                'current_price' => $item['price'],
                'reserve_price' => $item['price'] * 0.9,
                'minimum_increment' => 5000,
                'starts_at' => Carbon::now()->subDays(1),
                'ends_at' => Carbon::now()->addDays(7),
                'bid_count' => rand(1, 15),
                'view_count' => rand(100, 500),
            ]);
        }
    }
}
