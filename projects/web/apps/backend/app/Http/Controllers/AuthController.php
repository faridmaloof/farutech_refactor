<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AuthController extends Controller
{
    /**
     * Login de administrador.
     *
     * Valida credenciales contra la tabla `users` (role=admin), bloquea cuentas
     * con confirmación de correo pendiente según admin_settings, y emite un
     * token stateless firmado con HMAC-SHA256 usando APP_KEY.
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
     *     @OA\Response(response=403, description="No es admin / confirmación pendiente",
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

        $user = User::where('email', $request->input('email'))->first();

        if (! $user || ! $user->is_active
            || ! password_verify($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Acceso restringido a administradores'], 403);
        }

        if (AdminSetting::current()->require_email_confirmation
            && is_null($user->email_verified_at)) {
            return response()->json([
                'message' => 'Debes confirmar tu correo antes de iniciar sesión.',
            ], 403);
        }

        $user->forceFill(['last_login_at' => Carbon::now()])->save();

        return response()->json([
            'token' => $this->issueToken($user),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    private function issueToken(User $user): string
    {
        // base64url(JSON payload) . '.' . HMAC-SHA256(payload, APP_KEY)
        $ttl = (int) AdminSetting::current()->session_ttl_hours;

        $payload = rtrim(strtr(base64_encode(json_encode([
            'sub' => $user->id,
            'email' => $user->email,
            'exp' => Carbon::now()->timestamp + $ttl * 3600,
        ])), '+/', '-_'), '=');

        return $payload.'.'.hash_hmac('sha256', $payload, (string) env('APP_KEY'));
    }
}

