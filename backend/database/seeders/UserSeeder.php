<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // 1 Admin
        User::create([
            'id' => 'usr_admin_01',
            'username' => 'the_curator',
            'display_name' => 'The Curator',
            'email' => 'admin@highstakes.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'wallet_balance' => 0
        ]);

        // 4 Bidders
        for ($i = 2; $i <= 5; $i++) {
            User::create([
                'id' => 'usr_00' . $i,
                'username' => 'collector_0' . $i,
                'display_name' => 'VIP Collector ' . $i,
                'email' => "user{$i}@test.com",
                'password' => Hash::make('password'),
                'role' => 'bidder',
                'kyc' => ['tier' => 'Tier 3 (Elite)', 'status' => 'verified'],
                'wallet_balance' => 5000000,
                'available_balance' => 5000000,
            ]);
        }
    }
}
