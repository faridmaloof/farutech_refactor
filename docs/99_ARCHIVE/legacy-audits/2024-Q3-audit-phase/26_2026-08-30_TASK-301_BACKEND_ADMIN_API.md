# 26 — TASK-301 (FASE BACKEND): API del panel admin protegida

**Fecha:** 2026-08-30 · **Repo:** `Farutech/backend` · **Commit:** `25b156b` (merge a `main`, branch `task/301-admin-api` en remoto)

---

## WHAT

Se implementó la **capa de API que el panel admin (TASK-301) consume**, adelantando la parte de backend para desbloquear el frontend:

- **`AdminAuthMiddleware`** — autenticación stateless: `Authorization: Bearer base64url(payload).HMAC-SHA256(payload, APP_KEY)`. Verifica firma (`hash_equals`, timing-safe), expiración, `is_active` y `role === 'admin'`. Inyecta el usuario en la request sin sesión.
- **Rutas protegidas** (grupo `admin` + middleware `auth.admin`):
  - `GET /admin/contacts`, `PATCH /admin/contacts/{id}` (listar / marcar leído)
  - `GET /admin/newsletter/subscribers`
  - `GET|POST /admin/blog`, `PUT|DELETE /admin/blog/{id}` (CRUD completo del blog, métodos que ya existían en `BlogController`)
  - `GET|PUT /admin/settings`
- **Login** ya existente (`POST /admin/login`, `AuthController`) emite el token; sin modo demo.

## WHY

`docs/09` TASK-301 requiere panel admin con gestión de leads/newsletter/blog/settings. El frontend (`Farutech/admin`) no tiene contra qué consumir sin esta API. Adelantar el backend permite construir el panel contra una API real y probada.

## WHERE / RISK / ROLLBACK

- **WHERE:** `app/Http/Middleware/AdminAuthMiddleware.php` (nuevo), `ContactController` (+`index`/`markRead`), `NewsletterController` (+`index`), `routes/api.php` (grupo admin), `bootstrap/app.php` (routeMiddleware), `tests/Feature/AdminApiTest.php` (nuevo), `.gitignore` (+`/storage` runtime).
- **RISK:** token stateless sin revocación (mitigado por TTL corto del `exp`; revocación = rotación de `APP_KEY`). Endpoints admin ahora existen — la doc OpenAPI los incluye, correcto (a diferencia del caso TASK-103 donde estaban huérfanos).
- **ROLLBACK:** `git revert 25b156b` en `main`; las rutas públicas no se tocan.

## SECURITY REVIEW

- Sin credenciales en código (sweep limpio; las 2 coincidencias de grep son las aserciones anti-regresión del test de TASK-001 que verifican ausencia).
- Firma HMAC-SHA256 sobre `APP_KEY`; comparación timing-safe; 401 sin/inválido/expirado, 403 no-admin. Sin almacenamiento de token del lado servidor.

## TESTING / EVIDENCE (real, reproducible)

1. **PHPUnit (docker `composer:2`, PHP 8.5.9, SQLite `:memory:`): 20/20 OK, 93 assertions** — incluye `AdminApiTest` (401 sin token, 401 token inválido, 200 admin válido con token HMAC emitido en test) y TODA la suite previa en verde (Contact 5, Newsletter 3, ApiDocs 4, Seeder 3, Blog, etc.).
2. **Bug encontrado y corregido durante el ciclo:** parse error en `ContactController.php:182` (método `store()` sin cerrar tras insertar `index()`) — causaba 500 en toda la suite; `php -l` lo detectó, corregido, suite completa en verde. Evidencia de que el fallo era transitorio del WIP, no de diseño.
3. **E2E sobre servidor HTTP real** (contenedor `php -S`, SQLite migrado + seed + `admin:create` con `ADMIN_PASSWORD` por env — sin default):
   - `POST /admin/login` con credenciales → `200` + token (137 chars)
   - `GET /admin/contacts` sin token → **401** · token inválido → **401**
   - Con token: `/admin/contacts` → **200** (JSON paginado) · `/admin/blog` → **200** · `/admin/settings` → **200**
   - `POST /admin/blog` con token → **201** (post creado, respuesta con author/category/seo_meta)

## VALIDATION del riesgo CRITICAL asociado

El riesgo relevante (exposición de datos de contacto/leads sin auth — clase R-09) queda cerrado con evidencia dual: tests automatizados (401/403) y verificación HTTP real contra servidor levantado desde cero.

## NEXT

Fase frontend de TASK-301: construir `Farutech/admin` (React) consumiendo esta API con `@farutech/design-system` (auth-screens incluidas: LoginScreen ya existe en el paquete).
