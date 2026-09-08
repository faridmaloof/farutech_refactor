<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Auto-registro público controlado por admin_settings:
 *  - registration_enabled = false → 403
 *  - allowed_domains (CSV)        → el dominio del correo debe estar en la lista
 *  - require_email_confirmation   → la cuenta nace sin verificar + token
 */
class RegisterController extends Controller
{
    /**
     * Registro público de usuario.
     *
     * @OA\Post(
     *     path="/register",
     *     summary="Registro público",
     *     tags={"Auth"},
     *
     *     @OA\RequestBody(required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", maxLength=120),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", format="password", minLength=8),
     *         ),
     *     ),
     *
     *     @OA\Response(response=201, description="Cuenta creada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="requires_confirmation", type="boolean"),
     *             @OA\Property(property="confirmation_url_dev", type="string", nullable=true,
     *                 description="Solo dev cuando requires_confirmation=true"),
     *         ),
     *     ),
     *     @OA\Response(response=403, description="Registro deshabilitado o dominio no permitido",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Validación fallida / email duplicado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function register(Request $request)
    {
        $settings = AdminSetting::current();

        if (! $settings->registration_enabled) {
            return response()->json([
                'message' => 'El registro de nuevos usuarios está deshabilitado.',
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $email = strtolower($request->input('email'));
        $domain = substr(strrchr($email, '@'), 1);
        $allowed = $settings->allowedDomains();

        if ($allowed !== [] && ! in_array($domain, $allowed, true)) {
            return response()->json([
                'message' => 'El dominio del correo no está permitido para registrarse.',
            ], 403);
        }

        $needsConfirmation = $settings->require_email_confirmation;

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->input('password')),
            'role' => 'viewer',
            'is_active' => true,
            'email_verified_at' => $needsConfirmation ? null : now(),
            'confirmation_token' => $needsConfirmation ? bin2hex(random_bytes(32)) : null,
        ]);

        if ($needsConfirmation) {
            $user->notify(new \App\Notifications\RegistrationConfirmationNotification($user->confirmation_token));
            
            $response = [
                'message' => 'Cuenta creada. Requiere confirmación por correo.',
                'requires_confirmation' => true,
            ];
            
            if (!app()->environment('production')) {
                $response['confirmation_url_dev'] = url('/api/register/confirm?token='.$user->confirmation_token);
            }

            return response()->json($response, 201);
        }

        return response()->json([
            'message' => 'Cuenta creada correctamente.',
            'requires_confirmation' => false,
        ], 201);
    }

    /**
     * Confirmación de correo mediante token.
     *
     * @OA\Get(
     *     path="/register/confirm",
     *     summary="Confirmar correo",
     *     tags={"Auth"},
     *
     *     @OA\Parameter(name="token", in="query", required=true, @OA\Schema(type="string", maxLength=64)),
     *
     *     @OA\Response(response=200, description="Correo confirmado",
     *         @OA\JsonContent(@OA\Property(property="message", type="string"))),
     *     @OA\Response(response=404, description="Token inválido o usado",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     *     @OA\Response(response=422, description="Parámetros inválidos",
     *         @OA\JsonContent(ref="#/components/schemas/ErrorResponse")),
     * )
     */
    public function confirm(Request $request)
    {
        $request->validate([
            'token' => 'required|string|size:64',
        ]);

        $user = User::where('confirmation_token', $request->input('token'))->first();

        if (! $user) {
            return response()->json(['message' => 'Token inválido o ya utilizado'], 404);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'confirmation_token' => null,
        ])->save();

        return response()->json(['message' => 'Correo confirmado. Ya puedes iniciar sesión.']);
    }
}
