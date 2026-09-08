<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    /**
     * Listar categorías activas del blog.
     *
     * @OA\Get(
     *     path="/blog/categories",
     *     summary="Listar categorías",
     *     tags={"Blog público"},
     *
     *     @OA\Response(response=200, description="Categorías con conteo de posts publicados",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="slug", type="string"),
     *                 @OA\Property(property="description", type="string", nullable=true),
     *                 @OA\Property(property="posts_count", type="integer"),
     *             )),
     *         ),
     *     ),
     * )
     */
    public function index(Request $request)
    {
        $categories = BlogCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->withCount(['posts' => function ($q) {
                $q->published();
            }])
            ->get(['id', 'name', 'slug', 'description']);

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Ver una categoría con sus posts publicados.
     *
     * @OA\Get(
     *     path="/blog/categories/{slug}",
     *     summary="Detalle de categoría con posts",
     *     tags={"Blog público"},
     *
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=9)),
     *
     *     @OA\Response(response=200, description="Categoría + posts paginados",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="category", type="object"),
     *                 @OA\Property(property="posts", type="array", @OA\Items(ref="#/components/schemas/BlogPostPublic")),
     *             ),
     *             @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *         ),
     *     ),
     *     @OA\Response(response=404, description="Categoría no encontrada",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function show(Request $request, string $slug)
    {
        $category = BlogCategory::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->first();

        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Categoría no encontrada'], 404);
        }

        $posts = $category->posts()
            ->published()
            ->with(['author:id,name'])
            ->orderByDesc('published_at')
            ->paginate($request->integer('per_page', 9) ?: 9);

        return response()->json([
            'success' => true,
            'data' => [
                'category' => ['id' => $category->id, 'name' => $category->name, 'slug' => $category->slug, 'description' => $category->description],
                'posts' => collect($posts->items())->map(fn ($post) => [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'featured_image' => $post->featured_image,
                    'published_at' => optional($post->published_at)->toIso8601String(),
                    'views_count' => (int) $post->views_count,
                    'author' => $post->author ? ['id' => $post->author->id, 'name' => $post->author->name] : null,
                ]),
            ],
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }
}