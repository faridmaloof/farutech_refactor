# 03 — DECISIONES CONFIRMADAS + NUEVOS REQUISITOS + AMPLIACIÓN DE ALCANCE DEL DESIGN SYSTEM

**Basado en:** respuestas del owner a las 3 preguntas abiertas del documento 02.

---

## 1. BACKEND — CONFIRMADO: Lumen (no Laravel)

Decisión del owner, con justificación de performance ("Laravel entero carga archivos y librerías innecesarias para un backend API"). Técnicamente correcto: Lumen es literalmente el mismo kernel de Laravel con el bootstrap y los service providers no esenciales removidos — para una API pura sin vistas Blade, sesiones web, etc. (que es exactamente lo que confirma `routes/web.php` actual: *"La aplicación es una API; no hay rutas web propias"*), Lumen tiene menos overhead de arranque por request.

**Acción para la fase de implementación (no ejecutada todavía, solo queda especificada):**
- Descartar `laravel/framework`, `laravel/sanctum`, `laravel/tinker`, `laravel/pint`, `laravel/sail`, `spatie/laravel-ignition` del `composer.json` del working tree actual.
- Volver a `laravel/lumen-framework` como en el último commit (`708bcb5`).
- **Migrar tal cual** (sin reescribir) los controllers/modelos ya construidos en el working tree Laravel: `ContactController`, `NewsletterController`, `AuthController`, `Authenticate` middleware, modelos (`Service`, `Location`, `ApplicationType`, `NewsletterSubscriber`). Son compatibles con Lumen porque no usan nada exclusivo de Laravel (Eloquent, validación, `DB::transaction`, `Log`, todo eso existe igual en Lumen) — se verificó código por código en el doc 01/02, ninguno depende de Sanctum ni de features Laravel-only.
- Los tests `ContactApiTest.php` / `NewsletterApiTest.php` (usan `RefreshDatabase`, `postJson`) también son compatibles con Lumen sin cambios.

---

## 2. DOCUMENTACIÓN DE API — CONFIRMADO: evaluar Scalar priorizando el menor peso posible

Se investigó específicamente qué tan pesado es cada camino:

| Opción | Qué agrega al `composer.json` | Notas |
|---|---|---|
| `l5-swagger` (actual, Laravel-only) | Paquete completo Laravel + assets swagger-ui embebidos | **Descartado** — no funciona en Lumen de todas formas |
| `swagger-lume` (puerto de l5-swagger para Lumen) | Un paquete completo con su propio service provider, config, y assets de swagger-ui embebidos (~500 KB de JS/CSS servidos) | Viable, pero es justo el tipo de "peso" que quieres evitar |
| **Scalar (recomendado)** | **Ninguno de más.** Scalar no requiere paquete de Composer: es una sola página HTML que carga un script desde CDN (`@scalar/api-reference`) y apunta a la URL de tu JSON de OpenAPI. No tiene integración oficial con Lumen ni la necesita — es agnóstico de framework por diseño | El único requisito real, común a **cualquiera** de las 3 opciones, es generar el JSON de OpenAPI a partir de las anotaciones `@OA\*` que **ya existen** en `ContactController`/`AuthController` — eso lo hace `zircote/swagger-php` (dependencia base, mucho más liviana, sin UI embebida) |

**Recomendación técnica final:** `zircote/swagger-php` (solo generador del JSON, sin UI) + una ruta Lumen que sirva un HTML estático de ~15 líneas con el CDN de Scalar apuntando a ese JSON. Esto es objetivamente el camino de menor peso posible: cero dependencias de Composer adicionales para la interfaz visual, y reutiliza el trabajo de documentación (`@OA\*`) que ya está escrito.

