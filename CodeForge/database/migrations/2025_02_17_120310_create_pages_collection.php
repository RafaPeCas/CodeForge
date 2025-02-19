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
        Schema::create('pages', function (Blueprint $collection) {
            $collection->string('title'); // Title of the page
            $collection->embedsMany('blocks', function (Blueprint $embeddedCollection) {
                $embeddedCollection->string('type'); // Type of block (heading, paragraph, code, etc.)
                $embeddedCollection->number('level'); // Heading level (only for "heading" blocks)
                $embeddedCollection->string('content'); // Content of the block
                $embeddedCollection->string('language'); // Programming language (only for "code" blocks)
            });
            $collection->objectId('notebookId'); // ID of the notebook this page belongs to
            $collection->timestamps();
            $collection->objectId('author'); // ID of the user who created the page
            $collection->objectId('parentPage')->nullable(); // Optional reference to the parent page
            $collection->array('subpages')->nullable(); // List of references to subpages
            $collection->number('version'); // Current version number of the page
            $collection->embedsMany('history', function (Blueprint $embeddedCollection) {
                $embeddedCollection->number('version'); // Version number
                $embeddedCollection->string('title'); // Title of the page in this version
                $embeddedCollection->embedsMany('blocks', function (Blueprint $nestedEmbeddedCollection) {
                    $nestedEmbeddedCollection->string('type');
                    $nestedEmbeddedCollection->number('level');
                    $nestedEmbeddedCollection->string('content');
                    $nestedEmbeddedCollection->string('language');
                });
                $embeddedCollection->date('updatedAt'); // Update date of this version
                $embeddedCollection->objectId('updatedBy'); // ID of the user who updated this version
            });
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages_collection');
    }
};
