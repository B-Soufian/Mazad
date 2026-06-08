<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_categories()
    {
        Category::create(['name' => 'Art', 'slug' => 'art']);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
                 ->assertJsonCount(1);
    }

    public function test_non_admins_cannot_create_categories()
    {
        // Create a standard 'bidder' user
        $bidder = User::factory()->create(['role' => 'bidder']);

        $response = $this->actingAs($bidder)
                         ->postJson('/api/categories', [
                             'name' => 'Supercars',
                             'slug' => 'supercars'
                         ]);

        // Assert: 403 Forbidden
        $response->assertStatus(403);
    }

    public function test_admins_can_create_categories()
    {
        // Create an 'admin' user
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)
                         ->postJson('/api/categories', [
                             'name' => 'Supercars',
                             'slug' => 'supercars'
                         ]);

        // Assert: 201 Created and saved in DB
        $response->assertStatus(201);
        $this->assertDatabaseHas('categories', [
            'name' => 'Supercars'
        ]);
    }
}