Esto también resuelve directamente el punto pendiente del prompt maestro (sección 20): la visibilidad por ambiente (local/dev/qa, staging opcional) se implementa con una simple condición sobre `APP_ENV` en la ruta que sirve el HTML de Scalar y en la ruta que expone el JSON — sin necesitar el `SwaggerGate.php` actual tal como está (que fue escrito para el ecosistema Laravel/l5-swagger); se reimplementa el mismo concepto de gate, más simple, sobre esta nueva ruta.

**Queda registrado como decisión pendiente de ejecutar**, no implementada todavía (seguimos en fase de especificación, no de código).

---

## 3. NEWSLETTER — NUEVO REQUISITO (no es solo alta/baja de suscriptor)

**Lo que el owner aclaró, y que NO existe hoy en el código** (verificado: `NewsletterController.php` actual solo tiene `store()`, alta de suscriptor):

- El listado de suscriptores debe poder usarse para **enviar comunicados** ("noticias") armados **desde la plataforma de admin**.
- Envío **uno a uno o por lotes** — el owner pide evaluar cuál es la mejor estrategia, no está decidido todavía.
- El admin debe conectarse a **un proveedor de envío de correo externo** (no se ha elegido cuál) para el envío real.
- Esto implica, como mínimo (a especificar en detalle en la fase de Specification, no ahora):
  - Un modelo de **template** de correo (probablemente editable desde admin, conectando con el objetivo de "menor código, más configuración" del punto 8 del doc 02).
  - Un mecanismo de **envío en background** (colas), porque enviar a un listado de suscriptores de forma síncrona en el mismo request bloquearía la petición — esto es una implicación técnica real, no una preferencia: con Lumen hay que verificar/configurar `queue` (Lumen soporta colas, pero no viene con `Illuminate\Support\Facades\Queue` habilitado por defecto de la misma manera que Laravel — **queda como ítem a verificar en la fase de Specification del backend**).
  - Selección de proveedor de email transaccional/marketing (a decidir — ej. algo con buena tasa de entrega y API simple; no se elige aquí, es decisión de negocio + costo, fuera del alcance de esta sesión).

**Se agrega como REQ nuevo** (numeración formal se hará en el documento de Master Requirements, cuando se llegue a esa fase): *"El admin debe permitir componer y enviar comunicados a la lista de suscriptores del newsletter, vía un proveedor externo de email, en modo individual o por lotes, con soporte de templates."*

---

## 4. INTRANET (`intranet.farutech.com`) — SIGUE ABIERTO, CON MÁS CONTEXTO

Lo que sí quedó claro:
- Tendrá **solicitudes internas** (algún tipo de gestión de requests/tickets internos — no se especificó de qué tipo: ¿IT, RRHH, compras, soporte interno general?).
- Necesitará **su propio panel de administración** para gestionar esas solicitudes.
- El owner **no tiene decidido** si ese panel de administración de intranet vive dentro de `admin.farutech.com` (un módulo más) o si intranet termina siendo una app independiente con su propio panel.

**Esto se deja explícitamente como `UNKNOWN — DECISIÓN DIFERIDA`**, no se fuerza una respuesta ahora. No bloquea el resto del plan porque:
- El Design System (sección 5) se construye igual, sea cual sea la decisión final — los componentes (DataTable, CRUD, formularios) sirven para cualquiera de las dos opciones.
- La topología de repos (`apps/website`, `apps/admin`) se puede definir ahora; `apps/intranet` se puede agregar después sin romper nada, siempre que el Design System y el mecanismo de auth compartido (pendiente del doc 02, sección 7) estén bien diseñados desde el inicio para soportar N apps, no solo 2.

Se retoma en la fase de Requirements cuando el owner tenga definido el alcance funcional real de intranet.

---

## 5. DESIGN SYSTEM — ALCANCE AMPLIADO (no solo `dashboard`)

El owner confirmó que hay que mirar **qué componentes usa cada frontend existente**, no solo extraer de `dashboard`, para evitar que el Design System nazca sin uniformidad respecto a lo que ya existe en producción.

