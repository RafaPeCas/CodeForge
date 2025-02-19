<?php
namespace App\Http\Controllers;
use App\Models\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index()
    {
        $Spaces = Space::all();
        return response()->json($Spaces);
    }

    public function store(Request $request)
    {
         $name = $request->input("name");
         $description = $request->input("description");
         $userId = $request->user()->id;
         $Space = Space::create([
             'name' => $name,
             'description' => $description,
             'author' => $userId,
         ]);
        return response()->json($Space, 201);
    }

    public function show($id)
    {
        $Space = Space::findOrFail($id);
        return response()->json($Space);
    }

    public function update(Request $request, $id)
    {
        $Space = Space::findOrFail($id);
        $Space->update($request->all());
        return response()->json($Space);
    }

    public function destroy($id)
    {
        $Space = Space::findOrFail($id);
        $Space->delete();
        return response()->json(null, 204);
    }
}