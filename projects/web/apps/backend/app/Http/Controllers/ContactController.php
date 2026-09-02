<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\ContactMessage;
use App\Models\Lead;
use App\Models\Service;

class ContactController extends Controller
{
    /**
     * @OA\Post(
     *   path="/contact",
     *   summary="Enviar mensaje de contacto",
     *   description="Endpoint para enviar mensajes de contacto desde el formulario público y registrar el lead correspondiente.",
     *   tags={"Contact"},
     *   @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *       required={"name","email","service_interest","message","privacy_accepted"},
     *       @OA\Property(property="name", type="string", example="Juan Pérez"),
     *       @OA\Property(property="email", type="string", format="email", example="juan@empresa.com"),
     *       @OA\Property(property="phone", type="string", example="+573001234567"),
     *       @OA\Property(property="company", type="string", example="TechCorp"),
     *       @OA\Property(property="position", type="string", example="CTO"),
     *       @OA\Property(property="service_interest", type="string", example="software-development"),
     *       @OA\Property(property="budget_range", type="string", example="5000-10000"),
     *       @OA\Property(property="project_timeline", type="string", example="1-3_months"),
     *       @OA\Property(property="message", type="string", example="Requerimos desarrollo de plataforma a medida."),
     *       @OA\Property(property="privacy_accepted", type="boolean", example=true)
     *     )
     *   ),
     *   @OA\Response(
     *     response=201,
     *     description="Mensaje enviado y lead registrado correctamente",
     *     @OA\JsonContent(
     *       @OA\Property(property="success", type="boolean", example=true),
     *       @OA\Property(property="lead_id", type="integer", example=1),
     *       @OA\Property(property="message", type="string", example="Gracias por contactarnos. Nos pondremos en contacto pronto.")
     *     )
     *   ),
     *   @OA\Response(response=422, description="Datos de formulario inválidos"),
     *   @OA\Response(response=500, description="Error interno del servidor")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // Honeypot anti-spam verification: website_url should be empty for human users
        if ($request->filled('website_url')) {
            Log::info('Honeypot triggered in contact submission', ['ip' => $request->ip()]);
            return response()->json([
                'success' => true,
                'message' => 'Gracias por contactarnos. Nos pondremos en contacto pronto.'
            ], 201);
        }

        $validated = $request->validate([
            'name'             => ['required', 'string', 'min:2', 'max:255'],
            'email'            => ['required', 'email:rfc', 'max:255'],
            'phone'            => ['nullable', 'string', 'max:32'],
            'company'          => ['nullable', 'string', 'max:255'],
            'position'         => ['nullable', 'string', 'max:255'],
            'service_interest' => ['required', 'string', 'max:255'],
            'budget_range'     => ['nullable', 'string', 'max:255'],
            'project_timeline' => ['nullable', 'string', 'max:255'],
            'message'          => ['required', 'string', 'min:10', 'max:10000'],
            'privacy_accepted' => ['required', 'boolean'],
            'utm_source'       => ['nullable', 'string', 'max:255'],
            'utm_medium'       => ['nullable', 'string', 'max:255'],
            'utm_campaign'     => ['nullable', 'string', 'max:255'],
            'utm_term'         => ['nullable', 'string', 'max:255'],
            'utm_content'      => ['nullable', 'string', 'max:255'],
        ]);

        if (!$validated['privacy_accepted']) {
            return response()->json([
                'success' => false,
                'errors'  => ['privacy_accepted' => 'Debe aceptar la política de tratamiento de datos personales para continuar.']
            ], 422);
        }

        try {
            return DB::transaction(function () use ($validated, $request) {
                // Find service matching the provided slug, if any
                $service = Service::where('slug', $validated['service_interest'])->first();

                // Create ContactMessage entry
                $contactMessage = ContactMessage::create([
                    'name'             => $validated['name'],
                    'email'            => $validated['email'],
                    'phone'            => $validated['phone'] ?? null,
                    'subject'          => 'Contacto desde formulario web: ' . ($service ? $service->name : $validated['service_interest']),
                    'type'             => 'sales',
                    'message'          => $validated['message'],
                    'service_id'       => $service ? $service->id : null,
                    'privacy_accepted' => $validated['privacy_accepted'],
                    'status'           => 'new',
                    'metadata'         => [
                        'company'          => $validated['company'] ?? null,
                        'position'         => $validated['position'] ?? null,
                        'service_slug'     => $validated['service_interest'],
                        'budget_range'     => $validated['budget_range'] ?? null,
                        'project_timeline' => $validated['project_timeline'] ?? null,
                        'utm_source'       => $validated['utm_source'] ?? null,
                        'utm_medium'       => $validated['utm_medium'] ?? null,
                        'utm_campaign'     => $validated['utm_campaign'] ?? null,
                        'utm_term'         => $validated['utm_term'] ?? null,
                        'utm_content'      => $validated['utm_content'] ?? null,
                        'ip_address'       => $request->ip(),
                        'user_agent'       => $request->header('User-Agent'),
                    ],
                ]);

                // Create Lead entry (CRM integration)
                $lead = Lead::create([
                    'name'             => $validated['name'],
                    'email'            => $validated['email'],
                    'phone'            => $validated['phone'] ?? null,
                    'company'          => $validated['company'] ?? null,
                    'position'         => $validated['position'] ?? null,
                    'service_id'       => $service ? $service->id : null,
                    'message'          => $validated['message'],
                    'status'           => 'new',
                    'priority'         => 'medium',
                    'source'           => 'web_form',
                    'privacy_accepted' => $validated['privacy_accepted'],
                    'metadata'         => [
                        'contact_message_id' => $contactMessage->id,
                        'service_slug'       => $validated['service_interest'],
                        'budget_range'       => $validated['budget_range'] ?? null,
                        'project_timeline'   => $validated['project_timeline'] ?? null,
                        'utm_source'         => $validated['utm_source'] ?? null,
                        'utm_medium'         => $validated['utm_medium'] ?? null,
                        'utm_campaign'       => $validated['utm_campaign'] ?? null,
                        'utm_term'           => $validated['utm_term'] ?? null,
                        'utm_content'        => $validated['utm_content'] ?? null,
                        'ip_address'         => $request->ip(),
                    ],
                ]);

                Log::info('Contacto y Lead registrados exitosamente', [
                    'contact_message_id' => $contactMessage->id,
                    'lead_id'            => $lead->id,
                    'email'              => $lead->email,
                ]);

                return response()->json([
                    'success' => true,
                    'lead_id' => $lead->id,
                    'message' => 'Gracias por contactarnos. Nos pondremos en contacto pronto.'
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Error al guardar mensaje de contacto o lead', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al procesar la solicitud. Por favor, intente nuevamente.'
            ], 500);
        }
    }
}