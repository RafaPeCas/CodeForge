<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Project extends Model
{
    protected $collection = 'projects';

    protected $fillable = [
        'name',
        'description',
        'ownerId',
        'collaborators',
        'createdAt',
        'updatedAt',
    ];

    protected $casts = [
        'ownerId' => 'objectId',
        'collaborators' => 'array',
        'createdAt' => 'datetime',
        'updatedAt' => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'ownerId');
    }

    public function collaborators()
    {
        return $this->hasMany(User::class, '_id', 'collaborators');
    }
}
