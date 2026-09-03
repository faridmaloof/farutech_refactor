<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Métricas del dashboard admin.
     *
     * @OA\Get(
     *     path="/admin/dashboard/stats",
     *     summary="KPIs del dashboard",
     *     tags={"Dashboard"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="KPIs y últimos leads",
     *         @OA\JsonContent(
     *             @OA\Property(property="totalLeads", type="integer", example=0),
     *             @OA\Property(property="newLeads", type="integer", example=0),
     *             @OA\Property(property="activeProjects", type="integer", example=0),
     *             @OA\Property(property="conversionRate", type="number", example=0),
     *             @OA\Property(property="recentLeads", type="array", @OA\Items(type="object")),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function stats(Request $request)
    {
        $totalLeads = Lead::count();
        $wonLeads = Lead::where('status', 'closed_won')->count();

        return response()->json([
            'totalLeads' => $totalLeads,
            'newLeads' => Lead::where('status', 'new')->count(),
            'activeProjects' => 0,
            'conversionRate' => $totalLeads > 0 ? round(($wonLeads / $totalLeads) * 100, 1) : 0,
            'recentLeads' => Lead::query()
                ->latest('created_at')
                ->take(5)
                ->get(['id', 'name', 'email', 'status', 'created_at']),
        ]);
    }
}
