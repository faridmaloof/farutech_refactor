<?php

namespace App\Jobs;

use App\Models\Lead;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Job para sincronizar leads entre diferentes fuentes y sistemas.
 * 
 * Este job detecta duplicados, actualiza información desactualizada
 * y mantiene consistencia en los datos de leads.
 */
class SyncLeadsJob extends Job
{
    protected string $source;
    protected array $options;
    
    /**
     * Create a new job instance.
     */
    public function __construct(string $source = 'all', array $options = [])
    {
        $this->source = $source;
        $this->options = $options;
    }
    
    /**
     * Execute the job.
     */
    public function handle(): array
    {
        $results = [
            'processed' => 0,
            'updated' => 0,
            'duplicates_merged' => 0,
            'errors' => 0,
        ];
        
        Log::info("SyncLeadsJob started", [
            'source' => $this->source,
            'options' => $this->options
        ]);
        
        try {
            // Sincronizar desde fuentes externas si está configurado
            if ($this->options['fetch_from_external'] ?? false) {
                $externalLeads = $this->fetchFromExternalSources();
                $results['processed'] += count($externalLeads);
                
                foreach ($externalLeads as $externalLead) {
                    try {
                        $this->syncExternalLead($externalLead);
                        $results['updated']++;
                    } catch (\Exception $e) {
                        Log::error("SyncLeadsJob: Failed to sync external lead", [
                            'data' => $externalLead,
                            'error' => $e->getMessage()
                        ]);
                        $results['errors']++;
                    }
                }
            }
            
            // Detectar y mergear duplicados
            if ($this->options['detect_duplicates'] ?? true) {
                $duplicatesMerged = $this->detectAndMergeDuplicates();
                $results['duplicates_merged'] = $duplicatesMerged;
            }
            
            // Actualizar información desactualizada
            if ($this->options['refresh_stale'] ?? true) {
                $staleUpdated = $this->refreshStaleLeads();
                $results['updated'] += $staleUpdated;
            }
            
            // Validar integridad de datos
            if ($this->options['validate_integrity'] ?? true) {
                $validationResult = $this->validateDataIntegrity();
                $results['validation'] = $validationResult;
            }
            
            Log::info("SyncLeadsJob completed", $results);
            
            return $results;
        } catch (\Exception $e) {
            Log::error("SyncLeadsJob failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Fetch leads from external sources.
     */
    protected function fetchFromExternalSources(): array
    {
        $leads = [];
        
        // Ejemplo: sincronizar con CRM externo vía API
        if ($this->source === 'all' || $this->source === 'crm') {
            $crmLeads = $this->fetchFromCRM();
            $leads = array_merge($leads, $crmLeads);
        }
        
        // Ejemplo: sincronizar con plataformas de marketing
        if ($this->source === 'all' || $this->source === 'marketing') {
            $marketingLeads = $this->fetchFromMarketingPlatforms();
            $leads = array_merge($leads, $marketingLeads);
        }
        
        return $leads;
    }
    
    /**
     * Fetch leads from external CRM.
     */
    protected function fetchFromCRM(): array
    {
        $apiKey = config('services.external_crm.api_key');
        if (!$apiKey) {
            return [];
        }
        
        // Implementación específica según CRM (Salesforce, HubSpot, etc.)
        // Por ahora retorna array vacío - debe implementarse con credentials reales
        return [];
    }
    
    /**
     * Fetch leads from marketing platforms.
     */
    protected function fetchFromMarketingPlatforms(): array
    {
        // Implementación para plataformas como Google Ads, Facebook Leads, etc.
        return [];
    }
    
    /**
     * Sync a single external lead with local database.
     */
    protected function syncExternalLead(array $externalLead): void
    {
        DB::transaction(function () use ($externalLead) {
            // Buscar lead existente por email o identificador único
            $existingLead = Lead::where('email', $externalLead['email'] ?? '')
                ->orWhere('external_id', $externalLead['external_id'] ?? null)
                ->first();
            
            if ($existingLead) {
                // Actualizar lead existente con información más reciente
                $this->updateLeadWithExternalData($existingLead, $externalLead);
            } else {
                // Crear nuevo lead
                $this->createLeadFromExternalData($externalLead);
            }
        });
    }
    
    /**
     * Update existing lead with external data.
     */
    protected function updateLeadWithExternalData(Lead $lead, array $externalData): void
    {
        $updateFields = [
            'company_name',
            'contact_name',
            'email',
            'phone',
            'address',
            'city',
            'country',
            'latitude',
            'longitude',
            'website',
            'industry',
            'employee_count',
            'annual_revenue',
        ];
        
        $changes = [];
        foreach ($updateFields as $field) {
            if (isset($externalData[$field]) && $externalData[$field] !== $lead->$field) {
                $changes[$field] = $externalData[$field];
            }
        }
        
        if (!empty($changes)) {
            $lead->update($changes);
            
            // Registrar en historial
            $lead->interactions()->create([
                'type' => 'data_sync',
                'note' => 'Información actualizada desde fuente externa',
                'metadata' => ['changes' => $changes],
                'created_by' => null // System
            ]);
        }
    }
    
    /**
     * Create new lead from external data.
     */
    protected function createLeadFromExternalData(array $externalData): Lead
    {
        return Lead::create([
            'external_id' => $externalData['external_id'] ?? null,
            'company_name' => $externalData['company_name'] ?? null,
            'contact_name' => $externalData['contact_name'] ?? null,
            'email' => $externalData['email'] ?? null,
            'phone' => $externalData['phone'] ?? null,
            'address' => $externalData['address'] ?? null,
            'city' => $externalData['city'] ?? null,
            'country' => $externalData['country'] ?? null,
            'latitude' => $externalData['latitude'] ?? null,
            'longitude' => $externalData['longitude'] ?? null,
            'website' => $externalData['website'] ?? null,
            'industry' => $externalData['industry'] ?? null,
            'employee_count' => $externalData['employee_count'] ?? null,
            'annual_revenue' => $externalData['annual_revenue'] ?? null,
            'source' => $externalData['source'] ?? 'external_sync',
            'status' => 'new',
            'quality_score' => $this->calculateQualityScore($externalData),
            'metadata' => [
                'imported_from' => 'external_sync',
                'imported_at' => now()->toIso8601String(),
                'original_data' => $externalData
            ]
        ]);
    }
    
    /**
     * Detect and merge duplicate leads.
     */
    protected function detectAndMergeDuplicates(): int
    {
        $mergedCount = 0;
        
        // Estrategia 1: Duplicados por email exacto
        $duplicateEmails = Lead::select('email')
            ->whereNotNull('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('email');
        
        foreach ($duplicateEmails as $email) {
            $duplicates = Lead::where('email', $email)
                ->orderBy('created_at', 'asc')
                ->get();
            
            if ($duplicates->count() > 1) {
                $this->mergeDuplicateLeads($duplicates);
                $mergedCount++;
            }
        }
        
        // Estrategia 2: Duplicados por nombre de empresa + teléfono
        // Implementación adicional si es necesaria
        
        return $mergedCount;
    }
    
    /**
     * Merge duplicate leads keeping the most complete information.
     */
    protected function mergeDuplicateLeads(array $duplicates): void
    {
        // El primer lead (más antiguo) será el maestro
        $master = $duplicates[0];
        
        for ($i = 1; $i < count($duplicates); $i++) {
            $duplicate = $duplicates[$i];
            
            // Fusionar campos vacíos del maestro con datos del duplicado
            foreach (['company_name', 'contact_name', 'phone', 'address', 'website', 'industry'] as $field) {
                if (empty($master->$field) && !empty($duplicate->$field)) {
                    $master->$field = $duplicate->$field;
                }
            }
            
            // Fusionar notas
            $duplicate->notes->each(function ($note) use ($master) {
                $master->notes()->create([
                    'note' => $note->note,
                    'created_by' => $note->created_by,
                    'created_at' => $note->created_at
                ]);
            });
            
            // Fusionar interacciones
            $duplicate->interactions->each(function ($interaction) use ($master) {
                $master->interactions()->create([
                    'type' => $interaction->type,
                    'note' => $interaction->note,
                    'metadata' => $interaction->metadata,
                    'created_by' => $interaction->created_by,
                    'created_at' => $interaction->created_at
                ]);
            });
            
            // Guardar cambios en el maestro
            $master->save();
            
            // Marcar duplicado como eliminado/mergeado
            $duplicate->update([
                'status' => 'duplicate',
                'merged_into_id' => $master->id,
                'metadata' => array_merge(
                    $duplicate->metadata ?? [],
                    ['merged_at' => now()->toIso8601String(), 'merged_into' => $master->id]
                )
            ]);
        }
    }
    
    /**
     * Refresh stale leads (sin actualización en mucho tiempo).
     */
    protected function refreshStaleLeads(): int
    {
        $daysThreshold = $this->options['stale_days'] ?? 90;
        $staleDate = now()->subDays($daysThreshold);
        
        $staleLeads = Lead::where('updated_at', '<', $staleDate)
            ->whereIn('status', ['new', 'contacted', 'qualified'])
            ->limit(100)
            ->get();
        
        foreach ($staleLeads as $lead) {
            // Intentar enriquecer datos desde fuentes externas
            if (!empty($lead->email)) {
                $enrichedData = $this->enrichLeadData($lead->email);
                if (!empty($enrichedData)) {
                    $this->updateLeadWithExternalData($lead, $enrichedData);
                }
            }
            
            // Marcar para seguimiento
            $lead->interactions()->create([
                'type' => 'stale_review',
                'note' => "Lead sin actualización por {$daysThreshold} días - revisado automáticamente",
                'created_by' => null
            ]);
        }
        
        return $staleLeads->count();
    }
    
    /**
     * Enrich lead data from external sources.
     */
    protected function enrichLeadData(string $email): array
    {
        // Integración con servicios de enriquecimiento como Clearbit, Hunter, etc.
        // Por ahora retorna array vacío - debe implementarse con API keys reales
        return [];
    }
    
    /**
     * Validate data integrity across leads.
     */
    protected function validateDataIntegrity(): array
    {
        $issues = [
            'missing_email' => Lead::whereNull('email')
                ->whereNull('phone')
                ->count(),
            'invalid_email_format' => Lead::whereNotNull('email')
                ->whereNotLike('email', '%@%.%')
                ->count(),
            'missing_company' => Lead::whereNull('company_name')
                ->whereIn('status', ['qualified', 'proposal'])
                ->count(),
            'orphan_interactions' => \App\Models\LeadInteraction::whereNotNull('lead_id')
                ->whereDoesntHave('lead')
                ->count(),
        ];
        
        // Auto-corregir issues críticos si está habilitado
        if ($this->options['auto_fix'] ?? false) {
            $this->fixDataIntegrityIssues($issues);
        }
        
        return $issues;
    }
    
    /**
     * Fix data integrity issues automatically.
     */
    protected function fixDataIntegrityIssues(array $issues): void
    {
        // Implementación de auto-corrección según tipos de issues
        // Ejemplo: marcar leads sin contacto como inválidos
        if ($issues['missing_email'] > 0) {
            Lead::whereNull('email')
                ->whereNull('phone')
                ->whereNotIn('status', ['converted', 'lost'])
                ->update(['status' => 'invalid']);
        }
    }
    
    /**
     * Calculate quality score for lead data.
     */
    protected function calculateQualityScore(array $data): int
    {
        $score = 0;
        
        $score += !empty($data['email']) ? 20 : 0;
        $score += !empty($data['phone']) ? 15 : 0;
        $score += !empty($data['company_name']) ? 20 : 0;
        $score += !empty($data['contact_name']) ? 15 : 0;
        $score += !empty($data['website']) ? 10 : 0;
        $score += !empty($data['industry']) ? 10 : 0;
        $score += !empty($data['employee_count']) ? 5 : 0;
        $score += !empty($data['annual_revenue']) ? 5 : 0;
        
        return min($score, 100);
    }
}
