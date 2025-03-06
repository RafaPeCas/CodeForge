<?php
namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class PageController extends Controller
{
    // Create a new page
    public function store(Request $request, $notebookId)
    {
    // Validate the request
    $request->validate([
        'title'    => 'required|string|max:255',
        'parentId' => 'nullable|string',
    ]);

    // Initialize ancestors array
    $ancestors = [];

    // Handle parentId existence check
    if (!is_null($request->parentId) && $request->parentId !== '') {
        $parent = Page::find($request->parentId);
        if ($parent) {
            $ancestors   = $parent->ancestors ?? [];
            $ancestors[] = new ObjectId($parent->id);
        }
    }

    // Convert notebookId to ObjectId
    $notebookId = new ObjectId($notebookId);

    // Handle parentId conversion safely
    $parentId = (!is_null($request->parentId) && $request->parentId !== '') ? new ObjectId($request->parentId) : null;

    // Create the page
    try {
        $page = Page::create([
            'notebookId' => $notebookId,
            'title'      => $request->title,
            'parentId'   => $parentId,
            'ancestors'  => $ancestors,
            'version'    => 1,
            'isCurrent'  => true,
            'blocks'     => [],
        ]);

        return response()->json($page, 201);
    } catch (\Exception $e) {
        // Log the error for debugging
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
    }

    public function rename(Request $request, $notebookId, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $page = Page::find($id);
        if (! $page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $page->update(['title' => $request->title]);

        return response()->json($page, 200);
    }

    public function update(Request $request, $pageId)
    {
        $request->validate([
            'block' => 'required|array',
        ]);

        // If validation fails, return error response
        if ($request->fails()) {
            return response()->json(['errors' => $request->errors()], 422);
        }

        // Find the current version of the page
        $currentVersion = Page::where('pageId', $pageId)->where('isCurrent', true)->first();

        if (! $currentVersion) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $newVersion = Page::create([
            'pageId'     => new ObjectId($pageId),
            'notebookId' => new ObjectId($currentVersion->notebookId),
            'title'      => $currentVersion->title,
            'parentId'   => new ObjectId($currentVersion->parentId),
            'ancestors'  => $currentVersion->ancestors,
            'version'    => $currentVersion->version + 1,
            'isCurrent'  => true,
            'block'      => $request->block,
        ]);

        // Mark the previous version as not current
        $currentVersion->update(['isCurrent' => false]);

        // Delete the oldest version if there are more than 3 versions
        $versions = Page::where('pageId', $pageId)->orderBy('version', 'asc')->get();
        if ($versions->count() > 3) {
            $versions->first()->delete();
        }

        return response()->json($newVersion, 200);
    }

    // Retrieve all pages in a notebook
    public function index($notebookId)
    {
        $pages = Page::where('notebookId', $notebookId)->where('isCurrent', true)->get(['title', 'parentId', 'notebookId', 'ancestors']);
        return response()->json($pages, 200);
    }

    // Retrieve a single page by ID
    public function show($id)
    {
        $page = Page::find($id);

        if (! $page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        return response()->json($page, 200);
    }

    // Delete a page (all versions)
    public function destroy($notebookId, $id)
    {
        // Delete all versions of the page
        $deleted = Page::where('_id', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Page and all its versions deleted successfully'], 200);
        }

        return response()->json(['error' => 'Page not found'], 404);
    }
}
