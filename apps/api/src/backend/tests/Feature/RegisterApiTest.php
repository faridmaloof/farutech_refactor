<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AdminSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

class RegisterApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear settings por defecto (registro habilitado)
        AdminSetting::factory()->create([
            'registration_enabled' => true,
            'require_email_confirmation' => false,
            'allowed_domains' => null
        ]);
    }

    /** @test */
    public function can_register_new_user_successfully()
    {
        $data = [
            'name' => 'Nuevo Usuario',
            'email' => 'nuevo@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Cuenta creada exitosamente. Ya puedes iniciar sesión.',
                'requires_confirmation' => false
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'nuevo@farutech.com',
            'name' => 'Nuevo Usuario'
        ]);
    }

    /** @test */
    public function registration_fails_when_disabled_by_admin()
    {
        AdminSetting::current()->update(['registration_enabled' => false]);

        $data = [
            'name' => 'Usuario Test',
            'email' => 'test@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'El registro de nuevos usuarios está deshabilitado.'
            ]);
    }

    /** @test */
    public function registration_requires_name()
    {
        $data = [
            'email' => 'test@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    /** @test */
    public function registration_requires_valid_email()
    {
        $data = [
            'name' => 'Usuario Test',
            'email' => 'invalid-email',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function registration_requires_unique_email()
    {
        User::factory()->create(['email' => 'existing@farutech.com']);

        $data = [
            'name' => 'Usuario Test',
            'email' => 'existing@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function registration_requires_minimum_password_length()
    {
        $data = [
            'name' => 'Usuario Test',
            'email' => 'test@farutech.com',
            'password' => 'short'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }

    /** @test */
    public function email_domain_restriction_is_enforced()
    {
        AdminSetting::current()->update([
            'registration_enabled' => true,
            'allowed_domains' => 'farutech.com,farutech.local'
        ]);

        $data = [
            'name' => 'Usuario Externo',
            'email' => 'usuario@external.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'El dominio del correo no está permitido para registrarse.'
            ]);
    }

    /** @test */
    public function allowed_domain_can_register_successfully()
    {
        AdminSetting::current()->update([
            'allowed_domains' => 'farutech.com,farutech.local'
        ]);

        $data = [
            'name' => 'Usuario Farutech',
            'email' => 'usuario@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'usuario@farutech.com'
        ]);
    }

    /** @test */
    public function email_confirmation_is_required_when_configured()
    {
        AdminSetting::current()->update([
            'require_email_confirmation' => true
        ]);

        $data = [
            'name' => 'Usuario Confirmado',
            'email' => 'confirmado@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201)
            ->assertJson([
                'requires_confirmation' => true
            ])
            ->assertJsonStructure([
                'confirmation_url_dev'
            ]);

        $user = User::where('email', 'confirmado@farutech.com')->first();
        $this->assertNotNull($user);
        $this->assertNull($user->email_verified_at);
        $this->assertNotNull($user->confirmation_token);
    }

    /** @test */
    public function email_is_normalized_to_lowercase()
    {
        $data = [
            'name' => 'Usuario Mayusculas',
            'email' => 'UPPERCASE@FARUTECH.COM',
            'password' => 'password123'
        ];

        $this->postJson('/api/register', $data);

        $this->assertDatabaseHas('users', [
            'email' => 'uppercase@farutech.com'
        ]);
    }

    /** @test */
    public function password_is_hashed_before_storing()
    {
        $data = [
            'name' => 'Usuario Hash',
            'email' => 'hash@farutech.com',
            'password' => 'plainPassword123'
        ];

        $this->postJson('/api/register', $data);

        $user = User::where('email', 'hash@farutech.com')->first();
        
        $this->assertNotNull($user);
        $this->assertNotEquals('plainPassword123', $user->password);
        $this->assertTrue(password_verify('plainPassword123', $user->password));
    }

    /** @test */
    public function confirmation_url_is_generated_for_dev_environment()
    {
        AdminSetting::current()->update([
            'require_email_confirmation' => true
        ]);

        $data = [
            'name' => 'Usuario Dev',
            'email' => 'dev@farutech.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $data);

        $response->assertStatus(201);
        
        $confirmationUrl = $response->json('confirmation_url_dev');
        $this->assertNotNull($confirmationUrl);
        $this->assertStringContainsString('/api/register/confirm', $confirmationUrl);
        $this->assertStringContainsString('token=', $confirmationUrl);
    }
}
