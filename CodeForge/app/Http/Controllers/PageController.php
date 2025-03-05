<?php
namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    // Create a new page
    public function store(Request $request)
    {
        $request->validate([
            'notebookId' => 'required|string',
            'title'      => 'required|string|max:255',
            'parentId'   => 'nullable|string',
        ]);
    
        // If validation fails, return error response
        if ($request->fails()) {
            return response()->json(['errors' => $request->errors()], 422);
        }
    
        // Initialize ancestors array
        $ancestors = [];
    
        // If parentId is provided, fetch the parent's ancestors and append the parentId
        if ($request->has('parentId') && $request->parentId) {
            $parent = Page::find($request->parentId);
            if ($parent) {
                $ancestors = $parent->ancestors ?? [];
                $ancestors[] = $parent->id;
            }
        }
    
        // Set default values for version and isCurrent if not provided
        $version = 1;
        $isCurrent = true;
    
        // Create the page
        $page = Page::create([
            'notebookId' => $request->notebookId,
            'title'      => $request->title,
            'parentId'   => $request->parentId,
            'ancestors'  => $ancestors,
            'version'    => $version,
            'isCurrent'  => $isCurrent,
            'blocks'     => [],
        ]);
    
        return response()->json($page, 201);
    
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
            'pageId'     => $pageId,
            'notebookId' => $currentVersion->notebookId,
            'title'      => $currentVersion->title,
            'parentId'   => $currentVersion->parentId,
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
        $pages = Page::where('notebookId', $notebookId)->where('isCurrent', true)->get(['title', 'parentId','notebookId', 'ancestors']);
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
    public function destroy($pageId)
    {
        // Delete all versions of the page
        $deleted = Page::where('pageId', $pageId)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Page and all its versions deleted successfully'], 200);
        }

        return response()->json(['error' => 'Page not found'], 404);
    }
}
