<?php

namespace Database\Seeders;

use App\Models\Notebook;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;

class NotebooksCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Notebook::create([
            'name' => 'Example Notebook',
            'description' => 'This is an example notebook.',
            'spaceId' => new ObjectId(),
            'pages' => [
                new ObjectId(),
                new ObjectId(),
            ]
        ]);
    }
}
