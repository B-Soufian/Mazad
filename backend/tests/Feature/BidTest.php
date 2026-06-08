<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Category;
use App\Models\User;
use App\Models\Auction;
use App\Models\Bid;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BidTest extends TestCase
{
    use RefreshDatabase;

    private $bidderA;
    private $bidderB;
    private $auction;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup base data
        $category = Category::create(['name' => 'Watches', 'slug' => 'watches']);
        $owner = User::factory()->create();
        
        $asset = Asset::create([
            'owner_id' => $owner->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-WATCH1',
            'title' => 'Vintage Rolex Submariner',
            'condition_status' => 'excellent'
        ]);

        // Create a live auction (Starting price: 10,000, Increment: 1,000)
        $this->auction = Auction::create([
            'asset_id' => $asset->id,
            'status' => 'live',
            'starting_price' => 10000.00,
            'current_price' => 10000.00,
            'reserve_price' => 15000.00,
            'minimum_increment' => 1000.00,
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addHours(2),
        ]);

        // Create Bidder A with 50,000 MAD
        $this->bidderA = User::factory()->create([
            'wallet_balance' => 50000.00,
            'frozen_balance' => 0.00
        ]);

        // Create Bidder B with 60,000 MAD
        $this->bidderB = User::factory()->create([
            'wallet_balance' => 60000.00,
            'frozen_balance' => 0.00
        ]);
    }

    public function test_a_user_can_place_a_valid_bid_and_freezes_funds()
    {
        // Act: Bidder A places a bid of 12,000 (Valid: > 10k starting + 1k increment)
        $response = $this->actingAs($this->bidderA)
                         ->postJson('/api/bids', [
                             'auction_id' => $this->auction->id,
                             'amount' => 12000.00
                         ]);

        $response->assertStatus(201);

        // Check Auction Current Price updated
        $this->auction->refresh();
        $this->assertEquals(12000.00, $this->auction->current_price);

        // Check Bidder A funds are frozen
        $this->bidderA->refresh();
        $this->assertEquals(12000.00, $this->bidderA->frozen_balance);
        $this->assertEquals(38000.00, $this->bidderA->available_balance); // 50k - 12k

        // Check transaction was logged in DB
        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->bidderA->id,
            'type' => 'bid_placed',
            'amount' => 12000.00
        ]);
    }

    public function test_bidder_is_refunded_when_outbid_by_another_user()
    {
        // 1. Bidder A bids 12,000
        $this->actingAs($this->bidderA)->postJson('/api/bids', [
            'auction_id' => $this->auction->id,
            'amount' => 12000.00
        ]);

        // 2. Bidder B outbids with 15,000
        $response = $this->actingAs($this->bidderB)->postJson('/api/bids', [
            'auction_id' => $this->auction->id,
            'amount' => 15000.00
        ]);

        $response->assertStatus(201);

        // 3. Assert: Bidder A has been refunded (frozen balance back to 0)
        $this->bidderA->refresh();
        $this->assertEquals(0.00, $this->bidderA->frozen_balance);
        $this->assertEquals(50000.00, $this->bidderA->available_balance);

        // Assert: Bidder B is now the winning bidder and has funds frozen
        $this->bidderB->refresh();
        $this->assertEquals(15000.00, $this->bidderB->frozen_balance);
        $this->assertEquals(45000.00, $this->bidderB->available_balance);

        // Check refund transaction was logged for Bidder A
        $this->assertDatabaseHas('transactions', [
            'user_id' => $this->bidderA->id,
            'type' => 'refund',
            'amount' => 12000.00
        ]);
    }

    public function test_user_cannot_bid_with_insufficient_available_balance()
    {
        // Bidder A only has 50k, tries to bid 55k
        $response = $this->actingAs($this->bidderA)
                         ->postJson('/api/bids', [
                             'auction_id' => $this->auction->id,
                             'amount' => 55000.00
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['amount']);
    }

    public function test_bid_fails_if_below_current_price_plus_minimum_increment()
    {
        // Minimum bid must be 11k. Bidder A tries to bid 10,500
        $response = $this->actingAs($this->bidderA)
                         ->postJson('/api/bids', [
                             'auction_id' => $this->auction->id,
                             'amount' => 10500.00
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['amount']);
    }
}