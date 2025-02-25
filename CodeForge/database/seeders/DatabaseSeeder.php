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

        $this->call(UsersCollectionSeeder::class);
        $this->call(SpacesCollectionSeeder::class);
        $this->call(NotebooksCollectionSeeder::class);
        $this->call(PagesCollectionSeeder::class);

    }
}
