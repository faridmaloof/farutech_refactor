<?php

namespace Database\Factories;

use App\Models\Lead;
use App\Models\Service;
use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    protected $model = Lead::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->optional(0.8)->phoneNumber(),
            'company' => fake()->optional(0.7)->company(),
            'position' => fake()->optional(0.6)->jobTitle(),
            'service_id' => Service::factory(),
            'location_id' => Location::factory(),
            'message' => fake()->optional(0.9)->paragraph(3),
            'status' => fake()->randomElement(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost', 'unreachable']),
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'urgent']),
            'assigned_to' => User::factory(),
            'source' => fake()->randomElement(['web_form', 'referral', 'social_media', 'google_ads', 'linkedin']),
            'last_contact_at' => fake()->optional(0.5)->dateTimeBetween('-30 days', 'now'),
            'next_follow_up_at' => fake()->optional(0.6)->dateTimeBetween('now', '+14 days'),
            'conversion_value' => fake()->optional(0.4)->randomFloat(2, 1000, 50000),
            'privacy_accepted' => true,
            'marketing_accepted' => fake()->boolean(50),
            'metadata' => fake()->optional(0.3)->randomElement([
                ['utm_source' => 'google', 'utm_medium' => 'cpc'],
                ['referrer' => 'https://farutech.com'],
                null
            ]),
        ];
    }

    /**
     * Indicate that the lead is new.
     */
    public function new(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
        ]);
    }

    /**
     * Indicate that the lead is won.
     */
    public function won(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed_won',
        ]);
    }

    /**
     * Indicate that the lead is lost.
     */
    public function lost(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed_lost',
        ]);
    }

    /**
     * Indicate that the lead has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'high',
        ]);
    }

    /**
     * Indicate that the lead has urgent priority.
     */
    public function urgent(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'urgent',
        ]);
    }

    /**
     * Indicate that the lead is assigned to a specific user.
     */
    public function assignedTo(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'assigned_to' => $user->id,
        ]);
    }

    /**
     * Indicate that the lead is from a specific service.
     */
    public function forService(Service $service): static
    {
        return $this->state(fn (array $attributes) => [
            'service_id' => $service->id,
        ]);
    }

    /**
     * Indicate that the lead came from web form.
     */
    public function fromWebForm(): static
    {
        return $this->state(fn (array $attributes) => [
            'source' => 'web_form',
        ]);
    }

    /**
     * Indicate that the lead has a conversion value.
     */
    public function withValue(float $value): static
    {
        return $this->state(fn (array $attributes) => [
            'conversion_value' => $value,
        ]);
    }
}
