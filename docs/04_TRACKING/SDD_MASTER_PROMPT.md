# 🤖 PROMPT MAESTRO DE IMPLEMENTACIÓN — Spec-Driven Development (SDD)

**Versión:** 2.0 (reemplaza a `IMPLEMENTATION_PROMPT.md` v1.0, que queda archivado como referencia histórica)
**Fecha:** 2026-09-05
**Metodología:** Spec-Driven Development — ningún código se escribe sin una especificación aprobada que lo respalde, y ninguna especificación se da por implementada sin verificar sus criterios de aceptación uno por uno.

---

## 0. CÓMO USAR ESTE DOCUMENTO

Este prompt tiene tres partes, en este orden de lectura obligatorio:

1. **§1 — Reglas SDD no negociables** (pégalas siempre como contexto, en cada sesión de trabajo)
2. **§2 — Matriz de Trazabilidad** (verifica que TODO lo pedido por el Product Owner tiene un documento fuente — úsala para confirmar cobertura antes y después de implementar)
3. **§3 — Plan de Ejecución** (las instrucciones concretas, en orden, una por sesión/tarea)

**Con un agente de codificación (ej. Claude Code):** pega §1 una sola vez al inicio de la sesión de trabajo del repositorio, y luego una sección de §3 por tarea — no todas a la vez. Al cerrar cada tarea, pide al agente que ejecute el **Protocolo de Cierre SDD** (§4) antes de pasar a la siguiente.

**Con un equipo humano:** usa §2 como el documento de alcance a firmar por el Product Owner antes de asignar tickets, y cada bloque de §3 como el contenido de un ticket individual.

---

## 1. REGLAS SDD NO NEGOCIABLES (pegar siempre como contexto)

```
Trabajas bajo Spec-Driven Development (SDD) sobre el repositorio "Farutech Website Ecosystem".

REGLA 1 — La especificación es la fuente de verdad, no tu criterio.
Antes de escribir una sola línea de código para una tarea, debes:
  a) Leer COMPLETO el documento SPEC-XXX y/o ADR-XXX referenciado en la TASK-XXX correspondiente
     (no un resumen, no una sección — el documento entero).
  b) Confirmar que entiendes cada Criterio de Aceptación (CA00X) de esa spec antes de codificar.
  c) Si algo que necesitas no está definido en la spec, DETENTE y pregunta. No asumas, no
     "rellenes" con tu propio criterio de diseño. Rellenar huecos sin permiso es la causa
     número uno de que un proyecto SDD se desalinee del negocio.

REGLA 2 — No hay tarea "terminada" sin verificación explícita de criterios de aceptación.
Al finalizar la implementación de una TASK, debes recorrer CADA checkbox de Criterios de
Aceptación de su SPEC/ADR y marcar explícitamente si se cumple, con evidencia (comando
ejecutado, captura, log, o test pasado) — no basta con "creo que ya funciona".

REGLA 3 — Trazabilidad obligatoria: todo commit/PR referencia su TASK.
Cada cambio debe poder rastrearse: Requisito de producto -> SPEC/ADR -> TASK-XXX -> commit.
Si escribes código que no corresponde a ninguna TASK activa, detente: o falta documentarlo
primero (créala como una TASK nueva antes de seguir) o no debe hacerse todavía.

REGLA 4 — Alcance separado: Website Ecosystem vs. Platform.
Este ciclo de trabajo cubre EXCLUSIVAMENTE el Website Ecosystem (apps/website, apps/admin).
La visión de la futura plataforma multi-tenant "platform" (SPEC-003) es NO EJECUTABLE en este
ciclo — está documentada a propósito, no implementada a propósito. No inicies apps/platform
bajo ninguna circunstancia a partir de este prompt.

REGLA 5 — Independencia de aplicaciones.
Cada apps/<nombre> debe permanecer clonable, compilable y desplegable por separado, salvo la
fusión ya decidida de apps/api -> apps/website/src/backend (ADR-005). No crees nuevos
acoplamientos entre apps/website y apps/admin más allá de lo que el ADR-006 define
(enrutamiento por path a nivel de gateway, no fusión de código).

REGLA 6 — Cero deuda oculta.
`npm run build` (en cada frontend tocado) y `dotnet build Framework.Automation.sln` deben
terminar sin errores NI warnings antes de dar cualquier tarea por cerrada. Si introduces un
`any` de TypeScript, un `@ts-ignore`, o un TODO sin TASK asociada, la tarea no está terminada.

REGLA 7 — Actualización de documentación viva, no al final del proyecto.
Al cerrar cada TASK: actualiza su archivo TASK-XXX.md (estado + evidencia), agrega una línea
en docs/04_TRACKING/change-log/CHANGELOG.md, y actualiza docs/04_TRACKING/master-plan.md si el
progreso de la fase cambió. Esto no es opcional ni se pospone "para después".

REGLA 8 — No toques Examples/tests/framework-automation/.
Es material de referencia del framework de pruebas, no se ejecuta como parte del ecosistema.
```

