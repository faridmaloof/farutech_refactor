<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\LeadController;

/*
|--------------------------------------------------------------------------
| API Routes - Farutech API v1
|--------------------------------------------------------------------------
|
| Documentación completa disponible en: /docs (Scalar)
| Prefijo: /api/v1
|
*/

Route::prefix('v1')->group(function () {
    
    // Rutas públicas
    Route::get('/locations/search', [LocationController::class, 'search'])
        ->name('api.v1.locations.search');
    
    Route::get('/locations/{id}', [LocationController::class, 'show'])
        ->name('api.v1.locations.show');
    
    Route::get('/locations/{id}/hierarchy', [LocationController::class, 'hierarchy'])
        ->name('api.v1.locations.hierarchy');

    // Rutas protegidas (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Leads CRUD
        Route::apiResource('leads', LeadController::class);
        
        // Búsqueda de oportunidades
        Route::post('/leads/opportunities/search', [LeadController::class, 'searchOpportunities'])
            ->name('api.v1.leads.opportunities.search');
        
        // Guardar oportunidad encontrada
        Route::post('/leads/opportunities/save', [LeadController::class, 'saveOpportunity'])
            ->name('api.v1.leads.opportunities.save');
        
        // Estadísticas de leads
        Route::get('/leads/stats', [LeadController::class, 'stats'])
            ->name('api.v1.leads.stats');
        
        // Exportar leads
        Route::get('/leads/export', [LeadController::class, 'export'])
            ->name('api.v1.leads.export');
        
        // Interacciones con leads
        Route::apiResource('leads.interactions', \App\Http\Controllers\Api\V1\LeadInteractionController::class)
            ->shallow();
        
        // Tareas de leads
        Route::apiResource('leads.tasks', \App\Http\Controllers\Api\V1\LeadTaskController::class)
            ->shallow();
    });
});
