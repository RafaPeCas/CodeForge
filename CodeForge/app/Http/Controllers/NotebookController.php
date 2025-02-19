<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notebook;
use App\Models\Space;

class NotebookController extends Controller
{
        // Create a new notebook
        public function create(Request $request)
        {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'spaceId' => 'required|exists:spaces,_id',
            ]);
    
            $notebook = Notebook::create([
                'name' => $request->name,
                'description' => $request->description,
                'spaceId' => $request->spaceId,
            ]);
    
            // Add the notebook to the space
            $space = Space::find($request->spaceId);
            $space->addNotebook($notebook);
            $space->save();
    
            return response()->json($notebook, 201);
        }
    
        // Get all notebooks in a space
        public function listAll($spaceId)
        {
            $notebooks = Notebook::where('spaceId', $spaceId)->get();
            return response()->json($notebooks);
        }
    
        // Get a single notebook
        public function show($id)
        {
            $notebook = Notebook::findOrFail($id);
            return response()->json($notebook);
        }
    
        // Delete a notebook
        public function destroy($id)
        {
            $notebook = Notebook::findOrFail($id);
            $notebook->delete();
    
            return response()->json(['message' => 'Notebook deleted successfully']);
        }
    
}
