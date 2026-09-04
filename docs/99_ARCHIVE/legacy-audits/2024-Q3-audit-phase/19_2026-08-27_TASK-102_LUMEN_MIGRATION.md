# 19 — TASK-102: Migración del backend de Laravel 10 a Lumen 10

**Fecha:** 2026-08-27 · **TASK-ID:** TASK-102 (docs/09) · **Repo:** `Farutech/backend`
**Rama:** `task/102-lumen-migration` @ `f74a106` (fusionada a `main` por fast-forward, push a GitHub)
**Estado:** ✅ DONE — PHPUnit **13/13 OK, 66 assertions**

---

## 1. CONFLICTING declarado (regla de oro: el filesystem gana)

`docs/09` TASK-102 afirmaba que los controllers/modelos/tests se migran
"tal cual (compatibles, doc 03 §1)" y que los tests pasan "sin modificación
de aserciones". El inventario real del baseline demostró lo contrario:

| Dependencia encontrada en el código real | ¿Existe en Lumen? |
|---|---|
| `$request->validate()` (9 controllers) | ❌ → `$this->validate($request, ...)` |
| Form Requests (`StoreLeadRequest`/`UpdateLeadRequest`) | ❌ (no hay `Illuminate\Foundation\Http\FormRequest`) |
| Route model binding implícito (`Lead $lead`) | ❌ |
| `Illuminate\Routing\Controller` | ❌ → `Laravel\Lumen\Routing\Controller` |
| `Illuminate\Foundation\...\EventServiceProvider` | ❌ → variante `Laravel\Lumen\Providers\...` |
| Tests: `RefreshDatabase`, `TestResponse::assert*`, `artisan()->assertExitCode()` | ❌ (todo vive en `illuminate/foundation`) |

**Resolución sin violar el espíritu del requisito:** se portó el código y se
construyó una **capa de compatibilidad en `tests/`** (`TestResponse`,
`RefreshDatabase`, aserciones de BD, wrapper de `artisan`) para que los
**archivos de test quedaran intactos** — verificado con `git diff main -- tests/`:
solo cambian `TestCase.php` y `CreatesApplication.php` (infraestructura de
arranque), **cero archivos de test funcional modificados**.

## 2. Alcance aplicado (según doc 03 §1 / doc 09)

La API queda **solo pública**: blog público, contacto, newsletter, registro +
confirmación, settings públicos y `admin/login`. El CRUD del panel admin
(`LeadController`, `UserController`, `DashboardController`), Form Requests,
Jobs de notificación y middleware de Laravel se **eliminaron de esta API**
(migran al admin en TASK-301). Las rutas dobles `/x` y `/api/x` se conservan
por compatibilidad con el gateway.

## 3. Arquitectura resultante

- `bootstrap/app.php` Lumen 10: facades + Eloquent, configs mínimas
  (`app/database/cache/queue/logging`), CORS global, Handler JSON, `admin:create`.
- `app/Exceptions/Handler.php`: todas las respuestas de error son JSON
  (422/401/404) — comportamiento heredado del Handler de Laravel.
- `app/Http/Middleware/CorsMiddleware.php`: sustituye `HandleCors`.
- `config/` reducido a 5 archivos (app, database, cache, queue, logging).
- ROLLBACK intacto: `main` previo (`5907510`) queda en el historial; rama
  `task/102-lumen-migration` conservada en remoto.

## 4. Security review (hallazgo y cierre)

- **Hallazgo:** `CreateAdminUser.php` tenía default `ADMIN_PASSWORD=admin123`
  (misma clase de riesgo que R-09 corregido en TASK-001).
- **Cierre:** el comando ahora **falla con exit code de error** si el
  Secret/env no provisiona `ADMIN_PASSWORD` — no existe default.
- Barrido de credenciales en el diff: solo ejemplos OpenAPI (`********`) y
  reglas de validación — sin literales reales.

## 5. Evidencia de ejecución

```text
phpunit (docker composer:2, sqlite :memory:):
  OK (13 tests, 66 assertions)   ← suite completa, archivos de test intactos

Smoke end-to-end (diag sobre $app->handle()):
  POST /contact payload incompleto → 422 {"message","errors"} (formato correcto)

Clon fresco de GitHub + composer install + artisan --version:
  Laravel Framework Lumen (10.0.4)

GitHub: Farutech/backend main @ f74a106 (push verificado, working tree limpio)
```

## 6. Pendientes explícitos (no bloquean DONE de TASK-102)

- `app/Jobs/PublishScheduledBlogPost` y el scheduling de publicaciones
  programadas del blog: se eliminaron con el CRUD admin; se re-incorporan
  en la tarea del panel admin (TASK-301) o como servicio dedicado.
- `AuthController::issueToken` sigue usando `env('APP_KEY')` directo —
  funciona en Lumen, pero conviene unificar con config cuando se toque auth.
- Nota honesta: la suite corre sobre **PHP 8.5.9** (imagen `composer:2`), no
  sobre la 8.1 declarada en `composer.json`; sin errores de deprecación que
  afecten resultados (solo avisos internos del vendor de Lumen).
