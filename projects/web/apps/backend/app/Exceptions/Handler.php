<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * La aplicación es una API stateless: TODAS las respuestas de error deben ser
     * JSON, incluso si el cliente no envió Accept: application/json. Esto evita
     * que una validación fallida termine en un redirect HTML hacia la SPA,
     * lo que confunde a fetch() y dificulta el diagnóstico.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (ValidationException $e, $request) {
            return response()->json([
                'message' => $e->getMessage(),
                'errors' => $e->errors(),
            ], 422);
        });

        $this->renderable(function (AuthenticationException $e, $request) {
            return response()->json(['message' => 'No autenticado.'], 401);
        });

        $this->renderable(function (ModelNotFoundException $e, $request) {
            return response()->json(['message' => 'Recurso no encontrado.'], 404);
        });

        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($e->getPrevious() instanceof ModelNotFoundException) {
                return response()->json(['message' => 'Recurso no encontrado.'], 404);
            }

            return response()->json(['message' => 'Ruta no encontrada.'], 404);
        });
    }
}
