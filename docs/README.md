# Farutech — Documentación

Índice de documentación del monorepo `farutech_refactor` (checkpoint 2026-09-03).

## Entradas principales

| Documento | Ruta | Propósito |
|-----------|------|-----------|
| Guía de Implementación | [`/IMPLEMENTATION_GUIDE.md`](../IMPLEMENTATION_GUIDE.md) | Estado real, arquitectura, cómo build/testear |
| Inicio rápido | [`/QUICK_START.md`](../QUICK_START.md) | Puesta en marcha en 5 minutos |
| Bitácora de progreso | [`implementation-log/refactor-progress.md`](implementation-log/refactor-progress.md) | Tracker de fases + log de sesión |
| Plan maestro | [`09_MASTER_IMPLEMENTATION_PLAN_AND_DEPENDENCY_GRAPH.md`](09_MASTER_IMPLEMENTATION_PLAN_AND_DEPENDENCY_GRAPH.md) | Grafo de tareas/dependencias |
| Auditoría profunda | [`30_AUDITORIA_PROFUNDA_Y_ESTADO_REAL.md`](30_AUDITORIA_PROFUNDA_Y_ESTADO_REAL.md) | Hallazgos de seguridad/código |

## Tareas / análisis por bloque (planificación)

- `31_SECURITY_FIXES_PLAN.md` — correcciones de seguridad (SEC-01..SEC-07)
- `36_BACKEND_API_CONTRACT_ANALYSIS.md` — análisis del contrato REST
- `41_DESIGN_SYSTEM_SPECIFICATION.md` — componentes/tokens del design system
- `45_ARCHITECTURE_DECISION_RECORDS.md` — decisiones arquitectónicas (ADRs)
- `46_TAILWIND_DESIGN_TOKENS.md`
- `52_REFACTOR_REFACTOR_REFACTOR.md`, `59_TASK_LIST.md`, etc.

## Arquitectura / infraestructura

- `11_ARCHITECTURE_DECISION_RECORDS.md`
- `infrastructure/` — `docker-compose.yml`, `gateway/haproxy.cfg`, `.env.example`
- `docs/ESTADO_ACTUAL.md`

## Archivados (legacy / no migrado)

- [`archive/`](archive/) — contiene versiones previas archivadas (p. ej. `apps/web` legacy,
  website Next.js viejo) referenciadas por la migración FASE 0→1.

Ver también el tracker en vivo (`implementation-log/refactor-progress.md`) y la
guía de validación (`IMPLEMENTATION_GUIDE.md` → "Cómo validar").
