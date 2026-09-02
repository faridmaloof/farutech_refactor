<?php

namespace App\Listeners;

use App\Events\BlogPostViewed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Carbon;

class TrackBlogStats implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @return void
     */
    public function handle(BlogPostViewed $event)
    {
        $post = $event->post;

        $post->increment('views_count');
        $post->forceFill(['last_viewed_at' => Carbon::now()])->save();
    }
}
