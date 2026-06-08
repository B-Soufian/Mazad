<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssetTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_assets()
    {
        // 1. Arrange: Create a category and an asset
        $category = Category::create(['name' => 'Luxurious Cars', 'slug' => 'luxurious-cars']);
        $user = User::factory()->create();
        
        Asset::create([
            'owner_id' => $user->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-12345',
            'title' => 'Ferrari Testarossa',
            'condition_status' => 'excellent',
            'media' => ['thumbnail' => 'http://example.com/thumb.jpg', 'gallery' => []],
            'marketing' => ['isHot' => true, 'highlights' => []],
            'specifications' => []
        ]);

        // 2. Act: Fetch assets list
        $response = $this->getJson('/api/assets');

        // 3. Assert: Verify 200 OK and JSON structure
        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_guest_cannot_create_an_asset()
    {
        // Act: Try to POST an asset without logging in
        $response = $this->postJson('/api/assets', [
            'title' => 'Rolex Daytona'
        ]);

        // Assert: 401 Unauthorized
        $response->assertStatus(401);
    }

    public function test_authenticated_user_can_create_an_asset()
    {
        // Arrange: Create Category and Authenticate User
        $category = Category::create(['name' => 'Rare Watches', 'slug' => 'rare-watches']);
        $user = User::factory()->create();

        // Act: Send POST request with Sanctum Token
        $response = $this->actingAs($user)
                         ->postJson('/api/assets', [
                             'category_id' => $category->id,
                             'title' => 'Rolex Daytona',
                             'condition_status' => 'new',
                             'media' => [
                                 'thumbnail' => 'http://example.com/daytona.jpg',
                                 'gallery' => ['http://example.com/daytona1.jpg']
                             ],
                             'marketing' => ['isHot' => false, 'highlights' => ['Rolex Box Included']],
                             'specifications' => [
                                 ['group' => 'General', 'label' => 'Year', 'value' => '2023']
                             ]
                         ]);

        // Assert: 201 Created and saved in DB
        $response->assertStatus(201)
                 ->assertJsonPath('asset.title', 'Rolex Daytona');

        $this->assertDatabaseHas('assets', [
            'title' => 'Rolex Daytona',
            'owner_id' => $user->id,
            'condition_status' => 'new'
        ]);
    }
}