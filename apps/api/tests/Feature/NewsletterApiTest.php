<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NewsletterApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function can_subscribe_to_newsletter_with_email_only()
    {
        $data = [
            'email' => 'usuario@empresa.com'
        ];

        $response = $this->postJson('/api/newsletter', $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Te has suscrito exitosamente al newsletter de FaruTech.'
            ]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'usuario@empresa.com',
            'is_active' => true
        ]);
    }

    /** @test */
    public function can_subscribe_to_newsletter_with_name_and_email()
    {
        $data = [
            'email' => 'juan@startup.co',
            'name' => 'Juan Pérez'
        ];

        $response = $this->postJson('/api/newsletter', $data);

        $response->assertStatus(200);

        $subscriber = NewsletterSubscriber::where('email', 'juan@startup.co')->first();
        
        $this->assertNotNull($subscriber);
        $this->assertEquals('Juan Pérez', $subscriber->name);
        $this->assertTrue($subscriber->is_active);
    }

    /** @test */
    public function email_is_required_for_newsletter_subscription()
    {
        $data = [
            'name' => 'Juan Pérez'
        ];

        $response = $this->postJson('/api/newsletter', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function email_must_be_valid_format()
    {
        $data = [
            'email' => 'invalid-email-format'
        ];

        $response = $this->postJson('/api/newsletter', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    /** @test */
    public function duplicate_email_does_not_create_new_subscriber()
    {
        $data = [
            'email' => 'repeated@farutech.com',
            'name' => 'First Name'
        ];

        // First subscription
        $this->postJson('/api/newsletter', $data);
        
        // Second subscription with different name
        $this->postJson('/api/newsletter', [
            'email' => 'repeated@farutech.com',
            'name' => 'Different Name'
        ]);

        // Should only have one subscriber
        $this->assertCount(1, NewsletterSubscriber::where('email', 'repeated@farutech.com')->get());
    }

    /** @test */
    public function inactive_subscriber_can_be_reactivated()
    {
        $subscriber = NewsletterSubscriber::factory()->create([
            'email' => 'inactive@farutech.com',
            'is_active' => false,
            'unsubscribed_at' => now()->subDays(30)
        ]);

        $response = $this->postJson('/api/newsletter', [
            'email' => 'inactive@farutech.com',
            'name' => 'Reactivated User'
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $subscriber->refresh();
        $this->assertTrue($subscriber->is_active);
        $this->assertNull($subscriber->unsubscribed_at);
    }

    /** @test */
    public function newsletter_has_honeypot_protection()
    {
        $data = [
            'email' => 'bot@spam.com',
            'website_url' => 'http://spam-bot-site.com' // Honeypot field
        ];

        $response = $this->postJson('/api/newsletter', $data);

        // Should return success but not process
        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Te has suscrito exitosamente al newsletter.'
            ]);

        // Verify no data was actually saved
        $this->assertDatabaseMissing('newsletter_subscribers', [
            'email' => 'bot@spam.com'
        ]);
    }

    /** @test */
    public function email_is_normalized_to_lowercase()
    {
        $data = [
            'email' => 'UPPERCASE@FARUTECH.COM',
            'name' => 'Test User'
        ];

        $this->postJson('/api/newsletter', $data);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'uppercase@farutech.com'
        ]);
    }

    /** @test */
    public function email_whitespace_is_trimmed()
    {
        $data = [
            'email' => '  spaced@email.com  ',
            'name' => 'Test User'
        ];

        $this->postJson('/api/newsletter', $data);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'spaced@email.com'
        ]);
    }

    /** @test */
    public function unsubscribe_token_is_generated_on_subscription()
    {
        $data = [
            'email' => 'newuser@example.com'
        ];

        $this->postJson('/api/newsletter', $data);

        $subscriber = NewsletterSubscriber::where('email', 'newuser@example.com')->first();
        
        $this->assertNotNull($subscriber);
        $this->assertNotNull($subscriber->unsubscribe_token);
        $this->assertEquals(64, strlen($subscriber->unsubscribe_token));
    }
}
