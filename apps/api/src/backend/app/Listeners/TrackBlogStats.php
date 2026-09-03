<?php

namespace App\Listeners;

use App\Events\BlogPostViewed;
use App\Events\BlogPostPublished;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class TrackBlogStats implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle($event): void
    {
        if ($event instanceof BlogPostViewed) {
            $event->post->increment('views_count');
        } elseif ($event instanceof BlogPostPublished) {
            // Add specific publishing logic if required, e.g. notify subscribers
        }
    }
}
