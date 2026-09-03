<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

/**
 * Configuración global del panel (fila única id=1).
 * Lectura cacheada 60 s; invalidar con AdminSetting::flushCache().
 */
class AdminSetting extends Model
{
    protected $table = 'admin_settings';

    protected $guarded = [];

    protected $casts = [
        'registration_enabled' => 'bool',
        'require_email_confirmation' => 'bool',
        'session_ttl_hours' => 'int',
        'max_login_attempts' => 'int',
    ];

    public static function current(): self
    {
        return Cache::remember(
            'admin_settings',
            60,
            fn () => self::query()->firstOrFail()
        );
    }

    /** Dominios permitidos como array (vacío = sin restricción). */
    public function allowedDomains(): array
    {
        $raw = trim((string) $this->allowed_domains);

        if ($raw === '') {
            return [];
        }

        return array_values(array_filter(array_map(
            fn ($d) => strtolower(trim($d)),
            preg_split('/[,\s]+/', $raw)
        )));
    }

    public static function flushCache(): void
    {
        Cache::forget('admin_settings');
    }
}
