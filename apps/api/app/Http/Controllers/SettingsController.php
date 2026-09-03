<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/settings",
     *     summary="Configuración global del panel",
     *     tags={"Settings"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Política completa",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", ref="#/components/schemas/AdminSettings"),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function show()
    {
        return response()->json(['data' => $this->settings()]);
    }

    /**
     * @OA\Put(
     *     path="/admin/settings",
     *     summary="Actualizar configuración del panel",
     *     tags={"Settings"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             required={"registration_enabled","require_email_confirmation","session_ttl_hours","max_login_attempts"},
     *             @OA\Property(property="registration_enabled", type="boolean"),
     *             @OA\Property(property="allowed_domains", type="string", nullable=true, example="farutech.com"),
     *             @OA\Property(property="require_email_confirmation", type="boolean"),
     *             @OA\Property(property="session_ttl_hours", type="integer", minimum=1, maximum=168),
     *             @OA\Property(property="max_login_attempts", type="integer", minimum=3, maximum=20),
     *         ),
     *     ),
     *
     *     @OA\Response(response=200, description="Actualizada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", ref="#/components/schemas/AdminSettings"),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Validación fallida",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'registration_enabled' => 'required|boolean',
            'allowed_domains' => 'nullable|string|max:500',
            'require_email_confirmation' => 'required|boolean',
            'session_ttl_hours' => 'required|integer|min:1|max:168',
            'max_login_attempts' => 'required|integer|min:3|max:20',
        ]);

        $settings = AdminSetting::current();
        $settings->fill($data)->save();
        AdminSetting::flushCache();

        return response()->json([
            'message' => 'Configuración actualizada',
            'data' => $this->settings(),
        ]);
    }

    /**
     * @OA\Get(
     *     path="/settings/public",
     *     summary="Flags públicos de política para el frontend",
     *     tags={"Settings"},
     *
     *     @OA\Response(response=200, description="Flags seguros sin auth",
     *         @OA\JsonContent(
     *             @OA\Property(property="registration_enabled", type="boolean", example=false),
     *             @OA\Property(property="require_email_confirmation", type="boolean", example=true),
     *         ),
     *     ),
     * )
     */
    public function publicPolicy()
    {
        $s = AdminSetting::current();

        return response()->json([
            'registration_enabled' => (bool) $s->registration_enabled,
            'require_email_confirmation' => (bool) $s->require_email_confirmation,
        ]);
    }

    private function settings(): array
    {
        $s = AdminSetting::current();

        return [
            'registration_enabled' => (bool) $s->registration_enabled,
            'allowed_domains' => $s->allowed_domains,
            'require_email_confirmation' => (bool) $s->require_email_confirmation,
            'session_ttl_hours' => (int) $s->session_ttl_hours,
            'max_login_attempts' => (int) $s->max_login_attempts,
        ];
    }
}
