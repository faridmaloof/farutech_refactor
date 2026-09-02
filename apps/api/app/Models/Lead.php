<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'position',
        'city',
        'state',
        'country',
        'service_interest',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'status',
        'quality_score',
        'notes',
        'contacted_at',
        'converted_at',
        'assigned_to',
        'is_internal_search',
        'search_params',
        'external_url',
        'social_profiles',
    ];

    protected $casts = [
        'quality_score' => 'integer',
        'contacted_at' => 'datetime',
        'converted_at' => 'datetime',
        'search_params' => 'array',
        'social_profiles' => 'array',
        'is_internal_search' => 'boolean',
    ];

    const STATUS_NEW = 'new';
    const STATUS_CONTACTED = 'contacted';
    const STATUS_QUALIFIED = 'qualified';
    const STATUS_PROPOSAL = 'proposal';
    const STATUS_NEGOTIATION = 'negotiation';
    const STATUS_WON = 'won';
    const STATUS_LOST = 'lost';

    public static function getStatuses(): array
    {
        return [
            self::STATUS_NEW,
            self::STATUS_CONTACTED,
            self::STATUS_QUALIFIED,
            self::STATUS_PROPOSAL,
            self::STATUS_NEGOTIATION,
            self::STATUS_WON,
            self::STATUS_LOST,
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', self::STATUS_LOST);
    }

    public function scopeQualified($query)
    {
        return $query->whereIn('status', [self::STATUS_QUALIFIED, self::STATUS_PROPOSAL, self::STATUS_NEGOTIATION]);
    }

    public function scopeInternalSearch($query)
    {
        return $query->where('is_internal_search', true);
    }

    public function scopeByQuality($query, $minScore = 70)
    {
        return $query->where('quality_score', '>=', $minScore);
    }

    public function interactions()
    {
        return $this->hasMany(LeadInteraction::class);
    }

    public function tasks()
    {
        return $this->hasMany(LeadTask::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
