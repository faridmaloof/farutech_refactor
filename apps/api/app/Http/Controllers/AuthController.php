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
}
