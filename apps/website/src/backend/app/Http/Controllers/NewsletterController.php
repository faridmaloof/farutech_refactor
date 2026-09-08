<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\NewsletterSubscriber;
use App\Models\NewsletterCampaign;
use App\Jobs\SendNewsletterJob;

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

    /**
     * Listar campañas de newsletter (Admin)
     * GET /admin/newsletter/campaigns
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $perPage = $request->query('per_page', 15);

        $query = NewsletterCampaign::with('sender')->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        $campaigns = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $campaigns
        ]);
    }

    /**
     * Obtener detalle de una campaña (Admin)
     * GET /admin/newsletter/campaigns/{id}
     */
    public function show(int $id): JsonResponse
    {
        $campaign = NewsletterCampaign::with('sender')->find($id);

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Campaña no encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $campaign
        ]);
    }

    /**
     * Crear nueva campaña (Admin)
     * POST /admin/newsletter/campaigns
     */
    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'preview_text' => ['nullable', 'string', 'max:500'],
            'content_html' => ['required', 'string'],
            'content_text' => ['nullable', 'string'],
            'scheduled_for' => ['nullable', 'date'],
            'blog_posts_included' => ['nullable', 'array'],
        ]);

        try {
            $campaign = NewsletterCampaign::create([
                'title' => $validated['title'],
                'subject' => $validated['subject'],
                'preview_text' => $validated['preview_text'] ?? null,
                'content_html' => $validated['content_html'],
                'content_text' => $validated['content_text'] ?? null,
                'sender_id' => $request->user()->id,
                'status' => $validated['scheduled_for'] ? 'scheduled' : 'draft',
                'scheduled_for' => $validated['scheduled_for'] ?? null,
                'blog_posts_included' => $validated['blog_posts_included'] ?? null,
            ]);

            Log::info('Nueva campaña de newsletter creada', [
                'campaign_id' => $campaign->id,
                'title' => $campaign->title
            ]);

            return response()->json([
                'success' => true,
                'data' => $campaign,
                'message' => 'Campaña creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear campaña de newsletter', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la campaña'
            ], 500);
        }
    }

    /**
     * Actualizar campaña existente (Admin)
     * PUT /admin/newsletter/campaigns/{id}
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $campaign = NewsletterCampaign::find($id);

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Campaña no encontrada'
            ], 404);
        }

        // No permitir modificar campañas ya enviadas
        if ($campaign->status === 'sent') {
            return response()->json([
                'success' => false,
                'message' => 'No se puede modificar una campaña ya enviada'
            ], 403);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'subject' => ['sometimes', 'required', 'string', 'max:255'],
            'preview_text' => ['nullable', 'string', 'max:500'],
            'content_html' => ['sometimes', 'required', 'string'],
            'content_text' => ['nullable', 'string'],
            'scheduled_for' => ['nullable', 'date'],
            'blog_posts_included' => ['nullable', 'array'],
        ]);

        try {
            $campaign->update([
                'title' => $validated['title'] ?? $campaign->title,
                'subject' => $validated['subject'] ?? $campaign->subject,
                'preview_text' => $validated['preview_text'] ?? $campaign->preview_text,
                'content_html' => $validated['content_html'] ?? $campaign->content_html,
                'content_text' => $validated['content_text'] ?? $campaign->content_text,
                'scheduled_for' => $validated['scheduled_for'] ?? $campaign->scheduled_for,
                'blog_posts_included' => $validated['blog_posts_included'] ?? $campaign->blog_posts_included,
                'status' => isset($validated['scheduled_for']) ? 'scheduled' : $campaign->status,
            ]);

            Log::info('Campaña de newsletter actualizada', [
                'campaign_id' => $campaign->id
            ]);

            return response()->json([
                'success' => true,
                'data' => $campaign,
                'message' => 'Campaña actualizada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar campaña de newsletter', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la campaña'
            ], 500);
        }
    }

    /**
     * Eliminar campaña (Admin)
     * DELETE /admin/newsletter/campaigns/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        $campaign = NewsletterCampaign::find($id);

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Campaña no encontrada'
            ], 404);
        }

        // No permitir eliminar campañas enviadas o en envío
        if (in_array($campaign->status, ['sent', 'sending'])) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar una campaña en estado ' . $campaign->status
            ], 403);
        }

        try {
            $campaignId = $campaign->id;
            $campaign->delete();

            Log::info('Campaña de newsletter eliminada', [
                'campaign_id' => $campaignId
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Campaña eliminada exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar campaña de newsletter', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la campaña'
            ], 500);
        }
    }

    /**
     * Enviar campaña inmediatamente (Admin)
     * POST /admin/newsletter/campaigns/{id}/send
     */
    public function send(int $id): JsonResponse
    {
        $campaign = NewsletterCampaign::find($id);

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Campaña no encontrada'
            ], 404);
        }

        // Solo permitir enviar borradores o programadas
        if (!in_array($campaign->status, ['draft', 'scheduled'])) {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden enviar campañas en estado borrador o programadas'
            ], 400);
        }

        try {
            // Actualizar estado a "sending"
            $campaign->update([
                'status' => 'sending',
                'sent_at' => now(),
            ]);

            // Encolar job para envío asíncrono
            SendNewsletterJob::dispatch($campaign);

            Log::info('Envío de newsletter encolado', [
                'campaign_id' => $campaign->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'El envío de la campaña ha sido encolado y se procesará en breve'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al encolar envío de newsletter', [
                'error' => $e->getMessage()
            ]);

            // Revertir estado si falla
            $campaign->update(['status' => 'draft']);

            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar el envío de la campaña'
            ], 500);
        }
    }

    /**
     * Obtener lista de suscriptores (Admin)
     * GET /admin/newsletter/subscribers
     */
    public function subscribers(Request $request): JsonResponse
    {
        $isActive = $request->query('active');
        $perPage = $request->query('per_page', 15);

        $query = NewsletterSubscriber::orderBy('created_at', 'desc');

        if ($isActive !== null) {
            $query->where('is_active', $isActive === 'true');
        }

        $subscribers = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $subscribers
        ]);
    }

    /**
     * Dar de baja suscriptor manualmente (Admin)
     * POST /admin/newsletter/subscribers/{id}/unsubscribe
     */
    public function unsubscribeSubscriber(int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::find($id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Suscriptor no encontrado'
            ], 404);
        }

        try {
            $subscriber->update([
                'is_active' => false,
                'unsubscribed_at' => now(),
            ]);

            Log::info('Suscriptor dado de baja manualmente', [
                'subscriber_id' => $subscriber->id,
                'email' => $subscriber->email
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Suscriptor dado de baja exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al dar de baja suscriptor', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al dar de baja el suscriptor'
            ], 500);
        }
    }

    /**
     * Reactivar suscriptor (Admin)
     * POST /admin/newsletter/subscribers/{id}/reactivate
     */
    public function reactivateSubscriber(int $id): JsonResponse
    {
        $subscriber = NewsletterSubscriber::find($id);

        if (!$subscriber) {
            return response()->json([
                'success' => false,
                'message' => 'Suscriptor no encontrado'
            ], 404);
        }

        try {
            $subscriber->update([
                'is_active' => true,
                'unsubscribed_at' => null,
            ]);

            Log::info('Suscriptor reactivado', [
                'subscriber_id' => $subscriber->id,
                'email' => $subscriber->email
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Suscriptor reactivado exitosamente'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al reactivar suscriptor', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al reactivar el suscriptor'
            ], 500);
        }
    }
}
