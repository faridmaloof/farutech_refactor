<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $author = DB::table('users')->where('is_active', true)->orderBy('id')->first();
        $authorId = $author ? $author->id : 1;

        $categories = DB::table('blog_categories')->pluck('id', 'slug');

        $posts = [
            [
                'title' => 'Cómo elegir el stack tecnológico correcto para tu producto',
                'slug' => 'como-elegir-stack-tecnologico-para-tu-producto',
                'excerpt' => 'Seis criterios prácticos para elegir un stack que escale con tu negocio sin hipotecar el mantenimiento.',
                'content' => '<h2>Empieza por el problema, no por la herramienta</h2><p>Antes de discutir lenguajes elegimos el dominio: crecimiento esperado, equipo, tiempo al mercado y costo operativo.</p><h2>Los cuatro ejes</h2><p>Acoplamiento al negocio, ecosistema y talento, costo total de propiedad y velocidad de iteración.</p><h2>Decisión</h2><p>Anotamos 3 opciones razonables, prototipamos con la más ágil y validamos en producción.</p>',
                'category_id' => $categories['desarrollo-software'] ?? null,
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'reading_time_minutes' => 6,
                'tags' => json_encode(['Arquitectura', 'Stack tecnológico']),
                'is_featured' => true,
                'allow_comments' => true,
            ],
            [
                'title' => 'Multi-tenancy: la base de una plataforma SaaS rentable',
                'slug' => 'multi-tenancy-base-de-una-plataforma-saas-rentable',
                'excerpt' => 'Cómo diseñar aislamiento de datos, esquemas y facturación cuando cada cliente es su propio mundo.',
                'content' => '<p>El multi-tenancy no es solo tablas con tenant_id. Es una decisión de arquitectura que toca desde las migraciones hasta la facturación.</p><p>Recomendamos un enfoque por esquema para clientes enterprise y shared-schema para el long tail.</p>',
                'category_id' => $categories['plataformas-saas'] ?? null,
                'status' => 'scheduled',
                'scheduled_for' => now()->addDays(3),
                'reading_time_minutes' => 8,
                'tags' => json_encode(['SaaS', 'Arquitectura']),
                'is_featured' => false,
                'allow_comments' => true,
            ],
            [
                'title' => 'Automatización con IA: casos donde sí genera ROI',
                'slug' => 'automatizacion-con-ia-casos-con-roi',
                'excerpt' => 'No todo se debe automatizar. Estos son los procesos con retorno medible de inversión.',
                'content' => '<p>Automatizar un proceso ineficiente multiplica la ineficiencia. Primero se optimiza el flujo, luego se automatiza.</p><p>Los mejores casos: clasificación de leads, ticketing, extracción de datos y QA.</p>',
                'category_id' => $categories['ia-automatizacion'] ?? null,
                'status' => 'draft',
                'reading_time_minutes' => 5,
                'tags' => json_encode(['IA', 'Automatización']),
                'is_featured' => false,
                'allow_comments' => true,
            ],
        ];

        foreach ($posts as $post) {
            $exists = DB::table('blog_posts')->where('slug', $post['slug'])->exists();

            if (! $exists) {
                DB::table('blog_posts')->insert(array_merge($post, [
                    'author_id' => $authorId,
                    'published_at' => ($post['status'] ?? 'draft') === 'published'
                        ? ($post['published_at'] ?? now())
                        : ($post['published_at'] ?? null),
                    'scheduled_for' => $post['scheduled_for'] ?? null,
                    'slug' => Str::slug($post['slug']),
                    'views_count' => 0,
                    'seo_meta' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }
}