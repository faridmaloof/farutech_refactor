# FaruTech Repository Agents

Esta carpeta contiene contratos de trabajo para agentes humanos o IA. Son deliberadamente **provider-neutral**: describen responsabilidades y reglas en Markdown y no dependen exclusivamente de GitHub Copilot. `AGENTS.md` es la entrada portátil; esta carpeta contiene las especializaciones.

## Entrada recomendada

- `/TL <tarea>`
- `/lider-Tecnico <tarea>`
- `continúa con la siguiente tarea`

El Technical Lead es el orquestador y responsable de la aceptación técnica final. Los especialistas ejecutan actividades dentro de su dominio y devuelven evidencia al TL.

## Orden mínimo antes de modificar código

1. Leer `AGENTS.md`.
2. Leer `docs/00_INDEX.md` y `docs/README.md` cuando exista.
3. Revisar ADRs vigentes y superseded.
4. Revisar la tarea activa y sus dependencias.
5. Inspeccionar el código real.
6. Mantener trazabilidad: tarea → implementación → pruebas → seguridad → documentación.

## Agentes

- `technical-lead.md` — orquestación, delegación, triage, gates y aceptación final.
- `developer.md` — implementación/corrección de producto, configuración e infraestructura asignada.
- `qa-validation-specialist.md` — validación funcional, pruebas, regresiones y false positives.
- `repository-architect.md` — arquitectura y decisiones/ADRs.
- `test-automation-specialist.md` — E2E/API/integration y Framework.Core.
- `package-release-specialist.md` — Design System/Framework.Core, SemVer, CI/CD y registros.
- `documentation-guardian.md` — consistencia de documentación, tracking, ADRs y archivo histórico.
- `security-reviewer.md` — secretos, dependencias, supply chain y superficie de ataque.

## Delegación

El TL determina el owner según la naturaleza del problema. Un fallo de test no se asigna automáticamente a Developer: primero se determina si existe un defecto real del producto, un defecto del test, flaky test, problema de entorno, seguridad, arquitectura o documentación.

## Quality gates obligatorios

Una tarea no es `DONE` por estar compilada. Cuando sean aplicables, debe demostrar:

- acceptance criteria satisfechos;
- build limpio: **0 errores y 0 warnings**;
- type-check/lint/static analysis limpios;
- todos los tests requeridos en verde;
- ninguna prueba debilitada para ocultar fallos;
- security/dependency checks sin bloqueadores;
- documentación y changelog reconciliados;
- evidencia de los comandos y resultados.

Si una validación requerida no puede ejecutarse, el estado no puede ser `DONE`; debe quedar `BLOCKED` o pendiente de `VALIDATION` con la causa documentada.

## Protocolo “continúa”

Cuando el usuario diga `continúa con la siguiente tarea`, el TL debe leer índice, master plan y tracking; descartar tareas `DONE`, `SUPERSEDED` y `ARCHIVED`; comprobar dependencias; seleccionar la primera tarea realmente accionable por prioridad/dependencias; ejecutarla mediante los especialistas correspondientes; validar; actualizar evidencia; y solo después continuar con la siguiente.

## Arquitectura vigente

- Admin: `<dominio>/admin`.
- No `admin.<dominio>` como arquitectura objetivo.
- Admin dentro de `apps/website`.
- Backend Admin dentro de `apps/website/src/backend`.
- No reintroducir `apps/admin` como aplicación objetivo.
- Framework reutilizable: `packages/framework-automation/src/Framework.Core`.
- Ejemplo: `Examples/tests/framework-automation`.
