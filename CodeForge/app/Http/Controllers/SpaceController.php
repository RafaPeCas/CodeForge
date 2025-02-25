<?php

namespace App\Http\Controllers;

use App\Models\Space;
use Illuminate\Http\Request;
use MongoDB\BSON\ObjectId;

class SpaceController extends Controller
{
    public function index()
    {
        return response()->json(Space::paginate(5)); // Devuelve 5 espacios por página
    }

    public function store(Request $request)
    {

        $name = $request->input("spaceName");
        $description = $request->input("spaceDescription");
        $userId = new  ObjectId($request->user()->id);
        $Space = Space::create([
            'name' => $name,
            'description' => $description,
            'author' => $userId,
            'members' => [],
            'notebooks' => [],
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
        $space = Space::find($id);
        error_log($space);
        $space->name = $request->spaceName;
        $space->description = $request->spaceDescription;
        error_log($space);
        $space->save();
        error_log($space);
 
        return response()->json(["result" => "ok"], 201);  
    }



    public function destroy($id)
    {
        error_log("Eliminando espacio con ID: " . $id);
        $space = Space::find($id);
        $space->delete();
        return response()->json(null, 204);
    }
}
