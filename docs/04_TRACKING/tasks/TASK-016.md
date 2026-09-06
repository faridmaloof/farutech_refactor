# TASK-016 — Sincronizar Documentación Desactualizada con el Código Real

**Fase:** FASE 14 — Corrección de Deuda Técnica (Auditoría 2026-09)
**Estado:** 🔄 EN PROGRESO (avance parcial entregado en esta auditoría)
**Prioridad:** 🟡 HIGH
**Responsable:** Technical Lead
**Fecha Creación:** 2026-09-05

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
- [ ] `README.md` — pendiente de actualización final (badges de stack, tabla de estado por app, diagrama de arquitectura, lista de ADRs) — ver sección siguiente
- [ ] `docs/03_IMPLEMENTATION/testing-strategy.md` — pendiente, referencia `apps/api/src/backend/tests/` (debe pasar a `apps/website/src/backend/tests/` tras TASK-014)
- [ ] `docs/03_IMPLEMENTATION/coding-standards.md` — pendiente de revisión de referencias a estructura de carpetas

## 📂 Pendiente: Checklist de Actualización de README.md

- [ ] Badges: quitar cualquier mención a Next.js si existiera, confirmar Vite
- [ ] Tabla "Estado Real por Aplicación": actualizar ubicación de backend (`apps/website/src/backend`, ya no `apps/api/src/backend`)
- [ ] Diagrama de arquitectura: reemplazar `admin.farutech.local` por `farutech.com/admin`
- [ ] Sección de ADRs: agregar ADR-005, ADR-006 (marcando ADR-001 como superseded), ADR-007
- [ ] Sección de Especificaciones: agregar SPEC-003, SPEC-004, SPEC-005, SPEC-006, y SPEC-002 v1.1
- [ ] Quick Start: rutas corregidas según `getting-started.md` v2

## 🔗 Referencias

- Debe ejecutarse en conjunto con TASK-014 (para que las rutas de backend ya estén en su ubicación final antes de documentarlas)

## 📆 Historial de Cambios

| Fecha | Estado | Cambio | Responsable |
|---|---|---|---|
| 2026-09-05 | EN PROGRESO | Corrección de `overview.md` y `getting-started.md` entregada; resto pendiente | Technical Lead |
