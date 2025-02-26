<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\NotebookController;
use App\Http\Controllers\PageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/createSpace', function () {
    return Inertia::render('Form');
})->middleware(['auth', 'verified'])->name('Form');

Route::get('/sidebarPage', function () {
    return Inertia::render('SidebarPage');
})->middleware(['auth', 'verified'])->name('sidebarPage');

Route::middleware('auth')->group(function () {
    Route::post("/space", [SpaceController::class, "store"])->name("Space.create");
    Route::put("/space/{id}", [SpaceController::class, "update"])->name("Space.update");
    Route::get("/space", [SpaceController::class, "index"])->name("Space.index");
    Route::get("/sidebar", [SpaceController::class, "show"])->name("Space.show");

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('notebooks')->group(function () {
        Route::post('/', [NotebookController::class, 'store'])->name('notebooks.create'); //create a nootebook
        Route::get('/{spaceId}', [NotebookController::class, 'index'])->name('notebooks.index'); // all the notebooks in a space
        Route::put('/{id}', [NotebookController::class, 'update'])->name('notebooks.update'); // update a notebook
        Route::get('/show/{id}', [NotebookController::class, 'show'])->name('notebooks.show'); // get a single notebook
        Route::delete('/{id}', [NotebookController::class, 'destroy'])->name('notebooks.destroy'); // destroy a notebook
    });
    
    // Rutas para Páginas
    Route::prefix('pages')->group(function () {
        Route::post('/', [PageController::class, 'store'])->name('pages.create'); // create a page
        Route::get('/{notebookId}', [PageController::class, 'index'])->name('pages.index'); // all the pages in a notebook
        Route::get('/show/{id}', [PageController::class, 'show'])->name('pages.show'); // get a single page
        Route::put('/{id}', [PageController::class, 'update'])->name('pages.update'); // update a page (add a new version)
        Route::delete('/{id}', [PageController::class, 'destroy'])->name('pages.destroy'); // destroy a page
    });
    
});


require __DIR__.'/auth.php';
