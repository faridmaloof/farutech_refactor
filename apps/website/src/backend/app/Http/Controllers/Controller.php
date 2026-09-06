<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="FaruTech API",
 *     version="1.0.0",
 *     description="API del sitio corporativo FaruTech: blog público, autenticación
 *         admin con token HMAC (Bearer) y panel CRM/leads. Sirve bajo
 *         http://api.farutech.local sin prefijo /api.",
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Entorno actual (L5_SWAGGER_CONST_HOST)"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     description="Emite POST /admin/login. Enviar como: Authorization: Bearer <token>",
 * )
 *
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     @OA\Property(property="message", type="string", example="No autenticado."),
 *     @OA\Property(property="errors", type="object", nullable=true,
 *         description="Errores de validación (solo 422)",
 *     ),
 * )
 *
 * @OA\Schema(
 *     schema="AdminSettings",
 *     @OA\Property(property="registration_enabled", type="boolean"),
 *     @OA\Property(property="allowed_domains", type="string", nullable=true, example="farutech.com,gmail.com"),
 *     @OA\Property(property="require_email_confirmation", type="boolean"),
 *     @OA\Property(property="session_ttl_hours", type="integer", example=24),
 *     @OA\Property(property="max_login_attempts", type="integer", example=5),
 * )
 *
 * @OA\Schema(
 *     schema="PaginationMeta",
 *     @OA\Property(property="current_page", type="integer", example=1),
 *     @OA\Property(property="last_page", type="integer", example=1),
 *     @OA\Property(property="per_page", type="integer", example=9),
 *     @OA\Property(property="total", type="integer", example=3),
 * )
 *
 * @OA\Schema(
 *     schema="BlogPostPublic",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="slug", type="string"),
 *     @OA\Property(property="excerpt", type="string", nullable=true),
 *     @OA\Property(property="featured_image", type="string", nullable=true),
 *     @OA\Property(property="published_at", type="string", nullable=true),
 *     @OA\Property(property="reading_time_minutes", type="integer", nullable=true),
 *     @OA\Property(property="views_count", type="integer"),
 *     @OA\Property(property="is_featured", type="boolean"),
 *     @OA\Property(property="category", type="object", nullable=true,
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *         @OA\Property(property="slug", type="string"),
 *     ),
 *     @OA\Property(property="author", type="object", nullable=true,
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *     ),
 *     @OA\Property(property="tags", type="array", @OA\Items(type="object")),
 * )
 *
 * @OA\Schema(schema="BlogPostFull",
 *     allOf={@OA\Schema(ref="#/components/schemas/BlogPostPublic")},
 * )
 *
 * @OA\Schema(
 *     schema="BlogPostAdmin",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="slug", type="string"),
 *     @OA\Property(property="status", type="string", enum={"draft","scheduled","published","archived"}),
 *     @OA\Property(property="is_featured", type="boolean"),
 *     @OA\Property(property="category", type="object", nullable=true),
 *     @OA\Property(property="author", type="object", nullable=true),
 *     @OA\Property(property="scheduled_for", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string"),
 * )
 *
 * @OA\Schema(
 *     schema="Lead",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string", nullable=true),
 *     @OA\Property(property="phone", type="string", nullable=true),
 *     @OA\Property(property="company", type="string", nullable=true),
 *     @OA\Property(property="status", type="string"),
 *     @OA\Property(property="priority", type="string"),
 *     @OA\Property(property="source", type="string", nullable=true),
 *     @OA\Property(property="conversion_value", type="string", nullable=true),
 *     @OA\Property(property="created_at", type="string"),
 *     @OA\Property(property="service", type="object", nullable=true),
 *     @OA\Property(property="location", type="object", nullable=true),
 *     @OA\Property(property="user", type="object", nullable=true),
 * )
 *
 * @OA\Schema(
 *     schema="LeadStatRow",
 *     @OA\Property(property="status", type="string"),
 *     @OA\Property(property="priority", type="string"),
 *     @OA\Property(property="total", type="integer"),
 *     @OA\Property(property="recent", type="integer"),
 * )
 *
 * @OA\RequestBody(
 *     request="BlogPostPayload",
 *     required=true,
 *     description="Los campos slug/tags/seo_meta son opcionales; status controla draft|scheduled|published.",
 *     @OA\JsonContent(
 *         required={"title","content","status"},
 *         @OA\Property(property="title", type="string", maxLength=255),
 *         @OA\Property(property="slug", type="string", nullable=true),
 *         @OA\Property(property="excerpt", type="string", maxLength=500, nullable=true),
 *         @OA\Property(property="content", type="string"),
 *         @OA\Property(property="category_id", type="integer", nullable=true),
 *         @OA\Property(property="featured_image", type="string", nullable=true),
 *         @OA\Property(property="status", type="string", enum={"draft","scheduled","published","archived"}),
 *         @OA\Property(property="published_at", type="string", format="date-time", nullable=true),
 *         @OA\Property(property="scheduled_for", type="string", format="date-time", nullable=true),
 *         @OA\Property(property="tags", type="array", @OA\Items(type="string")),
 *         @OA\Property(property="seo_meta", type="object", nullable=true),
 *         @OA\Property(property="is_featured", type="boolean"),
 *         @OA\Property(property="allow_comments", type="boolean"),
 *         @OA\Property(property="reading_time_minutes", type="integer", nullable=true),
 *     ),
 * )
 */
abstract class Controller extends BaseController
{
    //
}
