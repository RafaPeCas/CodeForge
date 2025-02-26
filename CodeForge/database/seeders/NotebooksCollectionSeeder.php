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
            'pages'       => [], // Initialize pages as an empty array
        ]);

        // add the notebook to the space's notebooks array
        $space->addNotebook($notebook);
        $space->save();
        
        // Create a top-level page and associate it with the notebook
        $page = Page::create([
            'title'      => 'Test Page',
            'blocks'     => [
                [
                    'type'    => 'heading',
                    'level'   => 1,
                    'content' => 'Welcome to the Test Page',
                ],
                [
                    'type'    => 'paragraph',
                    'content' => 'This is a test page.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'author'     => new ObjectId(User::first()->_id),
            'version'    => 1,
        ]);
        
        // Prepare the page data to add to the notebook
        $pageData = [
            '_id'      => new ObjectId($page->_id),
            'title'    => $page->title,
            'subPages' => [], // Initialize subPages as an empty array
        ];
        \Log::info('Type of page id:', ['type' => gettype($page->_id)]);
        // Add the page to the notebook's pages array
        $notebook->push('pages', $pageData);
        $notebook->save();
        
        // Create a subpage and associate it with the top-level page
        $subPage = Page::create([
            'title'      => 'Test SubPage',
            'blocks'     => [
                [
                    'type'    => 'heading',
                    'level'   => 2,
                    'content' => 'Welcome to the Test SubPage',
                ],
                [
                    'type'    => 'paragraph',
                    'content' => 'This is a test subpage.',
                ],
            ],
            'notebookId' => new ObjectId($notebook->_id),
            'parentPage' => new ObjectId($page->_id), // Associate with the parent page
            'author'     => new ObjectId(User::first()->_id),
            'version'    => 1,
        ]);
        
        // Prepare the subpage data to add to the parent page's subPages array
        $subPageData = [
            '_id'      => new ObjectId($subPage->_id),
            'title'    => $subPage->title,
            'subPages' => [], // Initialize subPages as an empty array
        ];
        
        // Add the subpage to the parent page's subPages array
        $notebook = Notebook::find($notebook->_id); // Ensure fresh model instance
        $notebook->addSubPage($page->_id, $subPageData);
        $notebook->save();
    }
}