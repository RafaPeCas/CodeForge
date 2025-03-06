<?php
namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notebook extends Model
{
    protected $collection = 'notebooks';
    protected $fillable   = [
        'name',
        'description',
        'spaceId',
    ];

}