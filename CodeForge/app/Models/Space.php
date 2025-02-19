<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\BSON\ObjectId;

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

    public function addMember(User $user, string $role = 'member')
    {
        $this->push('members', [
            'id' => new \MongoDB\BSON\ObjectId($user->_id),
            'role' => $role
        ]);
    }
    
    public function addNotebook(Notebook $notebook)
    {
        $this->push('notebooks', [
            'id' => new ObjectId($notebook->_id),
            'name' => $notebook->name,
        ]);
    }
}
