# FARUTECH — TASK-103: Documentación de API con Scalar (REQ-BE-02)

**Fecha:** 2026-08-28 · **Repo:** `Farutech/backend` · **Estado:** DONE
**Fuente:** `docs/09` TASK-103 · **Dependencias:** TASK-102 (DONE)

## 1. WHAT
Exponer documentación viva de la API:
- `GET /docs` → HTML standalone de **Scalar** (vía CDN `@scalar/api-reference`), apuntando al JSON.
- `GET /docs/openapi.json` → spec **OpenAPI 3.0** generada en runtime con `zircote/swagger-php` escaneando las anotaciones `@OA\*` ya existentes en los controllers (no se reescribió documentación, se reutilizó la heredada de l5-swagger).

## 2. WHY
- REQ-BE-02 y TASK-103 exigen documentación de API utilizable por frontend/admin/QA sin leer código.
- Docs por anotaciones = una sola fuente de verdad: el código ES la doc; no puede divergir.

## 3. WHERE
| Archivo | Cambio |
|---|---|
| `composer.json` / `composer.lock` | + `zircote/swagger-php:^5.0` (5.8.3), + `doctrine/annotations:^2.0` |
| `config/docs.php` (nuevo) | `allowed_envs` (default `local,development,dev,qa,testing`), `staging_opt_in` (`DOCS_ENABLED`, default false) |
| `bootstrap/app.php` | `$app->configure('docs')` |
| `app/Http/Controllers/ApiDocsController.php` (nuevo) | HTML + JSON + gate por ambiente |
| `routes/api.php` | 2 rutas GET (`docs`, `docs/openapi.json`) |
| `tests/Feature/ApiDocsTest.php` (nuevo) | 4 tests de TESTING+SECURITY |
| `tests/compat/TestResponse.php` | `baseResponse(): Response\|JsonResponse` (corrección de tipo) |
| `app/Http/Controllers/BlogController.php` / `SettingsController.php` | anotaciones `@OA` de endpoints admin no ruteados → comentarios que apuntan a TASK-301 |
| `.env.example` | `DOCS_ENABLED=false` documentado |

## 4. CONFLICTING (declarado y resuelto)
1. **swagger-php 5.x no parsea docblocks sin doctrine/annotations.** `docs/09` no lo contemplaba (la doc se escribió en la era l5-swagger). Diagnóstico real: `Generator::scan()` devolvía spec vacío (`paths: []`, `info: null`) hasta instalar `doctrine/annotations`. Nota: doctrine/annotations está **abandoned** (sin reemplazo sugerido por composer) — es la vía soportada por swagger-php para docblocks; riesgo bajo, documentado en docs/10 de este repo (ver RIESGO).
2. **Spec mentía sobre la API real:** el escaneo inicial incluía `/admin/blog`, `/admin/settings` que **no existen** como rutas desde TASK-102 (regresan en TASK-301). Decisión: la doc pública debe reflejar la API REAL → se retiraron esas anotaciones (métodos PHP intactos). `/admin/login` SÍ existe y se documenta.
3. **PHP 8.5 deprecation warnings** en swagger-php 4.x (`SplObjectStorage`) → resuelto de raíz migrando a 5.8.3.
4. **API de serialización cambió en 5.x:** `toArr()` no existe → `toJson($flags)` / `jsonSerialize()`.

## 5. RISK
- **R-DOCS-EXPOSURE (nuevo, cubierto):** exponer `/docs` en producción filtraría superficie de ataque. Cerrado con gate en el controller (mismo camino para HTML y JSON — no se puede bloquear uno y dejar el otro) + tests de producción 404.
- **doctrine/annotations abandoned:** riesgo de mantenimiento futuro. Mitigación: migrar a PHP attributes cuando swagger-php lo exija (el escaneo ya soporta ambas formas).

## 6. TEST / VALIDATION (evidencia real)
- **PHPUnit (docker `composer:2`, PHP 8.5.9, SQLite `:memory:`):** `OK (17 tests, 88 assertions)` — incluye los 4 nuevos:
  - HTML visible en `local` con `id="api-reference"` y `data-url="/docs/openapi.json"`.
  - JSON en `qa`: `openapi: 3.0.0`, `info.title = FaruTech API`, y presencia de `/blog/posts`, `/blog/categories`, `/contact`, `/newsletter`, `/admin/login`.
  - `staging`: 404 con opt-in apagado; 200 en ambas rutas con `DOCS_ENABLED=true`.
  - `production`: 404 en HTML **y** JSON, sin contenido scalar/openapi.
- **Generación real del spec verificada fuera del test** (diagnóstico en contenedor): 10 paths, server resuelto vía `L5_SWAGGER_CONST_HOST`, schemas `ErrorResponse, AdminSettings, PaginationMeta, BlogPostPublic, BlogPostFull, BlogPostAdmin, Lead, LeadStatRow`.
- **Regression:** los 13 tests previos (TASK-102) siguen en verde.

## 7. SECURITY REVIEW
- Gate por ambiente verificado por test automatizado (no manual).
- Cero credenciales nuevas (sweep `Admin@|Editor@|Viewer@` → solo assertions negativas de TASK-001).
- `.env.example` solo con `DOCS_ENABLED=false` (sin secretos).

## 8. ROLLBACK
`git revert b9bb4f8` en `Farutech/backend` (o eliminar las 2 rutas + controller + config/docs.php). Sin efectos sobre datos ni infraestructura.

## 9. EVIDENCE
- Commit de tarea: `task/103-api-docs` @ `4001359` (push a origin verificado).
- Merge a `main` @ `b9bb4f8` (push verificado: `origin/main` apunta al merge).
- Salida completa de PHPUnit en sección 6.

## 10. NOTAS PARA TASKS FUTURAS
- **TASK-301:** al enrutar los endpoints admin, re-agregar las anotaciones `@OA` (los comentarios en el código lo recuerdan) y sumar los tests de doc correspondientes.
- **TASK-401/403 (K3s):** definir `DOCS_ENABLED` en el ConfigMap/Secret de staging explícitamente (default apagado).
