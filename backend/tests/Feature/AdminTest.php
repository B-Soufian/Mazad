<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Category;
use App\Models\User;
use App\Models\Auction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private $admin;
    private $bidder;
    private $pendingAuction;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->bidder = User::factory()->create(['role' => 'bidder']);
        
        $category = Category::create(['name' => 'Art', 'slug' => 'art']);
        $asset = Asset::create([
            'owner_id' => $this->bidder->id,
            'category_id' => $category->id,
            'lot_number' => 'LOT-123',
            'title' => 'Painting',
            'condition_status' => 'new'
        ]);

        $this->pendingAuction = Auction::create([
            'asset_id' => $asset->id,
            'status' => 'pending',
            'starting_price' => 1000,
            'reserve_price' => 1000,
            'starts_at' => now()->toDateTimeString(), // Format sécurisé
            'ends_at' => now()->addDays(2)->toDateTimeString(), // Format sécurisé
        ]);
    }

    public function test_admin_can_approve_an_auction()
    {
        $response = $this->actingAs($this->admin)->patchJson("/api/admin/auctions/{$this->pendingAuction->id}/approve");

        // C'EST CETTE LIGNE QUI VA NOUS DIRE EXACTEMENT OÙ EST L'ERREUR :
        $response->dump();

        $response->assertStatus(200);
        $this->assertEquals('live', $this->pendingAuction->fresh()->status);
    }

    public function test_non_admin_cannot_approve_auctions()
    {
        $response = $this->actingAs($this->bidder)->patchJson("/api/admin/auctions/{$this->pendingAuction->id}/approve");

        $response->assertStatus(403); 
    }
}