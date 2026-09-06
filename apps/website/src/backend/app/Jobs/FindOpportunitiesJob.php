<?php

namespace App\Jobs;

use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Job para encontrar oportunidades de leads desde fuentes externas.
 * 
 * Este job realiza scraping/búsquedas en fuentes configuradas
 * y convierte oportunidades válidas en leads.
 */
class FindOpportunitiesJob extends Job
{
    /**
     * Execute the job.
     */
    public function handle(): int
    {
        $opportunitiesFound = 0;
        $leadsCreated = 0;
        
        // Obtener fuentes activas desde configuración
        $sources = config('services.opportunity_sources', [
            'linkedin',
            'google_maps',
            'industry_directories'
        ]);
        
        foreach ($sources as $source) {
            try {
                $opportunities = $this->fetchOpportunitiesFromSource($source);
                $opportunitiesFound += count($opportunities);
                
                foreach ($opportunities as $opportunity) {
                    if ($this->isValidOpportunity($opportunity)) {
                        $lead = $this->convertOpportunityToLead($opportunity, $source);
                        if ($lead) {
                            $leadsCreated++;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error processing opportunity source {$source}: " . $e->getMessage());
            }
        }
        
        Log::info("FindOpportunitiesJob completed", [
            'opportunities_found' => $opportunitiesFound,
            'leads_created' => $leadsCreated
        ]);
        
        return $leadsCreated;
    }
    
    /**
     * Fetch opportunities from a specific source.
     */
    protected function fetchOpportunitiesFromSource(string $source): array
    {
        switch ($source) {
            case 'linkedin':
                return $this->fetchFromLinkedIn();
            case 'google_maps':
                return $this->fetchFromGoogleMaps();
            case 'industry_directories':
                return $this->fetchFromIndustryDirectories();
            default:
                return [];
        }
    }
    
    /**
     * Fetch opportunities from LinkedIn.
     */
    protected function fetchFromLinkedIn(): array
    {
        // Implementación específica de scraping/API de LinkedIn
        // Por ahora retorna array vacío - debe implementarse con credentials
        return [];
    }
    
    /**
     * Fetch opportunities from Google Maps.
     */
    protected function fetchFromGoogleMaps(): array
    {
        // Implementación específica de Google Places API
        // Requiere GOOGLE_MAPS_API_KEY en .env
        $apiKey = env('GOOGLE_MAPS_API_KEY');
        if (!$apiKey) {
            return [];
        }
        
        // Ejemplo: buscar negocios por categoría y ubicación
        $locations = \App\Models\Location::where('active', true)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->limit(10)
            ->get();
        
        $opportunities = [];
        foreach ($locations as $location) {
            try {
                $response = Http::get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', [
                    'location' => "{$location->latitude},{$location->longitude}",
                    'radius' => 5000,
                    'type' => 'establishment',
                    'key' => $apiKey
                ]);
                
                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['results'] ?? [] as $result) {
                        $opportunities[] = [
                            'name' => $result['name'],
                            'address' => $result['vicinity'],
                            'latitude' => $result['geometry']['location']['lat'],
                            'longitude' => $result['geometry']['location']['lng'],
                            'place_id' => $result['place_id'],
                            'types' => $result['types'] ?? [],
                            'rating' => $result['rating'] ?? null,
                            'source' => 'google_maps'
                        ];
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error fetching from Google Maps: " . $e->getMessage());
            }
        }
        
        return $opportunities;
    }
    
    /**
     * Fetch opportunities from industry directories.
     */
    protected function fetchFromIndustryDirectories(): array
    {
        // Implementación para directorios de industria específicos
        return [];
    }
    
    /**
     * Validate if an opportunity meets quality criteria.
     */
    protected function isValidOpportunity(array $opportunity): bool
    {
        // Validaciones básicas
        if (empty($opportunity['name'])) {
            return false;
        }
        
        // Verificar duplicados existentes
        $exists = Lead::where('company_name', $opportunity['name'])
            ->orWhere('email', $opportunity['email'] ?? '')
            ->exists();
        
        if ($exists) {
            return false;
        }
        
        // Quality scoring mínimo
        $score = $this->calculateOpportunityScore($opportunity);
        return $score >= 50; // Threshold configurable
    }
    
    /**
     * Calculate quality score for an opportunity.
     */
    protected function calculateOpportunityScore(array $opportunity): int
    {
        $score = 0;
        
        // Score por tener información completa
        $score += !empty($opportunity['name']) ? 20 : 0;
        $score += !empty($opportunity['email']) ? 20 : 0;
        $score += !empty($opportunity['phone']) ? 15 : 0;
        $score += !empty($opportunity['address']) ? 10 : 0;
        $score += ($opportunity['rating'] ?? 0) >= 4.0 ? 15 : 0;
        $score += !empty($opportunity['website']) ? 20 : 0;
        
        return min($score, 100);
    }
    
    /**
     * Convert opportunity to Lead model.
     */
    protected function convertOpportunityToLead(array $opportunity, string $source): ?Lead
    {
        return DB::transaction(function () use ($opportunity, $source) {
            $lead = Lead::create([
                'company_name' => $opportunity['name'],
                'contact_name' => $opportunity['contact_name'] ?? null,
                'email' => $opportunity['email'] ?? null,
                'phone' => $opportunity['phone'] ?? null,
                'address' => $opportunity['address'] ?? null,
                'city' => $opportunity['city'] ?? null,
                'country' => $opportunity['country'] ?? null,
                'latitude' => $opportunity['latitude'] ?? null,
                'longitude' => $opportunity['longitude'] ?? null,
                'source' => $source,
                'status' => 'new',
                'quality_score' => $this->calculateOpportunityScore($opportunity),
                'metadata' => [
                    'original_data' => $opportunity,
                    'imported_at' => now()->toIso8601String()
                ]
            ]);
            
            // Crear nota inicial
            $lead->notes()->create([
                'note' => "Oportunidad importada automáticamente desde {$source}",
                'created_by' => null // System generated
            ]);
            
            return $lead;
        });
    }
}
