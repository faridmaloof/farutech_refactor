<?php

namespace App\Events;

use App\Models\BlogPost;
use Illuminate\Queue\SerializesModels;

class BlogPostViewed extends Event
{
    use SerializesModels;

    /**
     * The blog post that was viewed.
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