# TASK-025 — Integración definitiva del Admin dentro de `apps/website`

**Fase:** FASE 14 — Corrección de Deuda Técnica / Reconciliación Arquitectónica  
**Estado:** READY  
**Prioridad:** 🔴 CRÍTICO  
**Owner:** Technical Lead (`/TL`) → Developer / QA / Test Automation / Security / Documentation  
**ADR:** ADR-008

## Objetivo

Eliminar la contradicción entre la URL `/admin` y la topología `apps/admin`. La arquitectura definitiva requiere que el Admin forme parte de `apps/website`, con separación modular interna y reutilización del Design System y Framework.Core.

## Alcance

### Frontend

- Migrar el código funcional necesario desde el legado `apps/admin` hacia `apps/website`.
- Mantener una frontera modular clara para Admin.
- Mantener rutas `/admin/*`, lazy loading y guards.
- Eliminar el segundo entrypoint SPA como dependencia objetivo.
- Consumir `packages/design-system`.

### Backend

- Mantener toda API administrativa en `apps/website/src/backend`.
- Validar autenticación, autorización, roles, middleware, CORS, cookies, Sanctum y CSRF bajo same-origin.

### Tests

- Migrar/adaptar pruebas a la estructura vigente.
- Reutilizar `packages/framework-automation/src/Framework.Core`.
- Mantener `Examples/tests/framework-automation` como referencia.
- Cubrir login, autorización, navegación `/admin`, CRUD representativo y sesión.

### Infraestructura

- Eliminar la dependencia de producción de un servicio dedicado a `apps/admin`.
- Servir `/admin` desde el artefacto/servicio Website.
- Revisar Docker, gateway, CI/CD, scripts y rutas directas/refresh.

### Documentación

- Reconciliar README, índice, overview, testing strategy, coding standards, getting started, master plan, tareas relacionadas y changelog.
- Conservar historia en `docs/99_ARCHIVE`.

## Criterios de aceptación funcionales

- [ ] Admin integrado en `apps/website`.
- [ ] `/admin` funciona con el router del Website.
- [ ] Refresh y acceso directo a `/admin/*` funcionan.
- [ ] Backend Admin permanece en `apps/website/src/backend`.
- [ ] No existe `admin.<dominio>` como arquitectura objetivo.
- [ ] No existe dependencia operativa de `apps/admin`.
- [ ] Design System reutilizado desde `packages/design-system`.
- [ ] Automatización reutiliza Framework.Core.
- [ ] Autenticación/autorización funcionan correctamente.

## Quality Gates obligatorios

### Build

- [ ] Todos los proyectos afectados compilan.
- [ ] Build global aplicable compila.
- [ ] **0 errores.**
- [ ] **0 warnings.**
- [ ] 0 diagnósticos inesperados.

### Static quality

- [ ] type-check pasa donde aplique.
- [ ] lint pasa donde aplique.
- [ ] analyzers/static analysis pasan donde aplique.
- [ ] No se ocultan warnings con supresiones injustificadas.

### Tests

- [ ] Unit tests aplicables pasan.
- [ ] Integration tests aplicables pasan.
- [ ] API tests aplicables pasan.
- [ ] E2E tests aplicables pasan.
- [ ] Regression tests aplicables pasan.
- [ ] Ningún test requerido se deshabilita para conseguir verde.
- [ ] Todo fallo fue clasificado como producto/test/flaky/infraestructura/security/arquitectura antes de corregirse.

### Security

- [ ] No hay secretos en el cambio.
- [ ] Dependency/security checks aplicables pasan.
- [ ] No existen vulnerabilidades Critical/High sin resolver.
- [ ] Findings Medium/Low tienen disposición documentada según política.

### Documentation

- [ ] TASK actualizada con evidencia.
- [ ] ADRs consistentes.
- [ ] Implementation docs actualizadas.
- [ ] CHANGELOG actualizado.
- [ ] INDEX/master-plan consistentes.

## Triage y ownership

- Defecto real de producto → Developer.
- Falso positivo o expectativa incorrecta del test → QA/Test Automation.
- Flaky test → QA/Test Automation.
- Problema de infraestructura → Infrastructure/Developer.
- Vulnerabilidad → Security valida; Developer remedia.
- Conflicto arquitectónico → TL + Architect.
- Documentación inconsistente → Documentation Guardian.

El TL conserva la responsabilidad de aceptación final.

## Evidencia de cierre

Registrar comandos ejecutados y resultados para build, type-check/lint, tests, seguridad y validaciones funcionales. Si una validación obligatoria no puede ejecutarse, el estado no puede ser `DONE`.

## Regla de migración

No borrar automáticamente el legado hasta identificar dependencias y demostrar que CI/CD, Docker, tests y documentación ya no lo necesitan. Una vez demostrado, el legado puede eliminarse o archivarse según el resultado de la auditoría.
