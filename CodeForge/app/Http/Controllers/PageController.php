<?php
namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class PageController extends Controller
{
    // Create a new page
    public function store(Request $request)
    {
        $request->validate([
            'title'      => 'required|string|max:255',
            'blocks'     => 'required|array',
            'notebookId' => 'required|exists:notebooks,_id',
            'parentPage' => 'nullable|exists:notebooks,pages._id',
        ]);

        $page = Page::create([
            'title'      => $request->title,
            'blocks'     => $request->blocks,
            'notebookId' => new objectId($request->notebookId),
            'author'     => new objectId($request->user()->id),
            'parentPage' => new objectId($request->parentPage) ?? null,
            'version'    => 1,
        ]);
        // find the ntoebook
        $notebook = Notebook::find($request->notebookId);

        // Prepare the page data to add to the notebook
        $pageData = [
            '_id'   => $page->_id,
            'title' => $page->title,
        ];

        if ($request->parentPage) {
            // If it's a subpage, add it to the parent page's subPages array
            $this->addSubPage($notebook, $request->parentPage, $pageData);
        } else {
            // If it's a top-level page, add it to the notebook's pages array
            $notebook->push('pages', $pageData);
        }

        // save the notebook changes
        $notebook->save();

        return response()->json($page, 201);
    }

    // Get pages in a notebook
    public function index($notebookId)
    {
        $pages = Page::where('notebookId', $notebookId)->get();
        return response()->json($pages);
    }

    // Get a single page
    public function show($id)
    {
        $page = Page::findOrFail($id);
        return response()->json($page);
    }

    // Update a page (new version)
    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $page->addVersion([
            'version'    => $page->version + 1,
            'title'      => $request->title ?? $page->title,
            'blocks'     => $request->blocks ?? $page->blocks,
            'notebookId' => new objectId($request->notebookId),
            'author'     => new objectId($request->user()->id),
            'parentPage' => new objectId($request->parentPage) ?? null,
            'updatedAt'  => now(),
            'updatedBy'  => new objectId($request->updatedBy) ?? $page->author,
        ]);

        $page->save();

        return response()->json($page);
    }

    // Delete a page
    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return response()->json(['message' => 'Page deleted successfully']);
    }
}
