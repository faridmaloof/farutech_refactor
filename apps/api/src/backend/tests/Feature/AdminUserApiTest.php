<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AdminSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminUserApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $regularUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = User::factory()->create([
            'email' => 'admin@farutech.com',
            'role' => 'admin'
        ]);

        $this->regularUser = User::factory()->create([
            'email' => 'user@farutech.com',
            'role' => 'user'
        ]);

        AdminSetting::factory()->create([
            'registration_enabled' => true
        ]);
    }

    /** @test */
    public function admin_can_list_all_users()
    {
        User::factory()->count(5)->create();

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'role', 'is_active', 'email_verified_at', 'last_login_at']
                ]
            ]);

        $this->assertCount(7, $response->json('data')); // admin + regular + 5 factory users
    }

    /** @test */
    public function admin_can_create_new_user()
    {
        $userData = [
            'name' => 'Nuevo Usuario Admin',
            'email' => 'nuevo@farutech.com',
            'password' => 'password123',
            'role' => 'editor'
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Usuario creado exitosamente',
                'data' => [
                    'name' => 'Nuevo Usuario Admin',
                    'email' => 'nuevo@farutech.com',
                    'role' => 'editor',
                    'is_active' => true
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'nuevo@farutech.com',
            'role' => 'editor'
        ]);
    }

    /** @test */
    public function user_creation_fails_when_registration_disabled()
    {
        AdminSetting::current()->update(['registration_enabled' => false]);

        $userData = [
            'name' => 'Usuario Test',
            'email' => 'test@farutech.com',
            'password' => 'password123',
            'role' => 'viewer'
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Creación de usuarios deshabilitada en Configuración.'
            ]);
    }

    /** @test */
    public function admin_can_toggle_user_status()
    {
        $user = User::factory()->create(['is_active' => true]);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->patchJson("/api/admin/users/{$user->id}/status");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Estado del usuario actualizado',
                'data' => [
                    'id' => $user->id,
                    'is_active' => false
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => false
        ]);
    }

    /** @test */
    public function admin_can_reactivate_inactive_user()
    {
        $user = User::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->patchJson("/api/admin/users/{$user->id}/status");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'is_active' => true
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => true
        ]);
    }

    /** @test */
    public function regular_user_cannot_list_admin_users()
    {
        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->getJson('/api/admin/users');

        $response->assertStatus(403);
    }

    /** @test */
    public function regular_user_cannot_create_users()
    {
        $userData = [
            'name' => 'Usuario No Autorizado',
            'email' => 'unauthorized@farutech.com',
            'password' => 'password123',
            'role' => 'viewer'
        ];

        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $response->assertStatus(403);
    }

    /** @test */
    public function regular_user_cannot_toggle_user_status()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->patchJson("/api/admin/users/{$user->id}/status");

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_admin_users_endpoints()
    {
        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(401);
    }

    /** @test */
    public function creating_user_requires_valid_role()
    {
        $userData = [
            'name' => 'Usuario Test',
            'email' => 'test@farutech.com',
            'password' => 'password123',
            'role' => 'invalid_role'
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('role');
    }

    /** @test */
    public function creating_user_requires_unique_email()
    {
        $existingUser = User::factory()->create(['email' => 'existing@farutech.com']);

        $userData = [
            'name' => 'Usuario Duplicado',
            'email' => 'existing@farutech.com',
            'password' => 'password123',
            'role' => 'viewer'
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function created_user_has_default_active_status()
    {
        $userData = [
            'name' => 'Usuario Activo',
            'email' => 'activo@farutech.com',
            'password' => 'password123',
            'role' => 'viewer'
        ];

        $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/users', $userData);

        $this->assertDatabaseHas('users', [
            'email' => 'activo@farutech.com',
            'is_active' => true
        ]);
    }
}
