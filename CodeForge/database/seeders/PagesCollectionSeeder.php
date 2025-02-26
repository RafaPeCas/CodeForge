<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Notebook;
use App\Models\Space;
use App\Models\User;
use MongoDB\BSON\ObjectId;

class PagesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing pages
        // Page::truncate();
        // Find or create a notebook
        $notebook = Notebook::firstOrCreate([
            'name' => 'Test Notebook',
        ], [
            'description' => 'This is a test notebook.',
            'spaceId' => new ObjectId(Space::first()->_id),
            'pages' => [], // Initialize pages as an empty array
            'createdAt' => now(),
            'updatedAt' => now(),
        ]);

        // ✅ Create the first top-level page
        $page1 = Page::create([
            'title' => 'Test Page 1',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 1,
                    'content' => 'Welcome to Test Page 1',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is a test page.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'author' => new ObjectId(User::first()->_id),
            'createdAt' => now(),
            'updatedAt' => now(),
            'version' => 1,
        ]);

        // ✅ Prepare page1 data for the notebook
        $page1Data = [
            '_id' =>new ObjectId($page1->_id), // Ensure ID is a string
            'title' => $page1->title,
            'subPages' => [],
        ];

        // ✅ Add page1 to notebook's pages array
        $notebook->push('pages', $page1Data);
        $notebook->save();

        // ✅ Create a subpage for page1
        $subpage1 = Page::create([
            'title' => 'Test Subpage 1',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 2,
                    'content' => 'Welcome to Test Subpage 1',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is a test subpage.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'author' => new ObjectId(User::first()->_id),
            'parentPage' => new ObjectId($page1->_id),
            'version' => 1,
        ]);

        // ✅ Prepare subpage1 data
        $subpage1Data = [
            '_id' =>new ObjectId($subpage1->_id),
            'title' => $subpage1->title,
            'subPages' => [],
        ];

        // ✅ Add subpage1 to page1 using addSubPage
        $notebook = Notebook::find($notebook->_id);
        $notebook->addSubPage($page1->_id, $subpage1Data);
        $notebook->save();

        // ✅ Create a second top-level page
        $page2 = Page::create([
            'title' => 'Test Page 2',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 1,
                    'content' => 'Welcome to Test Page 2',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is another test page.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'author' => new ObjectId(User::first()->_id),
            'version' => 1,
        ]);

        // ✅ Prepare page2 data
        $page2Data = [
            '_id' =>new ObjectId($page2->_id),
            'title' => $page2->title,
            'subPages' => [],
        ];

        // ✅ Add page2 to notebook's pages array
        $notebook->push('pages', $page2Data);
        $notebook->save();

        // ✅ Create a subpage for page2
        $subpage2 = Page::create([
            'title' => 'Test Subpage 2',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 2,
                    'content' => 'Welcome to Test Subpage 2',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is another test subpage.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'author' => new ObjectId(User::first()->_id),
            'parentPage' => new ObjectId($page2->_id),
            'version' => 1,
        ]);

        // ✅ Prepare subpage2 data
        $subpage2Data = [
            '_id' =>new ObjectId($subpage2->_id),
            'title' => $subpage2->title,
            'subPages' => [],
        ];

        // ✅ Add subpage2 to page2 using addSubPage
        $notebook = Notebook::find($notebook->_id);
        $notebook->addSubPage($page2->_id, $subpage2Data);
        $notebook->save();
    }
}