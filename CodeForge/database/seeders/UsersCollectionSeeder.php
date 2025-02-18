<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'john_doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'spaces' => [
                ['id' => new \MongoDB\BSON\ObjectId(), 'name' => 'Space 1'],
                ['id' => new \MongoDB\BSON\ObjectId(), 'name' => 'Space 2'],
            ],
        ]);
    }
}
