<?php
namespace App\Http\Controllers;

use App\Models\Notebook;
use App\Models\Space;
use App\Models\Page;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class NotebookController extends Controller
{
    // Create a new notebook
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'spaceId'     => 'required|exists:spaces,_id',
        ]);

        $spaceId = new ObjectId($request->spaceId);

        $notebook = Notebook::create([
            'name'        => $request->name,
            'description' => $request->description,
            'spaceId'     => $spaceId,
        ]);

        // Add the notebook to the space
        $space = Space::find($spaceId);
        $space->addNotebook($notebook);
        $space->save();

        return response()->json($notebook, 201);
    }

    // Get all notebooks in a space
    public function index($spaceId)
    {
        $spaceId = new ObjectId($spaceId);
        $notebooks = Notebook::where('spaceId', $spaceId)->get();
        $notebooksWithPages = $notebooks->map(function ($notebook) {
            $notebookId = new ObjectId($notebook->_id);
            // Fetch pages for the current notebook (only current versions)
            $pages = Page::where('notebookId', $notebookId)
                ->where('isCurrent', true)
                ->get(['_id', 'title', 'parentId', 'ancestors']);
            // Add pages to the notebook object
            $notebook->pages = $pages;
    
            return $notebook;
        });
        return response()->json($notebooks);
    }

    // Get a single notebook
    public function show($id)
    {
        $notebook = Notebook::findOrFail($id);
        return response()->json($notebook);
    }

    // Update a notebook
    public function update(Request $request, $id)
    {
        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'spaceId'     => 'sometimes|exists:spaces,_id',
        ]);

        $notebook = Notebook::findOrFail($id);

        if ($request->has('name')) {
            $notebook->name = $request->name;
        }

        if ($request->has('description')) {
            $notebook->description = $request->description;
        }

        if ($request->has('spaceId')) {
            $notebook->spaceId = new ObjectId($request->spaceId);
        }

        $notebook->save();

        return response()->json($notebook);
    }

    // Delete a notebook
    public function destroy($id)
    {
        $notebook = Notebook::findOrFail($id);

        // Find the space that has the notebook
        $space = Space::find($notebook->spaceId);
        // pass the notebook id as an ObjectId
        $notebookObject = $notebook->_id = new ObjectId($notebook->_id);

        if ($space) {
            $space->pull('notebooks', ['_id' => $notebookObject]);
            $space->save();
        }

        // Delete the notebook
        $notebook->delete();

        return response()->json(['message' => 'Notebook deleted successfully']);
    }

}
