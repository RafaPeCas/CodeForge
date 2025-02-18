<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Space extends Model
{
    protected $collection = 'spaces';
    protected $fillable = [
        'name',
        'description',
        'owner',
        'members',
        'notebooks',
    ];

    public function addMember(Space $space)
    {
        $this->push('members', [
            'id' => new ObjectId($space->_id),
            'role' => $space->name
        ]);
    }
}
