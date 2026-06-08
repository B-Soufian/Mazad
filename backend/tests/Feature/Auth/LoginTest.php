<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_login_successfully_with_valid_credentials()
    {
        // 1. Arrange: Create a user in the database
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
        ]);

        // 2. Act: Attempt to login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'password123',
        ]);

        // 3. Assert: Verify we get a token and 200 OK status (PDF Page 7)
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user',
                     'token'
                 ]);
    }

    public function test_a_user_cannot_login_with_incorrect_password()
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Act: Wrong password
        $response = $this->postJson('/api/auth/login', [
            'email' => 'user@example.com',
            'password' => 'wrong-password',
        ]);

        // Assert: 401 Unauthorized (PDF Page 7 Rule)
        $response->assertStatus(401)
                 ->assertJson([
                     'message' => 'Invalid credentials'
                 ]);
    }

    public function test_an_authenticated_user_can_logout()
    {
        // Arrange: Create a user and get a Sanctum token
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        // Act: Send request with Bearer token header
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/auth/logout');

        // Assert: 200 OK and tokens database table is empty
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Logged out successfully'
                 ]);

        $this->assertCount(0, $user->tokens);
    }
}