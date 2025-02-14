<?php

use Illuminate\Database\Migrations\Migration;
use MongoDB\Laravel\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $collection) {
            $collection->objectId('_id');
            $collection->string('name');
            $collection->string('description');
            $collection->objectId('ownerId');
            $collection->array('collaborators'); // Array de ObjectIds
            $collection->date('createdAt');
            $collection->date('updatedAt');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
