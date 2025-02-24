<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Page;
use MongoDB\BSON\ObjectId;

class PagesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing pages
        Page::truncate();

        // Find 
        $notebook = Notebook::firstOrCreate([
            'name' => 'Test Notebook',
        ], [
            'description' => 'This is a test notebook.',
            'spaceId' => Space::first()->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // Create a page
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

        // Create a subpage
        $subpage = Page::create([
            'title' => 'Test Subpage',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 2,
                    'content' => 'Welcome to the Test Subpage',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is a test subpage.',
                ],
            ],
            'notebookId' => $notebook->_id,
            'author' => User::first()->_id,
            'parentPage' => $page->_id,
            'createdAt' => now(),
            'updatedAt' => now(),
            'version' => 1,
        ]);

        // Add the subpage to the parent page's subpages array
        $page->addSubpage($subpage);
        $page->save();

        // Add a version to the page's history
        $page->addVersion([
            'version' => 2,
            'title' => 'Updated Test Page',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 1,
                    'content' => 'Welcome to the Updated Test Page',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is an updated test page.',
                ],
            ],
            'updatedAt' => now(),
            'updatedBy' => User::first()->_id,
        ]);
        $page->save();
    }
}
