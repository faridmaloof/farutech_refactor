<?php

namespace App\Jobs;

use App\Events\BlogPostPublished;
use App\Models\BlogPost;
use Illuminate\Support\Facades\DB;

class PublishScheduledBlogPost extends Job
{
    /**
     * Publish all scheduled blog posts whose time has come.
     *
     * @return int number of posts published
     */
    public function handle(): int
    {
        return DB::transaction(function () {
            $posts = BlogPost::query()
                ->dueScheduled()
                ->lockForUpdate()
                ->get();

            foreach ($posts as $post) {
                $post->status = 'published';
                $post->published_at = $post->scheduled_for;
                $post->scheduled_for = null;
                $post->save();

                event(new BlogPostPublished($post));
            }

            return $posts->count();
        });
    }
}