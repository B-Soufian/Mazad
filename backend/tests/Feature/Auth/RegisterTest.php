<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase; // Cleans the database after every test

    public function test_a_visitor_can_register_successfully()
    {
        // 1. Act: Send a POST request to the register API
        $response = $this->postJson('/api/auth/register', [
            'display_name' => 'John Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!'
        ]);

        // 2. Assert: Check if the response is 201 Created and has a token
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'message',
                     'user' => ['id', 'username', 'email', 'role'],
                     'token'
                 ]);

        // 3. Assert: Check if the user was actually saved in the Database as a 'bidder'
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'role' => 'bidder',
        ]);
    }

    public function test_registration_fails_if_email_is_already_taken()
    {
        // Arrange: Create a user first
        User::factory()->create(['email' => 'existing@example.com']);

        // Act: Try to register with the same email
        $response = $this->postJson('/api/auth/register', [
            'display_name' => 'Jane Doe',
            'username' => 'janedoe',
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!'
        ]);

        // Assert: Check that it throws a 422 Validation Error
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }
}