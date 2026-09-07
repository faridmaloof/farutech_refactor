<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    public const STATUS_NEW = 'new';

    protected $fillable = [
        'name', 'email', 'phone', 'company', 'position', 
        'service_id', 'location_id', 'message', 'status', 
        'priority', 'assigned_to', 'source', 'last_contact_at', 
        'next_follow_up_at', 'conversion_value', 'privacy_accepted', 
        'marketing_accepted', 'metadata'
    ];

    protected $casts = [
        'privacy_accepted' => 'boolean',
        'marketing_accepted' => 'boolean',
        'metadata' => 'array',
        'conversion_value' => 'decimal:2'
    ];

    protected $enumCastable = [
        'status' => 'string',
        'priority' => 'string'
    ];

    public function service()
    {
        return $this->belongsTo(\App\Models\Service::class, 'service_id');
    }

    public function location()
    {
        return $this->belongsTo('App\Models\Location', 'location_id');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User', 'assigned_to');
    }

    public function notes()
    {
        return $this->hasMany('App\Models\LeadNote');
    }
}