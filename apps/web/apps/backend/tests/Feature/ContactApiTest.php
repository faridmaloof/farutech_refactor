<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\ContactMessage;
use App\Models\Lead;
use App\Models\Service;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_submits_successfully_and_creates_contact_message_and_lead(): void
    {
        $service = Service::create([
            'name' => 'Desarrollo de Software a Medida',
            'slug' => 'software-development',
            'description' => 'Servicio de desarrollo',
            'is_active' => true,
        ]);

        $payload = [
            'name'             => 'Carlos Mendoza',
            'email'            => 'carlos@empresa.com',
            'phone'            => '+573001234567',
            'company'          => 'TechCorp',
            'position'         => 'CTO',
            'service_interest' => 'software-development',
            'budget_range'     => '5000-10000',
            'project_timeline' => '1-3_months',
            'message'          => 'Requerimos desarrollo de una plataforma web empresarial.',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/contact', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Gracias por contactarnos. Nos pondremos en contacto pronto.'
                 ]);

        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Carlos Mendoza',
            'email' => 'carlos@empresa.com',
            'service_id' => $service->id,
            'privacy_accepted' => true,
        ]);

        $this->assertDatabaseHas('leads', [
            'name' => 'Carlos Mendoza',
            'email' => 'carlos@empresa.com',
            'service_id' => $service->id,
            'source' => 'web_form',
            'status' => 'new',
        ]);
    }

    public function test_contact_form_validation_fails_without_required_fields(): void
    {
        $response = $this->postJson('/contact', []);

        $response->assertStatus(422)
                 ->assertJsonStructure(['message', 'errors']);
    }

    public function test_contact_form_fails_if_privacy_is_not_accepted(): void
    {
        $payload = [
            'name'             => 'Carlos Mendoza',
            'email'            => 'carlos@empresa.com',
            'service_interest' => 'software-development',
            'message'          => 'Mensaje de prueba con más de 10 caracteres',
            'privacy_accepted' => false,
        ];

        $response = $this->postJson('/contact', $payload);

        $response->assertStatus(422)
                 ->assertJson([
                     'success' => false,
                     'errors'  => ['privacy_accepted' => 'Debe aceptar la política de tratamiento de datos personales para continuar.']
                 ]);
    }

    public function test_contact_form_honeypot_ignores_bot_submission(): void
    {
        $payload = [
            'name'             => 'Spam Bot',
            'email'            => 'bot@spam.com',
            'service_interest' => 'software-development',
            'message'          => 'Spam message text content here...',
            'privacy_accepted' => true,
            'website_url'      => 'http://spam-link.com',
        ];

        $response = $this->postJson('/contact', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseMissing('contact_messages', ['email' => 'bot@spam.com']);
        $this->assertDatabaseMissing('leads', ['email' => 'bot@spam.com']);
    }

    public function test_contact_form_captures_utm_parameters_successfully(): void
    {
        $payload = [
            'name'             => 'Laura UTM Test',
            'email'            => 'laura@campaign.com',
            'service_interest' => 'software-development',
            'message'          => 'Mensaje desde campaña de prueba con parámetros UTM.',
            'privacy_accepted' => true,
            'utm_source'       => 'google',
            'utm_medium'       => 'cpc',
            'utm_campaign'     => 'summer_launch_2026',
        ];

        $response = $this->postJson('/contact', $payload);

        $response->assertStatus(201);

        $lead = Lead::where('email', 'laura@campaign.com')->first();
        $this->assertNotNull($lead);
        $this->assertEquals('google', $lead->metadata['utm_source']);
        $this->assertEquals('cpc', $lead->metadata['utm_medium']);
        $this->assertEquals('summer_launch_2026', $lead->metadata['utm_campaign']);
    }
}
