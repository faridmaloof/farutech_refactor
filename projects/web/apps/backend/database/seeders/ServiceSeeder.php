<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Software Development',
                'slug' => 'software-development',
                'short_description' => 'Desarrollo de software a medida para tus necesidades empresariales',
                'description' => 'Creamos soluciones de software personalizadas que impulsan tu negocio hacia el futuro.',
                'color_primary' => '#3B82F6',
                'color_secondary' => '#1E40AF',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'SaaS Platforms',
                'slug' => 'saas-platforms',
                'short_description' => 'Plataformas SaaS escalables y seguras',
                'description' => 'Desarrollamos plataformas SaaS robustas que crecen con tu negocio.',
                'color_primary' => '#10B981',
                'color_secondary' => '#047857',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Enterprise Solutions',
                'slug' => 'enterprise-solutions',
                'short_description' => 'Soluciones empresariales integrales',
                'description' => 'Implementamos sistemas empresariales que optimizan tus procesos.',
                'color_primary' => '#8B5CF6',
                'color_secondary' => '#6D28D9',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'AI & Automation',
                'slug' => 'ai-automation',
                'short_description' => 'Inteligencia Artificial y automatización de procesos',
                'description' => 'Automatizamos tus procesos con IA para maximizar la eficiencia.',
                'color_primary' => '#F59E0B',
                'color_secondary' => '#B45309',
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'Modernization',
                'slug' => 'modernization',
                'short_description' => 'Modernización de sistemas legacy',
                'description' => 'Transformamos tus sistemas antiguos en tecnologías modernas.',
                'color_primary' => '#EF4444',
                'color_secondary' => '#B91C1C',
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'UX Engineering',
                'slug' => 'ux-engineering',
                'short_description' => 'Ingeniería de experiencia de usuario',
                'description' => 'Diseñamos experiencias digitales excepcionales para tus usuarios.',
                'color_primary' => '#EC4899',
                'color_secondary' => '#BE185D',
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($services as $service) {
            $service['created_at'] = now();
            $service['updated_at'] = now();
            DB::table('services')->insert($service);
        }
    }
}
