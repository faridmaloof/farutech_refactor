<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

/**
 * Crea (o actualiza) el usuario administrador inicial.
 * Credenciales vía env: ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME.
 * Pensado para ejecutarse en el initContainer del despliegue K8s.
 */
class CreateAdminUser extends Command
{
    protected $signature = 'admin:create';

    protected $description = 'Crea o actualiza el usuario administrador inicial';

    public function handle(): int
    {
        $email = (string) env('ADMIN_EMAIL', 'admin@farutech.dev');
        $password = (string) env('ADMIN_PASSWORD', 'admin123');
        $name = (string) env('ADMIN_NAME', 'Administrador FaruTech');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => password_hash($password, PASSWORD_BCRYPT),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $this->info("Usuario administrador listo: {$user->email}");

        return self::SUCCESS;
    }
}
