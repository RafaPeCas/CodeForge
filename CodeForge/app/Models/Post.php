<?php

namespace App\Models;


use MongoDB\Laravel\Eloquent\Model;

https://laraveldaily.com/post/mongodb-laravel-guide-beginners

class Post extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'posts'; // The MongoDB collection name
    protected $fillable = ['title', 'content']; // Fields that can be mass-assigned
}
