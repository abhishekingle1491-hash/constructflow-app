<?php

use Illuminate\Support\Facades\Route;

// This route catches all web requests and loads your main Blade file,
// allowing your React Router to handle the rest.
Route::get('/{any?}', function () {
    return view('app'); // Make sure 'index' matches your Blade file name
})->where('any', '.*');
