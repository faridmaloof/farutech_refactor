<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Lead;
use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = User::factory()->create([
            'email' => 'admin@farutech.com',
            'role' => 'admin'
        ]);
    }

    /** @test */
    public function admin_can_get_dashboard_stats()
    {
        // Create some test leads
        Lead::factory()->count(5)->create(['status' => 'new']);
        Lead::factory()->count(3)->create(['status' => 'WON']);
        Lead::factory()->count(2)->create(['status' => 'contacted']);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJson([
                'totalLeads' => 10,
                'newLeads' => 5,
                'activeProjects' => 0,
                'conversionRate' => 30.0, // 3 won out of 10 total
            ])
            ->assertJsonStructure([
                'totalLeads',
                'newLeads',
                'activeProjects',
                'conversionRate',
                'recentLeads' => [
                    '*' => ['id', 'name', 'email', 'status', 'created_at']
                ]
            ]);
    }

    /** @test */
    public function dashboard_stats_returns_empty_when_no_leads()
    {
        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJson([
                'totalLeads' => 0,
                'newLeads' => 0,
                'activeProjects' => 0,
                'conversionRate' => 0,
                'recentLeads' => []
            ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_dashboard_stats()
    {
        $response = $this->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(401);
    }

    /** @test */
    public function dashboard_stats_only_returns_recent_5_leads()
    {
        Lead::factory()->count(10)->create();

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200);
        
        $recentLeads = $response->json('recentLeads');
        $this->assertCount(5, $recentLeads);
    }

    /** @test */
    public function dashboard_conversion_rate_calculation_is_correct()
    {
        Lead::factory()->count(8)->create(['status' => 'new']);
        Lead::factory()->count(2)->create(['status' => 'WON']);

        $response = $this->actingAs($this->adminUser, 'sanctum')
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJson([
                'totalLeads' => 10,
                'wonLeads' => 2,
                'conversionRate' => 20.0 // 2 won out of 10 total = 20%
            ]);
    }
}
