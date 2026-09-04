<?php

namespace App\Jobs;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Job para limpiar datos antiguos y mantener la base de datos optimizada.
 * 
 * Este job elimina o archiva registros obsoletos según políticas
 * de retención configuradas.
 */
class CleanOldDataJob extends Job
{
    protected string $target;
    protected array $options;
    
    /**
     * Create a new job instance.
     */
    public function __construct(string $target = 'all', array $options = [])
    {
        $this->target = $target;
        $this->options = $options;
    }
    
    /**
     * Execute the job.
     */
    public function handle(): array
    {
        $results = [
            'processed' => 0,
            'archived' => 0,
            'deleted' => 0,
            'errors' => 0,
        ];
        
        Log::info("CleanOldDataJob started", [
            'target' => $this->target,
            'options' => $this->options
        ]);
        
        try {
            switch ($this->target) {
                case 'all':
                    $results['leads'] = $this->cleanLeads();
                    $results['interactions'] = $this->cleanInteractions();
                    $results['audit_logs'] = $this->cleanAuditLogs();
                    $results['contact_messages'] = $this->cleanContactMessages();
                    $results['campaigns'] = $this->cleanCampaigns();
                    break;
                    
                case 'leads':
                    $results['leads'] = $this->cleanLeads();
                    break;
                    
                case 'interactions':
                    $results['interactions'] = $this->cleanInteractions();
                    break;
                    
                case 'audit_logs':
                    $results['audit_logs'] = $this->cleanAuditLogs();
                    break;
                    
                case 'contact_messages':
                    $results['contact_messages'] = $this->cleanContactMessages();
                    break;
                    
                case 'campaigns':
                    $results['campaigns'] = $this->cleanCampaigns();
                    break;
                    
                default:
                    throw new \InvalidArgumentException("Unknown clean target: {$this->target}");
            }
            
            // Consolidar resultados
            $results['total_archived'] = ($results['archived'] ?? 0) + 
                                         ($results['leads']['archived'] ?? 0) +
                                         ($results['interactions']['archived'] ?? 0) +
                                         ($results['audit_logs']['archived'] ?? 0);
            
            $results['total_deleted'] = ($results['deleted'] ?? 0) +
                                        ($results['leads']['deleted'] ?? 0) +
                                        ($results['interactions']['deleted'] ?? 0) +
                                        ($results['audit_logs']['deleted'] ?? 0) +
                                        ($results['contact_messages']['deleted'] ?? 0);
            
            Log::info("CleanOldDataJob completed", $results);
            
            return $results;
        } catch (\Exception $e) {
            Log::error("CleanOldDataJob failed", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Clean old leads based on status and age.
     */
    protected function cleanLeads(): array
    {
        $results = ['archived' => 0, 'deleted' => 0];
        
        $retentionDays = $this->options['leads_retention_days'] ?? 730; // 2 años por defecto
        $archiveDays = $this->options['leads_archive_days'] ?? 365; // 1 año
        
        $cutoffArchive = now()->subDays($archiveDays);
        $cutoffDelete = now()->subDays($retentionDays);
        
        // Archivar leads antiguos (status lost/invalid sin actividad)
        if ($this->options['archive_leads'] ?? true) {
            $toArchive = \App\Models\Lead::whereIn('status', ['lost', 'invalid', 'duplicate'])
                ->where('updated_at', '<', $cutoffArchive)
                ->where('is_archived', false)
                ->limit(1000)
                ->get();
            
            foreach ($toArchive as $lead) {
                $lead->update(['is_archived' => true]);
                $results['archived']++;
            }
        }
        
        // Eliminar leads muy antiguos (solo si está habilitado explícitamente)
        if ($this->options['delete_leads'] ?? false) {
            $toDelete = \App\Models\Lead::whereIn('status', ['lost', 'invalid', 'duplicate'])
                ->where('is_archived', true)
                ->where('updated_at', '<', $cutoffDelete)
                ->limit(500)
                ->get();
            
            foreach ($toDelete as $lead) {
                // Eliminar notas e interacciones relacionadas primero
                $lead->notes()->delete();
                $lead->interactions()->delete();
                $lead->delete();
                $results['deleted']++;
            }
        }
        
        return $results;
    }
    
    /**
     * Clean old lead interactions.
     */
    protected function cleanInteractions(): array
    {
        $results = ['archived' => 0, 'deleted' => 0];
        
        $retentionDays = $this->options['interactions_retention_days'] ?? 365; // 1 año
        $cutoff = now()->subDays($retentionDays);
        
        // Eliminar interacciones antiguas de leads eliminados/archivados
        $orphanCount = \App\Models\LeadInteraction::whereHas('lead', function ($query) use ($cutoff) {
            $query->where('is_archived', true)
                  ->orWhereIn('status', ['lost', 'invalid', 'duplicate']);
        })
        ->where('created_at', '<', $cutoff)
        ->limit(1000)
        ->delete();
        
        $results['deleted'] += $orphanCount;
        
        return $results;
    }
    
    /**
     * Clean old audit logs.
     */
    protected function cleanAuditLogs(): array
    {
        $results = ['archived' => 0, 'deleted' => 0];
        
        $retentionDays = $this->options['audit_logs_retention_days'] ?? 90; // 3 meses
        $cutoff = now()->subDays($retentionDays);
        
        // Exportar a archivo antes de eliminar (si está habilitado)
        if ($this->options['export_before_delete'] ?? true) {
            $this->exportAuditLogs($cutoff);
        }
        
        // Eliminar logs antiguos
        $deletedCount = \App\Models\AuditLog::where('created_at', '<', $cutoff)
            ->limit(5000)
            ->delete();
        
        $results['deleted'] += $deletedCount;
        
        return $results;
    }
    
    /**
     * Clean old contact messages.
     */
    protected function cleanContactMessages(): array
    {
        $results = ['deleted' => 0];
        
        $retentionDays = $this->options['contact_messages_retention_days'] ?? 180; // 6 meses
        $cutoff = now()->subDays($retentionDays);
        
        // Eliminar mensajes antiguos ya procesados
        $deletedCount = \App\Models\ContactMessage::where('created_at', '<', $cutoff)
            ->whereNotNull('processed_at')
            ->limit(1000)
            ->delete();
        
        $results['deleted'] += $deletedCount;
        
        return $results;
    }
    
    /**
     * Clean old newsletter campaigns.
     */
    protected function cleanCampaigns(): array
    {
        $results = ['archived' => 0, 'deleted' => 0];
        
        $retentionDays = $this->options['campaigns_retention_days'] ?? 365; // 1 año
        $cutoff = now()->subDays($retentionDays);
        
        // Archivar campañas antiguas
        if ($this->options['archive_campaigns'] ?? true) {
            $toArchive = \App\Models\NewsletterCampaign::where('status', 'sent')
                ->where('sent_at', '<', $cutoff)
                ->where('is_archived', false)
                ->limit(100)
                ->get();
            
            foreach ($toArchive as $campaign) {
                $campaign->update(['is_archived' => true]);
                $results['archived']++;
            }
        }
        
        return $results;
    }
    
    /**
     * Export audit logs to file before deletion.
     */
    protected function exportAuditLogs(\DateTime $cutoff): string
    {
        $filename = sprintf(
            'exports/audit_logs_export_%s.json',
            now()->format('Y-m-d_His')
        );
        
        $logs = \App\Models\AuditLog::where('created_at', '<', $cutoff)
            ->limit(10000)
            ->get()
            ->toArray();
        
        \Illuminate\Support\Facades\Storage::disk('local')->put(
            $filename,
            json_encode($logs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
        
        Log::info("Audit logs exported", [
            'filename' => $filename,
            'count' => count($logs)
        ]);
        
        return $filename;
    }
    
    /**
     * Schedule regular cleanup jobs.
     * 
     * Registrar en Kernel.php:
     * $schedule->job(new CleanOldDataJob('all', ['delete_leads' => false]))->weekly();
     */
    public static function getScheduleConfig(): array
    {
        return [
            'frequency' => 'weekly', // weekly, monthly, daily
            'day' => 0, // Sunday (0-6)
            'time' => '02:00', // 2 AM
            'options' => [
                'archive_leads' => true,
                'delete_leads' => false, // Requiere aprobación explícita
                'leads_retention_days' => 730,
                'leads_archive_days' => 365,
                'interactions_retention_days' => 365,
                'audit_logs_retention_days' => 90,
                'contact_messages_retention_days' => 180,
                'campaigns_retention_days' => 365,
                'export_before_delete' => true,
            ]
        ];
    }
}
