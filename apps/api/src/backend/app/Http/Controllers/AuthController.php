<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Login de administrador.
     *
     * Valida credenciales contra la tabla `users` (role=admin), bloquea cuentas
     * con confirmación de correo pendiente según admin_settings, y emite un
     * token usando Laravel Sanctum.
     *
     * @OA\Post(
     *     path="/admin/login",
     *     summary="Login del panel admin",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="admin@farutech.com"),
     *             @OA\Property(property="password", type="string", format="password", example="Admin@123456"),
     *         ),
     *     ),
     *
     *     @OA\Response(response=200, description="Token emitido",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="user", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Administrador Principal"),
     *                 @OA\Property(property="email", type="string", format="email"),
     *                 @OA\Property(property="role", type="string", enum={"admin","editor","viewer"}),
     *             ),
     *         ),
     *     ),
     *
     *     @OA\Response(response=401, description="Credenciales inválidas",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=403, description="No es admin / confirmación pendiente / Demasiados intentos",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Validación fallida",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $settings = AdminSetting::current();
        $maxAttempts = (int) $settings->max_login_attempts;
        
        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
            return response()->json([
                'message' => 'Demasiados intentos fallidos. Por favor intente más tarde.'
            ], 429);
        }

        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! $user->is_active || ! Hash::check($request->input('password'), $user->password)) {
            RateLimiter::hit($throttleKey, 60 * 5); // 5 minutes decay
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Acceso restringido a administradores'], 403);
        }

        if ($settings->require_email_confirmation && is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Debes confirmar tu correo antes de iniciar sesión.',
            ], 403);
        }

        RateLimiter::clear($throttleKey);

        $user->forceFill(['last_login_at' => Carbon::now()])->save();
        
        // Sanctum cleanup for old tokens if needed
        $user->tokens()->delete();

        // Issue Sanctum Token
        $tokenName = 'admin-token-' . Str::random(8);
        $ttl = (int) $settings->session_ttl_hours;
        
        $token = $user->createToken(
            $tokenName, 
            ['*'], 
            Carbon::now()->addHours($ttl)
                )->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Logout: revoca el token de acceso actual del usuario autenticado.
     *
     * @OA\Post(
     *     path="/logout",
     *     summary="Cerrar sesión (revoca el token actual)",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Sesión cerrada",
     *         @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * Devuelve el usuario autenticado en la sesión actual.
     *
     * @OA\Get(
     *     path="/user",
     *     summary="Usuario autenticado",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Response(response=200, description="Datos del usuario",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="name", type="string"),
     *                 @OA\Property(property="email", type="string"),
     *                 @OA\Property(property="role", type="string", enum={"admin","editor","viewer"})),
     *         ),
     *     ),
     *     @OA\Response(response=401, description="No autenticado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_active' => (bool) $user->is_active,
            ],
        ]);
    }

    /**
     * Crea un nuevo token de acceso (impersonalización / tokens de servicio).
     *
     * @OA\Post(
     *     path="/tokens",
     *     summary="Crear token de acceso",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", example="mi-app"),
     *             @OA\Property(property="abilities", type="array", @OA\Items(type="string"), example={"*"}),
     *             @OA\Property(property="expires_in_hours", type="integer", example=24),
     *         ),
     *     ),
     *
     *     @OA\Response(response=200, description="Token creado",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="plain_text_token_id", type="integer"),
     *             @OA\Property(property="abilities", type="array", @OA\Items(type="string")),
     *         ),
     *     ),
     *     @OA\Response(response=422, description="Validación fallida",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function createToken(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:120',
            'abilities' => 'array',
            'abilities.*' => 'string',
            'expires_in_hours' => 'nullable|integer|min:1|max:168',
        ]);

        $user = $request->user();
        $abilities = $data['abilities'] ?? ['*'];
        $expiresAt = isset($data['expires_in_hours'])
            ? Carbon::now()->addHours((int) $data['expires_in_hours'])
            : null;

        $token = $user->createToken($data['name'], $abilities, $expiresAt);

        return response()->json([
            'token' => $token->plainTextToken,
            'plain_text_token_id' => $token->accessToken->id,
            'abilities' => $token->accessToken->abilities,
        ]);
    }

    /**
     * Revoca un token de acceso por su id (propiedad del usuario autenticado).
     *
     * @OA\Delete(
     *     path="/tokens/{id}",
     *     summary="Revocar token por id",
     *     tags={"Auth"},
     *     security={{"bearerAuth":{}}},
     *
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *
     *     @OA\Response(response=200, description="Token revocado",
     *         @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Token no encontrado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function revokeToken(Request $request, $id)
    {
        $token = $request->user()->tokens()->findOrFail($id);
        $token->delete();

        return response()->json(['message' => 'Token revocado correctamente']);
    }
}
