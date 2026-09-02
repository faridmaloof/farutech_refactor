<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\NewsletterSubscriber;

class NewsletterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe_to_newsletter_successfully(): void
    {
        $payload = [
            'email' => 'subscriber@farutech.com',
            'name'  => 'Ana Gómez',
        ];

        $response = $this->postJson('/newsletter', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Te has suscrito exitosamente al newsletter de FaruTech.'
                 ]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@farutech.com',
            'name'  => 'Ana Gómez',
            'is_active' => true,
        ]);
    }

    public function test_subscribing_again_reactivates_inactive_subscriber(): void
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'existing@farutech.com',
            'name'  => 'Ana',
            'unsubscribe_token' => 'testtoken123',
            'is_active' => false,
            'unsubscribed_at' => now(),
        ]);

        $payload = [
            'email' => 'existing@farutech.com',
        ];

        $response = $this->postJson('/newsletter', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'existing@farutech.com',
            'is_active' => true,
        ]);
    }

    public function test_newsletter_fails_with_invalid_email(): void
    {
        $response = $this->postJson('/newsletter', ['email' => 'not-an-email']);

        $response->assertStatus(422);
    }
}
