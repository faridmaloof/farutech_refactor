# 02 — TARGET DIRECTION & STAKEHOLDER CLARIFICATIONS

**Basado en:** contexto entregado directamente por el owner del proyecto tras revisar `01_CURRENT_STATE_AUDIT.md`.
**Naturaleza de este documento:** Todo lo aquí registrado es **TARGET STATE / DECISIÓN DE NEGOCIO**, no estado actual verificado en código. Donde el objetivo declarado choca con lo encontrado en el audit 01, se marca explícitamente como `CONFLICT — REQUIERE RECONCILIACIÓN`.

---

## 1. EVALUACIÓN TÉCNICA SOLICITADA: ¿Lumen soporta bien Sanctum y Swagger?

Se investigó específicamente antes de decidir qué hacer con la migración a Laravel ya hecha (sin commitear) en el working tree.

### Resultado — VERIFIED (fuentes oficiales y del propio mantenedor del paquete):

| Componente | ¿Soportado en Lumen? | Evidencia |
|---|---|---|
| **Laravel Sanctum** (`laravel/sanctum`, el que ya está instalado en el working tree) | **NO, oficialmente no.** | El propio issue tracker de `laravel/sanctum` tiene solicitudes de soporte para Lumen cerradas sin implementarlo. La única alternativa es un paquete de comunidad no oficial (`xaamin/sanctum`): 1 star, 0 dependents en Packagist — no es una base razonable para un sistema "muy profesional" como pides. |
| **Documentación OpenAPI/Swagger** | **Sí, pero con OTRO paquete**, no con `darkaonline/l5-swagger` (el que está en el `composer.json` actual). Existe `darkaonline/swagger-lume`, del mismo autor, hecho específicamente para Lumen, con soporte confirmado hasta Lumen 10.0. | Tabla de compatibilidad oficial del paquete `SwaggerLume`. |
| **Recomendación oficial de Laravel sobre Lumen para proyectos nuevos** | Laravel dejó de recomendar Lumen para proyectos nuevos: *"we no longer support beginning new projects with Lumen. Instead, we recommend always beginning new projects with Laravel."* | Documentación oficial de Lumen (lumen.laravel.com). |

### Conclusión técnica (no es la decisión final, es el insumo para que tú decidas):

- **Si el objetivo es Lumen:** es viable para Swagger (cambiando `l5-swagger` → `swagger-lume`), pero **Sanctum queda descartado** — habría que seguir con el mecanismo de token custom HMAC que ya existe y está implementado (`AuthController@issueToken` + middleware `Authenticate`), que es funcionalmente razonable y ya funciona, solo que "hecho a mano" en vez de con un paquete estándar del ecosistema.
- **El trabajo ya hecho en Laravel** (Sanctum instalado, Contact/Newsletter/Auth reescritos, tests nuevos) **no es descartable a la ligera**: representa horas reales de trabajo funcional y correctamente probado (ver hallazgos F-VERIFIED en doc 01). Si se vuelve a Lumen, ese código de controllers/modelos SÍ es reutilizable casi tal cual (Lumen usa el mismo Eloquent, mismo estilo de controllers); lo que se pierde es Sanctum (no se estaba usando de todas formas — `laravel/sanctum` estaba instalado pero **sin ningún código que lo invoque**, confirmado en doc 01 F-05) y hay que cambiar `l5-swagger` por `swagger-lume`.
- **Dado que Sanctum nunca llegó a usarse en el código real** (es una dependencia "muerta" hoy), volver a Lumen **no tiene el costo que parecía** — el riesgo real es bajo. Recomiendo confirmar: **Lumen + token HMAC custom (ya implementado) + `swagger-lume`**, migrando los controllers/modelos ya escritos.

**PENDIENTE DE TU CONFIRMACIÓN EXPLÍCITA** antes de tocar código: ¿procedo asumiendo Lumen + swagger-lume + el auth custom que ya existe, descartando solo `laravel/sanctum` y `darkaonline/l5-swagger` del `composer.json`? Esto es lo que se ejecutaría en la fase de implementación, no ahora.

---

## 2. DESIGN SYSTEM (a partir de `projects/dashboard`)

