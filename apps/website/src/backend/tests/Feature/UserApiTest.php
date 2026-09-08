<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test de listar usuarios (autenticado).
     */
    public function test_listar_usuarios_autenticado(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        // Crear usuarios adicionales para listar
        User::factory()->count(3)->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'email_verified_at']
                ]
            ]);
    }

    /**
     * Test de listar usuarios sin autenticación (401).
     */
    public function test_listar_usuarios_no_autenticado(): void
    {
        $response = $this->getJson('/api/users');

        $response->assertStatus(401);
    }

    /**
     * Test de ver usuario específico.
     */
    public function test_ver_usuario_especifico(): void
    {
        $admin = User::factory()->create();
        $token = $admin->createToken('test-token')->plainTextToken;

        $user = User::factory()->create();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    /**
     * Test de usuario no encontrado (404).
     */
    public function test_usuario_no_encontrado(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/users/99999');

        $response->assertStatus(404);
    }

    /**
     * Test de actualizar usuario.
     */
    public function test_actualizar_usuario(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->putJson("/api/users/{$user->id}", [
            'name' => 'Nombre Actualizado',
            'email' => 'actualizado@farutech.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Nombre Actualizado',
                'email' => 'actualizado@farutech.com',
            ]);
    }

    /**
     * Test de eliminar usuario.
     */
    public function test_eliminar_usuario(): void
    {
        $admin = User::factory()->create();
        $token = $admin->createToken('test-token')->plainTextToken;

        $user = User::factory()->create();
        $userId = $user->id;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson("/api/users/{$userId}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Usuario eliminado correctamente']);

        // Verificar que el usuario fue eliminado
        $this->assertDatabaseMissing('users', ['id' => $userId]);
    }
}
