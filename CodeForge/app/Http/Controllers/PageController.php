<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Page;
use App\Models\Notebook;

class PageController extends Controller
{
        // Create a new page
        public function create(Request $request)
        {
            $request->validate([
                'title' => 'required|string|max:255',
                'blocks' => 'required|array',
                'notebookId' => 'required|exists:notebooks,_id',
                'author' => 'required|exists:users,_id',
                'parentPage' => 'nullable|exists:pages,_id',
            ]);
    
            $page = Page::create([
                'title' => $request->title,
                'blocks' => $request->blocks,
                'notebookId' => $request->notebookId,
                'author' => $request->author,
                'parentPage' => $request->parentPage ?? null,
                'version' => 1,
                'createdAt' => now(),
                'updatedAt' => now(),
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
        public function listAll($notebookId)
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
                'updatedAt' => now(),
                'updatedBy' => $request->updatedBy ?? $page->author,
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
