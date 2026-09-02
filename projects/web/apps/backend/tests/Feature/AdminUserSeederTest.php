<?php

namespace Tests\Feature;

use Database\Seeders\AdminUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserSeederTest extends TestCase
{
    use RefreshDatabase;

    /**
     * TESTING (docs/09 TASK-001): el seeder no debe contener ningún
     * literal de contraseña en el código fuente.
     */
    public function test_seeder_contains_no_hardcoded_password_literals(): void
    {
        $source = file_get_contents(base_path('database/seeders/AdminUserSeeder.php'));

        $this->assertIsString($source);
        $this->assertStringNotContainsString('Admin@123456', $source);
        $this->assertStringNotContainsString('Editor@123456', $source);
        $this->assertStringNotContainsString('Viewer@123456', $source);
        $this->assertStringNotContainsString('@123456', $source);
    }

    /**
     * TESTING (docs/09 TASK-001): el hash generado corresponde a un valor
     * no determinístico entre corridas (contraseñas distintas en cada run).
     */
    public function test_generated_passwords_are_non_deterministic_between_runs(): void
    {
        $seeder = new AdminUserSeeder();

        $firstRun  = $seeder->buildUserRows();
        $secondRun = $seeder->buildUserRows();

        $this->assertCount(3, $firstRun);
        $this->assertCount(3, $secondRun);

        $firstPlain  = array_column($firstRun, 'generated_plain');
        $secondPlain = array_column($secondRun, 'generated_plain');
        $firstHashes = array_column($firstRun, 'password');

        // No determinismo entre corridas (ni texto plano ni hash iguales).
        $this->assertNotSame($firstPlain, $secondPlain);
        $this->assertNotSame(
            array_column($secondRun, 'password'),
            $firstHashes,
        );

        // Las contraseñas generadas tienen longitud/entropía esperada.
        foreach ($firstPlain as $password) {
            $this->assertSame(24, mb_strlen($password));
            $this->assertNotSame('123456', $password);
        }

        // Los hashes son bcrypt válidos, nunca el texto plano.
        foreach ($firstHashes as $hash) {
            $this->assertStringStartsWith('$2y$', $hash);
            $this->assertTrue(Hash::info($hash)['algo'] === PASSWORD_BCRYPT);
        }
    }

    /**
     * VALIDATION: el seed inserta 3 usuarios con hash bcrypt (nunca en
     * texto plano) y los roles esperados.
     */
    public function test_seeder_creates_three_users_with_hashed_passwords_only(): void
    {
        $this->artisan('db:seed', ['--class' => AdminUserSeeder::class])
            ->assertExitCode(0);

        $this->assertDatabaseCount('users', 3);

        $expected = [
            ['admin@farutech.com', 'admin'],
            ['editor@farutech.com', 'editor'],
            ['viewer@farutech.com', 'viewer'],
        ];

        foreach ($expected as [$email, $role]) {
            $user = DB::table('users')->where('email', $email)->first();

            $this->assertNotNull($user, "El usuario {$email} debe existir.");
            $this->assertSame($role, $user->role);

            // Hash bcrypt, nunca la contraseña en texto plano ni la anterior hardcodeada.
            $this->assertStringStartsWith('$2y$', $user->password);
            $this->assertFalse(Hash::check('Admin@123456', $user->password));
            $this->assertFalse(Hash::check('123456', $user->password));
        }
    }
}