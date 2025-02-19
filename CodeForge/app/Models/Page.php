<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\BSON\ObjectId;

class Page extends Model
{
    protected $collection = 'pages'; // MongoDB collection name
    protected $fillable = [
        'title',
        'blocks',
        'notebookId',
        'author',
        'parentPage',
        'subpages',
        'version',
        'history',
    ];

    public function addSubpage(Page $subpage)
    {
        $this->push('subpages', new ObjectId($subpage->_id));
    }

    /**
     * $page->addVersion([
     *  'version' => 2,
     *  'title' => 'Updated Title',
     *  'blocks' => [
     *      [
     *          'type' => 'paragraph',
     *          'content' => 'This is an updated version.',
     *      ],
     *  ],
     *  'updatedAt' => now(),
     *  'updatedBy' => new ObjectId('user_id'),
     *  ]);
     */
    public function addVersion(array $versionData)
    {
        $this->push('history', $versionData);
    }
}
