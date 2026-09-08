# 🤖 PROMPT DE IMPLEMENTACIÓN — FaruTech Website Ecosystem v2

**Propósito:** instrucción portable para agentes de IA y desarrolladores humanos. No depende de GitHub Copilot, Claude, Gemini, ChatGPT u otro proveedor concreto.

## Punto de entrada recomendado

Usar:

- `/TL <tarea>`
- `/lider-Tecnico <tarea>`
- `continúa con la siguiente tarea`

El Technical Lead (`.github/agents/technical-lead.md`) es el orquestador y responsable de la aceptación técnica final.

## Contexto obligatorio

Antes de implementar, leer en este orden:

1. `AGENTS.md`
2. `docs/00_INDEX.md`
3. `docs/04_TRACKING/master-plan.md`
4. TASK-XXX completa
5. ADR/SPEC aplicables
6. implementación real
7. pruebas existentes
8. documentación histórica únicamente cuando sea necesaria para comprender una migración

## Arquitectura vigente

```text
apps/
└── website/
    └── src/
        ├── frontend/       # Website público + Admin bajo /admin
        └── backend/        # APIs Website + Admin

packages/
├── design-system/
└── framework-automation/
    └── src/Framework.Core/

Examples/tests/framework-automation/ # ejemplo/referencia
```

Reglas:

1. Admin: `<dominio>/admin`.
2. `admin.<dominio>` no es arquitectura objetivo.
3. Admin pertenece a `apps/website`.
4. Backend Admin pertenece a `apps/website/src/backend`.
5. No crear/restaurar/extender `apps/admin` como aplicación objetivo.
6. `packages/design-system` es el Design System compartido.
7. `Framework.Core` es el framework de automatización compartido.
8. `Examples/tests/framework-automation` no es un framework paralelo.
9. Website Ecosystem y futura Platform mantienen alcances separados; Platform se rige por ADR-007/SPEC-003.

## Orquestación

El TL debe:

1. entender requisitos y criterios de aceptación;
2. comprobar dependencias;
3. determinar owner por actividad;
4. delegar al especialista correcto;
5. revisar el resultado;
6. exigir evidencia;
7. corregir o volver a delegar ante fallos;
8. ejecutar/coordinar la validación final;
9. actualizar task/docs/changelog;
10. declarar `DONE` únicamente cuando todos los gates aplicables estén satisfechos.

## Delegación

| Problema | Owner principal |
|---|---|
| Arquitectura/ADR | Repository Architect + TL |
| Código de producto | Developer |
| Test incorrecto/false positive/flaky | QA/Test Automation |
| Defecto real de producto | Developer |
| Vulnerabilidad | Security Reviewer + Developer para remediation |
| Package/release | Package Release Specialist |
| Documentación inconsistente | Documentation Guardian |
| CI/CD/infrastructure | Developer/Infrastructure owner |

El TL mantiene la responsabilidad final aunque delegue.

## Triage obligatorio de fallos

Ante cualquier fallo:

```text
FAIL
 ↓
Reproducir
 ↓
Comparar contra requisito
 ↓
Clasificar
 ├─ producto incorrecto → Developer
 ├─ test incorrecto → QA
 ├─ flaky → QA/Test Automation
 ├─ infraestructura → Infrastructure/Developer
 ├─ security → Security + Developer
 ├─ arquitectura → Architect + TL
 └─ documentación → Documentation Guardian
```

Nunca modificar/eliminar/debilitar un test solamente para conseguir verde.

## Quality Gates — Definition of Done

### Requisitos

- Todos los criterios de aceptación satisfechos.
- Casos límite relevantes cubiertos.
- Sin contradicciones con ADR/SPEC.

### Build

- Build de todos los proyectos afectados.
- Build global requerido por el repositorio.
- **0 errores.**
- **0 warnings.**
- 0 diagnósticos inesperados.

### Static quality

- type-check cuando aplique;
- lint cuando aplique;
- analyzers/static analysis cuando aplique;
- sin supresiones injustificadas.

### Tests

- Unit cuando aplique.
- Integration cuando aplique.
- API cuando aplique.
- E2E cuando aplique.
- Regression cuando aplique.
- Ningún test requerido fallando.
- Ningún test deshabilitado/omitido para ocultar un problema.

### Security

- Sin secretos comprometidos.
- Dependency/security checks aplicables ejecutados.
- Sin Critical/High sin resolver.
- Medium/Low con disposición documentada según política.

### Documentation

- TASK actualizada con estado y evidencia.
- ADR actualizada/creada cuando cambia arquitectura.
- Implementation docs actualizadas.
- CHANGELOG actualizado cuando corresponde.
- INDEX/master-plan consistentes.

## Estados

```text
TODO → READY → IN PROGRESS → TESTING → SECURITY VALIDATION
     → DOCUMENTATION VALIDATION → VALIDATION → DONE
```

Estados alternativos:

- `BLOCKED` — dependencia no disponible.
- `SUPERSEDED` — reemplazada por decisión posterior.
- `ARCHIVED` — evidencia histórica.

No usar `DONE` sin evidencia.

## Continuación automática

Cuando se solicite `continúa con la siguiente tarea`:

1. Leer índice y master plan.
2. Construir lista de tareas accionables.
3. Ignorar `DONE`, `SUPERSEDED`, `ARCHIVED` y duplicados.
4. Comprobar dependencias.
5. Seleccionar la tarea prioritaria realmente ejecutable.
6. Leer TASK/ADR/SPEC completos.
7. Inspeccionar código real.
8. Delegar e implementar.
9. Ejecutar todos los quality gates aplicables.
10. Actualizar evidencia/documentación.
11. Marcar `DONE` solo si corresponde.
12. Identificar la siguiente tarea.

## Regla especial para Admin

La existencia de código histórico bajo `apps/admin` no autoriza a utilizarlo como arquitectura nueva. Primero se determina qué debe migrarse a `apps/website`; luego se elimina la dependencia operativa únicamente cuando la migración y validación lo demuestren.

## Regla especial para Framework.Core

Toda automatización nueva debe evaluar primero `packages/framework-automation/src/Framework.Core`. El ejemplo `Examples/tests/framework-automation` se usa para aprender/validar el patrón, no para duplicar la implementación.

## Regla especial para paquetes

`@farutech/design-system` y `EnterpriseAutomation.Framework` son paquetes independientes y versionados. No publicar una versión ya existente. Nunca almacenar credenciales en Git.

## Cierre obligatorio

La salida de una tarea debe informar como mínimo:

- qué se implementó;
- quién/qué especialista lo realizó;
- archivos/módulos afectados;
- criterios de aceptación;
- build y resultado;
- tests y resultado;
- security y resultado;
- documentación actualizada;
- riesgos restantes;
- estado final.

Si existe un fallo o una validación pendiente, el estado debe reflejarlo explícitamente y el TL debe continuar con la corrección o dejar la tarea bloqueada con causa verificable.

---

**© 2026 FaruTech — Implementation Prompt v2.0**
