<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\Location;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\DomCrawler\Crawler;

class LeadSearchService
{
    protected Client $httpClient;
    protected int $minQualityScore = 50;
    protected array $serviceKeywords = [
        'desarrollo web' => ['web', 'website', 'landing page', 'ecommerce'],
        'marketing digital' => ['seo', 'sem', 'social media', 'email marketing'],
        'consultoria ti' => ['transformacion digital', 'cloud', 'devops'],
        'diseno grafico' => ['branding', 'identidad corporativa', 'logo'],
        'app movil' => ['ios', 'android', 'react native', 'flutter'],
    ];

    public function __construct()
    {
        $this->httpClient = new Client([
            'timeout' => 30,
            'headers' => [
                'User-Agent' => 'Farutech Lead Finder/1.0',
                'Accept' => 'text/html,application/xhtml+xml',
            ],
        ]);
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

    public function findOpportunities(
        string $city,
        ?string $service = null,
        int $limit = 20
    ): array {
        $opportunities = [];

        $keywords = $service 
            ? ($this->serviceKeywords[$service] ?? [$service])
            : collect($this->serviceKeywords)->flatten()->toArray();

        $searchQueries = [
            "empresas en {$city}",
            "negocios {$city}",
            "tiendas {$city}",
            "servicios {$city}",
        ];

        foreach ($searchQueries as $query) {
            try {
                $results = $this->searchGoogleMaps($query, $limit / count($searchQueries));
                
                foreach ($results as $result) {
                    $opportunity = $this->processBusinessResult($result, $city, $service);
                    
                    if ($opportunity && $opportunity['quality_score'] >= $this->minQualityScore) {
                        $opportunities[] = $opportunity;
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Error searching opportunities: " . $e->getMessage());
            }
        }

        usort($opportunities, fn($a, $b) => $b['quality_score'] <=> $a['quality_score']);
        
        return array_slice(array_values($opportunities), 0, $limit);
    }

    public function calculateQualityScore(array $data): int
    {
        $score = 0;

        if (!empty($data['email'])) $score += 20;
        if (!empty($data['phone'])) $score += 15;
        if (!empty($data['website'])) $score += 15;
        if (!empty($data['social_profiles'])) $score += 10;
        if (!empty($data['address'])) $score += 10;
        if (!empty($data['description'])) $score += 10;
        if (!empty($data['reviews_count']) && $data['reviews_count'] > 10) $score += 10;
        if (!empty($data['rating']) && $data['rating'] > 4) $score += 10;

        return min($score, 100);
    }

    public function saveAsLead(array $opportunityData, bool $isInternalSearch = true): Lead
    {
        return Lead::create([
            'name' => $opportunityData['company'] ?? $opportunityData['name'],
            'email' => $opportunityData['email'] ?? null,
            'phone' => $opportunityData['phone'] ?? null,
            'company' => $opportunityData['company'] ?? $opportunityData['name'],
            'city' => $opportunityData['city'],
            'state' => $opportunityData['state'] ?? null,
            'country' => $opportunityData['country'] ?? 'Colombia',
            'service_interest' => $opportunityData['service_interest'] ?? null,
            'source' => 'internal_search',
            'status' => Lead::STATUS_NEW,
            'quality_score' => $opportunityData['quality_score'] ?? 50,
            'notes' => $opportunityData['notes'] ?? null,
            'is_internal_search' => $isInternalSearch,
            'search_params' => $opportunityData['search_params'] ?? [],
            'external_url' => $opportunityData['url'] ?? null,
            'social_profiles' => $opportunityData['social_profiles'] ?? [],
        ]);
    }

    protected function searchGoogleMaps(string $query, int $limit): array
    {
        // Implementación simplificada - en producción usar Google Places API
        $url = "https://www.google.com/search?q=" . urlencode($query);
        
        $response = $this->httpClient->get($url);
        $html = (string) $response->getBody();
        
        $crawler = new Crawler($html);
        $results = [];

        $crawler->filter('div[role="article"]')->each(function (Crawler $node) use (&$results, $limit) {
            if (count($results) >= $limit) return;

            try {
                $name = $node->filter('h3')->first()->text(null);
                if (!$name) return;

                $results[] = [
                    'name' => $name,
                    'url' => $node->filter('a')->first()->attr('href', ''),
                    'description' => $node->filter('.sXzcyd')->first()->text(null),
                ];
            } catch (\Exception $e) {
                // Skip invalid results
            }
        });

        return $results;
    }

    protected function processBusinessResult(array $result, string $city, ?string $service): ?array
    {
        $companyName = $result['name'] ?? null;
        if (!$companyName) return null;

        $website = $this->extractWebsite($result['url'] ?? '');
        $businessInfo = $this->scrapeBusinessInfo($website);

        $qualityScore = $this->calculateQualityScore(array_merge($result, $businessInfo));

        return [
            'name' => $companyName,
            'company' => $companyName,
            'city' => $city,
            'email' => $businessInfo['email'] ?? null,
            'phone' => $businessInfo['phone'] ?? null,
            'website' => $website,
            'description' => $result['description'] ?? null,
            'service_interest' => $this->detectServiceInterest($businessInfo['description'] ?? '', $service),
            'quality_score' => $qualityScore,
            'notes' => "Encontrado mediante búsqueda automática en {$city}",
            'search_params' => ['city' => $city, 'service' => $service],
            'url' => $result['url'] ?? null,
            'social_profiles' => $businessInfo['social_profiles'] ?? [],
        ];
    }

    protected function extractWebsite(string $url): ?string
    {
        if (empty($url)) return null;
        
        preg_match('/https?:\/\/([^\/]+)/', $url, $matches);
        return $matches[1] ?? null;
    }

    protected function scrapeBusinessInfo(?string $website): array
    {
        if (!$website) return [];

        try {
            $url = str_starts_with($website, 'http') ? $website : "https://{$website}";
            $response = $this->httpClient->get($url, ['timeout' => 10]);
            $html = (string) $response->getBody();
            
            $crawler = new Crawler($html);
            
            $email = null;
            $phone = null;
            $description = null;
            $socialProfiles = [];

            $emailPattern = '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/';
            preg_match($emailPattern, $html, $emailMatches);
            $email = $emailMatches[0] ?? null;

            $phonePattern = '/[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}/';
            preg_match($phonePattern, $html, $phoneMatches);
            $phone = $phoneMatches[0] ?? null;

            $description = $crawler->filter('meta[name="description"]')->first()->attr('content', null);

            $socialLinks = [
                'facebook' => $crawler->filter('a[href*="facebook.com"]')->first()->attr('href', null),
                'instagram' => $crawler->filter('a[href*="instagram.com"]')->first()->attr('href', null),
                'twitter' => $crawler->filter('a[href*="twitter.com"]')->first()->attr('href', null),
                'linkedin' => $crawler->filter('a[href*="linkedin.com"]')->first()->attr('href', null),
            ];

            $socialProfiles = array_filter($socialLinks);

            return compact('email', 'phone', 'description', 'socialProfiles');
        } catch (\Exception $e) {
            Log::warning("Error scraping business info: " . $e->getMessage());
            return [];
        }
    }

    protected function detectServiceInterest(string $description, ?string $preferredService): ?string
    {
        $description = strtolower($description);
        
        foreach ($this->serviceKeywords as $service => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($description, strtolower($keyword))) {
                    return $service;
                }
            }
        }

        return $preferredService;
    }

    protected function fetchExternalLocations(string $search, int $limit): array
    {
        // Fallback a API externa de geolocalización
        try {
            $response = Http::get('https://nominatim.openstreetmap.org/search', [
                'q' => $search,
                'format' => 'json',
                'limit' => $limit,
                'addressdetails' => 1,
            ]);

            return $response->json()->map(function ($item) {
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
