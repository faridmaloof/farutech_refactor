# TASK-026 — Publicación y versionado de paquetes reutilizables

**Estado:** READY_FOR_LOCAL_EXECUTION  
**Prioridad:** HIGH  
**Owner:** Technical Lead → Package Release Specialist / Developer / QA / Security  
**ADR:** ADR-009  
**Scope:** `@faridmaloof/design-system` + `EnterpriseAutomation.Framework`

## Objetivo

Dejar ambos paquetes preparados para distribución reproducible, versionada y mantenible desde el monorepo, con una regla objetiva: **todo cambio dentro del árbol de un paquete genera una nueva versión de ese paquete**.

## Regla de versionado

El versionado es independiente por paquete.

- Cualquier cambio en `packages/design-system/src/**` genera una nueva versión de `@faridmaloof/design-system`.
- Cualquier cambio en `packages/framework-automation/src/Framework.Core/**` genera una nueva versión de `EnterpriseAutomation.Framework`.
- Un cambio que afecte ambos árboles genera una nueva versión de ambos paquetes.
- Un cambio fuera de esos árboles no incrementa la versión de ninguno.
- El incremento automático actual es **PATCH** (`X.Y.Z` → `X.Y.(Z+1)`), porque la regla solicitada es que cualquier cambio material genere una versión nueva sin inferir automáticamente breaking changes.
- El workflow `.github/workflows/version-packages.yml` ejecuta esta regla después de un cambio integrado en `main`.
- Antes de crear el commit de release y las etiquetas, el workflow valida el paquete afectado.
- Las etiquetas son independientes: `design-system-vX.Y.Z` y `framework-core-vX.Y.Z`.

### Importante

La versión no debe incrementarse por cambios arbitrarios de documentación del repositorio. La unidad de versionado es el **contenido del paquete**: cualquier archivo modificado dentro de su árbol cuenta.

## Alcance

- Validar metadata npm/NuGet.
- Validar build, tests y artefactos.
- Validar workflows de versionado y publicación.
- Publicar sin credenciales versionadas.
- Verificar visibilidad y consumo del paquete.
- Documentar versiones reales publicadas.

## Criterios de aceptación

- [ ] Design System compila sin errores ni warnings.
- [ ] Framework.Core compila sin errores ni warnings.
- [ ] Tests aplicables pasan.
- [ ] Security/dependency checks aplicables pasan.
- [ ] Artefactos `.tgz`/`.nupkg` son reproducibles y válidos.
- [ ] Cada cambio dentro del árbol de un paquete produce una nueva versión PATCH.
- [ ] Las versiones de los paquetes son independientes.
- [ ] El tag coincide exactamente con la versión declarada del paquete.
- [ ] Versiones no fueron publicadas previamente.
- [ ] Workflows usan permisos mínimos y no contienen secretos.
- [ ] Publicación ejecutada correctamente.
- [ ] Instalación/consumo validado desde un proyecto consumidor.
- [ ] Documentación y changelog reflejan las versiones reales.

## Regla de bloqueo

Si build, tests, seguridad o validación de consumo fallan, la tarea no puede marcarse DONE. El TL clasifica el fallo y lo entrega al owner correcto.

El versionado automático tampoco debe crear una etiqueta ni publicar un paquete si la validación previa falla.

## No hacer

- No crear `apps/admin`.
- No duplicar Design System.
- No duplicar Framework.Core.
- No introducir credenciales en Git.
- No reutilizar una versión ya publicada.
- No incrementar una versión de paquete por cambios realizados fuera del árbol de ese paquete.

## Evidencia requerida

Registrar comandos, resultados, versiones, artefactos y validación de consumo. `READY_FOR_LOCAL_EXECUTION` permanece hasta que el propietario ejecute y confirme la publicación con credenciales autorizadas.
