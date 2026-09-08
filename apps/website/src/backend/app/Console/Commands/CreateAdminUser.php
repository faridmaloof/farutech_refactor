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
        $password = (string) env('ADMIN_PASSWORD');
        $name = (string) env('ADMIN_NAME', 'Administrador FaruTech');

        if (empty($password)) {
            $this->error('ADMIN_PASSWORD environment variable is required.');
            return self::FAILURE;
        }

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $this->info("Usuario administrador listo: {$user->email}");

        return self::SUCCESS;
    }
}