**Se hizo una verificación rápida en `apps/frontend` (sitio público actual) para confirmar que esto es necesario, y sí lo es:**

`apps/frontend/src/components/primitives.tsx` y `patterns.tsx` ya contienen **su propia mini-librería de componentes independiente**, sin relación con `dashboard`:
- `Button`, `Eyebrow`, `SectionHeading`, `Tag`, `StatusBadge`, `Reveal` (animación de entrada), y más en `patterns.tsx` (846 líneas combinadas entre `primitives.tsx` + `patterns.tsx` + `layout.tsx`).

**Esto confirma en código, no solo en discurso, exactamente el riesgo que describes:** hoy existen **al menos 2 sistemas de componentes paralelos y sin relación** (`apps/frontend/src/components/*` y `projects/dashboard/src/components/ui/*`), cada uno con su propio `Button`, su propio manejo de variantes, etc. Cualquiera de los dos que se elija como único origen dejaría huérfano al otro sin una migración deliberada.

**Alcance de auditoría del Design System, actualizado (a ejecutar en la próxima sesión de solo-lectura, no ahora):**
```text
1. Inventariar componente por componente:
   - projects/dashboard/src/components/ui/*  (más completo, con Design Tokens/Typography
     ya documentados según docs/components/UI_COMPONENTS.md — pendiente de leer a fondo)
   - projects/dashboard/src/components/crud/*, layout/*
   - apps/frontend/src/components/primitives.tsx, patterns.tsx, layout.tsx
2. Para cada componente que exista en ambos lados (ej. Button, Badge/Tag) comparar
   API (props), no solo apariencia, para decidir cuál absorbe a cuál o si se
   diseña una API nueva que cubra ambos casos de uso.
3. Documentar qué componentes son exclusivos de un solo lado (ej. DataTable/CRUD
   solo existen en dashboard; Reveal/animaciones de scroll solo existen en
   apps/frontend) — esos se migran completos, sin necesidad de reconciliar con nada.
```

---

## 6. RESUMEN DE ESTADO — QUÉ SIGUE BLOQUEADO Y QUÉ NO

```text
YA NO BLOQUEA (decidido):
- Backend = Lumen (confirmado)
- Documentación de API = zircote/swagger-php + Scalar vía CDN, gated por APP_ENV (confirmado como dirección técnica)
- Design System = fuente múltiple (dashboard + apps/frontend + lo que se encuentre en
  website/admin/intranet cuando existan), no solo dashboard (confirmado)
- Newsletter = requiere motor de campañas, no solo alta de suscriptor (confirmado como nuevo REQ)

SIGUE ABIERTO (no bloquea seguir documentando, sí bloquea Specification final de esos temas):
- Alcance funcional exacto de intranet.farutech.com (diferido explícitamente por el owner)
- Proveedor de email para newsletter (decisión de negocio/costo)
- Envío uno-a-uno vs. por lotes para newsletter (a evaluar técnicamente cuando se
  especifique esa feature en detalle)
- Mecanismo de colas en Lumen para envío en background (a verificar en Specification)
```

## 7. NEXT ACTION

```text
1. Ejecutar la lectura a fondo de docs/CI-CD-K3S-PI.md, docs/DEPLOYMENT.md,
   docs/DEPLOY-PI-K3S.md (pendiente desde el doc 02) — ya confirmado por el owner
   como prioridad ("que sea lo más claro y dummy posible").
2. Ejecutar el inventario de componentes descrito en la sección 5 (dashboard vs.
   apps/frontend) como insumo real para el Design System.
3. Con (1) y (2) completados, recién ahí se redacta el documento 04:
   REPOSITORY TOPOLOGY ANALYSIS + TARGET ARCHITECTURE, que es donde se decide
   formalmente la estructura de repos/apps (website/admin/intranet, design-system,
   framework-automation como template instalable, etc.) con evidencia real
   en vez de supuestos.
```
