<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;


class PagesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Page::create([
            'title' => 'Example Page',
            'blocks' => [
                [
                    'type' => 'heading',
                    'level' => 1,
                    'content' => 'Welcome to the Example Page',
                ],
                [
                    'type' => 'paragraph',
                    'content' => 'This is an example page with some content.',
                ],
                [
                    'type' => 'code',
                    'content' => 'console.log("Hello, world!");',
                    'language' => 'javascript',
                ],
            ],
            'notebookId' => new ObjectId(),
            'author' => new ObjectId(),
            'parentPage' => null, // No parent page
            'subpages' => null, // No subpages
            'version' => 1,
            'history' => [
                [
                    'version' => 1,
                    'title' => 'Example Page',
                    'blocks' => [
                        [
                            'type' => 'heading',
                            'level' => 1,
                            'content' => 'Welcome to the Example Page',
                        ],
                        [
                            'type' => 'paragraph',
                            'content' => 'This is an example page with some content.',
                        ],
                        [
                            'type' => 'code',
                            'content' => 'console.log("Hello, world!");',
                            'language' => 'javascript',
                        ],
                    ],
                    'updatedAt' => now(),
                    'updatedBy' => new ObjectId(),
                ],
            ],
        ]);
    }
}