**Decisión del owner:**
- `projects/dashboard` **no se sigue usando tal cual** como aplicación — es la base/fuente de la que se **extraen componentes** (DataTable, CRUD genérico, menú vertical, controles de formulario, Login/Register screens, etc.) para construir un **Design System publicable**.
- Los estilos del dashboard actual están "quemados" (hardcoded) — el Design System debe permitir **tokens/temas configurables** por control, no valores fijos.
- Screens tipo Login/Register/ForgotPassword deben vivir en el Design System como componentes, de forma que cada app solo indique/personalice el endpoint de API a llamar, sin reimplementar la pantalla.
- Debe publicarse como **package público en GitHub Packages** (público = sin requerir credenciales/token para instalarlo).
- Debe vivir en un espacio propio del workspace, no dentro de `dashboard`. Propuesta a validar: `packages/design-system` (a nivel de workspace, junto a `projects/` y `tests/`, no dentro de ninguno de los proyectos actuales) o repositorio independiente `Farutech/design-system` — **pendiente decisión de topología** (ver sección 5, se define en la fase de Repository Architecture, no aquí).
- El plan explícito es: **construir primero el Design System → luego retirar/discontinuar el `dashboard` actual** una vez sus componentes ya estén migrados al Design System y las apps reales (`admin.farutech.com`, futuro) lo consuman desde allí. `dashboard` como está hoy (con demo-auth hardcodeado — hallazgo F-02) queda con horizonte de **reemplazo, no de hardening** — no tiene sentido invertir en arreglar sus credenciales demo si el objetivo es extraerlo y descontinuarlo.

**Actualiza hallazgo F-02 del doc 01:** severidad se mantiene `CRITICAL` mientras el código exista y pueda desplegarse tal cual, pero la remediación **no es "arreglar `dashboard`"** sino "extraer sus componentes al Design System y no desplegar `dashboard` como app final".

---

## 3. INFRAESTRUCTURA Y SECRETS

**Decisión del owner:**
- Estrategia de configuración: **prioridad 1 = secrets** (mecanismo a definir según plataforma: Docker/K3s Secrets, etc.), **prioridad 2 = fallback a `.env`** si el secret no está definido.
- Se permiten valores por defecto en código **solo como fallback de última instancia**, nunca como valor real esperado en ambientes reales — deben quedar documentados como "solo si nada más está definido", no como "credenciales del proyecto" (que es como está hoy, según hallazgo F-03 del doc 01).
- Esto aplica a los 3 ambientes de despliegue (sección 4).

**Actualiza hallazgo F-03 del doc 01:** pasa de "CRITICAL sin plan" a "CRITICAL con plan de remediación definido, pendiente de implementación": diseñar jerarquía Secret → `.env` → default, y quitar el comentario actual de "no romper volúmenes ya inicializados" reemplazando las credenciales reales antes de cualquier despliegue fuera de un entorno local aislado.

---

## 4. TOPOLOGÍA DE DESPLIEGUE (3 ambientes reales, con requisitos distintos)

| Ambiente | Infraestructura real | Requisito clave |
|---|---|---|
| **Local** | Docker (Docker Compose) | Debe ser "casi un comando": ajustar variables y `docker compose up`, sin pasos manuales adicionales |
| **Dev** | Servidor propio: **Raspberry Pi 2B + Raspberry Pi 4B**, orquestado con **K3s**. Posibilidad futura de sumar 1–2 laptops como nodos adicionales, con el Pi 4B como nodo cabeza/control-plane. Acceso hoy vía edición manual de `hosts` en cada máquina cliente; a futuro se evalúa DNS propio o Pi-hole para no tener que tocar `hosts` en cada equipo | Debe funcionar en un clúster K3s real de hardware ARM heterogéneo (Pi 2B es considerablemente más limitado que el 4B — hay que tener en cuenta esto al decidir qué workloads corren en qué nodo) |
| **QA / Staging / Prod** | VPS de Hostinger, también con **K3s** (buscando que el patrón de despliegue sea el mismo que Dev, minimizando "funciona en Dev pero no en Prod") | URLs accesibles públicamente desde internet, a diferencia de Dev |

**Implicación directa para infraestructura:** el `docker-compose.yml` actual en `infrastructure/` y `projects/web/deployment/docker/` es solo para el caso **Local**. Para Dev/QA/Staging/Prod se necesitan manifiestos K3s (Helm charts o YAML plano) — **no existen todavía manifiestos K3s en el zip auditado**, esto es un GAP nuevo a agregar al doc 01 (no un hallazgo negativo, es simplemente trabajo pendiente conocido: los propios mensajes de commit de `web` ya mencionan "CI/CD pipeline for FaruTech on K3s" y "deployment guide for Raspberry Pi with K3s" — hay que revisar ese contenido existente en `docs/CI-CD-K3S-PI.md` y `docs/DEPLOYMENT.md` antes de construir nada nuevo, siguiendo la regla de "no reconstruir trabajo ya hecho").

