<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\CreateAdminUser::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Publica posts programados cuyo scheduled_for ya llegó.
        // Requiere cron: * * * * * php artisan schedule:run
        $schedule->call(function () {
            (new \App\Jobs\PublishScheduledBlogPost())->handle();
        })->everyMinute();
        
        // Búsqueda de oportunidades diarias (ejecutar a las 3 AM)
        $schedule->job(new \App\Jobs\FindOpportunitiesJob())
            ->dailyAt('03:00')
            ->onOneServer();
            
        // Sincronización de leads semanal (Domingo 2 AM)
        $schedule->job(new \App\Jobs\SyncLeadsJob('all', [
            'fetch_from_external' => true,
            'detect_duplicates' => true,
            'refresh_stale' => true,
            'validate_integrity' => true
        ]))->weeklyOn(0, '02:00')
            ->onOneServer();
            
        // Limpieza de datos antiguos mensual (primer día del mes 1 AM)
        $schedule->job(new \App\Jobs\CleanOldDataJob('all', [
            'archive_leads' => true,
            'delete_leads' => false, // Requiere aprobación explícita
            'export_before_delete' => true
        ]))->monthlyOn(1, '01:00')
            ->onOneServer();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}