# TASK-018 — Reconciliación integral de documentación, arquitectura y tareas

**Estado:** IN PROGRESS  
**Fecha:** 2026-09-07  
**Prioridad:** HIGH  
**Tipo:** Documentation / Architecture Governance / Traceability

## Objetivo

Establecer una única interpretación vigente del repositorio y reconciliar documentación, ADRs, tareas, implementación, pruebas y material histórico para que el proyecto sea claro, mantenible y ejecutable por personas y agentes de IA.

## Arquitectura vigente que esta tarea debe proteger

- Admin: `<dominio>/admin`.
- No se debe implementar `admin.<dominio>` como arquitectura objetivo.
- Admin frontend pertenece a `apps/website`.
- Admin backend pertenece a `apps/website/src/backend`.
- `apps/admin` es legado/histórico y no debe recibir desarrollo nuevo.
- `packages/framework-automation/src/Framework.Core` es el framework reutilizable de automatización.
- `Examples/tests/framework-automation` es ejemplo/referencia, no un framework paralelo.
- Design System y Framework.Core son paquetes independientes y versionables.

## Alcance

### 1. Índices y navegación
- Validar `docs/00_INDEX.md` como índice maestro.
- Validar `docs/README.md` y README raíz.
- Eliminar enlaces rotos y referencias a documentos inexistentes.
- Evitar taxonomías documentales paralelas.

### 2. ADRs
- Revisar todos los ADR vigentes.
- Confirmar que ADRs superseded/archived estén claramente marcados.
- Confirmar que ADR-006 sea la referencia vigente para Admin routing.
- Confirmar que ADR-007 sea la referencia vigente para distribución de paquetes.
- Crear/corregir ADR únicamente cuando exista una decisión arquitectónica real que no esté documentada.

### 3. Tareas
- Inventariar tareas activas e históricas.
- Detectar tareas duplicadas, superseded, parcialmente implementadas o marcadas DONE sin evidencia.
- Para cada tarea activa: scope, dependencias, aceptación, evidencia y validación.
- No cambiar un estado a DONE sin evidencia verificable.
- Crear una secuencia ejecutable basada en dependencias, no únicamente en numeración.

### 4. Admin
- Buscar referencias activas a `apps/admin`, `admin.<domain>`, subdominios o repositorios externos como arquitectura objetivo.
- Corregir documentación activa.
- Mantener evidencia histórica en `docs/99_ARCHIVE` cuando tenga valor de trazabilidad.
- Marcar explícitamente documentos históricos como legacy/superseded.
- Validar que el código vigente corresponda a `/admin` dentro de website.

### 5. Automatización
- Revisar referencias a Framework.Core.
- Validar ubicación real: `packages/framework-automation/src/Framework.Core`.
- Revisar `Examples/tests/framework-automation` y sus referencias de proyecto.
- Definir una estrategia única para E2E, API e integración evitando duplicación.
- Documentar cuándo usar framework/package, tags y fixtures.

### 6. Paquetes
- Design System: `@farutech/design-system`.
- Framework.Core: `EnterpriseAutomation.Framework`.
- Validar metadata, versionado, registry, publicación, consumo y documentación.
- No guardar credenciales.
- Distinguir claramente GitHub Packages público de instalación verdaderamente anónima; si esta última es requisito, documentar npmjs.org/NuGet.org como alternativa o complemento.

### 7. Agentes
- Mantener `.github/agents/` como catálogo especializado.
- Mantener `AGENTS.md` como entrada portable para agentes.
- Los agentes deben consultar documentación vigente antes de modificar arquitectura.
- Deben preservar trazabilidad y actualizar documentación cuando cambie la realidad.

## Matriz de reconciliación mínima

| Área | Fuente de verdad | Validación requerida |
|---|---|---|
| Arquitectura | ADRs vigentes | Código + infraestructura |
| Admin routing | ADR-006 | Website + routing + backend |
| Packages | ADR-007 | package metadata + CI + consumo |
| Tareas | `docs/04_TRACKING` | Git + código + tests |
| Tests | Framework.Core + example | proyectos reales + ejecución |
| Histórico | `docs/99_ARCHIVE` | no usar como arquitectura vigente |
| Agentes | `AGENTS.md` + `.github/agents` | reglas coherentes con ADRs |

## Criterios de aceptación

- [ ] `docs/00_INDEX.md` representa la estructura real.
- [ ] No quedan referencias activas ambiguas que presenten `apps/admin` como arquitectura objetivo.
- [ ] Las referencias históricas de Admin permanecen trazables y están marcadas como legacy/superseded.
- [ ] Cada ADR vigente tiene relación clara con implementación o decisión pendiente.
- [ ] Cada tarea activa tiene estado, dependencias y criterios verificables.
- [ ] No existen tareas DONE sin evidencia suficiente.
- [ ] Framework.Core tiene una única ubicación/rol documentado.
- [ ] Design System y Framework.Core tienen estrategia de distribución coherente.
- [ ] Los agentes conocen y respetan la arquitectura vigente.
- [ ] La documentación permite a un desarrollador nuevo entender qué existe, qué falta y qué debe ejecutarse después.
- [ ] La documentación permite a un agente continuar tareas sin reconstruir decisiones históricas desde cero.

## Regla de cierre

Esta tarea no debe cerrarse por cantidad de documentos modificados. Se cierra únicamente cuando la documentación, el código y las pruebas cuentan la misma historia y las discrepancias restantes están explícitamente clasificadas como pendientes, bloqueadas o históricas.
