# 📝 Change Log — Tracking Maestro de Implementación

Este documento registra los cambios realizados al sistema de tracking del proyecto Farutech.

---

## [2026-09-07] — Reconciliación de agentes, tareas y arquitectura

**Tipo:** 📝 DOCUMENTATION / PROCESS / ARCHITECTURE  
**Responsable:** Technical Lead

### Cambios

- Se incorporó el agente orquestador `Technical Lead` con comandos `/TL` y `/lider-Tecnico`.
- Se incorporaron agentes especializados de Developer y QA Validation.
- Se estableció el protocolo de delegación y triage de fallos.
- Se establecieron quality gates obligatorios: criterios de aceptación, build sin errores/warnings, static checks, tests, security y documentación.
- Se estableció que una tarea no puede marcarse `DONE` sin evidencia.
- Se estableció que un false positive de test pertenece a QA/Test Automation y un defecto real de producto pertenece a Developer.
- Se normalizó la numeración de ADR: ADR-007 queda reservado para Platform y distribución de paquetes pasa a ADR-009.
- Se normalizó la tarea de publicación de paquetes a TASK-026 para evitar colisión con TASK-017.
- TASK-017 de infraestructura queda `SUPERSEDED` donde contradice ADR-008; TASK-027 reemplaza su topología vigente.
- `IMPLEMENTATION_PROMPT.md` fue actualizado a una versión provider-neutral y alineada con ADR-008.
- `00_INDEX.md` y `master-plan.md` fueron reconciliados con la identidad real de tareas y ADRs.

### Regla vigente

La documentación histórica se conserva para trazabilidad, pero ningún documento `SUPERSEDED` o `ARCHIVED` constituye instrucción de implementación actual.

---
