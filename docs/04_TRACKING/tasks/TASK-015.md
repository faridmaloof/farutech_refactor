# TASK-015 — Servir Admin bajo `/admin` (decisión intermedia)

**Fase:** FASE 14 — Corrección de Deuda Técnica  
**Estado:** ⚠️ SUPERSEDED — ver TASK-025  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Technical Lead / DevOps  
**Fecha Creación:** 2026-09-05  
**Fecha Cierre histórico:** 2026-09-07  
**ADR histórico:** [ADR-006](../../01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md)  
**ADR vigente:** [ADR-008](../../01_ARCHITECTURE/adr/ADR-008_admin_hosting_and_ownership.md)

---

## Objetivo histórico

Implementar el acceso del Admin mediante el path `/admin` en lugar de `admin.<dominio>`.

La decisión de URL fue correcta y permanece vigente. Lo que quedó obsoleto fue la topología propuesta en esta tarea: mantener `apps/admin` como aplicación independiente.

## Qué se conserva

- URL objetivo: `<dominio>/admin`.
- Eliminación del routing por `admin.<dominio>`.
- Rechazo de la estrategia de subdominio definida originalmente en ADR-001.
- Necesidad de que las rutas y assets sean compatibles con `/admin`.

## Qué queda superseded

Las siguientes instrucciones de esta tarea **NO deben ejecutarse ni reproducirse** como arquitectura futura:

- mantener `apps/admin` como aplicación objetivo;
- crear un contenedor independiente únicamente para Admin;
- crear un backend separado para Admin;
- mantener un ciclo de despliegue independiente del Website por defecto.

## Estado

La tarea se conserva porque documenta una migración intermedia que ya ocurrió en el historial del repositorio. No debe utilizarse como guía para nuevas implementaciones.

## Siguiente tarea

La implementación definitiva se realizará en **TASK-025 — Integración del Admin dentro de `apps/website`**, conforme a ADR-008.

## Referencias

- ADR-001 — estrategia original por subdominio — SUPERSEDED.
- ADR-006 — estrategia intermedia por path con `apps/admin` — SUPERSEDED.
- ADR-008 — estrategia definitiva — VIGENTE.
- TASK-025 — migración definitiva.
