<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'icon',
        'color_primary',
        'color_secondary',
        'is_featured',
        'is_active',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'metadata' => 'array',
    ];

    public function applicationTypes(): HasMany
    {
        return $this->hasMany(ApplicationType::class);
    }
}
