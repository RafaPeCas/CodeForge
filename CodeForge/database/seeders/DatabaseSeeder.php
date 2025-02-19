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

    // Add the user to the space members
    $space->members()->create([
        'id' => $user->_id,
        'role' => 'admin',
    ]);

    // **Update the user's spaces array**
    $user->push('spaces', [
            'id' => $space->_id,
            'name' => $space->name
        ]);


    // Create a notebook
    $notebook = Notebook::create([
        'name' => 'Test Notebook',
        'description' => 'This is a test notebook.',
        'spaceId' => $space->_id,
    ]);

    // Create a page
    $page = Page::create([
        'title' => 'Test Page',
        'notebookId' => $notebook->_id,
        'author' => $user->_id,
    ]);

    // Create a subpage
    $subpage = Page::create([
        'title' => 'Test Subpage',
        'notebookId' => $notebook->_id,
        'author' => $user->_id,
        'parentPage' => $page->_id,
    ]);

    // Attach subpage to the parent page
    $page->subpages()->save($subpage);


    }
}
