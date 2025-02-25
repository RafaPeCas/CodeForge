<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Notebook;
use MongoDB\BSON\ObjectId;

class PageController extends Controller
{
        // Create a new page
        public function store(Request $request)
        {
            $request->validate([
                'title' => 'required|string|max:255',
                'blocks' => 'required|array',
                'notebookId' => 'required|exists:notebooks,_id',
                'parentPage' => 'nullable|exists:pages,_id',
            ]);
            // 'author' => 'required|exists:users,_id',
            
            $page = Page::create([
                'title' => $request->title,
                'blocks' => $request->blocks,
                'notebookId' =>new objectId($request->notebookId),
                'author' => new objectId($request->user()->id),
                'parentPage' => new objectId($request->parentPage) ?? null,
                'version' => 1,
            ]);
    
            // If it's a subpage, add to the parent
            if ($request->parentPage) {
                $parent = Page::find($request->parentPage);
                $parent->addSubpage($page);
                $parent->save();
            }
    
            // Add the page to the notebook
            $notebook = Notebook::find($request->notebookId);
            $notebook->addPage($page);
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
                'version' => $page->version + 1,
                'title' => $request->title ?? $page->title,
                'blocks' => $request->blocks ?? $page->blocks,
                'notebookId' =>new objectId($request->notebookId),
                'author' => new objectId($request->user()->id),
                'parentPage' => new objectId($request->parentPage) ?? null,
                'updatedAt' => now(),
                'updatedBy' => new objectId($request->updatedBy) ?? $page->author,
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
