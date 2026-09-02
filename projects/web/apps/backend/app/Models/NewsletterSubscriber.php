<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = [
        'email',
        'name',
        'unsubscribe_token',
        'is_active',
        'unsubscribed_at',
        'preferences',
        'emails_received',
        'emails_opened',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'unsubscribed_at' => 'datetime',
        'preferences' => 'array',
        'emails_received' => 'integer',
        'emails_opened' => 'integer',
    ];
}
