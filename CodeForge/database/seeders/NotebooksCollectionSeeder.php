<?php
namespace Database\Seeders;

use App\Models\Notebook;
use App\Models\Page;
use App\Models\Space;
use App\Models\User;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;

class NotebooksCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing notebooks
        Notebook::truncate();

        // Find or create a space
        $space = Space::firstOrCreate(
            ['name' => 'Test Space'],
            [
                'description' => 'This is a test space.',
                'author'      => new ObjectId(User::first()->_id),

            ]
        );

        $notebook = Notebook::create([
            'name'        => 'Test Notebook',
            'description' => 'This is a test notebook.',
            'spaceId'     => new ObjectId($space->_id),
        ]);

        // add the notebook to the space's notebooks array
        $space->addNotebook($notebook);
        $space->save();
    }
}