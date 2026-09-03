# 🚀 Farutech Ecosystem - Guía de Implementación Real y Plan de Ejecución

## 🎯 Visión General (Estado Real Post-Auditoría 2026-09-03)

Este repositorio contiene el ecosistema completo de Farutech consolidado. Tras una auditoría exhaustiva, se ha determinado que el progreso real NO es del 100% como se indicaba anteriormente, sino de aproximadamente un 70%, con varios problemas críticos de seguridad y código roto.

- **Backend API**: Laravel 10 (Faltan archivos core, fallos de auth y seguridad)
- **Admin App**: SPA en progreso
- **Website**: Next.js/Vite en progreso
- **Design System**: @farutech/design-system (Falta build y publicación)
- **Infraestructura**: Docker Compose con PostgreSQL, Redis, Gateway (Consolidada pero con configs hardcodeados)

### ⚠️ Limitación Importante
Debe mantenerse el backend y frontend **lo más limpio posible** (código óptimo, sin archivos basura o dependencias no utilizadas como `twilio/sdk`) para evitar sobrepasar los límites de inodos.

---

## 🚀 Plan de Implementación Activo (Ejecución en Progreso)

Este plan corrige las vulnerabilidades y fallos críticos descubiertos, además de completar la integración de Sanctum.

### ESTADO DEL PROYECTO (TRACKER VIVO)

| Bloque | Descripción | Estado |
|--------|-------------|--------|
| **BLOQUE 0** | Bloqueadores Absolutos (Archivos Kernel/Handler) | ✅ Completado |
| **BLOQUE 1** | Seguridad Crítica (Passwords, Auth) | ✅ Completado |
| **BLOQUE 2** | Correcciones de Modelo y Datos | ✅ Completado |
| **BLOQUE 3** | Clases Faltantes (Notifications, Requests) | ✅ Completado |
| **BLOQUE 4** | Limpieza y Código Muerto | ✅ Completado |
| **BLOQUE 5** | Features Pendientes | ✅ Completado |
| **BLOQUE 6** | Tests y Validación | ✅ Completado |

---

### DETALLE DE TAREAS Y EJECUCIÓN

#### BLOQUE 0 — BLOQUEADORES ABSOLUTOS (sin estos, nada arranca)
- [x] B0-01: Crear `app/Http/Kernel.php` (El núcleo HTTP de Laravel)
- [x] B0-02: Crear `app/Exceptions/Handler.php` (Manejo de errores)
- [x] B0-03: Crear `app/Http/Middleware/` (Middlewares básicos)
- [x] B0-04: Crear Events (`BlogPostViewed`, `BlogPostPublished`)
- [x] B0-05: Crear Listeners (`TrackBlogStats`)
- [x] B0-06: Decisión Auth: Implementar **Sanctum completo** (eliminar HMAC custom, proteger rutas admin).

#### BLOQUE 1 — SEGURIDAD CRÍTICA
- [x] B1-01: SEC-01 — Eliminar password default 'admin123' en `CreateAdminUser.php`
- [x] B1-02: SEC-02 — Eliminar password hardcodeada de `redis.conf` (Prioridad en compose `REDIS_PASSWORD`)
- [x] B1-03: SEC-03 — Migrar uso de `password_hash()` a `Hash::make()` / `Hash::check()`
- [x] B1-04: SEC-04 — Configurar middleware Auth Sanctum correctamente para rutas admin
- [x] B1-05: SEC-07 — Implementar `max_login_attempts` en AuthController

#### BLOQUE 2 — CORRECCIONES DE MODELO Y DATOS
- [x] B2-01: DISC-01 — Corregir `Lead::service()` para apuntar a `Service::class` (no `ApplicationType`)
- [x] B2-02: ROTO-06/07/08 — Completar modelo `Location` (añadir scopes, relaciones `parent`/`children`, y accessors)
- [x] B2-03: ROTO-09 — Agregar constante `Lead::STATUS_NEW` o referenciar string literal en `LeadSearchService`
- [x] B2-04: ROTO-15 — En `DashboardController`: Corregir estado 'WON' a 'closed_won'
- [x] B2-05: ROTO-16 — Crear migración `lead_interactions` (la feature está planeada)

