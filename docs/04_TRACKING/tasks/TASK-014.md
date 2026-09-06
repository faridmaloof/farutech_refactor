# TASK-014 — Consolidar `apps/api` dentro de `apps/website/src/backend`

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ⬜ BACKLOG
**Prioridad:** 🔴 CRÍTICO
**Responsable:** Backend Lead
**Fecha Creación:** 2026-09-05
**Implementa:** [ADR-005 — Website Backend Consolidation](../../01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md)

---

## 🎯 Objetivo

Ejecutar la migración decidida en ADR-005: mover `apps/api/src/backend` a `apps/website/src/backend`, dejando `apps/website` como unidad autocontenida (frontend + backend + test) y eliminando `apps/api` como aplicación top-level.

## 📋 Dependencias

| ID Tarea | Estado Requerido |
|---|---|
| ADR-005 | ✅ DECIDIDO |

## 📂 Pasos de Ejecución

1. `git mv apps/api/src/backend apps/website/src/backend` — **excluir `vendor/`** del movimiento (se regenera con `composer install`), y confirmar que `.gitignore` de `apps/website` cubre `src/backend/vendor/`
2. Mover `apps/api/test/` → fusionar contenido relevante dentro de `apps/website/test/` (unificar en un solo proyecto de test .NET para el website, cubriendo tanto frontend como backend vía BDD)
3. Actualizar `Framework.Automation.sln` (coordinado con TASK-013):
   - Eliminar/renombrar el proyecto `Farutech.Api.Tests`
   - Actualizar la ruta de `Farutech.Website.Tests` si cambió
4. Actualizar `infrastructure/docker-compose.yml`: el `build.context` del servicio `backend` pasa de `apps/api/src/backend` a `apps/website/src/backend` (el servicio de runtime/contenedor no cambia, solo el origen del código)
5. Actualizar `infrastructure/gateway/haproxy.cfg` si contiene referencias a rutas de build (normalmente no debería, pero verificar comentarios/paths)
6. Eliminar el directorio `apps/api/` una vez verificado que no quedan referencias
7. Actualizar documentación afectada (ya corregida parcialmente en esta entrega, verificar que no queden referencias residuales a `apps/api`):
   - `README.md`
   - `docs/01_ARCHITECTURE/overview.md`
   - `docs/03_IMPLEMENTATION/getting-started.md`
   - `docs/03_IMPLEMENTATION/testing-strategy.md`
   - `docs/03_IMPLEMENTATION/coding-standards.md`
8. Actualizar `docs/00_INDEX.md` y `docs/04_TRACKING/master-plan.md`

## ✅ Criterios de Aceptación

- [ ] `apps/api/` ya no existe en el repositorio
- [ ] `apps/website/src/backend` compila y sirve correctamente (`php artisan serve` o vía Docker)
- [ ] Todas las migraciones y seeders ejecutan sin cambios de lógica (solo cambió la ubicación)
- [ ] `docker compose up -d` desde `infrastructure/` levanta el backend desde la nueva ruta sin errores
- [ ] `dotnet build Framework.Automation.sln` compila (coordinado con TASK-013)
- [ ] `grep -r "apps/api" docs/ README.md` no devuelve resultados (salvo referencias históricas explícitamente marcadas en ADRs)
- [ ] CI/CD (si existe pipeline activo) actualizado con las nuevas rutas de build

## ⚠️ Riesgos

| Riesgo | Mitigación |
|---|---|
| Pérdida de historial de Git en el `mv` | Usar `git mv` (no copiar y borrar) para preservar el historial de archivos |
| Referencias absolutas a `apps/api` en scripts CI/CD no versionados en este repo | Auditar pipelines externos (Gitea/GitHub Actions) antes de eliminar `apps/api` |
| `.env` del backend con rutas relativas rotas tras el movimiento | Revisar `apps/website/src/backend/.env.example` y cualquier path relativo (storage, logs) |

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | BACKLOG | Creación — implementa ADR-005 | Technical Lead |
