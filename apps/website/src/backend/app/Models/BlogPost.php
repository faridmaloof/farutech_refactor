<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class BlogPost extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'author_id',
        'category_id',
        'featured_image',
        'status',
        'published_at',
        'scheduled_for',
        'views_count',
        'reading_time_minutes',
        'seo_meta',
        'tags',
        'is_featured',
        'allow_comments',
        'last_viewed_at',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'published_at' => 'datetime',
        'scheduled_for' => 'datetime',
        'last_viewed_at' => 'datetime',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
        'seo_meta' => 'array',
        'tags' => 'array',
        'views_count' => 'integer',
        'reading_time_minutes' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [];

    /**
     * Author (user) of the blog post.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Category of the blog post.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    /**
     * Scope to only published posts.
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', Carbon::now());
    }

    /**
     * Scope to only scheduled posts whose time has come.
     */
    public function scopeDueScheduled(Builder $query): Builder
    {
        return $query
            ->where('status', 'scheduled')
            ->whereNotNull('scheduled_for')
            ->where('scheduled_for', '<=', Carbon::now());
    }
}
