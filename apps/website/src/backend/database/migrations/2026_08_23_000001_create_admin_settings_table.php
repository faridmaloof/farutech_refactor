<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Tabla de configuración global del panel admin (single row, id=1):
 *  - registration_enabled:        permite o no crear nuevos usuarios
 *  - allowed_domains:             CSV de dominios de correo permitidos (vacío = todos)
 *  - require_email_confirmation:  exige confirmar el correo antes del login
 *  - session_ttl_hours / max_login_attempts: parámetros generales de seguridad
 * Además añade a `users` los campos de confirmación de correo.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('registration_enabled')->default(false);
            $table->text('allowed_domains')->nullable();
            $table->boolean('require_email_confirmation')->default(false);
            $table->unsignedInteger('session_ttl_hours')->default(24);
            $table->unsignedInteger('max_login_attempts')->default(5);
            $table->timestamps();
        });

        // Fila única de configuración. El default de confirmación depende del
        // entorno: false en dev, true en producción (APP_ENV=production).
        $requireConfirmation = env('APP_ENV') === 'production' ? 1 : 0;

        DB::table('admin_settings')->insert([
            'registration_enabled' => 0,
            'allowed_domains' => null,
            'require_email_confirmation' => $requireConfirmation,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 5,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('email_verified_at')->nullable()->after('password');
            $table->string('confirmation_token', 64)->nullable()->unique()->after('email_verified_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['email_verified_at', 'confirmation_token']);
        });

        Schema::dropIfExists('admin_settings');
    }
};
