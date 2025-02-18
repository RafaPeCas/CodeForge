<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Notebook extends Model
{
    protected $collection = 'notebooks';
    protected $fillable = [
        'name',
        'description',
        'spaceId',
        'pages'
    ];

    public function addPage(Page $page)
    {
        $this->push('pages', new ObjectId($page->_id));
    }
}
