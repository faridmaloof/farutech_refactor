<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $regularUser;
    protected BlogCategory $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear usuario admin para tests de blog
        $this->adminUser = User::factory()->create([
            'email' => 'admin@farutech.com',
            'role' => 'admin'
        ]);

        $this->regularUser = User::factory()->create([
            'email' => 'user@farutech.com'
        ]);

        $this->category = BlogCategory::factory()->create([
            'name' => 'Technology',
            'slug' => 'technology',
            'description' => 'Tech related posts'
        ]);
    }

    /** @test */
    public function can_get_public_posts_list()
    {
        BlogPost::factory()->count(3)->create([
            'category_id' => $this->category->id,
            'status' => 'published'
        ]);

        $response = $this->getJson('/api/blog/posts');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'excerpt', 'published_at']
                ],
                'meta' => ['total', 'per_page', 'current_page']
            ]);
    }

    /** @test */
    public function can_get_single_public_post()
    {
        $post = BlogPost::factory()->create([
            'category_id' => $this->category->id,
            'status' => 'published',
            'slug' => 'test-post'
        ]);

        $response = $this->getJson('/api/blog/posts/test-post');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $post->id,
                    'slug' => 'test-post'
                ]
            ]);
    }

    /** @test */
    public function returns_404_for_unpublished_post()
    {
        $post = BlogPost::factory()->create([
            'status' => 'draft',
            'slug' => 'draft-post'
        ]);

        $response = $this->getJson('/api/blog/posts/draft-post');

        $response->assertStatus(404);
    }

    /** @test */
    public function can_get_categories_list()
    {
        BlogCategory::factory()->count(5)->create();

        $response = $this->getJson('/api/blog/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description']
                ]
            ]);
    }

    /** @test */
    public function can_get_single_category()
    {
        $response = $this->getJson('/api/blog/categories/technology');

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'slug' => 'technology'
                ]
            ]);
    }

    /** @test */
    public function admin_can_list_all_posts_including_drafts()
    {
        BlogPost::factory()->create(['status' => 'draft']);
        BlogPost::factory()->create(['status' => 'published']);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/blog');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    /** @test */
    public function admin_can_create_new_post()
    {
        $postData = [
            'title' => 'New Test Post',
            'slug' => 'new-test-post',
            'content' => 'This is the content of the new post',
            'excerpt' => 'Short excerpt',
            'category_id' => $this->category->id,
            'status' => 'published',
            'tags' => ['laravel', 'testing']
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->postJson('/api/admin/blog', $postData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'New Test Post',
                    'slug' => 'new-test-post'
                ]
            ]);

        $this->assertDatabaseHas('blog_posts', [
            'slug' => 'new-test-post',
            'status' => 'published'
        ]);
    }

    /** @test */
    public function admin_can_update_post()
    {
        $post = BlogPost::factory()->create(['status' => 'draft']);

        $updateData = [
            'title' => 'Updated Title',
            'status' => 'published'
        ];

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->putJson("/api/admin/blog/{$post->id}", $updateData);

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'title' => 'Updated Title',
                    'status' => 'published'
                ]
            ]);
    }

    /** @test */
    public function admin_can_delete_post()
    {
        $post = BlogPost::factory()->create();

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->deleteJson("/api/admin/blog/{$post->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('blog_posts', ['id' => $post->id]);
    }

    /** @test */
    public function regular_user_cannot_access_admin_blog_endpoints()
    {
        $response = $this->actingAs($this->regularUser, 'sanctum')
            ->getJson('/api/admin/blog');

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_admin_blog_endpoints()
    {
        $response = $this->getJson('/api/admin/blog');

        $response->assertStatus(401);
    }
}
