<?php

namespace App\Events;

use App\Models\BlogPost;
use Illuminate\Queue\SerializesModels;

class BlogPostPublished extends Event
{
    use SerializesModels;

    /**
     * The blog post that was published.
     *
     * @var BlogPost
     */
    public $post;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(BlogPost $post)
    {
        $this->post = $post;
    }
}