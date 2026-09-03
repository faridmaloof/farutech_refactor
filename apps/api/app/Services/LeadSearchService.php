<?php

namespace App\Services;

use App\Models\Location;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LeadSearchService
{
    public function __construct()
    {
    }

    public function searchByLocation(string $search, int $limit = 10): array
    {
        if (strlen($search) < 3) {
            return [];
        }

        $locations = Location::active()
            ->search($search)
            ->limit($limit)
            ->get(['id', 'name', 'type', 'parent_id'])
            ->map(function ($location) {
                return [
                    'id' => $location->id,
                    'name' => $location->name,
                    'type' => $location->type,
                    'full_name' => $location->full_name,
                ];
            })
            ->toArray();

        if (empty($locations)) {
            $locations = $this->fetchExternalLocations($search, $limit);
        }

        return $locations;
    }

    protected function fetchExternalLocations(string $search, int $limit): array
    {
        // Fallback a API externa de geolocalización (Nominatim - OpenStreetMap)
        try {
            $response = Http::get('https://nominatim.openstreetmap.org/search', [
                'q' => $search,
                'format' => 'json',
                'limit' => $limit,
                'addressdetails' => 1,
            ]);

            return collect($response->json())->map(function ($item) {
                return [
                    'id' => null,
                    'name' => $item['display_name'] ?? $item['name'],
                    'type' => $item['type'] ?? 'city',
                    'full_name' => $item['display_name'],
                    'latitude' => $item['lat'] ?? null,
                    'longitude' => $item['lon'] ?? null,
                ];
            })->toArray();
        } catch (\Exception $e) {
            Log::error("Error fetching external locations: " . $e->getMessage());
            return [];
        }
    }
}
