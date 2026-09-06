<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = [
        'type',
        'name',
        'code',
        'parent_id',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the parent location.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Get the child locations.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    /**
     * Scope a query to only include active locations.
     */
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * Scope a query to search by name.
     */
    public function scopeSearch(Builder $query, string $search): void
    {
        $query->where('name', 'like', "%{$search}%");
    }

    /**
     * Scope a query by type.
     */
    public function scopeByType(Builder $query, string $type): void
    {
        $query->where('type', $type);
    }

    /**
     * Get the location's full name (e.g. "Bogotá, Colombia").
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: function () {
                $name = $this->name;
                $parent = $this->parent;
                
                while ($parent) {
                    $name .= ', ' . $parent->name;
                    $parent = $parent->parent;
                }
                
                return $name;
            },
        );
    }
}
