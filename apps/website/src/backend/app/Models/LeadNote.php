<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadNote extends Model
{
    protected $table = 'lead_notes';

    protected $fillable = [
        'lead_id', 'user_id', 'note', 'type', 'is_private', 'reminder_at'
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'reminder_at' => 'datetime'
    ];

    public function lead()
    {
        return $this->belongsTo('App\Models\Lead');
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}