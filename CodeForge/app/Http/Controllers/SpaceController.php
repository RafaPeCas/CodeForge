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

    public function show()
    {;

        $userId = auth()->id();

        if ($userId) {
            $spaces = Space::where('author', new ObjectId($userId))->get();
        } else {
            $spaces = collect(); // Colección vacía si el usuario no está autenticado
        }
        $filteredSpaces = $spaces->map(function ($space) {
            return [
                'name' => $space->name,
                'logo' => "This is the logo", // Transformar el logo a una URL
                'plan' => "This is the plan",
            ];
        });
        return response()->json($filteredSpaces);
    }

    public function update(Request $request, $id)
    {
        $space = Space::find($id);
        $space->name = $request->spaceName;
        $space->description = $request->spaceDescription;
        $space->save();

        return response()->json(["result" => "ok"], 201);
    }



    public function destroy($id)
    {
        $space = Space::find($id);
        $space->delete();
        return response()->json(null, 204);
    }
}
