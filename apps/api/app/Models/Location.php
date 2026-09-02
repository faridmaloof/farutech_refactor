<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'parent_id',
        'country_code',
        'state_code',
        'latitude',
        'longitude',
        'population',
        'timezone',
        'active',
    ];

    const TYPE_COUNTRY = 'country';
    const TYPE_STATE = 'state';
    const TYPE_CITY = 'city';
    const TYPE_MUNICIPALITY = 'municipality';

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'population' => 'integer',
        'active' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Location::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Location::class, 'parent_id');
    }

    public function leads()
    {
        return $this->hasMany(Lead::class, 'city', 'name');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%");
    }

    public function getFullNameAttribute(): string
    {
        $parts = [$this->name];
        
        if ($this->parent) {
            $parts[] = $this->parent->name;
            
            if ($this->parent->parent) {
                $parts[] = $this->parent->parent->name;
            }
        }
        
        return implode(', ', $parts);
    }
}
