<?php

namespace App\Jobs;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Job para generar reportes complejos.
 * 
 * Este job procesa grandes volúmenes de datos para generar
 * reportes analíticos sin bloquear la aplicación principal.
 */
class GenerateReportJob extends Job
{
    protected string $reportType;
    protected array $filters;
    protected ?int $userId;
    
    /**
     * Create a new job instance.
     */
    public function __construct(string $reportType, array $filters = [], ?int $userId = null)
    {
        $this->reportType = $reportType;
        $this->filters = $filters;
        $this->userId = $userId;
    }
    
    /**
     * Execute the job.
     */
    public function handle(): array
    {
        $startTime = now();
        
        Log::info("GenerateReportJob started", [
            'type' => $this->reportType,
            'filters' => $this->filters,
            'user_id' => $this->userId
        ]);
        
        try {
            $data = $this->generateData();
            
            $report = [
                'type' => $this->reportType,
                'generated_at' => now()->toIso8601String(),
                'filters' => $this->filters,
                'data' => $data,
                'execution_time_ms' => now()->diffInMilliseconds($startTime),
            ];
            
            // Guardar reporte en storage o DB según configuración
            $reportPath = $this->saveReport($report);
            
            Log::info("GenerateReportJob completed", [
                'type' => $this->reportType,
                'path' => $reportPath,
                'execution_time_ms' => $report['execution_time_ms']
            ]);
            
            return $report;
        } catch (\Exception $e) {
            Log::error("GenerateReportJob failed", [
                'type' => $this->reportType,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Generate report data based on type.
     */
    protected function generateData(): array
    {
        switch ($this->reportType) {
            case 'leads_summary':
                return $this->generateLeadsSummary();
            case 'blog_performance':
                return $this->generateBlogPerformance();
            case 'newsletter_metrics':
                return $this->generateNewsletterMetrics();
            case 'user_activity':
                return $this->generateUserActivity();
            case 'conversion_funnel':
                return $this->generateConversionFunnel();
            default:
                throw new \InvalidArgumentException("Unknown report type: {$this->reportType}");
        }
    }
    
    /**
     * Generate leads summary report.
     */
    protected function generateLeadsSummary(): array
    {
        $dateFrom = $this->filters['date_from'] ?? now()->subMonth();
        $dateTo = $this->filters['date_to'] ?? now();
        
        $query = \App\Models\Lead::query()
            ->whereBetween('created_at', [$dateFrom, $dateTo]);
        
        // Aplicar filtros adicionales
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }
        
        if (!empty($this->filters['source'])) {
            $query->where('source', $this->filters['source']);
        }
        
        if (!empty($this->filters['quality_min'])) {
            $query->where('quality_score', '>=', $this->filters['quality_min']);
        }
        
        $leads = $query->get();
        
        return [
            'total_leads' => $leads->count(),
            'by_status' => $leads->groupBy('status')->map->count(),
            'by_source' => $leads->groupBy('source')->map->count(),
            'average_quality' => $leads->avg('quality_score') ?? 0,
            'conversion_rate' => $this->calculateConversionRate($leads),
            'new_this_period' => $leads->where('status', 'new')->count(),
            'contacted' => $leads->where('status', 'contacted')->count(),
            'qualified' => $leads->whereIn('status', ['qualified', 'proposal'])->count(),
            'converted' => $leads->where('status', 'converted')->count(),
            'lost' => $leads->where('status', 'lost')->count(),
        ];
    }
    
    /**
     * Generate blog performance report.
     */
    protected function generateBlogPerformance(): array
    {
        $posts = \App\Models\BlogPost::with(['author', 'category'])
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->limit(50)
            ->get();
        
        return [
            'total_posts' => \App\Models\BlogPost::where('status', 'published')->count(),
            'total_views' => $posts->sum('views_count'),
            'average_views' => $posts->avg('views_count') ?? 0,
            'top_posts' => $posts->take(10)->map(function ($post) {
                return [
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'views' => $post->views_count,
                    'published_at' => $post->published_at?->toDateString(),
                    'author' => $post->author?->name,
                    'category' => $post->category?->name,
                ];
            }),
            'views_by_category' => $posts->groupBy('category.name')->map->sum('views_count'),
            'recent_trend' => $this->getRecentViewsTrend(),
        ];
    }
    
    /**
     * Generate newsletter metrics report.
     */
    protected function generateNewsletterMetrics(): array
    {
        $campaigns = \App\Models\NewsletterCampaign::query()
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();
        
        $totalSubscribers = \App\Models\NewsletterSubscriber::where('is_active', true)
            ->whereNull('unsubscribed_at')
            ->count();
        
        return [
            'total_campaigns' => $campaigns->count(),
            'total_subscribers' => $totalSubscribers,
            'average_sent' => $campaigns->avg('sent_count') ?? 0,
            'average_open_rate' => $this->calculateAverageOpenRate($campaigns),
            'average_click_rate' => $this->calculateAverageClickRate($campaigns),
            'recent_campaigns' => $campaigns->take(10)->map(function ($campaign) {
                return [
                    'subject' => $campaign->subject,
                    'sent_at' => $campaign->sent_at?->toDateString(),
                    'sent_count' => $campaign->sent_count,
                    'open_rate' => $campaign->open_rate ?? 0,
                    'click_rate' => $campaign->click_rate ?? 0,
                ];
            }),
            'subscriber_growth' => $this->getSubscriberGrowth(),
        ];
    }
    
    /**
     * Generate user activity report.
     */
    protected function generateUserActivity(): array
    {
        $users = \App\Models\User::withCount(['leads', 'blogPosts', 'interactions'])
            ->get();
        
        return [
            'total_users' => $users->count(),
            'active_users' => $users->where('is_active', true)->count(),
            'by_role' => $users->groupBy('role')->map->count(),
            'top_performers' => $users->sortByDesc('leads_count')->take(10)->map(function ($user) {
                return [
                    'name' => $user->name,
                    'email' => $user->email,
                    'leads_count' => $user->leads_count,
                    'posts_count' => $user->blog_posts_count,
                ];
            }),
        ];
    }
    
    /**
     * Generate conversion funnel report.
     */
    protected function generateConversionFunnel(): array
    {
        $allLeads = \App\Models\Lead::all();
        
        $funnel = [
            'new' => $allLeads->where('status', 'new')->count(),
            'contacted' => $allLeads->where('status', 'contacted')->count(),
            'qualified' => $allLeads->whereIn('status', ['qualified', 'proposal'])->count(),
            'converted' => $allLeads->where('status', 'converted')->count(),
            'lost' => $allLeads->where('status', 'lost')->count(),
        ];
        
        $total = $allLeads->count();
        
        return [
            'stages' => $funnel,
            'conversion_rates' => [
                'new_to_contacted' => $total > 0 ? round(($funnel['contacted'] / $total) * 100, 2) : 0,
                'contacted_to_qualified' => $funnel['contacted'] > 0 ? round(($funnel['qualified'] / $funnel['contacted']) * 100, 2) : 0,
                'qualified_to_converted' => $funnel['qualified'] > 0 ? round(($funnel['converted'] / $funnel['qualified']) * 100, 2) : 0,
                'overall_conversion' => $total > 0 ? round(($funnel['converted'] / $total) * 100, 2) : 0,
            ],
            'average_time_in_stage' => $this->calculateAverageTimeInStage(),
        ];
    }
    
    /**
     * Calculate conversion rate from leads collection.
     */
    protected function calculateConversionRate($leads): float
    {
        $total = $leads->count();
        if ($total === 0) {
            return 0;
        }
        
        $converted = $leads->where('status', 'converted')->count();
        return round(($converted / $total) * 100, 2);
    }
    
    /**
     * Get recent views trend for blog posts.
     */
    protected function getRecentViewsTrend(): array
    {
        // Implementación simplificada - puede optimizarse con cache
        return [
            'last_7_days' => \App\Models\BlogPost::where('status', 'published')
                ->where('last_viewed_at', '>=', now()->subDays(7))
                ->sum('views_count'),
            'previous_7_days' => \App\Models\BlogPost::where('status', 'published')
                ->whereBetween('last_viewed_at', [now()->subDays(14), now()->subDays(7)])
                ->sum('views_count'),
        ];
    }
    
    /**
     * Calculate average open rate from campaigns.
     */
    protected function calculateAverageOpenRate($campaigns): float
    {
        $rates = $campaigns->pluck('open_rate')->filter()->toArray();
        return count($rates) > 0 ? round(array_sum($rates) / count($rates), 2) : 0;
    }
    
    /**
     * Calculate average click rate from campaigns.
     */
    protected function calculateAverageClickRate($campaigns): float
    {
        $rates = $campaigns->pluck('click_rate')->filter()->toArray();
        return count($rates) > 0 ? round(array_sum($rates) / count($rates), 2) : 0;
    }
    
    /**
     * Get subscriber growth trend.
     */
    protected function getSubscriberGrowth(): array
    {
        return [
            'current_month' => \App\Models\NewsletterSubscriber::where('is_active', true)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
            'previous_month' => \App\Models\NewsletterSubscriber::where('is_active', true)
                ->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];
    }
    
    /**
     * Calculate average time in stage for leads.
     */
    protected function calculateAverageTimeInStage(): array
    {
        // Implementación básica - puede mejorarse con tracking de timestamps por cambio de estado
        return [
            'note' => 'Requires lead_interactions tracking for accurate calculation',
        ];
    }
    
    /**
     * Save report to storage.
     */
    protected function saveReport(array $report): string
    {
        $filename = sprintf(
            'reports/%s/%s_%s.json',
            $this->reportType,
            $this->reportType,
            now()->format('Y-m-d_His')
        );
        
        \Illuminate\Support\Facades\Storage::disk('local')->put(
            $filename,
            json_encode($report, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
        
        return $filename;
    }
}
