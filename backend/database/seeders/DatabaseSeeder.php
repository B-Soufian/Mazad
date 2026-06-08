<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User ────────────────────────────────────────────────────────
        // Login: admin@mazad.com / password: admin1234
        User::create([
            'display_name' => 'Admin',
            'username'     => 'admin',
            'email'        => 'admin@mazad.com',
            'password'     => Hash::make('admin1234'),
            'role'         => 'admin',
        ]);

        // ── Regular Test User ─────────────────────────────────────────────────
        // Login: test@example.com / password: password
        User::create([
            'display_name' => 'Test User',
            'username'     => 'testuser',
            'email'        => 'test@example.com',
            'password'     => Hash::make('password'),
            'role'         => 'bidder',
        ]);

        $this->call([
            FakeDataSeeder::class,
        ]);
    }
}
