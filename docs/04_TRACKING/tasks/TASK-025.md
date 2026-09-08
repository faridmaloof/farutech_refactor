# TASK-025 — Integración definitiva del Admin dentro de `apps/website`

**Fase:** FASE 14 — Corrección de Deuda Técnica / Reconciliación Arquitectónica  
**Estado:** READY  
**Prioridad:** 🔴 CRÍTICO  
**Responsable:** Technical Lead / Frontend / Backend / QA  
**ADR:** [ADR-008](../../01_ARCHITECTURE/adr/ADR-008_admin_hosting_and_ownership.md)

## Objetivo

Eliminar la contradicción entre la URL `/admin` y la topología actualmente documentada/implementada como `apps/admin`.

La arquitectura definitiva requiere que el Admin forme parte de `apps/website`, manteniendo separación modular interna y reutilizando el Design System y Framework.Core.

## Alcance

### Frontend

- Identificar todo el código funcional actualmente ubicado en `apps/admin/src/frontend`.
- Integrarlo dentro del frontend de `apps/website` con una frontera modular clara para Admin.
- Mantener rutas `/admin/*`.
- Mantener lazy loading y guards donde correspondan.
- Eliminar dependencias de un segundo entrypoint SPA.
- Reutilizar `packages/design-system`.

### Backend

- Confirmar que toda API administrativa usa `apps/website/src/backend`.
- No crear backend paralelo.
- Validar autenticación, autorización, roles y middleware.
- Revisar CORS, cookies, Sanctum y CSRF bajo same-origin.

### Tests

- Migrar/adaptar pruebas del Admin para utilizar la estructura de pruebas vigente del Website Ecosystem.
- Reutilizar `packages/framework-automation/src/Framework.Core`.
- Mantener `Examples/tests/framework-automation` como referencia, no como implementación duplicada.
- Cubrir como mínimo login, autorización, navegación `/admin`, una operación CRUD representativa y manejo de sesión.

### Infraestructura

- Eliminar del despliegue objetivo cualquier servicio dedicado a `apps/admin`.
- Servir `/admin` desde el mismo artefacto/servicio frontend de Website, salvo una decisión posterior documentada que justifique otra cosa.
- Revisar Docker, Compose, gateway, CI/CD y scripts de build.

### Documentación

- Actualizar README, índice maestro, overview, testing strategy, getting started, master-plan y tareas relacionadas.
- Mantener documentos históricos bajo `docs/99_ARCHIVE`.
- Marcar como `SUPERSEDED` cualquier documento que presente `apps/admin` como arquitectura vigente.
- Registrar la migración en CHANGELOG.

## Dependencias

- ADR-005 — backend consolidado.
- ADR-008 — ownership final del Admin.
- TASK-014 — consolidación backend.
- TASK-015 — migración histórica por path; no debe tratarse como arquitectura vigente.
- TASK-016 — reconciliación documental previa; debe revisarse nuevamente porque ahora existe ADR-008.

## Criterios de aceptación

- [ ] No existe `apps/admin` como aplicación objetivo en la documentación ni en el despliegue.
- [ ] El código Admin está integrado dentro de `apps/website`.
- [ ] `/admin` funciona mediante el router del Website.
- [ ] El backend Admin reside en `apps/website/src/backend`.
- [ ] No existe routing objetivo por `admin.<dominio>`.
- [ ] No existe backend/container/CI de Admin independiente requerido para producción.
- [ ] Design System se consume desde `packages/design-system`.
- [ ] Tests Admin reutilizan Framework.Core y no duplican framework.
- [ ] Build, lint, type-check y tests relevantes pasan.
- [ ] Se validan rutas directas y refresh de `/admin/*`.
- [ ] Se valida autenticación/autorización.
- [ ] Se actualizan docs y changelog.
- [ ] La evidencia de cierre incluye comandos ejecutados y resultados.

## Regla de seguridad documental

No borrar automáticamente `apps/admin` ni los documentos históricos hasta haber identificado dependencias, migrado código necesario y confirmado que CI/CD, Docker, tests y documentación ya no dependen de esa aplicación.

## Resultado esperado

Una única aplicación Website con dos superficies claramente separadas a nivel de rutas/módulos:

```text
apps/website
├── src/frontend
│   ├── public/...
│   └── admin/...
└── src/backend
    ├── public APIs
    └── admin APIs
```

con una única entrada de dominio:

```text
<dominio>/
<dominio>/admin
```
