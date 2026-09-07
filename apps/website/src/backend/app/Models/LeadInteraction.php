<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeadInteraction extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'lead_id',
        'user_id',
        'type',
        'subject',
        'description',
        'notes',
        'next_follow_up',
        'channel',
        'sentiment',
        'duration_minutes',
    ];

    protected $casts = [
        'next_follow_up' => 'datetime',
    ];

    const TYPE_CALL = 'call';
    const TYPE_EMAIL = 'email';
    const TYPE_MEETING = 'meeting';
    const TYPE_MESSAGE = 'message';
    const TYPE_NOTE = 'note';

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