---

## 2. MATRIZ DE TRAZABILIDAD (Requisito de Producto → Documento Fuente → Tareas)

> Esta tabla es la prueba de cobertura completa: cada punto de la definición de producto original tiene, al menos, un documento fuente (ADR/SPEC) y una o más tareas ejecutables asociadas. Si en algún momento se agrega un requisito nuevo que no aparece aquí, **debe agregarse una fila nueva antes de implementarlo** — nunca implementar sin esta trazabilidad.

| # | Requisito de Producto | Documento(s) Fuente | Tarea(s) | Estado de Cobertura |
|---|---|---|---|---|
| 1 | Páginas de servicio totalmente independientes, sin template | `docs/04_TRACKING/tasks/TASK-025.md` | TASK-025 | 🟡 Requiere decisión de Product Owner antes de ejecutar |
| 2 | Excelente SEO en toda la navegación | `overview.md`, `TASK-023.md`, `TASK-026.md` | TASK-023, TASK-026 | 🟡 Base ya sólida (prerender+sitemap+robots); gap de JSON-LD y verificación real pendientes |
| 3 | Sin elementos huérfanos + excelente performance | `TASK-013.md`, `TASK-017.md`, `TASK-024.md`, `TASK-026.md` | TASK-013, TASK-017, TASK-024, TASK-026 | 🟡 4 huérfanos concretos identificados, performance nunca auditado realmente |
| 4 | Mayor cantidad de leads | `SPEC-002_Opportunity_Search.md` (v1.1), `TASK-018.md`, `TASK-021.md` | TASK-018, TASK-021 | 🔴 Backend de prospección es un stub sin efecto real hoy |
| 5 | Intuitivo, navegable, informativo | Cubierto conceptualmente por el diseño actual del website (ver `overview.md` §1) | TASK-026 (verificación real de accesibilidad/UX vía Lighthouse) | 🟢 Base razonable; falta solo verificación formal |
| 6 (base) | `/admin` obligatorio, sin acceso por otro dominio | `ADR-006_admin_routing_strategy_v2.md` | TASK-015 | 🔴 No implementado ni por subdominio ni por path — pendiente crítico |
| 6.1 | Gestión de mensajes de Contáctenos | `TASK-018.md` | TASK-018 | 🔴 Backend existe, frontend admin no |
| 6.2 | Newsletter con editor WYSIWYG/HTML | `SPEC-004_Newsletter_Management.md` | TASK-019 | 🔴 Gap total en frontend, backend parcial |
| 6.3 | Blog tipo WordPress con SEO completo | `SPEC-005_Blog_CMS.md` | TASK-020 | 🔴 Gap total en frontend, backend parcial |
| 6.4 | App de hallazgo de leads (tipo Google Business Profile) | `SPEC-002_Opportunity_Search.md` (v1.1) | TASK-021 | 🔴 Job stub, sin modelo de datos, sin frontend |
| 6.5 | Mini CRM + cotizaciones ("minipos") + control tarifario | `SPEC-006_Quotes_And_Tariff_Management.md` | TASK-022 | 🔴 Gap total — no existía ningún artefacto antes de esta auditoría |
| — | Corrección: `apps/api` separado de `apps/website` | `ADR-005_website_backend_consolidation.md` | TASK-014 | ⬜ Pendiente (prerrequisito técnico de varias tareas de arriba) |
| — | Corrección: `.sln` de tests con ruta rota | — (hallazgo técnico puro) | TASK-013 | ⬜ Pendiente |
| — | Visión de plataforma futura (fuera de este ciclo) | `ADR-007_platform_scope_separation.md`, `SPEC-003_Platform_Vision.md` | Ninguna (documentación pura, no ejecutable) | ✅ Documentado, correctamente NO en el plan de ejecución |

