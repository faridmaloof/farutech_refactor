<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (api.farutech.local, sin prefijo /api redundante)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return 'FaruTech API - Laravel '.app()->version();
});

// ============================================================
// API Pública — Blog
// ============================================================
Route::prefix('blog')->group(function () {
    Route::get('posts', 'App\Http\Controllers\BlogController@index');
    Route::get('posts/{slug}', 'App\Http\Controllers\BlogController@show');
    Route::get('categories', 'App\Http\Controllers\BlogCategoryController@index');
    Route::get('categories/{slug}', 'App\Http\Controllers\BlogCategoryController@show');
});

// ============================================================
// API ADMIN — CRUD de blog (autenticado)
// ============================================================
Route::prefix('admin/blog')->middleware('auth')->group(function () {
    Route::get('/', 'App\Http\Controllers\BlogController@adminIndex');
    Route::post('/', 'App\Http\Controllers\BlogController@store');
    Route::get('{id}', 'App\Http\Controllers\BlogController@showAdmin');
    Route::put('{id}', 'App\Http\Controllers\BlogController@update');
    Route::delete('{id}', 'App\Http\Controllers\BlogController@destroy');
});

// ============================================================
// API ADMIN — Autenticación + panel (dashboard y leads CRM)
// ============================================================
Route::post('admin/login', 'App\Http\Controllers\AuthController@login');

// Registro público + confirmación (controlados por admin_settings)
Route::get('settings/public', 'App\Http\Controllers\SettingsController@publicPolicy');
Route::post('register', 'App\Http\Controllers\RegisterController@register');
Route::get('register/confirm', 'App\Http\Controllers\RegisterController@confirm');

// Endpoints de contacto y newsletter públicos (soportan tanto /contact como /api/contact)
Route::post('contact', 'App\Http\Controllers\ContactController@store');
Route::post('api/contact', 'App\Http\Controllers\ContactController@store');

Route::post('newsletter', 'App\Http\Controllers\NewsletterController@store');
Route::post('api/newsletter', 'App\Http\Controllers\NewsletterController@store');

Route::prefix('admin')->middleware('auth')->group(function () {
    Route::get('dashboard/stats', 'App\Http\Controllers\DashboardController@stats');

    Route::prefix('leads')->group(function () {
        // Debe registrarse ANTES de {lead} para no ser capturado por el wildcard.
        Route::get('stats', 'App\Http\Controllers\LeadController@stats');
        Route::get('/', 'App\Http\Controllers\LeadController@index');
        Route::get('{lead}', 'App\Http\Controllers\LeadController@show');
    });

    // Configuración global del panel
    Route::get('settings', 'App\Http\Controllers\SettingsController@show');
    Route::put('settings', 'App\Http\Controllers\SettingsController@update');

    // Gestión de usuarios (creación condicionada por registration_enabled)
    Route::get('users', 'App\Http\Controllers\UserController@index');
    Route::post('users', 'App\Http\Controllers\UserController@store');
    Route::patch('users/{user}/status', 'App\Http\Controllers\UserController@toggleStatus');
});