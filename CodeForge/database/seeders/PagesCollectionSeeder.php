<?php
namespace Database\Seeders;

use App\Models\Notebook;
use App\Models\Page;
use App\Models\Space;
use Illuminate\Database\Seeder;
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
        // Find or create a notebook
        $notebook = Notebook::firstOrCreate([
            'name' => 'Test Notebook',
        ], [
            'description' => 'This is a test notebook.',
            'spaceId'     => new ObjectId(Space::first()->_id),
        ]);

        // Create pages for the notebook
        $pages = [
            [
                '_id'       => new ObjectId('64a1b2c3d4e5f6a7b8c9d0e1'),
                'title'     => 'Introduction',
                'parentId'  => null,
                'ancestors' => [],
                'version'   => 1,
                'isCurrent' => true,
                'blocks'    => [
                    [
                        'type'    => 'heading',
                        'level'   => 2,
                        'content' => 'This is the initial content of the Introduction page.',
                    ],
                    [
                        'type'    => 'paragraph',
                        'content' => 'This is another test subpage.',
                    ],
                ],
            ],
            [
                '_id'       => new ObjectId('64a1b2c3d4e5f6a7b8c9d0e2'),
                'title'     => 'Chapter 1',
                'parentId'  => null,
                'ancestors' => [],
                'version'   => 1,
                'isCurrent' => true,
                'blocks'    => [
                    [
                        'type'    => 'heading',
                        'level'   => 3,
                        'content' => 'This is the initial content of Chapter 1.',
                    ],
                    [
                        'type'    => 'paragraph',
                        'content' => 'This is another test subpage.',
                    ],
                ],
            ],
            [
                '_id'       => new ObjectId('64a1b2c3d4e5f6a7b8c9d0e3'),
                'title'     => 'Chapter 1.1',
                'parentId'  => new ObjectId('64a1b2c3d4e5f6a7b8c9d0e2'),
                'ancestors' => [new ObjectId('64a1b2c3d4e5f6a7b8c9d0e2')],
                'version'   => 1,
                'isCurrent' => true,
                'blocks'    => [
                    [
                        'type'    => 'heading',
                        'level'   => 2,
                        'content' => 'This is the initial content of Section 1.1.',
                    ],
                    [
                        'type'    => 'code_block',
                        'content' => 'This is a codeblock',
                    ],
                ],
            ],
        ];

        foreach ($pages as $pageData) {
            Page::firstOrCreate(
                ['_id' => $pageData['_id']],
                array_merge($pageData, [
                    'notebookId' => new ObjectId($notebook->_id),
                ])
            );
        }
    }
}
