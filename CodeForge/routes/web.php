<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpaceController;
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

Route::post("/space", [SpaceController::class, "store"])->name("Space.create");

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::prefix('notebooks')->group(function () {
        Route::post('/', [NotebookController::class, 'create'])->name('notebooks.create'); //create a nootebook
        Route::get('/{spaceId}', [NotebookController::class, 'listAll'])->name('notebooks.listAll'); // all the notebooks in a space
        Route::get('/show/{id}', [NotebookController::class, 'show'])->name('notebooks.show'); // get a single notebook
        Route::delete('/{id}', [NotebookController::class, 'destroy'])->name('notebooks.destroy'); // destroy a notebook
    });

    // Rutas para Páginas
    Route::prefix('pages')->group(function () {
        Route::post('/', [PageController::class, 'create'])->name('pages.create'); // create a page
        Route::get('/{notebookId}', [PageController::class, 'listAll'])->name('pages.listAll'); // all the pages in a notebook
        Route::get('/show/{id}', [PageController::class, 'show'])->name('pages.show'); // get a single page
        Route::put('/{id}', [PageController::class, 'update'])->name('pages.update'); // update a page (add a new version)
        Route::delete('/{id}', [PageController::class, 'destroy'])->name('pages.destroy'); // destroy a page
    });
});

require __DIR__.'/auth.php';
