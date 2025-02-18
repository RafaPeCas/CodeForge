<?php

namespace Database\Seeders;

use App\Models\Space;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;

class SpacesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Space::create([
            'name' => 'Example Space',
            'description' => 'This is an example space.',
            'owner' => new ObjectId(),
            'members' => [
                ['id' => new ObjectId(), 'role' => 'read-only'],
                ['id' => new ObjectId(), 'role' => 'read-write'],
                ['id' => new ObjectId(), 'role' => 'admin'],
            ],
            'notebooks' => [
                ['id' => new ObjectId(), 'name' => 'Notebook 1'],
                ['id' => new ObjectId(), 'name' => 'Notebook 2'],
            ],
        ]);
    }
}
