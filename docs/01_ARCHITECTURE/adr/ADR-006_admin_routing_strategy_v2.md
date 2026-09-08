# ADR-006 — Admin Routing Strategy v2: Path-Based `/admin`

**Fecha:** 2026-09-05  
**Estado:** ⚠️ SUPERSEDED por [ADR-008 — Admin integrado al Website y servido bajo `/admin`](ADR-008_admin_hosting_and_ownership.md) (2026-09-07)  
**Responsable:** Technical Lead

---

## Propósito histórico

Este ADR documentó la decisión intermedia de abandonar el subdominio `admin.<dominio>` y servir el Admin mediante `/admin`.

La decisión de **URL** continúa vigente: el Admin se accede mediante `<dominio>/admin`.

Sin embargo, durante la reconciliación documental de 2026-09-07 se detectó que este ADR mantenía `apps/admin` como aplicación Vite independiente. Esa topología ya no representa la arquitectura objetivo. La decisión definitiva de ownership/topología está en **ADR-008**: el Admin pertenece a `apps/website` y su backend a `apps/website/src/backend`.

## Decisión histórica que queda reemplazada

La alternativa que proponía:

- `apps/admin` como aplicación objetivo independiente;
- contenedor Admin separado;
- routing del gateway hacia ese contenedor;
- configuración independiente de Vite para `base: "/admin/"`;

queda **SUPERSEDED**.

No debe utilizarse este documento para crear, restaurar o extender `apps/admin`.

## Decisiones que permanecen vigentes

1. El Admin **no** se publica en `admin.<dominio>`.
2. La URL pública es `<dominio>/admin`.
3. `admin.<dominio>` no forma parte de la arquitectura objetivo.
4. El backend administrativo pertenece al backend consolidado de `apps/website/src/backend`, conforme a ADR-005.
5. Las referencias históricas a `apps/admin` se conservan únicamente para trazabilidad y migración.

## Evidencia histórica

Este ADR es útil para entender por qué se abandonó el subdominio y por qué se introdujo inicialmente el routing por path. Las implementaciones y tareas basadas en la topología independiente deben considerarse material de migración/legacy.

## Referencias

- [ADR-001 — Admin Routing Strategy](ADR-001_admin_routing_strategy.md) — SUPERSEDED; estrategia original por subdominio.
- [ADR-005 — Website Backend Consolidation](ADR-005_website_backend_consolidation.md) — backend consolidado en `apps/website/src/backend`.
- [ADR-008 — Admin integrado al Website y servido bajo `/admin`](ADR-008_admin_hosting_and_ownership.md) — **vigente**.
- `TASK-015` — implementación histórica de `/admin`, superseded en cuanto a la topología independiente.
- `TASK-025` — migración/integración definitiva del Admin dentro de `apps/website`.

---

**Estado final:** ⚠️ SUPERSEDED — conservar como registro histórico.
