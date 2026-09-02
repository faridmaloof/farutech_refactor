<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'type',
        'message',
        'service_id',
        'privacy_accepted',
        'marketing_accepted',
        'is_read',
        'read_at',
        'assigned_to',
        'status',
        'internal_notes',
        'metadata',
    ];

    protected $casts = [
        'privacy_accepted' => 'boolean',
        'marketing_accepted' => 'boolean',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
