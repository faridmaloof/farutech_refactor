# TASK-026 — Publicación de paquetes reutilizables

**Estado:** READY_FOR_LOCAL_EXECUTION  
**Prioridad:** HIGH  
**Owner:** Technical Lead → Package Release Specialist / Developer / QA / Security  
**ADR:** ADR-009  
**Scope:** `@farutech/design-system` + `EnterpriseAutomation.Framework`

## Objetivo

Dejar ambos paquetes preparados para distribución reproducible, versionada y mantenible desde el monorepo.

## Alcance

- Validar metadata npm/NuGet.
- Validar build, tests y artefactos.
- Validar workflows de publicación.
- Publicar sin credenciales versionadas.
- Verificar visibilidad y consumo del paquete.
- Documentar versiones reales publicadas.

## Criterios de aceptación

- [ ] Design System compila sin errores ni warnings.
- [ ] Framework.Core compila sin errores ni warnings.
- [ ] Tests aplicables pasan.
- [ ] Security/dependency checks aplicables pasan.
- [ ] Artefactos `.tgz`/`.nupkg` son reproducibles y válidos.
- [ ] Versiones no fueron publicadas previamente.
- [ ] Workflows usan permisos mínimos y no contienen secretos.
- [ ] Publicación ejecutada correctamente.
- [ ] Instalación/consumo validado desde un proyecto consumidor.
- [ ] Documentación y changelog reflejan las versiones reales.

## Regla de bloqueo

Si build, tests, seguridad o validación de consumo fallan, la tarea no puede marcarse DONE. El TL clasifica el fallo y lo entrega al owner correcto.

## No hacer

- No crear `apps/admin`.
- No duplicar Design System.
- No duplicar Framework.Core.
- No introducir credenciales en Git.
- No reutilizar una versión ya publicada.

## Evidencia requerida

Registrar comandos, resultados, versiones, artefactos y validación de consumo. `READY_FOR_LOCAL_EXECUTION` permanece hasta que el propietario ejecute y confirme la publicación con credenciales autorizadas.
