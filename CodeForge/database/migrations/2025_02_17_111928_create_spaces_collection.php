<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    /**
     * Run the migrations.
     */

    public function up(): void
    {
        Schema::create('spaces', function (Blueprint $collection) {
            $collection->string('name');
            $collection->string('description');
            $collection->objectId('author');
            $collection->embedsMany('members', function (Blueprint $embeddedCollection) {
                $embeddedCollection->objectId('id');
                $embeddedCollection->string('role');
            });
            $collection->embedsMany('notebooks', function (Blueprint $embeddedCollection) {
                $embeddedCollection->objectId('id');
                $embeddedCollection->string('name');
            });
            $collection->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
