<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Puerta de acceso a la documentación OpenAPI/Swagger.
 *
 * Regla de negocio: la documentación interactivo SOLO existe en ambientes de
 * desarrollo (local/dev/qa). En producción responde 404 sin filtrar rutas.
 * Control por variable de entorno SWAGGER_UI_ENABLED (default: activo en local).
 */
class SwaggerGate
{
    public function handle(Request $request, Closure $next): Response
    {
        $enabled = filter_var(env('SWAGGER_UI_ENABLED', true), FILTER_VALIDATE_BOOL);

        if (! $enabled) {
            return response()->json(['message' => 'Not Found.'], 404);
        }

        return $next($request);
    }
}
