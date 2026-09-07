<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AdminSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SettingsApiTest extends TestCase
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

        // Crear settings iniciales
        AdminSetting::factory()->create();
    }

    /** @test */
    public function admin_can_view_settings()
    {
        $settings = AdminSetting::current();

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/settings');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'registration_enabled',
                    'allowed_domains',
                    'require_email_confirmation',
                    'session_ttl_hours',
                    'max_login_attempts'
                ]
            ]);
    }

    /** @test */
    public function admin_can_update_settings()
    {
        $updateData = [
            'registration_enabled' => false,
            'allowed_domains' => 'farutech.com,farutech.local',
            'require_email_confirmation' => true,
            'session_ttl_hours' => 48,
            'max_login_attempts' => 5,
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Configuración actualizada',
                'data' => $updateData
            ]);

        $this->assertDatabaseHas('admin_settings', [
            'registration_enabled' => false,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 48,
            'max_login_attempts' => 5,
        ]);
    }

    /** @test */
    public function settings_require_registration_enabled_field()
    {
        $updateData = [
            'allowed_domains' => 'farutech.com',
            'require_email_confirmation' => true,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 10,
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('registration_enabled');
    }

    /** @test */
    public function session_ttl_hours_must_be_between_1_and_168()
    {
        $updateData = [
            'registration_enabled' => true,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 200, // Invalid: > 168
            'max_login_attempts' => 10,
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('session_ttl_hours');
    }

    /** @test */
    public function max_login_attempts_must_be_between_3_and_20()
    {
        $updateData = [
            'registration_enabled' => true,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 2, // Invalid: < 3
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('max_login_attempts');
    }

    /** @test */
    public function regular_user_cannot_view_settings()
    {
        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->getJson('/api/admin/settings');

        $response->assertStatus(403);
    }

    /** @test */
    public function regular_user_cannot_update_settings()
    {
        $updateData = [
            'registration_enabled' => false,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 10,
        ];

        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_settings()
    {
        $response = $this->getJson('/api/admin/settings');

        $response->assertStatus(401);
    }

    /** @test */
    public function allowed_domains_can_be_null()
    {
        $updateData = [
            'registration_enabled' => true,
            'allowed_domains' => null,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 10,
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('admin_settings', [
            'allowed_domains' => null,
        ]);
    }

    /** @test */
    public function settings_cache_is_flushed_after_update()
    {
        $updateData = [
            'registration_enabled' => false,
            'require_email_confirmation' => true,
            'session_ttl_hours' => 48,
            'max_login_attempts' => 5,
        ];

        $this->actingAs($this->adminUser, 'sanctum')
            ->putJson('/api/admin/settings', $updateData);

        // Verificar que los settings se actualizaron correctamente
        $settings = AdminSetting::current();
        
        $this->assertFalse($settings->registration_enabled);
        $this->assertTrue($settings->require_email_confirmation);
        $this->assertEquals(48, $settings->session_ttl_hours);
        $this->assertEquals(5, $settings->max_login_attempts);
    }
}
