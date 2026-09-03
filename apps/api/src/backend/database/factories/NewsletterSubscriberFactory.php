<?php

namespace Database\Factories;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NewsletterSubscriber>
 */
class NewsletterSubscriberFactory extends Factory
{
    protected $model = NewsletterSubscriber::class;

    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'name' => fake()->optional(0.7)->name(),
            'unsubscribe_token' => Str::random(64),
            'is_active' => true,
            'unsubscribed_at' => null,
        ];
    }

    /**
     * Indicate that the subscriber is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'unsubscribed_at' => null,
        ]);
    }

    /**
     * Indicate that the subscriber is inactive (unsubscribed).
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'unsubscribed_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the subscriber has a name.
     */
    public function withName(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => fake()->name(),
        ]);
    }

    /**
     * Indicate that the subscriber does not have a name.
     */
    public function withoutName(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => null,
        ]);
    }
}
