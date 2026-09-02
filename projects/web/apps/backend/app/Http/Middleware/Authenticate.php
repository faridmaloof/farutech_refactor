<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\JsonResponse;

/**
 * Valida el token stateless emitido por AuthController@login:
 *   Authorization: Bearer <base64url-payload>.<hmac-sha256>
 * La firma se recalcula con APP_KEY y se comprueba expiración (24 h).
 */
class Authenticate
{
    public function handle($request, Closure $next, $guard = null)
    {
        $header = $request->header('Authorization', '');

        if (! preg_match('/^Bearer\s+(\S+)$/i', $header, $matches)) {
            return $this->unauthorized();
        }

        [$payload, $signature] = array_pad(explode('.', $matches[1], 2), 2, null);

        if ($payload === null || $signature === null
            || ! hash_equals(hash_hmac('sha256', $payload, (string) env('APP_KEY')), $signature)) {
            return $this->unauthorized();
        }

        $data = json_decode(base64_decode(strtr($payload, '-_', '+/')) ?: '', true);
        $user = is_array($data) ? User::find($data['sub'] ?? null) : null;

        if (! $user || ! $user->is_active || (int) ($data['exp'] ?? 0) < time()) {
            return $this->unauthorized();
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }

    private function unauthorized(): JsonResponse
    {
        return response()->json(['message' => 'No autenticado.'], 401);
    }
}

