<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    // Store the password in a static property to avoid hashing it multiple times during tests
    protected static ?string $password = null;

    public function definition(): array
    {
        return [
            'display_name' => fake()->name(),
            'username' => fake()->unique()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'email_verified_at' => now(),
            // This dynamically hashes the password safely according to your Laravel settings
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'bidder',
            'wallet_balance' => 0,
            'frozen_balance' => 0,
            'remember_token' => Str::random(10),
        ];
    }
}