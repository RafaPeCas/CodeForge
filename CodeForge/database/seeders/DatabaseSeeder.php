<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Space;
use App\Models\Notebook;
use App\Models\Page;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // $this->call(UsersCollectionSeeder::class);
        // $this->call(SpacesCollectionSeeder::class);
        // $this->call(NotebooksCollectionSeeder::class);
        // $this->call(PagesCollectionSeeder::class);
      // Create a user

        // Create a user
        $user = User::create([
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create a space
        $space = Space::create([
            'name' => 'Test Space',
            'description' => 'This is a test space.',
            'author' => $user->_id,
        ]);

        // Add the space to the user's spaces array
        $user->addSpace($space);//$user, 'admin'
        $user->save();

        // Add the user as a member of the space
        $space->addMember($user, 'admin');
        $space->save();

        // Create a notebook
        $notebook = Notebook::create([
            'name' => 'Test Notebook',
            'description' => 'This is a test notebook.',
            'spaceId' => $space->_id,
        ]);

        // Add the notebook to the space's notebooks array
        $space->addNotebook($notebook);
        $space->save();

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
            'author' => $user->_id,
            'version' => 1,
        ]);

        // Add the page to the notebook's pages array
        $notebook->addPage($page);
        $notebook->save();

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
            'author' => $user->_id,
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
            'updatedBy' => $user->_id,
        ]);
        $page->save();

    }
}
