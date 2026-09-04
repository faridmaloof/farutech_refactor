# TASK-203 — Auth screens reutilizables + validación backend end-to-end

**Fecha:** 2026-08-28
**Estado:** DONE
**Relacionado:** REQ-DS-03 (pantallas auth) · REQ-BE-04 (auth backend) · desbloquea TASK-301

---

## WHAT

Se migraron las pantallas de autenticación del `dashboard` al paquete `@farutech/design-system`
como `src/auth-screens/` con **API configurable por props** (sin hardcode de endpoint ni
mecanismo de almacenamiento de token fijo), y se validó el backend Lumen con los endpoints
reales de auth.

## WHY

`docs/08` exige pantallas de auth reutilizables (Login/Register/ForgotPassword) que cada app
consumidora (`website`, `admin`, `intranet`) conecte a su propio backend sin fork del paquete.
`docs/09` TASK-203 pide validar que el backend real soporta el flujo.

## WHERE

- `Farutech/design-system` → `src/auth-screens/` (LoginScreen, RegisterScreen, ForgotPasswordScreen, index, auth.css)
- `Farutech/design-system` → `src/auth-screens/__tests__/` (6 tests)
- `Farutech/backend` → validación HTTP real (front controller Lumen, `config/auth`), fixes en `app/Http/Controllers/AuthController.php`

## EVIDENCIA (test automatizado + curl real)

### Frontend — vitest
```
Test Files  6 passed (6)
     Tests  25 passed (25)
```
Incluye los 6 tests de auth-screens (login/register/forgot) + regresión del catálogo.

### Backend — validación end-to-end (curl real contra contenedor)
```
POST /admin/login  (credenciales válidas)  → 200/201 + access_token (JWT claims verificados)
POST /admin/login  (credenciales falsas)   → 401
POST /register     (modo abierto)          → 201 usuario creado
GET  /settings/public                     → 200 con flags reales
GET  /blog/posts                          → 200 con posts publicados reales
```

### Seguridad
- Las auth-screens **no asumen storage** de token (localStorage/cookie lo decide la app consumidora).
- El backend valida credenciales con bcrypt (hash), no texto plano.
- Sweep: cero credenciales hardcodeadas en backend.

## VALIDATION / ROLLBACK

- Validación: tests vitest verdes + curl real contra el backend en contenedor.
- Rollback: los commits quedan en `main` de cada repo con la rama previa conservada
  (`task/202-publish-npmjs` @ `8b491ff` en design-system; `b9bb4f8` previo en backend).

## ESTADO FINAL

DONE. Commits: `Farutech/design-system@c7260ec` · `Farutech/backend@9e5e1ac`.