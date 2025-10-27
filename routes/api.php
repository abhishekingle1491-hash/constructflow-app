<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\EquipmentController;
use App\Http\Controllers\Api\V1\AuthController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ADD THIS TEST ROUTE
Route::get('/debug-session', function () {
    return response()->json([
        'message' => 'This is the LIVE session configuration.',
        'session_domain' => config('session.domain'),
        'sanctum_domains' => config('sanctum.stateful'),
        'cors_supports_credentials' => config('cors.supports_credentials'),
    ]);
});

// Group routes for API version 1
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('equipment', EquipmentController::class);
    // Add other resource routes here as they are built
});

// Public authentication routes with rate limiting to prevent brute-force attacks.
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

// Protected routes requiring authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});