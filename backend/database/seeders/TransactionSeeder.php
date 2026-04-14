<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    public function run()
    {
        for ($i = 2; $i <= 5; $i++) {
            // Initial Deposit for users
            Transaction::create([
                'id' => uniqid('trx_'),
                'user_id' => 'usr_00' . $i,
                'type' => 'deposit',
                'amount' => 5000000,
                'currency' => 'AED',
                'status' => 'cleared',
                'description' => 'Initial Wire Transfer'
            ]);
        }
    }
}
