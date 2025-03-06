<?php
namespace App\Models;

use MongoDB\BSON\ObjectId;
use MongoDB\Laravel\Eloquent\Model;

class Page extends Model
{
    protected $collection = 'pages';
    protected $fillable   = [
        'notebookId',
        'title',
        'blocks',
        'parentId',
        'ancestors',
        'version',
        'isCurrent',
    ];

}