**Verificación de cobertura:** los 6 puntos de la definición original (incluidos los 5 sub-puntos de 6) tienen todos al menos un documento fuente y al menos una tarea. No queda ningún punto de la definición de producto sin una tarea asociada. Los estados 🔴/🟡 reflejan el trabajo pendiente real, no una falta de documentación.

---

## 3. PLAN DE EJECUCIÓN (orden obligatorio por dependencias)

### 🔴 BLOQUE 1 — Cimientos técnicos (nada más avanza sin esto)

#### Sesión 1 — TASK-014 (implementa ADR-005)
```
[Pega primero §1 completo de este documento como contexto]

Lee COMPLETO docs/01_ARCHITECTURE/adr/ADR-005_website_backend_consolidation.md y
docs/04_TRACKING/tasks/TASK-014.md antes de tocar cualquier archivo.

Ejecuta la migración ahí descrita: apps/api/src/backend -> apps/website/src/backend, vía
git mv (preserva historial), excluyendo vendor/. Actualiza infrastructure/docker-compose.yml.
Elimina apps/api/ al final, solo después de confirmar que no queda ninguna referencia rota.

Al terminar, ejecuta el Protocolo de Cierre SDD (§4) usando los Criterios de Aceptación de
TASK-014.md como checklist.
```

#### Sesión 2 — TASK-013
```
[Contexto §1 ya activo de la sesión anterior, o re-pégalo si es sesión nueva]

Lee COMPLETO docs/04_TRACKING/tasks/TASK-013.md. Requiere que TASK-014 ya esté cerrada
(verifica su TASK-014.md antes de empezar — si no dice DONE, detente y ejecuta esa primero).

Corrige la referencia rota de Framework.Core en Framework.Automation.sln y actualiza/renombra
Farutech.Api.Tests según la nueva ubicación. Verifica CADA proyecto del .sln contra el
filesystem real, no solo el que sabes que estaba roto.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 3 — TASK-015 (implementa ADR-006)
```
[Contexto §1]

Lee COMPLETO docs/01_ARCHITECTURE/adr/ADR-006_admin_routing_strategy_v2.md y
docs/04_TRACKING/tasks/TASK-015.md.

Implementa en el orden exacto que indica TASK-015.md (vite.config -> main.tsx -> App.tsx ->
haproxy.cfg -> docker-compose.yml -> CORS). No reordenes estos pasos: cada uno depende del
anterior para poder probarse.

Cierra con el Protocolo de Cierre SDD (§4), verificando en particular que ningún subdominio
admin.* resuelve al panel (Criterio de Aceptación explícito de ADR-006).
```

#### Sesión 4 — TASK-017 (implementa re-alcance de ADR-004)
```
[Contexto §1]

Lee COMPLETO docs/01_ARCHITECTURE/adr/ADR-004_multi_database_strategy.md (incluida la nota de
re-alcance al inicio) y docs/04_TRACKING/tasks/TASK-017.md.

Antes de eliminar ningún servicio de infrastructure/docker-compose.yml, confirma explícitamente
(documentándolo en TASK-017.md) que ningún módulo activo depende de MySQL/MongoDB. Si hay duda,
DETENTE y pregunta al Backend Lead — no asumas.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 5 — TASK-016
```
[Contexto §1]

Lee docs/04_TRACKING/tasks/TASK-016.md. Con TASK-014/015/017 ya cerradas, completa el
checklist pendiente de README.md, testing-strategy.md y coding-standards.md, verificando
cada afirmación contra el filesystem real (no copies el checklist sin confirmar).

Cierra con el Protocolo de Cierre SDD (§4).
```

### 🟡 BLOQUE 2 — Correcciones independientes (pueden ejecutarse en paralelo entre sí, después del Bloque 1)