**Acción inmediata (no requiere tu confirmación, es solo lectura):** en la próxima sesión de investigación se debe leer a fondo `projects/web/docs/CI-CD-K3S-PI.md`, `docs/DEPLOYMENT.md` y `docs/DEPLOY-PI-K3S.md` (los tres existen en el zip, listados en el audit 01 sección de documentación, pero **no se leyeron en profundidad todavía** — quedan como `GAP` explícito).

---

## 5. BACKEND — DOCUMENTACIÓN API (Swagger/Scalar) por ambiente

**Decisión del owner:**
- Debe existir documentación de API (Swagger o Scalar — a evaluar cuál).
- Disponible **por configuración**, no hardcodeada, en: local, dev, qa, y **opcionalmente** staging (no obligatorio en staging).
- Preocupación explícita del owner: evitar peso/dependencias innecesarias — evaluar si conviene reimplementar la solución de documentación en vez de arrastrar todo lo que trae `l5-swagger`/`darkaonline` si no se necesita todo.

**Nota técnica para la fase de Specification (no se decide aquí):** "Scalar" como alternativa a Swagger UI normalmente se sirve como un simple HTML que consume el JSON de OpenAPI ya generado — es decir, no reemplaza `swagger-php`/`zircote` (que es quien genera el JSON desde las anotaciones `@OA\*` que ya existen en `ContactController`/`AuthController`), solo reemplazaría la interfaz visual (`swagger-ui`). Esto es relevante porque el peso real no está en la UI sino en el generador de anotaciones, que de todas formas se necesita con cualquiera de las dos opciones. Esto se detalla en la fase de Specification, no se decide en este documento.

---

## 6. FRAMEWORK-AUTOMATION — ALCANCE CONFIRMADO

**Decisión del owner:**
- `framework-automation` (.NET) se usa **exclusivamente** para: **E2E, API, Performance e Integración**.
- **Pruebas unitarias NO van en este framework** — cada solución usa el framework nativo de su lenguaje (PHPUnit en el backend Lumen/Laravel, lo que corresponda en frontend/dashboard si aplica).
- Sigue pendiente (ya estaba distribuido como tarea `TASK-A8` en el prompt maestro, confirmado por el owner como aún no resuelto): empaquetarlo como plantilla instalable vía `dotnet new <template>` para facilitar su adopción en cada proyecto/solución sin clonar el repo completo.
- Esto confirma y cierra (parcialmente) el GAP "Confirmar si framework-automation necesita ApiClient/ContractValidator/etc." del prompt maestro (TASK-A2): si el alcance es API+E2E+Performance+Integración, sí se necesita una capa API real — pendiente de auditar qué de eso ya existe en `Framework.Core/Tools/` vs. qué falta, en la próxima sesión.

---

## 7. REESTRUCTURACIÓN DE FRONTEND — de 1 app con admin embebido a 3 apps por subdominio

**Decisión del owner — este es el cambio de topología más grande de todos los recibidos hoy:**

```text
apps/frontend  (actual, único, con admin embebido)
        ↓ SE DIVIDE EN
apps/website/frontend   → website.farutech.com   (sitio público)
apps/admin/frontend     → admin.farutech.com     (antes: dashboard, o el admin embebido — a definir cuál es la base)
apps/intranet/frontend  → intranet.farutech.com  (nuevo, no existía en el audit 01)
```

**Relación funcional entre las 3 (importante, no son independientes):**
- `admin.farutech.com` es donde se **configura** contenido (blog, ajustes) y donde **llegan** los datos de negocio (leads de "contáctenos", suscriptores de newsletter).
- `website.farutech.com` **consume/muestra** lo configurado en admin (ej. posts de blog).
- `intranet.farutech.com` también consume configuración/datos de admin (mencionado explícitamente, alcance funcional completo aún no detallado por el owner — **queda como GAP a preguntar en la próxima ronda**: ¿qué funcionalidad tiene intranet más allá de "consumir lo que admin configura"? ¿Quién accede a ella — solo empleados/rol interno?).
- Newsletter: admin no solo recibe suscriptores, sino que se usa para **hacer difusión por medio de templates** desde allí — esto es una funcionalidad nueva no vista en el código actual (`NewsletterController.php` hoy solo hace alta de suscriptor, no hay evidencia de envío de campañas/templates) → **GAP nuevo**, no implementado todavía en ningún lado del código auditado.

**Esto afecta directamente al hallazgo F-01 del doc 01** ("dos paneles admin desconectados"): la resolución no es "elegir uno de los dos que ya existen", es **construir `apps/admin/frontend` de cero apoyado en el Design System** (sección 2), y el admin embebido actual en `apps/frontend` (`AdminDashboardPage.tsx` y compañía) queda con el mismo destino que `dashboard`: es referencia a extraer/discontinuar, no a mantener.

