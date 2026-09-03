<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\NewsletterSubscriber;

class NewsletterController extends Controller
{
    /**
     * @OA\Post(
     *   path="/newsletter",
     *   summary="Suscribirse al boletín informativo",
     *   description="Endpoint público para suscribirse al newsletter de FaruTech.",
     *   tags={"Newsletter"},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"email"},
     *       @OA\Property(property="email", type="string", format="email", example="usuario@empresa.com"),
     *       @OA\Property(property="name", type="string", example="Juan Pérez")
     *     )
     *   ),
     *   @OA\Response(response=201, description="Suscripción realizada con éxito"),
     *   @OA\Response(response=422, description="Email inválido"),
     *   @OA\Response(response=500, description="Error interno del servidor")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // Honeypot check for bots
        if ($request->filled('website_url')) {
            return response()->json([
                'success' => true,
                'message' => 'Te has suscrito exitosamente al newsletter.'
            ], 201);
        }

        $validated = $request->validate([
            'email' => ['required', 'email:rfc', 'max:255'],
            'name'  => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $subscriber = NewsletterSubscriber::firstOrNew(['email' => strtolower(trim($validated['email']))]);

            if (!$subscriber->exists) {
                $subscriber->name = $validated['name'] ?? null;
                $subscriber->unsubscribe_token = Str::random(64);
                $subscriber->is_active = true;
                $subscriber->save();

                Log::info('Nuevo suscriptor registrado al newsletter', ['email' => $subscriber->email]);
            } elseif (!$subscriber->is_active) {
                $subscriber->is_active = true;
                $subscriber->unsubscribed_at = null;
                if (!empty($validated['name'])) {
                    $subscriber->name = $validated['name'];
                }
                $subscriber->save();

                Log::info('Suscriptor reactivado en newsletter', ['email' => $subscriber->email]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Te has suscrito exitosamente al newsletter de FaruTech.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error al procesar suscripción a newsletter', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al procesar tu suscripción. Por favor intente más tarde.'
            ], 500);
        }
    }
}
