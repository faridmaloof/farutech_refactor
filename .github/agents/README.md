# FaruTech Repository Agents

Esta carpeta contiene contratos de trabajo para agentes humanos o IA. Los agentes no sustituyen la documentación `docs/`; la utilizan como fuente de verdad.

## Regla principal

Antes de modificar código:

1. Leer `docs/00_INDEX.md` y `docs/README.md`.
2. Revisar ADRs vigentes y detectar ADRs superseded.
3. Revisar la tarea activa en `docs/04_TRACKING/`.
4. Inspeccionar el código real antes de asumir que una tarea está implementada.
5. Mantener trazabilidad: tarea → código → pruebas → documentación.
6. No reintroducir `apps/admin` como aplicación independiente. El Admin vigente es `/admin` dentro de `apps/website`, con backend nativo bajo `apps/website`.
7. Para pruebas nuevas, evaluar primero `packages/framework-automation/src/Framework.Core` y su ejemplo en `Examples/tests/framework-automation`.

## Agentes

- `repository-architect.md` — arquitectura, límites entre website/admin/backend/packages.
- `test-automation-specialist.md` — E2E/API/integration con Framework.Core y tags.
- `package-release-specialist.md` — Design System y Framework.Core, SemVer, CI/CD y registros.
- `documentation-guardian.md` — consistencia de docs, ADRs, tracking y archive.
- `security-reviewer.md` — secretos, dependencias, supply chain y superficie de ataque.

## Protocolo “continúa”

Cuando el usuario diga `continúa con la siguiente tarea`, identificar la primera tarea READY/BLOCKED resoluble según `docs/04_TRACKING`, comprobar dependencias y ejecutar únicamente lo permitido por su criterio de aceptación. Si una decisión arquitectónica está en conflicto, detener la implementación de esa parte y registrar/consultar el ADR correspondiente antes de improvisar.
