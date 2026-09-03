<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Gestión de usuarios desde /admin. La creación está condicionada por
 * admin_settings.registration_enabled (doble control junto al auto-registro).
 */
class UserController extends Controller
{
    /**
     * @OA\Get(
     *     path="/admin/users",
     *     summary="Listar usuarios del panel",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Colección de usuarios",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="name", type="string"),
     *                     @OA\Property(property="email", type="string", format="email"),
     *                     @OA\Property(property="role", type="string", enum={"admin","editor","viewer"}),
     *                     @OA\Property(property="is_active", type="boolean"),
     *                     @OA\Property(property="email_verified_at", type="string", nullable=true),
     *                     @OA\Property(property="last_login_at", type="string", nullable=true),
     *                 ),
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function index()
    {
        return response()->json([
            'data' => User::query()
                ->orderBy('id')
                ->get(['id', 'name', 'email', 'role', 'is_active', 'email_verified_at', 'last_login_at']),
        ]);
    }

    /**
     * @OA\Post(
     *     path="/admin/users",
     *     summary="Crear usuario (requiere registration_enabled=true)",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","role"},
     *             @OA\Property(property="name", type="string", maxLength=120),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password", minLength=8),
     *             @OA\Property(property="role", type="string", enum={"admin","editor","viewer"}),
     *         ),
     *     ),
     *
     *     @OA\Response(response=201, description="Usuario creado",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="role", type="string"),
     *                 @OA\Property(property="is_active", type="boolean"),
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=403, description="Creación deshabilitada en Configuración",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Validación fallida / email duplicado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function store(Request $request)
    {
        if (! AdminSetting::current()->registration_enabled) {
            return response()->json([
                'message' => 'Creación de usuarios deshabilitada en Configuración.',
            ], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,editor,viewer',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
            'role' => $data['role'],
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Usuario creado',
            'data' => $user->only(['id', 'name', 'email', 'role', 'is_active']),
        ], 201);
    }

    /**
     * @OA\Patch(
     *     path="/admin/users/{id}/status",
     *     summary="Activar/desactivar un usuario",
     *     tags={"Users"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Estado alternado",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="is_active", type="boolean"),
     *             ),
     *         ),
     *     ),
     *     @OA\Response(response=422, description="Intento sobre la propia cuenta",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function toggleStatus(Request $request, User $user)
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'No puedes desactivar tu propia cuenta'], 422);
        }

        $user->forceFill(['is_active' => ! $user->is_active])->save();

        return response()->json(['data' => $user->only(['id', 'is_active'])]);
    }
}