**Pendiente de decisión (no bloquea seguir documentando, pero sí bloquea Fase de Topología de Repositorios):**
- ¿Estas 3 apps siguen siendo carpetas `apps/*` dentro del monorepo `projects/web`, o pasan a ser repos independientes? El prompt maestro pide evaluar exactamente esto (sección 9/10 — independencia de repos) — no se decide aquí, se decide en la Fase de Repository Architecture con este nuevo dato de 3 apps en vez de 1.
- ¿Comparten sesión/autenticación entre subdominios (SSO real vía cookie de dominio padre `.farutech.com`, o cada una vuelve a loguearse)? Es relevante porque admin/intranet/website comparten datos según lo que describes — hay que definirlo antes de diseñar el auth del Design System.

---

## 8. VISIÓN A FUTURO — Editor WYSIWYG para roles no técnicos

**Contexto capturado (FUTURE ARCHITECTURAL CONTEXT, no alcance actual, según regla del prompt maestro sección 2):**
- El objetivo de fondo de todo lo anterior: que personas de diseño/producto (sin conocimiento de desarrollo) puedan operar el sitio — ej. un editor de blog tipo WYSIWYG con drag-and-drop, generando la menor cantidad de "código basura" posible por debajo.
- Esto es la razón de negocio principal detrás de invertir en el Design System: sin componentes reutilizables y bien definidos, un editor visual no tiene con qué construir.
- **No se implementa ahora** (consistente con sección 2/69 del prompt maestro) — se registra aquí únicamente para que el Design System (sección 2) se diseñe teniendo esto en mente (ej. componentes con props serializables a JSON, nombres/props predecibles, sin lógica implícita difícil de representar visualmente).

---

## 9. TABLA DE IMPACTO — cómo cambian los hallazgos del doc 01 con este contexto

| Hallazgo (doc 01) | Estado anterior | Estado actualizado |
|---|---|---|
| F-01 (dos admin panels) | CONFLICTING, sin resolución clara | Resuelto en dirección: ninguno de los dos sobrevive tal cual; se construye `apps/admin/frontend` nuevo sobre el Design System |
| F-02 (demo auth hardcoded en dashboard) | CRITICAL, requiere fix | CRITICAL, pero el fix correcto es extraer y descontinuar, no parchear |
| F-03 (credenciales infra débiles) | CRITICAL, sin plan | CRITICAL, con plan: Secret → .env → default, pendiente de implementar |
| F-05 (migración Laravel sin commitear, Sanctum sin usar) | HIGH, ambigüedad de qué framework es el objetivo | Evaluado: Sanctum no viable en Lumen sin paquete no oficial; Swagger sí viable vía `swagger-lume`. **Pendiente tu confirmación final** (sección 1) |
| GAP "framework-automation ¿necesita capa API?" | Abierto | Confirmado que sí, alcance = E2E+API+Performance+Integración, unitarias fuera |
| — | — | **GAP nuevo:** manifiestos K3s para Dev/QA/Staging/Prod no existen todavía en el zip auditado, aunque hay documentación relacionada sin leer a fondo (`docs/CI-CD-K3S-PI.md`, etc.) |
| — | — | **GAP nuevo:** envío de campañas de newsletter por templates — no implementado en el código actual, solo alta de suscriptor |
| — | — | **GAP nuevo:** alcance funcional de `intranet.farutech.com` sin definir |

---

## 10. NEXT ACTION

```text
1. Confirmar sección 1 (Lumen + auth custom + swagger-lume, descartando Sanctum/l5-swagger)
   — es lo único que bloquea empezar a tocar código del backend.
2. Mientras tanto, próxima sesión de solo-lectura (sin implementar):
   a) Leer a fondo docs/CI-CD-K3S-PI.md, docs/DEPLOYMENT.md, docs/DEPLOY-PI-K3S.md
      de projects/web para no reconstruir lo que ya se documentó sobre K3s/Raspberry Pi.
   b) Inventariar componente por componente qué existe en projects/dashboard/src
      (components/ui, crud/, layout/) como insumo real para el Design System.
   c) Aclarar alcance funcional de intranet.farutech.com.
3. Con (1) resuelto y (2) completado, recién ahí se puede escribir el
   03_REPOSITORY_TOPOLOGY_ANALYSIS y el 04_TARGET_ARCHITECTURE con evidencia
   real, no supuestos.
```
