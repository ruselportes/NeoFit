<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard stats
    Route::get('/dashboard', [MemberController::class, 'dashboard']);

    // Members CRUD
    Route::apiResource('members', MemberController::class);

    // Check-ins
    Route::get('/checkins', [CheckInController::class, 'index']);
    Route::post('/checkins', [CheckInController::class, 'store']);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
