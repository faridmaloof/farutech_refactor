# TASK-017 — Reestructuración de Infraestructura y Apps Independientes

**Fase:** FASE 14 — Deuda técnica / infraestructura  
**Estado:** SUPERSEDED  
**Prioridad histórica:** HIGH  
**Reemplazada por:** TASK-027  
**Decisión vigente:** ADR-008

## Motivo de supersession

Esta tarea histórica proponía `apps/admin` como aplicación independiente, un Compose propio de Admin y despliegue separado. Esa topología contradice la decisión posterior de ADR-008: el Admin pertenece a `apps/website` y se sirve mediante `<dominio>/admin`.

La tarea se conserva para trazabilidad y no debe utilizarse como instrucción de implementación actual.

## Qué permanece útil

La necesidad de revisar:

- separación de infraestructura compartida y servicios de aplicación;
- redes Docker;
- variables de entorno;
- configuración local/producción;
- CI/CD;
- health checks;
- gateway;
- reproducibilidad de despliegue.

Esas necesidades se trasladan a **TASK-027 — Reconciliación de infraestructura y topología de despliegue**.

## No ejecutar

No implementar los criterios originales que creen o mantengan:

- `apps/admin` como aplicación objetivo;
- `apps/admin/docker-compose.yml` como despliegue requerido;
- un servicio Admin independiente para producción;
- routing por `admin.<dominio>`.

## Historial

La tarea original fue creada antes de la decisión definitiva de ownership del Admin. Se mantiene intacta conceptualmente como evidencia del diseño anterior, pero su ejecución queda cancelada por una decisión arquitectónica posterior.
