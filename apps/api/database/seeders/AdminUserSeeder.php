<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed de usuarios base del sistema (admin / editor / viewer).
     *
     * Por diseño NO existen contraseñas fijas ni literales de ningún tipo:
     * cada ejecución genera una contraseña aleatoria criptográficamente
     * segura por usuario, la imprime UNA sola vez en la salida del comando
     * de seed y NO la persiste ni en código, ni en logs, ni en la BD (en la
     * BD solo queda el hash bcrypt).
     *
     * Corrige R-09 (CRITICAL): antes se hardcodeaban contraseñas de ejemplo
     * (p. ej. `Admin@…` / `Editor@…` / `Viewer@…` con sufijo numérico),
     * visibles para cualquiera con acceso al repositorio.
     */
    public function run(): void
    {
        $rows = $this->buildUserRows();

        // Se insertan SOLO las columnas reales de `users`; la clave interna
        // `generated_plain` (texto plano momentáneo) nunca se persiste.
        DB::table('users')->insert(array_map(
            static fn (array $row): array => array_diff_key($row, ['generated_plain' => null]),
            $rows,
        ));

        $this->printCredentialsOnce($rows);
    }

    /**
     * Construye las filas a insertar. Público para testabilidad: permite
     * verificar entropía/no-determinismo sin tocar la base de datos.
     *
     * @return array<int, array<string, mixed>>
     */
    public function buildUserRows(): array
    {
        $definitions = [
            'admin'  => ['Administrador Principal', 'admin@farutech.com'],
            'editor' => ['Editor de Contenido',     'editor@farutech.com'],
            'viewer' => ['Visualizador',            'viewer@farutech.com'],
        ];

        $rows = [];

        foreach ($definitions as $role => [$name, $email]) {
            $plain = Str::password(24); // ~157 bits de entropía, segura criptográficamente

            $rows[] = [
                'name'            => $name,
                'email'           => $email,
                'password'        => Hash::make($plain),
                'role'            => $role,
                'is_active'       => true,
                'created_at'      => now(),
                'updated_at'      => now(),
                'generated_plain' => $plain, // solo para impresión; eliminada antes del insert
            ];
        }

        return $rows;
    }

    /**
     * Imprime las credenciales UNA única vez, en la salida del comando de seed.
     *
     * ⚠️ Seguridad: NUNCA usar Log::* aquí — eso escribiría las contraseñas en
     * logs persistentes. Por eso se usa únicamente la salida de consola del
     * comando artisan (`$this->command`).
     *
     * @param array<int, array<string, mixed>> $rows
     */
    private function printCredentialsOnce(array $rows): void
    {
        if (! $this->command) {
            return;
        }

        $this->command->warn('');
        $this->command->info('FARUTECH ADMIN CREDENTIALS — se muestran una única vez, anótalas ahora:');
        foreach ($rows as $row) {
            $this->command->warn(sprintf(
                '  %s / %s  (role: %s)',
                $row['email'],
                $row['generated_plain'],
                $row['role'],
            ));
        }
        $this->command->warn('Guárdalas en tu gestor de contraseñas. No se vuelven a mostrar');
        $this->command->warn('y no quedan almacenadas en el servidor ni en logs.');
        $this->command->warn('');
    }
}
