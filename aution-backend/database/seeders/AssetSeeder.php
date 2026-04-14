<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Asset;

class AssetSeeder extends Seeder
{
    public function run()
    {
        $assets = [
            ['id' => 'ast_001', 'cat' => 'cat_01', 'title' => '2024 GMC Hummer EV'],
            ['id' => 'ast_002', 'cat' => 'cat_01', 'title' => '1967 Ferrari 275 GTB/4'],
            ['id' => 'ast_003', 'cat' => 'cat_02', 'title' => 'Rolex Daytona Paul Newman'],
            ['id' => 'ast_004', 'cat' => 'cat_04', 'title' => 'Basquiat Original Skull'],
            ['id' => 'ast_005', 'cat' => 'cat_05', 'title' => 'Dubai Plate D-77'],
        ];

        foreach ($assets as $item) {
            Asset::create([
                'id' => $item['id'],
                'owner_id' => 'usr_admin_01', // Admin owns them all for now
                'category_id' => $item['cat'],
                'lot_number' => 'LOT-' . rand(1000, 9999),
                'title' => $item['title'],
                'condition_status' => 'mint',
                'media' => [
                    'thumbnail' => 'https://via.placeholder.com/400',
                    'gallery' => ['https://via.placeholder.com/800']
                ],
                'marketing' => ['isHot' => true, 'highlights' => []],
                'specifications' => [
                    ['group' => 'General', 'label' => 'Authentication', 'value' => 'Verified']
                ]
            ]);
        }
    }
}
