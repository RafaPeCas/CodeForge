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
        'pages',
    ];

    /*
    * &$pages: A reference to the pages array (so we can modify it directly).
    * isset:Determine if a variable is declared and is different than NULL
    * use: Imports variables from the parent scope into the closure.
    * &: Passes the variable by reference, allowing the closure to modify the original variable.
    * use (&$findAndAddSubPage): Allows the recursive closure to call itself and modify the original $findAndAddSubPage variable.
    */

    // Add a subpage to a specific parent page in the notebook
    public function addSubPage($parentPageId, $newPage)
    {
        // Get the pages array (use actual attribute, not `$this->attributes['pages']`)
        $pages = $this->pages;

        // Recursive function to find the parent page and add the subpage
        $findAndAddSubPage = function (&$pages, $parentPageId, $newPage) use (&$findAndAddSubPage) {
            foreach ($pages as &$page) {

                // Case 1: The page is an array and its 'id' matches the parentPageId
                if (is_array($page) && isset($page['id']) && (string) $page['id'] === (string) $parentPageId) {
                    if (! isset($page['subPages'])) {
                        $page['subPages'] = []; // Initialize subPages if not already set
                    }
                    $page['subPages'][] = $newPage; // Append the new subpage
                    return true;                    // Stop further recursion
                }
                // Case 2: If the page contains subPages, continue searching deeper recursively
                elseif (! empty($page['subPages'])) {
                    \Log::info('check_subPages');
                    if ($findAndAddSubPage($page['subPages'], $parentPageId, $newPage)) {
                        return true;
                    }
                }
            }
            return false;
        };

        // Modify the pages array
        $updated = $findAndAddSubPage($pages, $parentPageId, $newPage);

        if ($updated) {
            //  Apply the modified pages back to the model
            $this->pages = $pages;

            $this->save();
        } else {
            \Log::error("Parent page ID $parentPageId not found in pages array.");
        }
    }
}

// Debugging: Log the page type and ID based on whether it's an array or object
// if (is_object($page) && isset($page->_id)) {
//     \Log::info('Type of page1:', ['type' => gettype($page)]);
//     \Log::info('Processing page:', ['page' => $page, '_id' => (string)$page->_id]);
// } elseif (is_array($page) && isset($page['id'])) {
//     \Log::info('Type of page2:', ['type' => gettype($page)]);
//     \Log::info('Processing page:', ['page' => $page, 'id' => (string)$page['id']]);
// } else {
//     \Log::info('Unknown page structure:', ['page' => $page]);
// }

// if (is_object($page) && isset($page->_id) && (string)$page->_id === (string)$parentPageId) {
//     \Log::info('Is_object');
//     // Found the parent page, add the new subpage
//     if (!isset($page->subPages)) {
//         $page->subPages = [];
//     }
//     $page->subPages[] = $newPage;
//     return true; // Stop further recursion

// } else
