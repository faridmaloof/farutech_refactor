<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsletterCampaign extends Model
{
    protected $fillable = [
        'title',
        'subject',
        'preview_text',
        'content_html',
        'content_text',
        'sender_id',
        'status',
        'scheduled_for',
        'sent_at',
        'recipients_count',
        'opens_count',
        'clicks_count',
        'unsubscribes_count',
        'bounces_count',
        'blog_posts_included',
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
        'sent_at' => 'datetime',
        'recipients_count' => 'integer',
        'opens_count' => 'integer',
        'clicks_count' => 'integer',
        'unsubscribes_count' => 'integer',
        'bounces_count' => 'integer',
        'blog_posts_included' => 'array',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
