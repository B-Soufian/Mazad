<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WalletTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_deposit_money_into_wallet()
    {
        $user = User::factory()->create(['wallet_balance' => 1000]);

        $response = $this->actingAs($user)
                         ->postJson('/api/wallet/deposit', [
                             'amount' => 5000
                         ]);

        $response->assertStatus(200);

        // Verify balance updated (1000 + 5000 = 6000)
        $user->refresh();
        $this->assertEquals(6000, $user->wallet_balance);

        // Verify transaction logged
        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'type' => 'deposit',
            'amount' => 5000
        ]);
    }

    public function test_user_can_withdraw_available_money()
    {
        // User has 10k total, but 4k is frozen in a bid. Available = 6k.
        $user = User::factory()->create([
            'wallet_balance' => 10000,
            'frozen_balance' => 4000
        ]);

        // Attempt to withdraw 5000 (Success: 5000 <= 6000)
        $response = $this->actingAs($user)
                         ->postJson('/api/wallet/withdraw', [
                             'amount' => 5000
                         ]);

        $response->assertStatus(200);
        
        $user->refresh();
        $this->assertEquals(5000, $user->wallet_balance); // 10k - 5k
    }

    public function test_user_cannot_withdraw_frozen_money()
    {
        // User has 10k total, but 9k is frozen. Available = 1k.
        $user = User::factory()->create([
            'wallet_balance' => 10000,
            'frozen_balance' => 9000
        ]);

        // Attempt to withdraw 5000 (Fail: 5000 > 1000 available)
        $response = $this->actingAs($user)
                         ->postJson('/api/wallet/withdraw', [
                             'amount' => 5000
                         ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['amount']);
    }
}