#### Sesión 6 — TASK-023
```
[Contexto §1]

Lee COMPLETO docs/04_TRACKING/tasks/TASK-023.md. Corrige que el JSON-LD no llegue al HTML
prerenderizado (ver diagnóstico técnico completo en el propio archivo). Valida con curl sobre
el HTML generado por `npm run build:seo` (sin ejecutar JS) y con Google Rich Results Test.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 7 — TASK-024
```
[Contexto §1]

Lee docs/04_TRACKING/tasks/TASK-024.md. Esta tarea es una DECISIÓN DE PRODUCTO primero
(retomar/archivar/eliminar apps/intranet). No ejecutes ninguna acción sobre código sin que el
Product Owner haya elegido explícitamente una opción — documenta la decisión en el propio
archivo antes de tocar una sola línea.
```

#### Sesión 8 — TASK-025
```
[Contexto §1]

Lee docs/04_TRACKING/tasks/TASK-025.md. Igual que TASK-024: requiere decisión de Product
Owner (Alternativa A o B) ANTES de estimar o ejecutar. Presenta ambas alternativas al Product
Owner con sus trade-offs (ya documentados en el archivo) y espera su elección explícita.
```

### 🟡 BLOQUE 3 — Cierre de brechas funcionales del requisito 6 (requiere Bloque 1 completo)

> Antes de Sesión 9 y 10: resolver la decisión de `ContentBlockEditor` compartido (Design System) mencionada en ambas tareas — no repartir a implementadores distintos sin esa decisión tomada primero.

#### Sesión 9 — TASK-018
```
[Contexto §1]

Lee COMPLETO docs/04_TRACKING/tasks/TASK-018.md. Verifica primero si ContactController expone
los verbos necesarios; si no, amplíalo como parte de esta misma tarea. Reutiliza componentes
existentes del Design System, no crees nuevos si ya existe un equivalente.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 10 — TASK-019 (implementa SPEC-004)
```
[Contexto §1]

Lee COMPLETO docs/02_SPECIFICATIONS/SPEC-004_Newsletter_Management.md (las 11 secciones
completas, no un resumen) y docs/04_TRACKING/tasks/TASK-019.md.

Implementa siguiendo la spec sección por sección: modelo de datos (§4) -> API contract (§5) ->
frontend (§6) -> reglas de negocio (§7). Verifica cada Criterio de Aceptación de §8 antes de
cerrar.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 11 — TASK-020 (implementa SPEC-005)
```
[Contexto §1]

Lee COMPLETO docs/02_SPECIFICATIONS/SPEC-005_Blog_CMS.md y docs/04_TRACKING/tasks/TASK-020.md.

ANTES de estimar, resuelve el riesgo abierto de la spec (RB004 — cómo un artículo publicado
llega al HTML prerenderizado). Escala esta decisión si no está resuelta; no la tomes
unilateralmente dado su impacto directo en el requisito 2 (SEO).

Implementa siguiendo la spec sección por sección igual que en Sesión 10. Verifica cada
Criterio de Aceptación de §8 antes de cerrar.

Cierra con el Protocolo de Cierre SDD (§4).
```

#### Sesión 12 — TASK-021 (implementa SPEC-002 v1.1)
```
[Contexto §1]

Lee COMPLETO docs/02_SPECIFICATIONS/SPEC-002_Opportunity_Search.md — el documento ENTERO,
incluidas las secciones 1-11 originales Y la sección 16 (Adendo v1.1). No implementes solo el
adendo sin conocer el resto de la spec original (modelo de Opportunity, flujo de conversión,
Quality Score).

Primero las migraciones faltantes (opportunities, scraping_jobs), luego el job corregido,
luego el frontend. NO implementes scraping de LinkedIn sin aprobación legal explícita — si no
existe esa aprobación, documenta el bloqueo en TASK-021.md y continúa con las demás fuentes.

Cierra con el Protocolo de Cierre SDD (§4), verificando explícitamente los CA017-CA020 del
adendo además de los criterios originales de la spec aplicables.
```

#### Sesión 13 — TASK-022 (implementa SPEC-006)
```
[Contexto §1]

