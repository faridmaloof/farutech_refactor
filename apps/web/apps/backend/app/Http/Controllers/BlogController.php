<?php

namespace App\Http\Controllers;

use App\Events\BlogPostViewed;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BlogController extends Controller
{
    /**
     * Listar posts publicados del blog.
     *
     * @OA\Get(
     *     path="/blog/posts",
     *     summary="Listar posts publicados",
     *     tags={"Blog público"},
     *
     *     @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string"), description="Slug de categoría"),
     *     @OA\Parameter(name="tag", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="featured", in="query", required=false, @OA\Schema(type="boolean")),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=9)),
     *
     *     @OA\Response(response=200, description="Posts paginados",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/BlogPostPublic")),
     *             @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *         ),
     *     ),
     * )
     */
    public function index(Request $request)
    {
        $query = BlogPost::query()
            ->published()
            ->with(['author:id,name', 'category:id,name,slug'])
            ->orderByDesc('published_at');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->input('category'));
            });
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->input('tag'));
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $posts = $query->paginate($request->integer('per_page', 9) ?: 9);

        return response()->json([
            'success' => true,
            'data' => $posts->through(fn (BlogPost $post) => $this->publicPayload($post))->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Ver un post publicado y registrar una vista.
     *
     * @OA\Get(
     *     path="/blog/posts/{slug}",
     *     summary="Detalle de post por slug",
     *     tags={"Blog público"},
     *
     *     @OA\Parameter(name="slug", in="path", required=true, @OA\Schema(type="string")),
     *
     *     @OA\Response(response=200, description="Post completo",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/BlogPostFull"),
     *         ),
     *     ),
     *     @OA\Response(response=404, description="Post no encontrado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function show(Request $request, string $slug)
    {
        $post = BlogPost::query()
            ->published()
            ->with(['author:id,name', 'category:id,name,slug'])
            ->where('slug', $slug)
            ->first();

        if (! $post) {
            return response()->json(['success' => false, 'message' => 'Post no encontrado'], 404);
        }

        event(new BlogPostViewed($post));

        return response()->json([
            'success' => true,
            'data' => $this->publicPayload($post, true),
        ]);
    }

    /**
     * Show a single post for the admin panel (any status).
     */
    public function showAdmin(Request $request, int $id)
    {
        $post = BlogPost::query()
            ->with(['author:id,name', 'category:id,name,slug'])
            ->find($id);

        if (! $post) {
            return response()->json(['success' => false, 'message' => 'Post no encontrado'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->adminPayload($post),
        ]);
    }
    /**
     * Listar todos los posts desde el panel admin.
     *
     * @OA\Get(
     *     path="/admin/blog",
     *     summary="Listar posts (cualquier estado)",
     *     tags={"Blog admin"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="status", in="query", required=false,
     *         @OA\Schema(type="string", enum={"draft","scheduled","published","archived"})),
     *     @OA\Parameter(name="category", in="query", required=false, @OA\Schema(type="string")),
     *     @OA\Parameter(name="q", in="query", required=false, @OA\Schema(type="string"), description="Búsqueda en title/slug"),
     *     @OA\Parameter(name="per_page", in="query", required=false, @OA\Schema(type="integer", default=15)),
     *
     *     @OA\Response(response=200, description="Colección paginada",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/BlogPostAdmin")),
     *             @OA\Property(property="meta", ref="#/components/schemas/PaginationMeta"),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function adminIndex(Request $request)
    {
        $query = BlogPost::query()
            ->with(['author:id,name', 'category:id,name,slug'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->input('category')));
        }

        if ($request->filled('q')) {
            $like = '%'.$request->input('q').'%';
            $query->where(function ($q) use ($like) {
                $q->where('title', 'like', $like)->orWhere('slug', 'like', $like);
            });
        }

        $posts = $query->paginate($request->integer('per_page', 15) ?: 15);

        return response()->json([
            'success' => true,
            'data' => collect($posts->items())->map(fn (BlogPost $post) => $this->adminPayload($post)),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Crear post (borrador / programado / publicado).
     *
     * @OA\Post(
     *     path="/admin/blog",
     *     summary="Crear post",
     *     tags={"Blog admin"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true, ref="#/components/requestBodies/BlogPostPayload"),
     *
     *     @OA\Response(response=201, description="Creado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/BlogPostAdmin"),
     *         ),
     *     ),
     *     @OA\Response(response=422, description="Validación fallida",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function store(Request $request)
    {
        $request->validate($this->rules());

        $data = $this->normalizePayload($request);

        $post = BlogPost::create($data);

        return response()->json([
            'success' => true,
            'data' => $this->adminPayload($post->load(['author:id,name', 'category:id,name,slug'])),
        ], 201);
    }

    /**
     * Actualizar un post.
     *
     * @OA\Put(
     *     path="/admin/blog/{id}",
     *     summary="Actualizar post",
     *     tags={"Blog admin"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, ref="#/components/requestBodies/BlogPostPayload"),
     *
     *     @OA\Response(response=200, description="Actualizado",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/BlogPostAdmin"),
     *         ),
     *     ),
     *     @OA\Response(response=404, description="No encontrado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Validación fallida",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function update(Request $request, int $id)
    {
        $post = BlogPost::findOrFail($id);

        $request->validate($this->rules($id));
$post->update($this->normalizePayload($request));

        return response()->json([
            'success' => true,
            'data' => $this->adminPayload($post->load(['author:id,name', 'category:id,name,slug'])),
        ]);
    }

    /**
     * Eliminar un post.
     *
     * @OA\Delete(
     *     path="/admin/blog/{id}",
     *     summary="Eliminar post",
     *     tags={"Blog admin"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Eliminado",
     *         @OA\JsonContent(@OA\Property(property="success", type="boolean"))),
     *     @OA\Response(response=404, description="No encontrado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function destroy(int $id)
    {
        $post = BlogPost::findOrFail($id);

        $post->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Validation rules for creating/updating posts.
     */
    protected function rules(?int $ignoreId = null): array
    {
        $unique = Rule::unique('blog_posts', 'slug');
        if ($ignoreId) {
            $unique = $unique->ignore($ignoreId);
        }

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255', $unique],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:blog_categories,id'],
            'featured_image' => ['nullable', 'string', 'max:500'],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'published', 'archived'])],
            'published_at' => ['nullable', 'date'],
            'scheduled_for' => ['nullable', 'date', 'after:now'],
            'tags' => ['sometimes', 'array'],
            'seo_meta' => ['sometimes', 'array'],
            'is_featured' => ['sometimes', 'boolean'],
            'allow_comments' => ['sometimes', 'boolean'],
            'reading_time_minutes' => ['sometimes', 'nullable', 'integer', 'min:0', 'max:300'],
        ];
    }

    /**
     * Normalize incoming payload into an array safe for mass assignment.
     */
    protected function normalizePayload(Request $request): array
    {
        $data = $request->only([
            'title', 'excerpt', 'content', 'category_id', 'featured_image',
            'status', 'published_at', 'scheduled_for', 'tags', 'seo_meta',
            'is_featured', 'allow_comments', 'reading_time_minutes',
        ]);

        $data['slug'] = $request->filled('slug')
            ? Str::slug($request->input('slug'))
            : Str::slug($request->input('title'));

        if (! $data['slug']) {
            $data['slug'] = (string) Str::uuid();
        }

        // A falta de autenticaci├│n completa (JWT llega en Feature 4),
        // asigna el autor por defecto (admin seed) o el primer usuario activo.
        $data['author_id'] = $this->getDefaultAuthorId();

        $data['tags'] = $request->input('tags', []);
        $data['seo_meta'] = $request->input('seo_meta', []);

        // L├│gica de publicaci├│n seg├║n el plan:
        // - published_at NULL  -> Borrador
        // - published_at futuro -> Programado (el Job lo publica)
        // - published_at pasado/presente -> Publicado
        $status = $data['status'] ?? 'draft';

        if (($data['published_at'] ?? null) === null
            && ($data['scheduled_for'] ?? null) === null
            && $status === 'published') {
            $data['published_at'] = Carbon::now();
        }

        if ($status === 'scheduled' && ($data['scheduled_for'] ?? null) !== null) {
            $data['published_at'] = null;
        }

        if ($status === 'published' && ($data['published_at'] ?? null) !== null) {
            $data['scheduled_for'] = null;
        }

        return $data;
    }

    /**
     * Resolve the author id used when authentication is not yet required.
     */
    protected function getDefaultAuthorId(): int
    {
        $user = DB::table('users')->where('is_active', true)->orderBy('id')->first();

        return $user?->id ?? 1;
    }

    /**
     * Public payload for list/detail responses.
     */
    protected function publicPayload(BlogPost $post, bool $withContent = false): array
    {
        $payload = [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'featured_image' => $post->featured_image,
            'published_at' => optional($post->published_at)->toIso8601String(),
            'reading_time_minutes' => $post->reading_time_minutes,
            'category' => $post->relationLoaded('category')
                ? ($post->category ? ['id' => $post->category->id, 'name' => $post->category->name, 'slug' => $post->category->slug] : null)
                : null,
            'author' => $post->author ? ['id' => $post->author->id, 'name' => $post->author->name] : null,
            'tags' => collect($post->tags ?? [])->map(fn ($tag) => is_array($tag) ? $tag : ['name' => $tag])->values(),
            'is_featured' => (bool) $post->is_featured,
            'views_count' => (int) $post->views_count,
        ];

        if ($withContent) {
            $payload['content'] = $post->content;
        }

        return $payload;
    }

    /**
     * Admin payload includes internal state fields.
     */
    protected function adminPayload(BlogPost $post): array
    {
        $payload = $this->publicPayload($post, true);
        $payload['status'] = $post->status;
        $payload['scheduled_for'] = optional($post->scheduled_for)->toIso8601String();
        $payload['last_viewed_at'] = optional($post->last_viewed_at)->toIso8601String();
        $payload['seo_meta'] = $post->seo_meta ?? [];

        return $payload;
    }
}
