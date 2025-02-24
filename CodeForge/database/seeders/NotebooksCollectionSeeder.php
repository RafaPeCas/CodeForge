<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notebook;
use App\Models\Space;
use App\Models\Page;
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
        $space = Space::first([
            'name' => 'Test Space',
        ], [
            'description' => 'This is a test space.',
            'author' => User::first()->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Create a notebook
        $notebook = Notebook::create([
            'name' => 'Test Notebook',
            'description' => 'This is a test notebook.',
            'spaceId' => $space->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Create a page and associate it with the notebook
        $page = Page::create([
            'title' => 'Test Page',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 1,
                    'content' => 'Welcome to the Test Page',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is a test page.',
                ],
            ],
            'notebookId' => $notebook->_id,
            'author' => User::first()->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
            'version' => 1,
        ]);

        // Add the page to the notebook's pages array
        $notebook->addPage($page);
        $notebook->save();

    }
}
