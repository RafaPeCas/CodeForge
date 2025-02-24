<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Space;
use App\Models\User;
use App\Models\Notebook;
use MongoDB\BSON\ObjectId;

class SpacesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing spaces
        Space::truncate();

        // Find or create a user
        $user = User::firstOrCreate([
            'username' => 'testuser',
        ], [
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Create a space
        $space = Space::create([
            'name' => 'Test Space',
            'description' => 'This is a test space.',
            'author' => $user->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Add the user as a member of the space
        $space->addMember($user, 'admin');
        $space->save();

        // Create a notebook and associate it with the space
        $notebook = Notebook::create([
            'name' => 'Test Notebook',
            'description' => 'This is a test notebook.',
            'spaceId' => $space->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Add the notebook to the space's notebooks array
        $space->addNotebook($notebook);
        $space->save();
        
    }
}