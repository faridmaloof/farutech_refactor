<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\ContactMessage;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_submit_contact_form_successfully()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'phone' => '+573001234567',
            'company' => 'TechCorp',
            'position' => 'CTO',
            'service_interest' => 'software-development',
            'budget_range' => '5000-10000',
            'project_timeline' => '1-3_months',
            'message' => 'Requerimos desarrollo de plataforma a medida para nuestro negocio.',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Gracias por contactarnos. Nos pondremos en contacto pronto.'
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'juan@empresa.com',
            'name' => 'Juan Pérez'
        ]);

        $this->assertDatabaseHas('leads', [
            'email' => 'juan@empresa.com',
            'source' => 'website_contact'
        ]);
    }

    /** @test */
    public function contact_form_requires_name()
    {
        $data = [
            'email' => 'juan@empresa.com',
            'message' => 'Mensaje de prueba',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    /** @test */
    public function contact_form_requires_valid_email()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'invalid-email',
            'message' => 'Mensaje de prueba',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function contact_form_requires_message()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('message');
    }

    /** @test */
    public function contact_form_requires_privacy_acceptance()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'message' => 'Mensaje de prueba',
            'privacy_accepted' => false,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('privacy_accepted');
    }

    /** @test */
    public function contact_form_has_honeypot_protection()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'message' => 'Mensaje de prueba',
            'privacy_accepted' => true,
            'website_url' => 'http://spam-bot.com', // Honeypot field
        ];

        $response = $this->postJson('/api/contact', $data);

        // Should return success but not process the form (anti-spam)
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Gracias por contactarnos. Nos pondremos en contacto pronto.'
            ]);

        // Verify no data was actually saved
        $this->assertDatabaseMissing('contact_messages', [
            'email' => 'juan@empresa.com'
        ]);
    }

    /** @test */
    public function contact_form_saves_utm_parameters()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'message' => 'Mensaje de prueba con UTM',
            'privacy_accepted' => true,
            'utm_source' => 'google',
            'utm_medium' => 'cpc',
            'utm_campaign' => 'summer_sale',
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'juan@empresa.com',
            'utm_source' => 'google',
            'utm_medium' => 'cpc',
            'utm_campaign' => 'summer_sale'
        ]);
    }

    /** @test */
    public function message_must_be_at_least_10_characters()
    {
        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@empresa.com',
            'message' => 'Short',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('message');
    }

    /** @test */
    public function creates_lead_with_correct_source()
    {
        $data = [
            'name' => 'María García',
            'email' => 'maria@startup.co',
            'message' => 'Estamos interesados en sus servicios de consultoría tecnológica.',
            'privacy_accepted' => true,
        ];

        $response = $this->postJson('/api/contact', $data);

        $response->assertStatus(201);

        $lead = Lead::where('email', 'maria@startup.co')->first();
        
        $this->assertNotNull($lead);
        $this->assertEquals('website_contact', $lead->source);
        $this->assertEquals('María García', $lead->name);
    }
}
