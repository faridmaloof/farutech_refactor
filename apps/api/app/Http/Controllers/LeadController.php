<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Http\Requests\StoreLeadRequest;
use App\Http\Requests\UpdateLeadRequest;
use Illuminate\Support\Facades\Cache;

class LeadController extends Controller
{
    /**
     * Listar leads del CRM con filtros.
     *
     * @OA\Get(
     *     path="/admin/leads",
     *     summary="Listar leads (paginado)",
     *     tags={"Leads"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="status", in="query", required=false,
     *         @OA\Schema(type="string", enum={"new","contacted","qualified","proposal","negotiation","closed_won","closed_lost","unreachable"})),
     *     @OA\Parameter(name="priority", in="query", required=false,
     *         @OA\Schema(type="string", enum={"low","medium","high","urgent"})),
     *     @OA\Parameter(name="service_id", in="query", required=false, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Leads paginados",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Lead")),
     *             @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function index()
    {
        $leads = Lead::with(['service', 'location', 'user'])
            ->when(request('status'), fn ($q) => $q->where('status', request('status')))
            ->when(request('priority'), fn ($q) => $q->where('priority', request('priority')))
            ->when(request('service_id'), fn ($q) => $q->where('service_id', request('service_id')))
            ->latest('created_at')
            ->paginate(20);

        return response()->json([
            'data' => $leads->items(),
            'meta' => [
                'total' => $leads->total(),
                'per_page' => $leads->perPage(),
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
            ],
        ]);
    }

    public function store(StoreLeadRequest $request)
    {
        $lead = Lead::create($request->validated());

        Cache::forget('crm_dashboard_stats');

        if ($lead->assigned_to) {
            \App\Jobs\SendLeadNotification::dispatch($lead->assigned_to, $lead->id);
        }

        return response()->json([
            'message' => 'Lead creado exitosamente',
            'data' => $lead->load(['service', 'location']),
        ], 201);
    }

    public function show(Lead $lead)
    {
        return response()->json($lead->load(['service', 'location', 'notes', 'user']));
    }

    public function update(UpdateLeadRequest $request, Lead $lead)
    {
        $lead->update($request->validated());

        if ($lead->assigned_to) {
            \App\Jobs\SendLeadUpdateNotification::dispatch($lead->assigned_to, $lead->id);
        }

        Cache::forget('crm_dashboard_stats');

        return response()->json([
            'message' => 'Lead actualizado exitosamente',
            'data' => $lead->fresh(),
        ]);
    }

    public function destroy(Lead $lead)
    {
        $lead->notes()->delete();
        $lead->delete();

        Cache::forget('crm_dashboard_stats');

        return response()->json(['message' => 'Lead eliminado exitosamente'], 204);
    }

    /**
     * Resumen de leads por estado y prioridad.
     *
     * @OA\Get(
     *     path="/admin/leads/stats",
     *     summary="Agregación status/prioridad de leads",
     *     tags={"Leads"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Filas de agregación",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/LeadStatRow"))),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function stats()
    {
        $stats = Lead::query()
            ->selectRaw("status, priority, COUNT(*) as total,
                COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as recent")
            ->groupBy('status', 'priority')
            ->get();

        return response()->json($stats);
    }
}