Lee COMPLETO docs/02_SPECIFICATIONS/SPEC-006_Quotes_And_Tariff_Management.md y
docs/04_TRACKING/tasks/TASK-022.md. Este módulo parte de cero — no hay código previo que
reutilizar salvo el Lead de SPEC-001, del cual depende.

Antes de escribir código, decide y documenta en TASK-022.md la librería de generación de PDF.
Implementa siguiendo la spec sección por sección. Presta especial atención a RB001 (control
tarifario auditable) y RB005 (token público no adivinable) — son reglas de seguridad/negocio,
no detalles opcionales.

Cierra con el Protocolo de Cierre SDD (§4).
```

### 🟢 BLOQUE 4 — Verificación final transversal

#### Sesión 14 — TASK-026
```
[Contexto §1]

Lee docs/04_TRACKING/tasks/TASK-026.md. Ejecuta Lighthouse real (no proyectado) sobre TODAS
las rutas listadas en el archivo, tanto en website público como en admin (ya servido bajo
/admin tras el Bloque 1). Documenta resultados reales en el propio archivo TASK-026.md. Para
cualquier puntaje por debajo del umbral, crea una sub-tarea puntual, no una genérica.

Esta es la última tarea del ciclo: al cerrarla, ejecuta también el Protocolo de Cobertura
Final (§5) sobre la Matriz de Trazabilidad completa (§2).
```

---

## 4. PROTOCOLO DE CIERRE SDD (ejecutar al final de cada tarea, sin excepción)

```
Antes de marcar esta TASK como DONE:

1. Vuelve a abrir el SPEC/ADR fuente y lista, uno por uno, TODOS sus Criterios de Aceptación.
2. Para cada uno, indica: ✅ Cumplido (con evidencia concreta: comando, log, captura, test) /
   ❌ No cumplido (explica por qué y qué falta) / ⚠️ Cumplido parcialmente (explica el gap).
3. Si hay algún ❌ o ⚠️, la tarea NO está terminada — no la marques DONE. Documenta el
   pendiente como una sub-tarea o dejando la TASK en EN PROGRESO con el detalle explícito.
4. Verifica: `npm run build` (frontends tocados) y/o `dotnet build Framework.Automation.sln`
   sin errores ni warnings.
5. Actualiza docs/04_TRACKING/tasks/TASK-XXX.md: cambia el Estado, agrega la evidencia del
   paso 2 en una sección "## Evidencia de Cierre".
6. Agrega una línea en docs/04_TRACKING/change-log/CHANGELOG.md.
7. Actualiza docs/04_TRACKING/master-plan.md si el progreso de la fase cambió.
8. Reporta un resumen de 3-5 líneas de lo hecho, sin narrar el proceso interno de decisión.
```

---

## 5. PROTOCOLO DE COBERTURA FINAL (ejecutar una sola vez, al cerrar TASK-026)

```
Con todas las tareas del Bloque 1-4 cerradas, recorre la Matriz de Trazabilidad completa (§2)
de este documento, fila por fila:

1. Para cada uno de los 6 requisitos de producto (y sus 5 sub-puntos del punto 6), confirma
   que la(s) tarea(s) asociada(s) están en estado DONE con evidencia verificada (no solo
   "código escrito").
2. Si algún requisito quedó parcialmente cubierto (por ejemplo, TASK-024/025 sin decisión de
   Product Owner tomada), repórtalo explícitamente como pendiente abierto — no lo des por
   cerrado implícitamente.
3. Genera un reporte final: "Estado de Cobertura de la Definición de Producto Original",
   listando los 6 puntos + 5 sub-puntos con su estado real, para entregar al Product Owner
   como cierre de este ciclo de implementación.
```

---

## 6. FUERA DE ESTE CICLO (recordatorio final)

`apps/platform` (SPEC-003) **no se inicia** con este prompt bajo ninguna circunstancia. Requiere, antes de convertirse en un ciclo de ejecución propio: stack técnico final confirmado, modelo de datos de Organization/Instance/Application, mecanismo de resolución de tenant, y un ADR de seguridad multi-tenant — todos pendientes según SPEC-003 §9.

---

**© 2026 Farutech — SDD Master Prompt v2.0 (2026-09-05)**
