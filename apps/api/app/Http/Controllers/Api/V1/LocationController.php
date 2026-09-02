<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Services\LeadSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct(
        protected LeadSearchService $searchService
    ) {}

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:3|max:100',
            'type' => 'nullable|string|in:country,state,city,municipality',
            'limit' => 'nullable|integer|min:1|max:50',
            'parent_id' => 'nullable|integer|exists:locations,id',
        ]);

        $query = $request->input('q');
        $type = $request->input('type');
        $limit = (int) $request->input('limit', 10);
        $parentId = $request->input('parent_id');

        $locationsQuery = Location::active()
            ->search($query)
            ->limit($limit);

        if ($type) {
            $locationsQuery->byType($type);
        }

        if ($parentId) {
            $locationsQuery->where('parent_id', $parentId);
        }

        $locations = $locationsQuery->get(['id', 'name', 'type', 'parent_id'])
            ->map(fn($location) => [
                'id' => $location->id,
                'name' => $location->name,
                'type' => $location->type,
                'full_name' => $location->full_name,
                'parent_id' => $location->parent_id,
            ]);

        if ($locations->isEmpty()) {
            $externalLocations = $this->searchService->searchByLocation($query, $limit);
            
            return response()->json([
                'success' => true,
                'data' => $externalLocations,
                'source' => 'external',
                'message' => count($externalLocations) . ' ubicaciones encontradas externamente',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $locations,
            'source' => 'local',
            'message' => count($locations) . ' ubicaciones encontradas',
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $location = Location::with(['parent', 'children'])->find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Ubicación no encontrada',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $location->id,
                'name' => $location->name,
                'type' => $location->type,
                'full_name' => $location->full_name,
                'parent' => $location->parent ? [
                    'id' => $location->parent->id,
                    'name' => $location->parent->name,
                    'type' => $location->parent->type,
                ] : null,
                'children' => $location->children->map(fn($child) => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'type' => $child->type,
                ]),
                'coordinates' => [
                    'latitude' => $location->latitude,
                    'longitude' => $location->longitude,
                ],
            ],
        ]);
    }

    public function hierarchy(int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Ubicación no encontrada',
            ], 404);
        }

        $hierarchy = [];
        $current = $location;

        while ($current) {
            $hierarchy[] = [
                'id' => $current->id,
                'name' => $current->name,
                'type' => $current->type,
            ];
            $current = $current->parent;
        }

        return response()->json([
            'success' => true,
            'data' => array_reverse($hierarchy),
        ]);
    }
}
