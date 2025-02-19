<?php

namespace Database\Seeders;

use App\Models\Space;
use Illuminate\Database\Seeder;
use MongoDB\BSON\ObjectId;
use App\Models\User;

class SpacesCollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        $space = Space::create([
            'name' => 'Test Space',
            'description' => 'This is a test space.',
            'author' => $user->_id,
        ]);

        // Agregar usuario como miembro del espacio
        $space->members()->create([
            'id' => $user->_id,
            'role' => 'admin',
        ]);

        // Actualizar espacios del usuario
        $user->push('spaces', [
            'id' => $space->_id,
            'name' => $space->name
        ]);
        
    }
}