<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Category;
use App\Models\User;
use App\Models\Auction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuctionTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_auctions()
    {
        // 1. Arrange: Create Category, User, Asset, and Auction
        $category = Category::create(['name' => 'Art', 'slug' => 'art']);
        $user = User::factory()->create();
        
        $asset = Asset::create([
            'owner_id' => $user->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-ART123',
            'title' => 'Monna Lisa Replica',
            'condition_status' => 'excellent'
        ]);

        Auction::create([
            'asset_id' => $asset->id,
            'status' => 'live',
            'starting_price' => 10000.00,
            'current_price' => 10000.00,
            'reserve_price' => 15000.00,
            'buy_now_price' => 20000.00,
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHours(2),
        ]);

        // 2. Act: Fetch auctions list
        $response = $this->getJson('/api/auctions');

        // 3. Assert: Verify 200 OK and list count
        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_user_can_create_an_auction_for_their_asset()
    {
        // Arrange: Create Category, User, Asset
        $category = Category::create(['name' => 'Art', 'slug' => 'art']);
        $user = User::factory()->create();
        
        $asset = Asset::create([
            'owner_id' => $user->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-ART123',
            'title' => 'Monna Lisa Replica',
            'condition_status' => 'excellent'
        ]);

        // Act: Post new auction as the logged-in owner
        $response = $this->actingAs($user)
                         ->postJson('/api/auctions', [ // Corrected URL path
                             'asset_id' => $asset->id,
                             'starting_price' => 10000.00,
                             'reserve_price' => 15000.00,
                             'buy_now_price' => 20000.00,
                             'minimum_increment' => 1000.00,
                             'starts_at' => now()->addMinutes(5)->toDateTimeString(),
                             'ends_at' => now()->addDays(2)->toDateTimeString(),
                         ]);

        // Assert: 201 Created and verify DB record
        $response->assertStatus(201);
        $this->assertDatabaseHas('auctions', [
            'asset_id' => $asset->id,
            'starting_price' => 10000.00,
            'reserve_price' => 15000.00
        ]);
    }

    public function test_user_cannot_auction_someone_elses_asset()
    {
        // Arrange: Two users, one asset
        $owner = User::factory()->create();
        $thief = User::factory()->create();
        $category = Category::create(['name' => 'Art', 'slug' => 'art']);
        
        $asset = Asset::create([
            'owner_id' => $owner->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-ART123',
            'title' => 'Monna Lisa Replica',
            'condition_status' => 'excellent'
        ]);

        // Act: Thief tries to auction the Owner's asset
        $response = $this->actingAs($thief)
                         ->postJson('/api/auctions', [
                             'asset_id' => $asset->id,
                             'starting_price' => 10000.00,
                             'reserve_price' => 15000.00,
                             'starts_at' => now()->addMinutes(5)->toDateTimeString(),
                             'ends_at' => now()->addDays(2)->toDateTimeString(),
                         ]);

        // Assert: 403 Forbidden
        $response->assertStatus(403);
    }
}