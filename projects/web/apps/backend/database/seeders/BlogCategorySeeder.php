<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Desarrollo de Software',
                'slug' => 'desarrollo-software',
                'description' => 'Arquitectura, lenguajes y buenas prácticas para construir software confiable.',
                'sort_order' => 1,
            ],
            [
                'name' => 'Plataformas SaaS',
                'slug' => 'plataformas-saas',
                'description' => 'Multi-tenancy, suscripciones y escalabilidad para productos SaaS.',
                'sort_order' => 2,
            ],
            [
                'name' => 'Soluciones Empresariales',
                'slug' => 'soluciones-empresariales',
                'description' => 'Integraciones y sistemas que optimizan las operaciones corporativas.',
                'sort_order' => 3,
            ],
            [
                'name' => 'IA y Automatización',
                'slug' => 'ia-automatizacion',
                'description' => 'Inteligencia artificial aplicada y automatización de procesos.',
                'sort_order' => 4,
            ],
            [
                'name' => 'Modernización',
                'slug' => 'modernizacion',
                'description' => 'Migración y renovación de sistemas legacy.',
                'sort_order' => 5,
            ],
            [
                'name' => 'UX Engineering',
                'slug' => 'ux-engineering',
                'description' => 'Diseño centrado en el usuario e investigación de experiencia.',
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            $exists = DB::table('blog_categories')->where('slug', $category['slug'])->exists();

            if (! $exists) {
                DB::table('blog_categories')->insert(array_merge($category, [
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }
}