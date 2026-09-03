<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de login exitoso.
     */
    public function test_login_exitoso(): void
    {
        $user = User::factory()->create([
            'email' => 'test@farutech.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@farutech.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'token',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    /**
     * Test de login fallido con credenciales incorrectas.
     */
    public function test_login_fallido_credenciales_incorrectas(): void
    {
        $user = User::factory()->create([
            'email' => 'test@farutech.com',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@farutech.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Credenciales inválidas']);
    }

    /**
     * Test de logout.
     */
    public function test_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * Test de obtener usuario actual con token válido.
     */
    public function test_usuario_actual_con_token_valido(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    /**
     * Test de obtener usuario actual sin token (401).
     */
    public function test_usuario_actual_sin_token(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertStatus(401);
    }

    /**
     * Test de creación de tokens con habilidades específicas.
     */
    public function test_creacion_token_con_habilidades(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token', ['users:read', 'users:write'])->plainTextToken;

        $this->assertNotNull($token);
        $this->assertTrue(strlen($token) > 0);
    }

    /**
     * Test de revocación de token específico.
     */
    public function test_revocacion_token(): void
    {
        $user = User::factory()->create();
        $tokenModel = $user->createToken('test-token');
        $tokenId = $tokenModel->accessToken->id;

        $token = $user->createToken('admin-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/tokens/{$tokenId}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Token revocado correctamente']);
    }
}
