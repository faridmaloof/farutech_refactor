# TASK-028 — Auditoría y mantenimiento documental continuo

**Estado:** IN PROGRESS  
**Prioridad:** CRÍTICO  
**Owner:** Technical Lead → Documentation Guardian + all specialists

## Objetivo

Evitar que código, tareas, ADRs, especificaciones, implementación, pruebas e infraestructura vuelvan a divergir.

## Alcance

La revisión documental debe comprobar:

- `README.md`;
- `docs/00_INDEX.md`;
- architecture overview;
- todos los ADRs;
- specifications;
- implementation guides;
- master plan;
- task files;
- changelog;
- archive/historical evidence;
- agent contracts;
- referencias a rutas, servicios, paquetes y comandos.

## Reglas

1. La documentación no puede declarar una arquitectura que el código no implementa.
2. El código no puede introducir una arquitectura durable sin documentarla cuando requiera decisión.
3. Las tareas `DONE` requieren evidencia.
4. Una decisión nueva supersede una anterior; no se reescribe el historial.
5. Los documentos históricos se mantienen explícitamente como históricos.
6. Los enlaces internos deben apuntar a archivos existentes.
7. IDs de ADR/TASK deben ser únicos.
8. Las instrucciones operativas no pueden contradecir ADRs aceptados.

## Criterios de aceptación

- [ ] No existen IDs duplicados de ADR/TASK.
- [ ] Índice y master plan coinciden.
- [ ] Cada tarea accionable tiene owner, dependencias, acceptance criteria y Definition of Done.
- [ ] Los agentes utilizan la arquitectura vigente.
- [ ] Las referencias históricas están identificadas como superseded/archived cuando corresponde.
- [ ] Las referencias activas a `apps/admin` se clasifican y corrigen donde sean instrucciones actuales.
- [ ] `/admin`, `apps/website` y `apps/website/src/backend` son coherentes en documentación activa.
- [ ] Framework.Core y Design System están descritos de forma consistente.
- [ ] CHANGELOG registra cambios relevantes.
- [ ] No quedan contradicciones conocidas sin registrar.

## Nota

Esta tarea es continua: debe revisarse al cerrar cambios arquitectónicos importantes y antes de declarar hitos globales completados.