#### BLOQUE 3 — CLASES FALTANTES
- [x] B3-01: Crear `Notifications/LeadNotification.php`
- [x] B3-02: Crear `Notifications/LeadStatusUpdateNotification.php`
- [x] B3-03: Crear `Http/Requests/StoreLeadRequest.php`
- [x] B3-04: Crear `Http/Requests/UpdateLeadRequest.php`
- [x] B3-05: Corregir `SendLeadUpdateNotification.php` (implementar interface `ShouldQueue`)
- [x] B3-06: Corregir typo de namespace `Illuminate\queue\` -> `Illuminate\Queue\` en `SendLeadNotification.php`

#### BLOQUE 4 — LIMPIEZA Y CÓDIGO MUERTO (Reducción de Inodes)
- [x] B4-01: Eliminar `ExampleController.php`
- [x] B4-02: Eliminar `ExampleJob.php`
- [x] B4-03: Remover `twilio/sdk` del `composer.json` y actualizar vendor.
- [x] B4-04: Modificar `LeadSearchService`: Mantener SOLO la búsqueda local de Location + Nomiatim/OSM. **Eliminar por completo el scraping de Google**.
- [x] B4-05: Limpiar rutas duplicadas (`/api/contact`, `/api/newsletter`)
- [x] B4-06: Eliminar ruta `/admin/login` duplicada
- [x] B4-07: Limpiar variables Vite/Pusher sin uso del `.env.example` en la API
- [x] B4-08: Corregir comentarios con encoding UTF-8 roto en `BlogController.php`

#### BLOQUE 5 — FEATURES PENDIENTES
- [x] B5-01: SEC-05 — Exponer `confirmation_url_dev` SOLO si `APP_ENV` no es production.
- [x] B5-02: SEC-06 — Hacer más robusta la creación de `AdminSetting::current()` usando `firstOrFail()` si es apropiado, apoyado en el seeder.
- [x] B5-03: PF-16 — Implementar el email real de confirmación de registro.
- [x] B5-04: PF-17 — Añadir columnas de `latitude`, `longitude` a migración `locations`.
- [x] B5-05: Crear `UserFactory.php` (y otros factories si se necesitan para los tests).

#### BLOQUE 6 — TESTS Y VALIDACIÓN
- [x] B6-01: Ejecutar tests y corregir fallos resultantes de la refactorización.
- [x] B6-02: Validar la base de datos (migraciones completan sin error).
- [x] B6-03: Actualizar Documentación API (Scalar).
- [x] B6-04: Confirmar la reducción de dependencias/código inútil.

---

## 🏗️ Arquitectura del Sistema Consolidado

```
┌─────────────────────────────────────────────────────────────────┐
│                        GATEWAY (Nginx/HAProxy)                  │
│  api.farutech.local │ admin.farutech.local │ farutech.local    │
└──────────────┬──────────────────────┬─────────────────┬────────┘
               │                      │                 │
    ┌──────────▼──────────┐ ┌────────▼────────┐ ┌─────▼────────┐
    │   Backend API       │ │   Admin App     │ │   Website    │
    │   Laravel 10        │ │   React/Vite    │ │   Next.js/TS │
    │   + Scalar Docs     │ │   + Design Sys  │ │              │
    │   + Sanctum Auth    │ │                 │ │              │
    └──────────┬──────────┘ └─────────────────┘ └──────────────┘
               │
    ┌──────────▼──────────────────────────────────────────────┐
    │                   INFRAESTRUCTURA                        │
    │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
    │  │  PostgreSQL  │  │    Redis     │  │  MySQL/Mongo  │  │
    └───────────────────────────────────────────────────────────┘
```

## ⚠️ Requisitos para el Refactor y Limpieza

Para optimizar recursos y mantener limpio el entorno (restricciones de inodes):
1. Todo código que no se use (como ExampleController) debe ser borrado.
2. Todo paquete inútil (Twilio) debe removerse del `composer.json` y del `composer.lock`.
3. No añadir lógica de scaffolding innecesaria. Solo los archivos exactos para que funcione Laravel.
