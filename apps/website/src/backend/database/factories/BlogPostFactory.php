<?php

namespace Database\Factories;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        $title = fake()->sentence(6);
        
        return [
            'title' => $title,
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()-> paragraphs(5, true),
            'status' => fake()->randomElement(['draft', 'published', 'scheduled']),
            'is_featured' => fake()->boolean(20),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-1 year', 'now'),
            'scheduled_for' => null,
            'meta_title' => $title,
            'meta_description' => fake()->paragraph(1),
            'tags' => fake()->randomElements(['laravel', 'php', 'javascript', 'react', 'vue', 'nodejs'], 3),
            'category_id' => BlogCategory::factory(),
            'author_id' => User::factory(),
            'view_count' => fake()->numberBetween(0, 10000),
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the post is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_for' => fake()->dateTimeBetween('tomorrow', '+1 month'),
        ]);
    }

    /**
     * Indicate that the post is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the post belongs to a specific category.
     */
    public function forCategory(BlogCategory $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category_id' => $category->id,
        ]);
    }

    /**
     * Indicate that the post is authored by a specific user.
     */
    public function authoredBy(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'author_id' => $user->id,
        ]);
    }
}
