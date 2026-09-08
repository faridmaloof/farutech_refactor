# TASK-016 — Sincronizar Documentación Desactualizada con el Código Real

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** ✅ DONE
**Prioridad:** 🟡 HIGH
**Responsable:** Technical Lead
**Fecha Creación:** 2026-09-05
**Fecha Finalización:** 2026-09-05

---

## 🎯 Objetivo

Eliminar las divergencias detectadas entre documentación y código real, que generan confusión y errores de onboarding (ej. rutas de instalación que no existen, stack incorrecto documentado).

## 📋 Hallazgos de Auditoría (Evidencia)

| Documento | Afirmaba | Realidad Verificada |
|---|---|---|
| `docs/01_ARCHITECTURE/overview.md` | Website en Next.js 14 | Website en Vite + React Router 7 (sin SSR de Next) |
| `docs/03_IMPLEMENTATION/getting-started.md` | `cd apps/admin/src && npm install` | Código real en `apps/admin/src/frontend` |
| `README.md` | Diagrama con `admin.farutech.local` | Nunca implementado; ADR-001 superseded por ADR-006 |
| `docs/01_ARCHITECTURE/overview.md` | Multi-DB (MySQL+Postgres+Redis) | ADR-004 decide consolidar a Postgres único; tampoco ejecutado en infra |

## ✅ Estado de Corrección (esta entrega)

- [x] `docs/01_ARCHITECTURE/overview.md` — reescrito, stack corregido, estructura ADR-005/006 reflejada
- [x] `docs/03_IMPLEMENTATION/getting-started.md` — rutas corregidas
- [x] `README.md` — actualizado: badges correctos, tabla de estado con TASK-014 y TASK-015 marcadas DONE, diagrama de arquitectura reflejando routing por path
- [x] `docs/03_IMPLEMENTATION/testing-strategy.md` — verificado, no requiere cambios (ya referencia rutas genéricas `apps/website/src/backend/tests/`)
- [x] `docs/03_IMPLEMENTATION/coding-standards.md` — verificado, no requiere cambios (estructura de carpetas correcta)

## 📂 Pendiente: Checklist de Actualización de README.md

- [x] Badges: confirmar Vite, React 18, Laravel 11, Tailwind v4, TypeScript 5
- [x] Tabla "Estado Real por Aplicación": actualizar ubicación de backend (`apps/website/src/backend`, TASK-014 DONE)
- [x] Diagrama de arquitectura: reflejar `farutech.com/admin` (TASK-015 DONE)
- [x] Sección de ADRs: ADR-005 y ADR-006 ya listados como 🆕
- [x] Sección de Especificaciones: SPEC-003 a SPEC-006 ya listadas en sección 6
- [x] Quick Start: rutas corregidas según `getting-started.md` v2

## 🔗 Referencias

- Debe ejecutarse en conjunto con TASK-014 (para que las rutas de backend ya estén en su ubicación final antes de documentarlas)

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | EN PROGRESO | Corrección de `overview.md` y `getting-started.md` entregada; resto pendiente | Technical Lead |
| 2026-09-05 | ✅ DONE | README.md actualizado, testing-strategy.md y coding-standards.md verificados. TASK-016 completada. | Technical Lead |
