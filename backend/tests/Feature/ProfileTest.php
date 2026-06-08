<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_own_profile_with_balances()
    {
        $user = User::factory()->create([
            'display_name' => 'Soufiane',
            'wallet_balance' => 5000,
            'frozen_balance' => 1000
        ]);

        $response = $this->actingAs($user)->getJson('/api/auth/me');

        $response->assertStatus(200)
                 ->assertJsonPath('user.display_name', 'Soufiane')
                 ->assertJsonPath('user.available_balance', 4000); // 5000 - 1000
    }

    public function test_user_can_view_their_transaction_history()
    {
        $user = User::factory()->create();
        
        // Create 2 fake transactions
        Transaction::create(['user_id' => $user->id, 'type' => 'deposit', 'amount' => 5000]);
        Transaction::create(['user_id' => $user->id, 'type' => 'withdrawal', 'amount' => 1000]);

        $response = $this->actingAs($user)->getJson('/api/transactions/my');

        $response->assertStatus(200)
                 ->assertJsonCount(2);
    }

    public function test_user_can_submit_kyc_documents()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson("/api/users/{$user->id}/kyc", [
            'document_type' => 'CIN',
            'document_number' => 'AB123456',
            'file_url' => 'http://storage.com/cin.pdf'
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'KYC documents submitted for review.']);
    }
}