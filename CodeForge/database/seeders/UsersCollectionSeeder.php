<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Space;
use MongoDB\BSON\ObjectId;

class UsersCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing users
        User::truncate();

        // Create a user
        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create a space and associate it with the user
        $space = Space::create([
            'name' => 'Test Space',
            'description' => 'This is a test space.',
            'author' => $user->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Add the space to the user's spaces array
        $user->addSpace($space);
        $user->save();
    }
}
