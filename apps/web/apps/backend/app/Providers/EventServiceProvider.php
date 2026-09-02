<?php

namespace App\Providers;

use App\Events\BlogPostPublished;
use App\Events\BlogPostViewed;
use App\Listeners\TrackBlogStats;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        BlogPostViewed::class => [
            TrackBlogStats::class,
        ],
        BlogPostPublished::class => [
            // Futuros listeners de notificaciones se registran aquí
        ],
    ];
}