<?php

namespace Database\Factories;

use App\Models\AdminSetting;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AdminSetting>
 */
class AdminSettingFactory extends Factory
{
    protected $model = AdminSetting::class;

    public function definition(): array
    {
        return [
            'registration_enabled' => true,
            'allowed_domains' => null,
            'require_email_confirmation' => false,
            'session_ttl_hours' => 24,
            'max_login_attempts' => 10,
        ];
    }

    /**
     * Indicate that registration is enabled.
     */
    public function withRegistrationEnabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'registration_enabled' => true,
        ]);
    }

    /**
     * Indicate that registration is disabled.
     */
    public function withRegistrationDisabled(): static
    {
        return $this->state(fn (array $attributes) => [
            'registration_enabled' => false,
        ]);
    }

    /**
     * Indicate that email confirmation is required.
     */
    public function requireEmailConfirmation(): static
    {
        return $this->state(fn (array $attributes) => [
            'require_email_confirmation' => true,
        ]);
    }

    /**
     * Indicate that specific domains are allowed.
     */
    public function withAllowedDomains(string $domains): static
    {
        return $this->state(fn (array $attributes) => [
            'allowed_domains' => $domains,
        ]);
    }

    /**
     * Indicate custom session TTL.
     */
    public function withSessionTtl(int $hours): static
    {
        return $this->state(fn (array $attributes) => [
            'session_ttl_hours' => $hours,
        ]);
    }

    /**
     * Indicate custom max login attempts.
     */
    public function withMaxLoginAttempts(int $attempts): static
    {
        return $this->state(fn (array $attributes) => [
            'max_login_attempts' => $attempts,
        ]);
    }
}
