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

        Schema::create('users', function (Blueprint $collection) {
            $collection->string('username');
            $collection->string('email');
            $collection->string('password');
            $collection->string('remember_token')->nullable();
            $collection->nullable('email_verified_at');
            $collection->embedsMany('spaces', function (Blueprint $embeddedCollection) {
                $embeddedCollection->objectId('id');
                $embeddedCollection->string('name');
            });
            $collection->timestamps();
        });

        //todo check if this is correct 
        Schema::create('password_reset_tokens', function (Blueprint $collection) {
            $collection->string('email')->primary();
            $collection->string('token');
            $collection->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $collection) {
            $collection->objectId('id');
            $collection->objectId('user_id')->nullable();
            $collection->string('ip_address', 45)->nullable();
            $collection->text('user_agent')->nullable();
            $collection->longText('payload');
            $collection->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
